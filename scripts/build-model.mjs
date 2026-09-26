/**
 * Hesyra Labs — STL → compact mesh preprocessor
 *
 * The source scan is a 5.5 MB / 110k-triangle binary STL. That's fine for a
 * lab workstation and far too heavy for a hero section, so this bakes it down
 * offline into a small indexed buffer the browser can fetch instantly.
 *
 *   1. Parse the binary STL.
 *   2. Decimate by vertex clustering — snap vertices to a 3D grid, average
 *      each cell, drop triangles that collapse. Holds shape well on organic
 *      meshes and is stable, unlike edge-collapse on a non-manifold scan.
 *   3. Weld into an indexed buffer and normalise to a unit-sized, centred mesh.
 *   4. Write positions + indices as a flat binary.
 *
 * Normals are recomputed in the browser (computeVertexNormals) — cheap, and it
 * keeps them consistent after decimation.
 *
 * Run: node scripts/build-model.mjs
 *
 * Output format (little-endian):
 *   u32 vertexCount | u32 indexCount | u32 flags (bit0 = 32-bit indices) | u32 reserved
 *   f32 positions[vertexCount * 3]
 *   u16|u32 indices[indexCount]
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')

const SOURCE = join(root, 'public/models/Upper.stl')
const OUTPUT = join(root, 'public/models/arch.bin')
// The arch is a thin shell, so clustering too coarsely merges opposing walls
// into one cell and pits the surface. 30k holds up at hero scale; the material
// must also render DoubleSide, since the scan's winding is inconsistent and
// culling backfaces punches holes straight through the shell.
const TARGET_TRIANGLES = 30000

function parseBinarySTL(buffer) {
    const triangles = buffer.readUInt32LE(80)
    if (84 + triangles * 50 !== buffer.length) {
        throw new Error('Not a binary STL, or the file is truncated')
    }
    // 3 vertices per triangle, 3 components each
    const positions = new Float32Array(triangles * 9)
    for (let t = 0; t < triangles; t++) {
        const base = 84 + t * 50 + 12 // skip the per-facet normal
        for (let v = 0; v < 3; v++) {
            const src = base + v * 12
            const dst = t * 9 + v * 3
            // Dental scanners export Z-up. Rotate -90° about X on the way in so
            // +Y is the occlusal (build) axis, which is what the print sweep and
            // every downstream camera assumption expect.
            const x = buffer.readFloatLE(src)
            const y = buffer.readFloatLE(src + 4)
            const z = buffer.readFloatLE(src + 8)
            positions[dst] = x
            positions[dst + 1] = z
            positions[dst + 2] = -y
        }
    }
    return { positions, triangles }
}

function bounds(positions) {
    const min = [Infinity, Infinity, Infinity]
    const max = [-Infinity, -Infinity, -Infinity]
    for (let i = 0; i < positions.length; i += 3) {
        for (let a = 0; a < 3; a++) {
            const val = positions[i + a]
            if (val < min[a]) min[a] = val
            if (val > max[a]) max[a] = val
        }
    }
    return { min, max }
}

/** Vertex-cluster decimation at grid resolution `grid`. */
function cluster(positions, grid, min, size) {
    const cellOf = (x, y, z) => {
        const cx = Math.min(grid - 1, Math.floor(((x - min[0]) / size) * grid))
        const cy = Math.min(grid - 1, Math.floor(((y - min[1]) / size) * grid))
        const cz = Math.min(grid - 1, Math.floor(((z - min[2]) / size) * grid))
        return (cx * grid + cy) * grid + cz
    }

    // Accumulate each cell's centroid, and assign it a compact index.
    const sums = new Map() // cell -> [x, y, z, count, index]
    const cells = new Int32Array(positions.length / 3)
    let next = 0

    for (let i = 0, v = 0; i < positions.length; i += 3, v++) {
        const key = cellOf(positions[i], positions[i + 1], positions[i + 2])
        cells[v] = key
        let entry = sums.get(key)
        if (!entry) {
            entry = [0, 0, 0, 0, next++]
            sums.set(key, entry)
        }
        entry[0] += positions[i]
        entry[1] += positions[i + 1]
        entry[2] += positions[i + 2]
        entry[3]++
    }

    const vertexCount = sums.size
    const verts = new Float32Array(vertexCount * 3)
    for (const entry of sums.values()) {
        const o = entry[4] * 3
        verts[o] = entry[0] / entry[3]
        verts[o + 1] = entry[1] / entry[3]
        verts[o + 2] = entry[2] / entry[3]
    }

    // Rebuild triangles, dropping any that collapsed to a line or point.
    const indices = []
    for (let t = 0; t < cells.length; t += 3) {
        const a = sums.get(cells[t])[4]
        const b = sums.get(cells[t + 1])[4]
        const c = sums.get(cells[t + 2])[4]
        if (a === b || b === c || a === c) continue
        indices.push(a, b, c)
    }

    return { verts, indices, vertexCount }
}

