import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import './Pipeline.css'

/**
 * The 48-Hour Pipeline.
 *
 * Scroll advances a process rather than a document: one arch mesh is carried
 * through the five stages Hesyra actually runs, from scan to delivery.
 *
 * The copy renders immediately as plain DOM so it is prerenderable and readable
 * without WebGL. Three.js is imported dynamically and only when the section is
 * near the viewport, so it never blocks first paint and never loads at all for
 * visitors who prefer reduced motion.
 */

const STAGES = [
    {
        id: 'scan',
        index: '01',
        label: 'Intraoral scan received',
        body: 'Your STL or PLY export lands in the Hesyra portal and is checked for margin clarity before anything else begins.',
        readout: 'INGEST'
    },
    {
        id: 'design',
        index: '02',
        label: 'CAD design & margin marking',
        body: 'Technicians define the margin line, contacts and occlusion against the opposing arch.',
        readout: 'CAD'
    },
    {
        id: 'print',
        index: '03',
        label: 'DLP layer fabrication',
        body: 'Built layer by layer at 62-micron resolution on an industrial DLP farm — the stage that replaces two weeks of analogue work.',
        readout: 'PRINT'
    },
    {
        id: 'cure',
        index: '04',
        label: 'Post-cure & polish',
        body: 'Fully cured, finished and shade-matched to the prescription.',
        readout: 'CURE'
    },
    {
        id: 'deliver',
        index: '05',
        label: 'Delivered to your clinic',
        body: 'Packed and dispatched. Two appointments instead of five.',
        readout: 'SHIP'
    }
]

// Where each stage becomes the active one, matched to archScene.js.
const STOPS = [0, 0.22, 0.42, 0.68, 0.86]

function stageFor(progress) {
    let active = 0
    for (let i = 0; i < STOPS.length; i++) {
        if (progress >= STOPS[i]) active = i
    }
    return active
}

export default function Pipeline() {
    const sectionRef = useRef(null)
    const canvasRef = useRef(null)
    const readoutRef = useRef(null)
    const [active, setActive] = useState(0)
    const [webglReady, setWebglReady] = useState(false)
    const [failed, setFailed] = useState(false)

    useEffect(() => {
        const section = sectionRef.current
        const canvas = canvasRef.current
        if (!section || !canvas) return

        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
        if (reduced) return

        let scene = null
        let tick = null
        let observer = null
        let resizeObserver = null
        let visible = false
        let cancelled = false
        let lastStage = -1

        const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v)

        const progressOf = () => {
            const rect = section.getBoundingClientRect()
            const travel = rect.height - window.innerHeight
            if (travel <= 0) return 0
            return clamp01(-rect.top / travel)
        }

        const start = async () => {
            try {
                const { createArchScene } = await import('../three/archScene')
                if (cancelled) return

                const quality = window.innerWidth < 768 ? 'low' : 'high'
                scene = createArchScene(canvas, { quality })

                const applySize = () => {
                    const rect = canvas.getBoundingClientRect()
                    if (rect.width && rect.height) scene.resize(rect.width, rect.height)
                }
                applySize()

                resizeObserver = new ResizeObserver(applySize)
                resizeObserver.observe(canvas)

                await scene.ready
                if (cancelled) return
                setWebglReady(true)

                // Rendered from the same ticker that drives Lenis, so scroll and
                // WebGL resolve on one frame instead of racing each other.
                tick = (_time, delta) => {
                    if (!visible) return
                    const p = progressOf()
                    scene.setProgress(p)
                    scene.update(delta)

                    const stage = stageFor(p)
                    if (stage !== lastStage) {
                        lastStage = stage
                        setActive(stage)
                    }
                    if (readoutRef.current) {
                        const hours = Math.round(p * 48)
                        readoutRef.current.textContent =
                            `${String(hours).padStart(2, '0')}h / 48h`
                    }
                }
                gsap.ticker.add(tick)
            } catch (err) {
                console.error('Pipeline: WebGL scene failed to start', err)
                if (!cancelled) setFailed(true)
            }
        }

        // Only pay for three.js once the section is actually approaching.
        observer = new IntersectionObserver(
            (entries) => {
                visible = entries[0].isIntersecting
                if (visible && !scene && !cancelled) start()
            },
            { rootMargin: '200px 0px' }
        )
        observer.observe(section)

        return () => {
            cancelled = true
            observer?.disconnect()
            resizeObserver?.disconnect()
            if (tick) gsap.ticker.remove(tick)
            scene?.dispose()
        }
    }, [])

    return (
        <section
            id="pipeline"
            ref={sectionRef}
            className={`pipeline ${webglReady ? 'is-live' : ''}`}
            aria-label="The 48-hour manufacturing pipeline"
        >
            <div className="pipeline-sticky">
                <canvas
                    ref={canvasRef}
                    className="pipeline-canvas"
                    aria-hidden="true"
                />

                <div className="pipeline-overlay container">
                    <header className="pipeline-head">
                        <div className="mono-label">THE PIPELINE</div>
                        <h2>
                            Scan to seat.<br />
                            <em>48 hours.</em>
                        </h2>
                    </header>

                    <div className="pipeline-stage" aria-live="polite">
                        <div className="pipeline-stage-index">{STAGES[active].index}</div>
                        <h3>{STAGES[active].label}</h3>
                        <p>{STAGES[active].body}</p>
                    </div>

                    <div className="pipeline-telemetry" aria-hidden="true">
                        <span className="tele-item">
                            <i>STAGE</i>
                            <b>{STAGES[active].readout}</b>
                        </span>
                        <span className="tele-item">
                            <i>LAYER</i>
                            <b>062 µm</b>
                        </span>
                        <span className="tele-item">
                            <i>ELAPSED</i>
                            <b ref={readoutRef}>00h / 48h</b>
                        </span>
                    </div>

                    <ol className="pipeline-rail" aria-hidden="true">
                        {STAGES.map((stage, i) => (
                            <li
                                key={stage.id}
                                className={i === active ? 'active' : i < active ? 'done' : ''}
                            >
                                <span className="rail-dot" />
                                <span className="rail-label">{stage.label.split(' ')[0]}</span>
                            </li>
                        ))}
                    </ol>
                </div>
            </div>

            {/* Readable without WebGL: prerendered, reduced-motion, or failure. */}
            <div className={`pipeline-fallback ${failed ? 'is-error' : ''}`}>
                <ol>
                    {STAGES.map((stage) => (
                        <li key={stage.id}>
                            <span className="fallback-index">{stage.index}</span>
                            <h3>{stage.label}</h3>
                            <p>{stage.body}</p>
                        </li>
                    ))}
                </ol>
            </div>
        </section>
    )
}
