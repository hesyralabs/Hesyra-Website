import * as THREE from 'three'
import { RoomEnvironment } from 'three/examples/jsm/environments/RoomEnvironment.js'
import { loadArch } from './loadArch'

/**
 * The 48-Hour Pipeline scene.
 *
 * One arch mesh carried through the five real manufacturing stages, scrubbed by
 * a single `progress` value in [0, 1]:
 *
 *   scan    0.00–0.22  scattered points converge into the scanned surface
 *   design  0.22–0.42  points hand off to a solid surface with a fresnel edge
 *   print   0.42–0.68  build plane sweeps upward, curing layer glows  ← the moment
 *   cure    0.68–0.86  matte resin resolves to polished ceramic
 *   deliver 0.86–1.00  settles to the presentation angle
 *
 * Rendering is driven externally (see Pipeline.jsx) off GSAP's ticker, so this
 * never starts a requestAnimationFrame loop of its own — scroll, DOM animation
 * and WebGL all resolve on the same frame.
 */

const BRAND = {
    accent: new THREE.Color('#7A9C96'),  // bioceramic
    resin: new THREE.Color('#5E8C84'),
    ceramic: new THREE.Color('#EDE9E6'),
    glow: new THREE.Color('#9FD4C9')
}

const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)
const smoothstep = (a, b, t) => {
    const x = clamp01((t - a) / (b - a))
    return x * x * (3 - 2 * x)
}
/** Progress within a stage, as 0→1. */
const range = (t, a, b) => clamp01((t - a) / (b - a))

