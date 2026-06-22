/**
 * Hesyra Labs — Static Pre-Renderer
 * 
 * Builds the app, starts a preview server, visits every route with Puppeteer,
 * waits for React to fully render, then saves the real HTML to dist/.
 * 
 * This is what makes Googlebot see actual content instead of an empty shell.
 * 
 * Run: node prerender.mjs
 */

import { execSync, spawn } from 'child_process'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── All routes to pre-render ─────────────────────────────────────────────────
const ROUTES = [
    '/',
    '/about',
    '/portal-docs',
    // Products
    '/products/crowns-bridges',
    '/products/dentures',
    '/products/veneers',
    '/products/surgical-guides',
    '/products/aligners',
    // Blog
    '/blog/digital-vs-traditional-dentures',
    '/blog/what-is-dlp-3d-printing-dentistry',
    '/blog/choosing-right-dental-lab-india',
    // City Landing Pages
    '/dental-lab/nagpur',
    '/dental-lab/mumbai',
    '/dental-lab/pune',
    '/dental-lab/delhi',
    '/dental-lab/hyderabad',
    '/dental-lab/bangalore',
    '/dental-lab/chennai',
    '/dental-lab/ahmedabad',
    // Service Landing Pages
    '/services/3d-printed-crowns',
    '/services/clear-aligners',
    '/services/digital-dentures',
]

const PORT = 4173
const BASE_URL = `http://localhost:${PORT}`
const DIST_DIR = join(__dirname, 'dist')

// ─── Step 1: Build ─────────────────────────────────────────────────────────────
console.log('\n🔨 Building...')
try {
    execSync('npm run build', { stdio: 'inherit', cwd: __dirname })
} catch (e) {
    console.error('Build failed:', e.message)
    process.exit(1)
}

// ─── Step 2: Start preview server ──────────────────────────────────────────────
console.log('\n🚀 Starting preview server...')
const server = spawn('npm', ['run', 'preview', '--', '--port', String(PORT)], {
    cwd: __dirname,
    stdio: 'pipe',
    shell: true,
})

// Wait for server to be ready
await new Promise((resolve) => {
    server.stdout.on('data', (d) => {
        const msg = d.toString()
        if (msg.includes('localhost')) resolve()
    })
    setTimeout(resolve, 3000) // fallback
})

// ─── Step 3: Load Puppeteer ────────────────────────────────────────────────────
let puppeteer
try {
    puppeteer = (await import('puppeteer')).default
} catch {
    console.error('❌ Puppeteer not installed. Run: npm install --save-dev puppeteer')
    server.kill()
    process.exit(1)
}

const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
})

// ─── Step 4: Visit each route and save rendered HTML ──────────────────────────
const page = await browser.newPage()

// Silence console noise from the app
page.on('console', () => {})
page.on('pageerror', () => {})

let success = 0
let failed = 0

for (const route of ROUTES) {
    try {
        await page.goto(`${BASE_URL}${route}`, {
            waitUntil: 'networkidle0',
            timeout: 15000,
        })

        // Wait for React root to be populated
        await page.waitForFunction(
            () => document.getElementById('root')?.children.length > 0,
            { timeout: 10000 }
        )

        // Extra wait for animations/lazy components
        await new Promise(r => setTimeout(r, 800))

        const html = await page.content()

        // Determine output path
        const filePath = route === '/'
            ? join(DIST_DIR, 'index.html')
            : join(DIST_DIR, ...route.slice(1).split('/'), 'index.html')

        // Ensure directory exists
        const dir = dirname(filePath)
        if (!existsSync(dir)) mkdirSync(dir, { recursive: true })

        writeFileSync(filePath, html, 'utf-8')
        console.log(`  ✅ ${route}`)
        success++
    } catch (err) {
        console.log(`  ❌ ${route} — ${err.message}`)
        failed++
    }
}

await browser.close()
server.kill()

console.log(`\n✨ Pre-render complete: ${success} succeeded, ${failed} failed`)
console.log(`📁 Output: ${DIST_DIR}`)
console.log('\nDeploy the dist/ folder. Googlebot will now see real HTML content on every page.\n')