const buffer = readFileSync(SOURCE)
const { positions, triangles } = parseBinarySTL(buffer)
const { min, max } = bounds(positions)
const extent = [max[0] - min[0], max[1] - min[1], max[2] - min[2]]
const size = Math.max(...extent)

// Search for the smallest grid that still clears the triangle target — finer
// grids keep more detail, so we want the coarsest acceptable one.
let best = null
for (let grid = 32; grid <= 256; grid += 8) {
    const result = cluster(positions, grid, min, size)
    best = result
    if (result.indices.length / 3 >= TARGET_TRIANGLES) break
}

const { verts, indices, vertexCount } = best

// Centre on the origin and scale the longest axis to 1 unit.
const centre = [min[0] + extent[0] / 2, min[1] + extent[1] / 2, min[2] + extent[2] / 2]
for (let i = 0; i < verts.length; i += 3) {
    verts[i] = (verts[i] - centre[0]) / size
    verts[i + 1] = (verts[i + 1] - centre[1]) / size
    verts[i + 2] = (verts[i + 2] - centre[2]) / size
}

const use32 = vertexCount > 65535
const indexArray = use32 ? new Uint32Array(indices) : new Uint16Array(indices)

const header = Buffer.alloc(16)
header.writeUInt32LE(vertexCount, 0)
header.writeUInt32LE(indexArray.length, 4)
header.writeUInt32LE(use32 ? 1 : 0, 8)
header.writeUInt32LE(0, 12)

const out = Buffer.concat([
    header,
    Buffer.from(verts.buffer, verts.byteOffset, verts.byteLength),
    Buffer.from(indexArray.buffer, indexArray.byteOffset, indexArray.byteLength)
])

if (!existsSync(dirname(OUTPUT))) mkdirSync(dirname(OUTPUT), { recursive: true })
writeFileSync(OUTPUT, out)

// Report the final bounds — the scene derives its build sweep from these, so a
// surprise here means the source orientation changed.
let bmin = [Infinity, Infinity, Infinity]
let bmax = [-Infinity, -Infinity, -Infinity]
for (let i = 0; i < verts.length; i += 3) {
    for (let a = 0; a < 3; a++) {
        if (verts[i + a] < bmin[a]) bmin[a] = verts[i + a]
        if (verts[i + a] > bmax[a]) bmax[a] = verts[i + a]
    }
}
const f = (n) => n.toFixed(3)

const pct = (n) => `${((n / buffer.length) * 100).toFixed(1)}%`
console.log(`source     ${(buffer.length / 1024 / 1024).toFixed(2)} MB · ${triangles.toLocaleString()} triangles`)
console.log(`bounds     X ${f(bmin[0])}..${f(bmax[0])}  Y ${f(bmin[1])}..${f(bmax[1])} (build axis)  Z ${f(bmin[2])}..${f(bmax[2])}`)
console.log(`decimated  ${vertexCount.toLocaleString()} vertices · ${(indexArray.length / 3).toLocaleString()} triangles`)
console.log(`output     ${(out.length / 1024).toFixed(1)} KB (${pct(out.length)} of source) → ${OUTPUT.replace(root, '.')}`)
console.log(`indices    ${use32 ? 'Uint32' : 'Uint16'}`)