export function createArchScene(canvas, { quality = 'high' } = {}) {
    const renderer = new THREE.WebGLRenderer({
        canvas,
        antialias: quality === 'high',
        alpha: true,
        powerPreference: 'high-performance'
    })
    renderer.setClearColor(0x000000, 0)
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.15

    const scene = new THREE.Scene()
    // Raised three-quarter view: the arch reads as a horseshoe from above, and
    // the build sweep stays legible across its (shallow) occlusal height.
    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100)
    camera.position.set(0, 1.45, 1.50)
    camera.lookAt(0, 0, 0)

    // A room environment gives the ceramic something to reflect. Without it,
    // physical materials read as flat plastic.
    const pmrem = new THREE.PMREMGenerator(renderer)
    const envRT = pmrem.fromScene(new RoomEnvironment(), 0.04)
    scene.environment = envRT.texture

    const key = new THREE.DirectionalLight(0xffffff, 2.2)
    key.position.set(2, 3, 2)
    scene.add(key)

    const rim = new THREE.DirectionalLight(BRAND.accent.getHex(), 2.6)
    rim.position.set(-2.5, 0.5, -1.5)
    scene.add(rim)

    scene.add(new THREE.AmbientLight(0xffffff, 0.35))

    // The mesh spins inside this, so scroll-driven tilt stays independent.
    const pivot = new THREE.Group()
    // Sits centre-right and slightly high, keeping the left column and the
    // lower copy block clear — the overlay text has to stay readable over it.
    pivot.position.set(0.30, 0.10, 0)
    scene.add(pivot)
    const spinner = new THREE.Group()
    spinner.scale.setScalar(0.95)
    pivot.add(spinner)

    // Build sweep bounds come from the loaded geometry, never hardcoded — the
    // mesh is normalised on its longest axis, so the occlusal height is whatever
    // the scan happens to be.
    let yMin = -0.5
    let yMax = 0.5
    const OFF = 99 // build plane parked above the mesh = nothing clipped

    const uniforms = {
        uBuild: { value: OFF },
        uGlow: { value: 0 },
        uGlowColor: { value: BRAND.glow.clone() },
        uBand: { value: 0.05 },
        uLayer: { value: 0 },
        uFresnel: { value: 0 },
        uAccent: { value: BRAND.accent.clone() }
    }

    let mesh = null
    let points = null
    let geometry = null
    let disposed = false
    let ready = false

    const material = new THREE.MeshPhysicalMaterial({
        color: BRAND.resin.clone(),
        roughness: 0.62,
        metalness: 0.0,
        clearcoat: 0.0,
        clearcoatRoughness: 0.25,
        transparent: true,
        opacity: 0,
        // The scan has inconsistent triangle winding, and clustering flips more
        // of it. Single-sided rendering culls those faces and punches holes
        // through the shell, so render both sides.
        side: THREE.DoubleSide
    })

    // Clip plane, curing-layer glow, DLP layer striations and the fresnel edge
    // all need local position, which the standard material doesn't forward.
    material.onBeforeCompile = (shader) => {
        Object.assign(shader.uniforms, uniforms)

        shader.vertexShader = shader.vertexShader
            .replace(
                '#include <common>',
                `#include <common>
                 varying vec3 vLocalPos;
                 varying vec3 vLocalNormal;`
            )
            .replace(
                '#include <begin_vertex>',
                `#include <begin_vertex>
                 vLocalPos = position;
                 vLocalNormal = normal;`
            )

        shader.fragmentShader = shader.fragmentShader
            .replace(
                '#include <common>',
                `#include <common>
                 varying vec3 vLocalPos;
                 varying vec3 vLocalNormal;
                 uniform float uBuild;
                 uniform float uGlow;
                 uniform vec3  uGlowColor;
                 uniform float uBand;
                 uniform float uLayer;
                 uniform float uFresnel;
                 uniform vec3  uAccent;`
            )
            // Discard anything the print head hasn't reached yet.
            .replace(
                '#include <clipping_planes_fragment>',
                `if (vLocalPos.y > uBuild) discard;
                 #include <clipping_planes_fragment>`
            )
            .replace(
                '#include <dithering_fragment>',
                `#include <dithering_fragment>

                 // Curing layer: a bright band tracking the build plane. Band
                 // width scales with the sweep range so it reads the same on a
                 // shallow arch as on a tall model.
                 float dist = uBuild - vLocalPos.y;
                 float band = (1.0 - smoothstep(0.0, uBand, dist)) * step(0.0, dist);
                 gl_FragColor.rgb += uGlowColor * band * uGlow * 2.4;

                 // DLP layer striations — the physical signature of the process.
                 float lines = sin(vLocalPos.y / max(uBand, 0.0001) * 22.0) * 0.5 + 0.5;
                 gl_FragColor.rgb *= 1.0 - (lines * 0.10 * uLayer);

                 // Fresnel edge while the surface is still resolving.
                 vec3 nrm = normalize(vLocalNormal);
                 float fres = pow(1.0 - abs(dot(nrm, vec3(0.0, 0.0, 1.0))), 2.5);
                 gl_FragColor.rgb += uAccent * fres * uFresnel;`
            )
    }

    // ── Scan points ──────────────────────────────────────────────────────────
    const pointsUniforms = {
        uScatter: { value: 1 },
        uOpacity: { value: 0 },
        uSize: { value: quality === 'high' ? 5.0 : 3.6 },
        uColor: { value: BRAND.accent.clone() },
        uPixelRatio: { value: 1 }
    }

    const pointsMaterial = new THREE.ShaderMaterial({
        uniforms: pointsUniforms,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
        vertexShader: `
            attribute vec3 aScatter;
            uniform float uScatter;
            uniform float uSize;
            uniform float uPixelRatio;
            void main() {
                vec3 pos = position + aScatter * uScatter;
                vec4 mv = modelViewMatrix * vec4(pos, 1.0);
                gl_Position = projectionMatrix * mv;
                // uSize is the on-screen size in px at one unit of depth.
                gl_PointSize = uSize * uPixelRatio / -mv.z;
            }
        `,
        fragmentShader: `
            uniform vec3 uColor;
            uniform float uOpacity;
            void main() {
                // round, soft-edged dot
                float d = length(gl_PointCoord - 0.5);
                if (d > 0.5) discard;
                float a = (1.0 - smoothstep(0.28, 0.5, d)) * uOpacity;
                gl_FragColor = vec4(uColor, a);
            }
        `
    })

    const onReady = loadArch()
        .then((geo) => {
            if (disposed) return
            geometry = geo

            // Derive the build sweep from the actual mesh.
            yMin = geometry.boundingBox.min.y
            yMax = geometry.boundingBox.max.y
            uniforms.uBand.value = (yMax - yMin) * 0.16

            mesh = new THREE.Mesh(geometry, material)
            spinner.add(mesh)

            // Scatter offsets for the scan stage — outward along the normal so
            // the cloud collapses onto the surface rather than through it.
            const count = geometry.attributes.position.count
            const scatter = new Float32Array(count * 3)
            const normals = geometry.attributes.normal.array
            for (let i = 0; i < count; i++) {
                const o = i * 3
                // Kept tight — 12k additive sprites spread wide just reads as
                // fog rather than a scan resolving.
                const spread = 0.05 + Math.random() * 0.18
                scatter[o] = normals[o] * spread + (Math.random() - 0.5) * 0.05
                scatter[o + 1] = normals[o + 1] * spread + (Math.random() - 0.5) * 0.05
                scatter[o + 2] = normals[o + 2] * spread + (Math.random() - 0.5) * 0.05
            }

            const pointsGeo = new THREE.BufferGeometry()
            pointsGeo.setAttribute('position', geometry.attributes.position)
            pointsGeo.setAttribute('aScatter', new THREE.BufferAttribute(scatter, 3))
            points = new THREE.Points(pointsGeo, pointsMaterial)
            spinner.add(points)

            ready = true
            return geometry
        })

    // ── Scroll-driven state ──────────────────────────────────────────────────
    let progress = 0
    let spin = 0

    function setProgress(p) {
        progress = clamp01(p)
    }

    function update(delta) {
        if (!ready) return

        const p = progress

        // Idle rotation, plus a scroll-linked sweep so scrubbing feels connected.
        spin += delta * 0.16
        spinner.rotation.y = spin + p * Math.PI * 0.9
        // Subtle settle out of a tilted presentation angle.
        pivot.rotation.x = 0.18 * (1 - smoothstep(0.2, 0.95, p))

        // ── scan ──
        const scan = range(p, 0.0, 0.22)
        pointsUniforms.uScatter.value = 1 - smoothstep(0, 1, scan)
        // Visible the instant the section is entered — a blank first frame
        // reads as a broken canvas. The cloud then dims once the surface
        // resolves and lingers through the print as the un-printed remainder,
        // so material visibly hands off from digital model to cured resin
        // instead of leaving a gap while the build plane is still low.
        pointsUniforms.uOpacity.value =
            0.8 *
            (0.45 + 0.55 * smoothstep(0, 0.35, scan)) *
            (1 - 0.55 * smoothstep(0.22, 0.44, p)) *
            (1 - smoothstep(0.58, 0.72, p))

        // ── design: surface resolves ──
        const design = range(p, 0.20, 0.44)
        material.opacity = smoothstep(0, 0.7, design)
        uniforms.uFresnel.value = design * (1 - smoothstep(0.5, 1, design)) * 1.6

        // ── print: build plane sweeps up ──
        const print = range(p, 0.42, 0.68)
        if (p < 0.42) {
            uniforms.uBuild.value = OFF // nothing clipped yet
            uniforms.uGlow.value = 0
            uniforms.uLayer.value = 0
        } else if (p < 0.70) {
            // A hair of headroom at each end so the first and last layers
            // actually appear rather than being clipped by rounding.
            const pad = (yMax - yMin) * 0.04
            uniforms.uBuild.value = (yMin - pad) + (yMax - yMin + pad * 2) * print
            uniforms.uGlow.value = 1 - smoothstep(0.9, 1, print)
            uniforms.uLayer.value = 1
        } else {
            uniforms.uBuild.value = OFF
            uniforms.uGlow.value = 0
            uniforms.uLayer.value = 1 - smoothstep(0.70, 0.88, p)
        }

        // ── cure: resin → ceramic ──
        const cure = smoothstep(0.66, 0.90, p)
        material.color.copy(BRAND.resin).lerp(BRAND.ceramic, cure)
        material.roughness = 0.62 - cure * 0.50
        material.clearcoat = cure * 0.9
        material.metalness = cure * 0.05

        renderer.render(scene, camera)
    }

    function resize(width, height, pixelRatio) {
        const dpr = Math.min(pixelRatio ?? window.devicePixelRatio, quality === 'high' ? 2 : 1.5)
        renderer.setPixelRatio(dpr)
        renderer.setSize(width, height, false)
        pointsUniforms.uPixelRatio.value = dpr
        camera.aspect = width / height
        camera.updateProjectionMatrix()
    }

    function dispose() {
        disposed = true
        // The arch geometry is owned by the loadArch module cache and shared
        // with the points cloud, so it deliberately outlives this scene —
        // disposing it here would hand a freed buffer to the next mount.
        material.dispose()
        pointsMaterial.dispose()
        envRT.texture.dispose()
        pmrem.dispose()
        renderer.dispose()
    }

    return { setProgress, update, resize, dispose, ready: onReady }
}
