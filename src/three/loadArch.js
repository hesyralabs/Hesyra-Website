import * as THREE from 'three'

/**
 * Loads the preprocessed arch mesh produced by scripts/build-model.mjs.
 *
 * Layout (little-endian):
 *   u32 vertexCount | u32 indexCount | u32 flags (bit0 = 32-bit indices) | u32 reserved
 *   f32 positions[vertexCount * 3]
 *   u16|u32 indices[indexCount]
 *
 * Positions arrive centred on the origin and normalised so the longest axis is
 * 1 unit, so the scene can scale it without measuring anything.
 */

let pending = null

export function loadArch(url = '/models/arch.bin') {
    // The scene can mount more than once across route changes; parse once.
    if (pending) return pending

    pending = fetch(url)
        .then((res) => {
            if (!res.ok) throw new Error(`arch.bin: HTTP ${res.status}`)
            return res.arrayBuffer()
        })
        .then((buffer) => {
            const header = new Uint32Array(buffer, 0, 4)
            const vertexCount = header[0]
            const indexCount = header[1]
            const use32 = (header[2] & 1) === 1

            const positionBytes = vertexCount * 3 * 4
            const positions = new Float32Array(buffer, 16, vertexCount * 3)
            const indices = use32
                ? new Uint32Array(buffer, 16 + positionBytes, indexCount)
                : new Uint16Array(buffer, 16 + positionBytes, indexCount)

            const geometry = new THREE.BufferGeometry()
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3))
            geometry.setIndex(new THREE.BufferAttribute(indices, 1))
            geometry.computeVertexNormals()
            geometry.computeBoundingBox()
            geometry.computeBoundingSphere()

            return geometry
        })
        .catch((err) => {
            pending = null // allow a retry on the next mount
            throw err
        })

    return pending
}
