import DoctorDashboardDemo from './DoctorDashboardDemo'
import React, { useEffect, useRef, useState } from 'react'
import './IllocaHome.css'

const clamp = (v, a, b) => (v < a ? a : v > b ? b : v)
const pad2 = (n) => (n < 10 ? '0' : '') + n
const smooth = (e0, e1, x) => {
  const t = clamp((x - e0) / (e1 - e0), 0, 1)
  return t * t * (3 - 2 * t)
}
const lerp = (a, b, t) => a + (b - a) * t

export default function IllocaHome() {
  const containerRef = useRef(null)
  const outerRef = useRef(null)
  const telemRef = useRef(null)
  const contentRef = useRef(null)
  const coneRef = useRef(null)
  const motesHostRef = useRef(null)
  const heroTypeRef = useRef(null)
  const bleedRef = useRef(null)
  const bleedImgRef = useRef(null)
  const bleedScrimRef = useRef(null)
  const bleedCapRef = useRef(null)
  const heroSignRef = useRef(null)
  const rulerRef = useRef(null)
  const hourElRef = useRef(null)
  const threadLineRef = useRef(null)
  const threadGhostRef = useRef(null)
  const threadHeadRef = useRef(null)
  const threadSvgRef = useRef(null)
  const flowPanelRef = useRef(null)
  const flowSceneRef = useRef(null)
  const stn2ImgRef = useRef(null)
  const stripRef = useRef(null)
  const stripIdxRef = useRef(null)
  const stripBarRef = useRef(null)
  const raceARef = useRef(null)
  const raceABarRef = useRef(null)
  const raceANumRef = useRef(null)
  const raceAStampRef = useRef(null)
  const raceBBarRef = useRef(null)
  const raceBNumRef = useRef(null)
  const raceBStampRef = useRef(null)
  const raceNoteRef = useRef(null)
  const worldRef = useRef(null)

  const [mousePos, setMousePos] = useState({ x: '0000.00', y: '0000.00' })

  // Parametric thread shapes (168 sampled points)
  const threadShapes = () => [
    // 01 the arch you scan
    (u) => {
      const t = -2.55 + u * 5.10
      return [500 + 268 * Math.sin(t), 330 - 178 * Math.cos(t)]
    },
    // 02 the upload — arch straightens into a rising stream
    (u) => [500 + 210 * Math.sin(u * 7.6) * (1 - u * 0.88), 575 - u * 512],
    // 03 reception — squares into a screen
    (u) => {
      const L = 285, R = 715, T = 155, B = 455, w = R - L, h = B - T
      let d = u * 2 * (w + h)
      if (d < w) return [L + d, T]
      d -= w
      if (d < h) return [R, T + d]
      d -= h
      if (d < w) return [R - d, B]
      return [L, B - (d - w)]
    },
    // 04 the print — raster of cured planes
    (u) => {
      const p = u * 11, r = Math.floor(p), f = p - r
      return [272 + (r % 2 ? 1 - f : f) * 456, 145 + r * 31]
    },
    // 05 finishing — crown lobed silhouette
    (u) => {
      const t = u * Math.PI * 2, r = 160 + 27 * Math.cos(4 * t)
      return [500 + r * 1.14 * Math.sin(t), 322 - r * Math.cos(t)]
    },
    // 06 delivery — clock face then hand
    (u) => {
      if (u < 0.8) {
        const t = (u / 0.8) * Math.PI * 2
        return [500 + 172 * Math.sin(t), 322 - 172 * Math.cos(t)]
      }
      const k = (u - 0.8) / 0.2
      return [500 + k * 121, 322 - k * 84]
    }
  ]

  useEffect(() => {
    const content = contentRef.current
    if (!content) return

    let cur = 0
    let target = 0
    let maxScroll = 1
    let kScale = 1
    let vh = window.innerHeight
    let vw = window.innerWidth
    let rafId = null
    let touchY = null
    let mx = 0, my = 0, tmx = 0, tmy = 0
    let sceneDrift = 0, heroDrift = 0
    let scene1Svg = null
    let scene1Layers = null
    let sceneHeroLayers = null
    let rulerWidth = 0

    // Fetch and embed SVG illustration
    let isCancelled = false
    fetch('/assets/scene-scan.svg')
      .then((r) => r.text())
      .then((txt) => {
        if (isCancelled) return
        const body = txt.replace(/^<\?xml[^>]*\?>/, '')
        const hosts = [
          { id: 'hs-scene-hero', key: 'hero' },
          { id: 'hs-scene1', key: 'flow' }
        ]
        hosts.forEach(({ id, key }, n) => {
          const el = document.getElementById(id)
          if (!el) return
          el.innerHTML = body
            .replace(/id="([a-z_]+\d*)"/g, 'id="$1__' + n + '"')
            .replace(/url\(#([a-z_]+\d*)\)/g, 'url(#$1__' + n + ')')
          const svg = el.querySelector('svg')
          if (!svg) return
          svg.setAttribute('preserveAspectRatio', 'xMidYMid slice')
          svg.removeAttribute('width')
          svg.removeAttribute('height')
          svg.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block;'
          if (key === 'flow') scene1Svg = svg

          const layers = [
            ['room', 7, 3],
            ['fixtures', 16, 6],
            ['bench', 30, 11],
            ['patient', 48, 17],
            ['dentist', 78, 27]
          ]
            .map(([lid, ax, ay]) => ({
              el: svg.querySelector('#' + lid + '__' + n),
              ax,
              ay
            }))
            .filter((o) => o.el)

          if (key === 'flow') scene1Layers = layers
          if (key === 'hero') sceneHeroLayers = layers
        })
      })
      .catch(() => {})

    // Collect motion elements
    const q = (s) => Array.from(content.querySelectorAll(s))
    const pars = q('[data-speed]').map((el) => ({
      el,
      speed: parseFloat(el.dataset.speed) || 0,
      top: 0,
      h: 0
    }))
    const dzs = q('[data-dz]').map((el) => {
      const v = el.dataset.dz.split(',').map(parseFloat)
      el.style.willChange = 'transform, opacity'
      return { el, from: v[0] || 0, to: v[1] || 0, rot: parseFloat(el.dataset.dzRot) || 0, top: 0, h: 0 }
    })
    const pins = q('[data-pin]').map((el) => ({
      el,
      name: el.dataset.pin,
      inner: el.querySelector('[data-pin-inner]'),
      top: 0,
      h: 0
    }))
    const drifts = Array.from(document.querySelectorAll('[data-drift]')).map((el) => {
      const v = el.dataset.drift.split(',').map(parseFloat)
      return { el, ax: v[0] || 0, ay: v[1] || 0, ph: v[2] || 0 }
    })
    const worlds = q('[data-world]')
    const P = 1200
    q('[data-z]').forEach((el) => {
      const z = parseFloat(el.dataset.z) || 0
      el.style.transform = 'translateZ(' + z + 'px) scale(' + ((P - z) / P).toFixed(4) + ')'
      el.style.transformStyle = 'preserve-3d'
      el.style.willChange = 'transform'
    })

    // Setup particulate motes
    const motesHost = motesHostRef.current
    const motes = []
    if (motesHost) {
      motesHost.innerHTML = ''
      const bands = [
        { n: 34, r: 0.035, sway: 5, min: 1.0, max: 1.8, op: [0.09, 0.2] },
        { n: 22, r: 0.1, sway: 14, min: 1.6, max: 2.8, op: [0.16, 0.34] },
        { n: 11, r: 0.22, sway: 30, min: 2.6, max: 4.4, op: [0.26, 0.5] }
      ]
      let seed = 7
      const rnd = () => {
        seed = (seed * 1103515245 + 12345) % 2147483648
        return seed / 2147483648
      }
      bands.forEach((b, bi) => {
        const span = 200
        const layer = document.createElement('div')
        layer.style.cssText =
          'position:absolute;left:0;width:100%;top:-100%;height:' + span * 2 + '%;will-change:transform;'
        for (let i = 0; i < b.n; i++) {
          const d = document.createElement('div')
          const size = (b.min + rnd() * (b.max - b.min)).toFixed(2)
          const op = (b.op[0] + rnd() * (b.op[1] - b.op[0])).toFixed(3)
          d.style.cssText =
            'position:absolute;left:' +
            (rnd() * 100).toFixed(2) +
            '%;top:' +
            (rnd() * 100).toFixed(2) +
            '%;width:' +
            size +
            'px;height:' +
            size +
            'px;border-radius:50%;background:#7A9C96;opacity:' +
            op +
            ';box-shadow:0 0 ' +
            (bi * 4 + 3) +
            'px rgba(122,156,150,' +
            (0.3 + bi * 0.2).toFixed(2) +
            ');'
          layer.appendChild(d)
        }
        motesHost.appendChild(layer)
        motes.push({ el: layer, rate: b.r, sway: b.sway, span: window.innerHeight * 2 })
      })
    }

    // Build Hour Ruler
    const ruler = rulerRef.current
    if (ruler && !ruler.childElementCount) {
      let rHtml = ''
      for (let h = 0; h <= 72; h++) {
        const major = h % 12 === 0
        const mark = h === 24 || h === 48 || h === 72
        rHtml +=
          '<div data-hr="' +
          h +
          '" style="width:76px;flex:none;display:flex;flex-direction:column;align-items:center;">' +
          '<div style="width:1px;height:' +
          (mark ? 54 : major ? 34 : 18) +
          'px;background:' +
          (mark ? 'rgba(122,156,150,.8)' : major ? 'rgba(255,255,255,.34)' : 'rgba(255,255,255,.22)') +
          ';"></div>' +
          (major
            ? '<div style="font-family:var(--font-mono);font-size:' +
              (mark ? '14px' : '11px') +
              ';letter-spacing:.06em;color:' +
              (mark ? '#E8E6E5' : '#5e7a80') +
              ';margin-top:12px;">' +
              pad2(h) +
              '</div>'
            : '') +
          '</div>'
      }
      ruler.innerHTML = rHtml
      ;[
        [24, 'SURGICAL GUIDES'],
        [48, 'CROWNS · VENEERS'],
        [72, 'DENTURE SYSTEMS']
      ].forEach((pair) => {
        const cell = ruler.querySelector('[data-hr="' + pair[0] + '"]')
        if (!cell) return
        const tag = document.createElement('div')
        tag.setAttribute('data-marker', String(pair[0]))
        tag.style.cssText =
          'position:absolute;top:100%;margin-top:16px;white-space:nowrap;font-family:var(--font-mono);font-size:9.5px;letter-spacing:.16em;color:#3f5b63;padding:5px 10px;border-radius:30px;border:1px solid rgba(255,255,255,.08);background:rgba(0,13,26,.7);transition:color .4s ease,border-color .4s ease,background .4s ease,transform .5s cubic-bezier(.16,1,.3,1);transform:translateY(-4px);'
        tag.textContent = pair[1]
        cell.style.position = 'relative'
        cell.appendChild(tag)
      })
    }

    const markers = ruler ? Array.from(ruler.querySelectorAll('[data-marker]')) : []
    const bands = q('.hs-band')
    const stns = q('.hs-stn')
    const stnImgs = q('.hs-stn-img')
    const stnTicks = q('.hs-stn-tick')
    const slides = q('.hs-slide')
    const shapes = threadShapes()

    const threadPath = (t) => {
      const S = shapes,
        N = 168
      const i = clamp(Math.floor(t), 0, S.length - 1)
      const j = Math.min(i + 1, S.length - 1)
      const k = smooth(0.8, 0.995, t - i)
      let d = '',
        prev = null,
        len = 0
      const cum = [0],
        pts = []
      for (let s = 0; s < N; s++) {
        const u = s / (N - 1)
        const a = S[i](u),
          b = S[j](u)
        const x = a[0] + (b[0] - a[0]) * k,
          y = a[1] + (b[1] - a[1]) * k
        pts.push(x, y)
        d += (s ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1)
        if (prev) {
          len += Math.hypot(x - prev[0], y - prev[1])
          cum.push(len)
        }
        prev = [x, y]
      }
      return { d, len, cum, pts }
    }

    // Scroll scene handlers
    const sceneHero = (p) => {
      const open = smooth(0.04, 0.62, p)
      const hold = smooth(0.62, 0.86, p)
      if (worlds && worlds[0]) worlds[0].__dolly = open * 120
      heroDrift = (1 - open) * 0.42
      if (bleedRef.current) {
        bleedRef.current.style.top = lerp(43, 0, open) + '%'
        bleedRef.current.style.left = '0%'
        bleedRef.current.style.right = '0%'
        bleedRef.current.style.bottom = lerp(4, 0, open) + '%'
        bleedRef.current.style.borderRadius = '0px'
      }
      if (bleedImgRef.current)
        bleedImgRef.current.style.transform = 'scale(' + (1.1 - open * 0.1 + hold * 0.04).toFixed(4) + ')'
      if (heroSignRef.current) heroSignRef.current.style.opacity = (1 - smooth(0.3, 0.62, p)).toFixed(3)
      if (heroTypeRef.current) {
        heroTypeRef.current.style.transform = 'translate3d(0,' + (-open * 130).toFixed(1) + 'px,0)'
        heroTypeRef.current.style.opacity = (1 - smooth(0.18, 0.5, p)).toFixed(3)
      }
      if (bleedScrimRef.current) bleedScrimRef.current.style.opacity = hold.toFixed(3)
      if (bleedCapRef.current) {
        bleedCapRef.current.style.opacity = hold.toFixed(3)
        bleedCapRef.current.style.transform = 'translate3d(0,' + ((1 - hold) * 26).toFixed(1) + 'px,0)'
      }
    }

    const sceneFlow = (p) => {
      if (!threadLineRef.current) return
      const N = shapes.length
      const t = clamp(p * N, 0, N - 0.0001)
      const curP = threadPath(t)
      threadLineRef.current.setAttribute('d', curP.d)
      if (threadGhostRef.current) {
        threadGhostRef.current.setAttribute('d', threadPath(clamp(t - 0.085, 0, N - 0.0001)).d)
      }

      const drawn = smooth(0.03, 0.62, t)
      threadLineRef.current.style.strokeDasharray = curP.len.toFixed(1)
      threadLineRef.current.style.strokeDashoffset = (curP.len * (1 - drawn)).toFixed(1)
      if (threadGhostRef.current) {
        threadGhostRef.current.style.strokeDasharray = curP.len.toFixed(1)
        threadGhostRef.current.style.strokeDashoffset = (curP.len * (1 - drawn)).toFixed(1)
      }

      const targetLen = curP.len * drawn * ((t * 0.9) % 1)
      let lo = 0
      while (lo < curP.cum.length - 1 && curP.cum[lo + 1] < targetLen) lo++
      if (threadHeadRef.current) {
        threadHeadRef.current.setAttribute('cx', curP.pts[lo * 2].toFixed(1))
        threadHeadRef.current.setAttribute('cy', curP.pts[lo * 2 + 1].toFixed(1))
        threadHeadRef.current.style.opacity = drawn > 0.05 ? '1' : '0'
      }

      const i = Math.floor(t),
        f = t - i
      if (scene1Svg) {
        const k = smooth(0.02, 1.05, t)
        const wide = [0, 0, 2752, 1536],
          close = [412, 236, 1930, 1077]
        const vb = wide.map((v, n) => v + (close[n] - v) * k)
        scene1Svg.setAttribute('viewBox', vb.map((v) => v.toFixed(1)).join(' '))
      }
      if (flowSceneRef.current) flowSceneRef.current.style.opacity = (1 - smooth(0.82, 1.14, t)).toFixed(3)

      sceneDrift = i <= 1 ? (1 - smooth(0, 0.9, f)) * 0.5 : 0
      const open = smooth(0.14, 0.38, f) - smooth(0.84, 1, f)
      const say = smooth(0.3, 0.5, f) - smooth(0.8, 0.94, f)
      if (flowPanelRef.current) {
        const cut = open * vw * 0.37
        flowPanelRef.current.style.clipPath = 'inset(0px ' + cut.toFixed(0) + 'px 0px 0px round 14px)'
        if (threadSvgRef.current) threadSvgRef.current.style.right = cut.toFixed(0) + 'px'
        if (stn2ImgRef.current) stn2ImgRef.current.style.transform = 'translateX(' + (-cut * 0.9).toFixed(0) + 'px)'
      }

      const active = f >= 0.9 ? Math.min(i + 1, N - 1) : i
      for (let s = 0; s < stns.length; s++) {
        const on = s === active
        stns[s].style.opacity = on ? say.toFixed(3) : '0'
        stns[s].style.transform = 'translate(0,-50%) translate3d(0,' + ((1 - say) * 34).toFixed(1) + 'px,0)'
        if (stnImgs[s]) stnImgs[s].style.opacity = on ? '1' : '0'
        const tk = stnTicks[s]
        if (tk) {
          tk.style.background = on ? '#7A9C96' : 'rgba(255,255,255,.06)'
          tk.style.color = on ? '#001A33' : s < active ? '#7A9C96' : '#3f5b63'
        }
      }
    }

    const sceneClock = (p) => {
      const hrs = p * 72
      if (hourElRef.current) hourElRef.current.textContent = 'T+' + pad2(Math.floor(hrs)) + ':' + pad2(Math.floor((hrs % 1) * 60))
      if (rulerRef.current && rulerWidth) {
        rulerRef.current.style.transform = 'translate3d(' + (vw / 2 - p * (rulerWidth - 76) - 38).toFixed(2) + 'px,0,0)'
      }
      for (let i = 0; i < markers.length; i++) {
        const m = markers[i]
        const on = hrs >= parseFloat(m.getAttribute('data-marker')) - 0.6
        m.style.color = on ? '#001A33' : '#3f5b63'
        m.style.background = on ? '#7A9C96' : 'rgba(0,13,26,.7)'
        m.style.borderColor = on ? '#7A9C96' : 'rgba(255,255,255,.08)'
        m.style.transform = on ? 'translateY(4px)' : 'translateY(-4px)'
      }
      const band = hrs < 24 ? 0 : hrs < 48 ? 1 : 2
      for (let i = 0; i < bands.length; i++) {
        bands[i].style.opacity = i === band ? '1' : '0'
        bands[i].style.transform = i === band ? 'translateY(0)' : 'translateY(14px)'
      }
    }

    const sceneRace = (p) => {
      if (!raceABarRef.current || !raceBBarRef.current) return
      const TOTAL = 240,
        DONE = 48
      const t = smooth(0.05, 0.95, p) * TOTAL
      const a = Math.min(t, DONE)
      const fmt = (h) => Math.floor(h / 24) + 'd ' + pad2(Math.floor(h % 24)) + 'h'
      raceABarRef.current.style.width = (a / TOTAL * 100).toFixed(2) + '%'
      raceBBarRef.current.style.width = (t / TOTAL * 100).toFixed(2) + '%'
      if (raceANumRef.current) raceANumRef.current.textContent = fmt(a)
      if (raceBNumRef.current) raceBNumRef.current.textContent = fmt(t)
      const aDone = t >= DONE
      if (raceAStampRef.current) {
        raceAStampRef.current.style.opacity = aDone ? '1' : '0'
      }
      if (raceANumRef.current) {
        raceANumRef.current.style.color = aDone ? '#7A9C96' : '#E8E6E5'
      }
      if (raceBStampRef.current) {
        raceBStampRef.current.style.opacity = t >= TOTAL - 1 ? '1' : '0'
      }
      let note = 'Same prep. Same shade. Same patient. Both clocks start when you finish scanning.'
      if (t >= DONE && t < TOTAL - 1)
        note = 'Yours is on the bench. Theirs is on day ' + (Math.floor(t / 24) + 1) + ' — and the chair is still booked.'
      else if (t >= TOTAL - 1) note = 'Eight days later, the same crown arrives. That gap is the entire product.'
      if (raceNoteRef.current && raceNoteRef.current.textContent !== note) raceNoteRef.current.textContent = note
    }

    const sceneStrip = (p) => {
      const n = slides.length || 1
      const x = -p * (n - 1) * vw
      if (stripRef.current) stripRef.current.style.transform = 'translate3d(' + x.toFixed(2) + 'px,0,0)'
      for (let i = 0; i < n; i++) {
        const local = clamp(p * (n - 1) - i, -1, 1)
        const img = slides[i].firstElementChild
        if (img) img.style.transform = 'translate3d(' + (local * 14).toFixed(2) + '%,0,0) scale(1.18)'
      }
      const idx = clamp(Math.round(p * (n - 1)) + 1, 1, n)
      if (stripIdxRef.current) stripIdxRef.current.textContent = pad2(idx) + ' / ' + pad2(n)
      if (stripBarRef.current) stripBarRef.current.style.width = (((p * (n - 1) + 1) / n) * 100).toFixed(1) + '%'
    }

    const measure = () => {
      kScale = Math.min(1, window.innerWidth / 1200)
      vh = window.innerHeight / kScale
      vw = window.innerWidth / kScale
      content.style.transformOrigin = '0 0'
      content.style.setProperty('--hsvh', vh + 'px')
      content.style.setProperty('--hsvw', vw + 'px')

      const prev = content.style.transform
      content.style.transform = 'none'
      pars.forEach((p) => (p.el.style.transform = 'none'))
      dzs.forEach((d) => (d.el.style.transform = 'none'))
      pins.forEach((p) => {
        if (p.inner) p.inner.style.transform = 'none'
      })
      const base = content.getBoundingClientRect().top
      pars.forEach((p) => {
        const r = p.el.getBoundingClientRect()
        p.top = r.top - base
        p.h = r.height
      })
      dzs.forEach((d) => {
        const r = d.el.getBoundingClientRect()
        d.top = r.top - base
        d.h = r.height
      })
      pins.forEach((p) => {
        const r = p.el.getBoundingClientRect()
        p.top = r.top - base
        p.h = r.height
      })
      if (rulerRef.current) rulerWidth = rulerRef.current.scrollWidth
      const docH = content.scrollHeight
      content.style.transform = prev

      maxScroll = Math.max(1, docH - vh)
      target = clamp(target, 0, maxScroll)
      apply()
    }

    const apply = () => {
      if (!content || vh === undefined) return
      content.style.transform = 'scale(' + kScale.toFixed(5) + ') translate3d(0,' + (-cur).toFixed(2) + 'px,0)'

      const prog = clamp(cur / maxScroll, 0, 1)
      for (let i = 0; i < motes.length; i++) {
        const b = motes[i]
        b.el.style.transform =
          'translate3d(' + (mx * b.sway).toFixed(1) + 'px,' + ((-cur * b.rate) % b.span).toFixed(1) + 'px,0)'
      }
      if (coneRef.current) {
        coneRef.current.style.transform =
          'translate3d(' + (mx * -26).toFixed(1) + 'px,' + (cur * 0.02).toFixed(1) + 'px,0)'
      }
      for (let i = 0; i < drifts.length; i++) {
        const d = drifts[i]
        d.el.style.transform =
          'translate3d(' +
          (Math.sin(prog * 3.4 + d.ph) * d.ax).toFixed(1) +
          'px,' +
          (Math.cos(prog * 2.6 + d.ph) * d.ay).toFixed(1) +
          'px,0)'
      }

      for (let i = 0; i < pars.length; i++) {
        const p = pars[i]
        const c = p.top + p.h / 2 - cur - vh / 2
        if (c < -vh * 2 || c > vh * 2.4) continue
        p.el.style.transform = 'translate3d(0,' + (c * p.speed).toFixed(2) + 'px,0)'
      }

      for (let i = 0; i < dzs.length; i++) {
        const d = dzs[i]
        const c = d.top + d.h / 2 - cur - vh / 2
        if (c < -vh * 1.6 || c > vh * 1.7) continue
        const n = clamp(c / (vh * 0.78), -1, 1)
        const e = n > 0 ? 1 - Math.pow(1 - n, 2) : -(1 - Math.pow(1 + n, 2))
        const z = e > 0 ? d.from * e : d.to * -e
        d.el.style.transform =
          'perspective(1500px) translate3d(0,0,' +
          z.toFixed(1) +
          'px)' +
          (d.rot ? ' rotateX(' + (n * d.rot).toFixed(2) + 'deg)' : '')
        d.el.style.opacity = (1 - smooth(0.58, 1, Math.abs(n)) * 0.92).toFixed(3)
      }

      for (let i = 0; i < pins.length; i++) {
        const pin = pins[i]
        if (!pin.inner) continue
        const span = pin.h - vh
        pin.inner.style.transform = 'translate3d(0,' + clamp(cur - pin.top, 0, span).toFixed(2) + 'px,0)'
        const p = clamp((cur - pin.top) / span, 0, 1)
        if (pin.name === 'hero') sceneHero(p)
        else if (pin.name === 'clock') sceneClock(p)
        else if (pin.name === 'flow') sceneFlow(p)
        else if (pin.name === 'race') sceneRace(p)
        else if (pin.name === 'strip') sceneStrip(p)
      }

      mx += (tmx - mx) * 0.055
      my += (tmy - my) * 0.055
      for (const set of [scene1Layers, sceneHeroLayers]) {
        if (!set) continue
        const driftVal = set === scene1Layers ? sceneDrift : heroDrift
        for (let i = 0; i < set.length; i++) {
          const L = set[i]
          L.el.setAttribute(
            'transform',
            'translate(' + (-mx * L.ax).toFixed(2) + ',' + (-my * L.ay + driftVal * L.ax).toFixed(2) + ')'
          )
        }
      }
      const rx = (-my * 3.2).toFixed(3),
        ry = (mx * 5).toFixed(3)
      for (let i = 0; i < worlds.length; i++) {
        const w = worlds[i]
        w.style.transform =
          'translateZ(' + (w.__dolly || 0).toFixed(1) + 'px) rotateX(' + rx + 'deg) rotateY(' + ry + 'deg)'
      }
    }

    const loop = () => {
      cur += (target - cur) * 0.16
      if (Math.abs(target - cur) < 0.04) cur = target
      apply()
      rafId = requestAnimationFrame(loop)
    }

    // Event listeners
    const onResize = () => measure()
    const onWheel = (e) => {
      e.preventDefault()
      const unit = e.deltaMode === 1 ? 18 : e.deltaMode === 2 ? vh : 1
      target = clamp(target + e.deltaY * unit, 0, maxScroll)
    }
    const onTouchStart = (e) => {
      touchY = e.touches[0].clientY
    }
    const onTouchMove = (e) => {
      if (touchY == null) return
      const y = e.touches[0].clientY
      target = clamp(target + (touchY - y) * 1.9, 0, maxScroll)
      touchY = y
      e.preventDefault()
    }
    const onKey = (e) => {
      const k = e.key
      const step = k === 'PageDown' || k === 'PageUp' ? vh * 0.9 : 90
      if (k === 'ArrowDown' || k === 'PageDown' || k === ' ') target = clamp(target + step, 0, maxScroll)
      else if (k === 'ArrowUp' || k === 'PageUp') target = clamp(target - step, 0, maxScroll)
      else if (k === 'Home') target = 0
      else if (k === 'End') target = maxScroll
      else return
      e.preventDefault()
    }
    const onMove = (e) => {
      tmx = (e.clientX / window.innerWidth) * 2 - 1
      tmy = (e.clientY / window.innerHeight) * 2 - 1
      setMousePos({
        x: e.clientX.toFixed(2).padStart(7, '0'),
        y: e.clientY.toFixed(2).padStart(7, '0')
      })
    }

    window.addEventListener('resize', onResize)
    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    window.addEventListener('keydown', onKey)
    window.addEventListener('mousemove', onMove, { passive: true })

    measure()
    rafId = requestAnimationFrame(loop)
    const tTimer = setTimeout(() => measure(), 800)

    return () => {
      isCancelled = true
      cancelAnimationFrame(rafId)
      clearTimeout(tTimer)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('mousemove', onMove)
    }
  }, [])

  return (
    <div id="illoca-wrapper">
      <div id="hs-outer" ref={outerRef} style={{ position: 'relative', width: '100%', height: '100vh' }}>
        <div
          id="hs-view"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100vh',
            overflow: 'hidden',
            zIndex: 1,
            background: '#001A33'
          }}
        >
          {/* Spotlight radial cone */}
          <div
            id="hs-cone"
            ref={coneRef}
            style={{
              position: 'absolute',
              left: '50%',
              top: '-34%',
              width: '150%',
              height: '120%',
              marginLeft: '-75%',
              zIndex: 0,
              pointerEvents: 'none',
              background:
                'radial-gradient(ellipse 46% 62% at 50% 0%, rgba(122,156,150,.13) 0%, rgba(122,156,150,.045) 34%, transparent 68%)'
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              zIndex: 0,
              pointerEvents: 'none',
              background: 'linear-gradient(180deg, transparent 40%, rgba(0,9,18,.55) 100%)'
            }}
          />
          {/* Floating particulate motes */}
          <div
            id="hs-motes"
            ref={motesHostRef}
            style={{ position: 'absolute', inset: 0, zIndex: 0, pointerEvents: 'none', overflow: 'hidden' }}
          />

          {/* Ambient background blobs */}
          <div
            data-drift="120,-90,0"
            style={{
              position: 'absolute',
              top: '-24%',
              right: '-16%',
              width: '960px',
              height: '960px',
              borderRadius: '50%',
              zIndex: 0,
              pointerEvents: 'none',
              background:
                'radial-gradient(circle, rgba(122,156,150,.15) 0%, rgba(122,156,150,.05) 36%, transparent 68%)'
            }}
          />
          <div
            data-drift="-150,110,2.1"
            style={{
              position: 'absolute',
              bottom: '-30%',
              left: '-18%',
              width: '820px',
              height: '820px',
              borderRadius: '50%',
              zIndex: 0,
              pointerEvents: 'none',
              background:
                'radial-gradient(circle, rgba(122,156,150,.10) 0%, rgba(122,156,150,.03) 38%, transparent 70%)'
            }}
          />

          {/* Live Mouse Telemetry & Direct Contact */}
          <div
            id="hs-telem"
            ref={telemRef}
            style={{
              position: 'absolute',
              top: '20px',
              left: '24px',
              zIndex: 60,
              fontFamily: 'var(--font-mono)',
              fontSize: '9.5px',
              lineHeight: '1.5',
              letterSpacing: '.1em',
              color: '#3f5b63',
              pointerEvents: 'none'
            }}
          >
            X {mousePos.x}
            <br />Y {mousePos.y}
          </div>
          <a
            href="mailto:hesyralabs@gmail.com"
            style={{
              position: 'absolute',
              top: '20px',
              right: '24px',
              zIndex: 60,
              fontFamily: 'var(--font-mono)',
              fontSize: '9.5px',
              letterSpacing: '.12em',
              color: '#3f5b63'
            }}
          >
            HESYRALABS@GMAIL.COM
          </a>

          {/* Scaled desktop stage content */}
          <div
            id="hs-content"
            ref={contentRef}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              minWidth: '1200px',
              zIndex: 1,
              willChange: 'transform'
            }}
          >
            {/* 01 Hero and Bleed Section */}
            <section
              id="top"
              data-screen-label="01 Hero and bleed"
              data-pin="hero"
              style={{ height: 'calc(var(--hsvh) * 2.9)', position: 'relative' }}
            >
              <div data-pin-inner style={{ height: 'var(--hsvh)', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <div data-cam style={{ position: 'absolute', inset: 0, perspective: '1200px', perspectiveOrigin: '50% 46%' }}>
                  <div
                    data-world
                    ref={worldRef}
                    style={{ position: 'absolute', inset: 0, transformStyle: 'preserve-3d', willChange: 'transform' }}
                  >
                    <div
                      data-z="-980"
                      style={{
                        position: 'absolute',
                        inset: '-14%',
                        zIndex: 0,
                        pointerEvents: 'none',
                        background:
                          'radial-gradient(ellipse 60% 50% at 50% 34%, rgba(122,156,150,.16) 0%, rgba(122,156,150,.04) 40%, transparent 72%)'
                      }}
                    />
                    <div
                      data-z="-700"
                      style={{
                        position: 'absolute',
                        left: '6%',
                        top: '-16%',
                        width: '760px',
                        height: '760px',
                        borderRadius: '50%',
                        zIndex: 0,
                        pointerEvents: 'none',
                        background:
                          'radial-gradient(circle, rgba(122,156,150,.22) 0%, rgba(122,156,150,.06) 38%, transparent 68%)'
                      }}
                    />

                    <div
                      id="hs-hero-type"
                      ref={heroTypeRef}
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        padding: 'calc(var(--hsvh) * 0.163) 60px 0',
                        zIndex: 3,
                        textAlign: 'center',
                        willChange: 'transform,opacity'
                      }}
                    >
                      <div style={{ position: 'relative', display: 'inline-block', maxWidth: '1000px' }}>
                        <div
                          style={{
                            position: 'absolute',
                            left: '-158px',
                            top: '22px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transform: 'rotate(-4deg)'
                          }}
                        >
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.16em', color: '#7A9C96' }}>
                            DIGITAL-FIRST
                          </span>
                          <span style={{ display: 'block', width: '42px', height: '1px', background: 'rgba(122,156,150,.5)' }} />
                        </div>
                        <div
                          style={{
                            position: 'absolute',
                            right: '-186px',
                            bottom: '34px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            transform: 'rotate(3deg)'
                          }}
                        >
                          <span style={{ display: 'block', width: '34px', height: '1px', background: 'rgba(122,156,150,.5)' }} />
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.16em', color: '#7A9C96' }}>
                            NOT NEXT WEEK
                          </span>
                        </div>
                        <h1
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontWeight: 700,
                            fontSize: 'clamp(2.6rem, calc(var(--hsvw) * 0.056), 6.2rem)',
                            lineHeight: 1.0,
                            letterSpacing: '-.042em',
                            color: '#E8E6E5'
                          }}
                        >
                          <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '.06em' }}>
                            <span data-reveal="mask" style={{ display: 'block' }}>
                              Every case ships
                            </span>
                          </span>
                          <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '.06em' }}>
                            <span data-reveal="mask" style={{ display: 'block' }}>
                              with a clock on it.
                            </span>
                          </span>
                        </h1>
                      </div>
                    </div>

                    <div data-z="-300" style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
                      <div id="hs-bleed" ref={bleedRef} style={{ position: 'absolute', overflow: 'hidden', willChange: 'inset,border-radius' }}>
                        <div id="hs-bleed-img" ref={bleedImgRef} style={{ position: 'absolute', inset: 0, willChange: 'transform' }}>
                          <div
                            id="hs-scene-hero"
                            style={{ position: 'absolute', inset: 0, overflow: 'hidden', zIndex: 2 }}
                          >
                            
                          </div>
                        </div>
                        {/* Removed hs-hero-sign to keep canvas uncluttered */}
                        <div
                          id="hs-bleed-scrim"
                          ref={bleedScrimRef}
                          style={{
                            position: 'absolute',
                            inset: 0,
                            opacity: 0,
                            background:
                              'linear-gradient(0deg, rgba(0,13,26,.88) 0%, rgba(0,13,26,.06) 46%, rgba(0,13,26,.5) 100%)'
                          }}
                        />
                        <div
                          id="hs-bleed-cap"
                          ref={bleedCapRef}
                          style={{
                            position: 'absolute',
                            left: '60px',
                            right: '60px',
                            bottom: '56px',
                            opacity: 0,
                            willChange: 'opacity,transform'
                          }}
                        >
                          <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96', marginBottom: '12px' }}>
                            T+03:40 — 41 UNITS NESTED
                          </div>
                          <p
                            style={{
                              fontFamily: 'var(--font-display)',
                              fontWeight: 600,
                              fontSize: 'clamp(1.3rem, calc(var(--hsvw) * 0.021), 1.9rem)',
                              lineHeight: 1.25,
                              letterSpacing: '-.02em',
                              color: '#E8E6E5',
                              maxWidth: '640px'
                            }}
                          >
                            Upload the scan. We design, print, finish, fit-check and dispatch — and hand you a timestamp at every step.
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Floating badges removed to give 100% clean cinematic stage to Motion Reel */}
                  </div>
                </div>
              </div>
            </section>

                        {/* 02 Gutter Statement */}
            <section id="trail" data-screen-label="02 Gutter statement" style={{ padding: 'calc(var(--hsvh) * 0.2) 0', position: 'relative' }}>
              <div data-cam style={{ position: 'relative', perspective: '1200px', perspectiveOrigin: '50% 50%' }}>
                <div
                  data-world
                  style={{
                    position: 'relative',
                    display: 'grid',
                    gridTemplateColumns: '36% 64%',
                    alignItems: 'center',
                    gap: 0,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform'
                  }}
                >
                  <div style={{ paddingLeft: '60px', position: 'relative', zIndex: 2 }}>
                    <div data-dz="-480,220" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#7A9C96', boxShadow: '0 0 9px #7A9C96', display: 'block' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96' }}>
                        ONE CASE, END TO END
                      </span>
                    </div>
                    <h2
                      data-dz="-240,340"
                      data-dz-rot="3"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontWeight: 700,
                        fontSize: 'clamp(2.2rem, calc(var(--hsvw) * 0.042), 4.2rem)',
                        lineHeight: 1,
                        letterSpacing: '-.038em',
                        color: '#E8E6E5',
                        marginBottom: '28px'
                      }}
                    >
                      <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '.06em' }}>
                        <span data-reveal="mask" style={{ display: 'block' }}>You are</span>
                      </span>
                      <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '.06em' }}>
                        <span data-reveal="mask" style={{ display: 'block' }}>never told</span>
                      </span>
                      <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '.06em' }}>
                        <span data-reveal="mask" style={{ display: 'block', color: '#7A9C96' }}>“in progress”.</span>
                      </span>
                    </h2>
                    <p data-dz="-680,110" style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.7, color: '#9baab0', maxWidth: '330px' }}>
                      Every case carries a live timestamp in the portal, from scan received to courier handover. Nobody here can tell you it is being looked at — the board says which hour it is on.
                    </p>
                  </div>
                  <div
                    data-z="-40"
                    style={{
                      position: 'relative',
                      minHeight: '540px',
                      height: 'calc(var(--hsvh) * 0.82)',
                      maxHeight: '680px',
                      paddingRight: '50px',
                      zIndex: 10
                    }}
                  >
                    <DoctorDashboardDemo />
                  </div>
                </div>
              </div>
            </section>

            {/* 03 Workflow Thread */}
            <section id="workflow" data-screen-label="03 Workflow thread" data-pin="flow" style={{ height: 'calc(var(--hsvh) * 8.4)', position: 'relative' }}>
              <div data-pin-inner style={{ height: 'var(--hsvh)', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <div id="hs-flow-panel" ref={flowPanelRef} style={{ position: 'absolute', top: '92px', left: '60px', right: '60px', bottom: '64px', willChange: 'clip-path' }}>
                  <div id="hs-flow-scene" ref={flowSceneRef} style={{ position: 'absolute', inset: 0 }}>
                    <div id="hs-scene1" role="img" aria-label="Chairside scan illustration" style={{ position: 'absolute', inset: 0, overflow: 'hidden', background: '#081d2d' }} />
                  </div>
                  <div className="hs-stn-img" style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity .8s ease' }} />
                  <div className="hs-stn-img" style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity .8s ease' }}>
                    <img id="hs-stn2-img" ref={stn2ImgRef} src="/assets/scene-upload.png" alt="Scan upload" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', willChange: 'transform' }} />
                  </div>
                  <div className="hs-stn-img" style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity .8s ease' }}>
                    <img src="/assets/p7.webp" alt="Workstation" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div className="hs-stn-img" style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity .8s ease' }}>
                    <img src="/assets/p4.webp" alt="Build platform" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div className="hs-stn-img" style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity .8s ease' }}>
                    <img src="/assets/p2.webp" alt="Finishing" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div className="hs-stn-img" style={{ position: 'absolute', inset: 0, opacity: 0, transition: 'opacity .8s ease' }}>
                    <img src="/assets/p5.webp" alt="Dispatch box" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  </div>
                  <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(180deg, rgba(0,13,26,.26) 0%, rgba(0,13,26,.04) 40%, rgba(0,13,26,.58) 100%)', zIndex: 1, pointerEvents: 'none' }} />

                  <svg id="hs-thread" ref={threadSvgRef} viewBox="0 0 1000 620" preserveAspectRatio="xMidYMid meet" style={{ position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, zIndex: 2, pointerEvents: 'none', overflow: 'visible' }}>
                    <path id="hs-thread-ghost" ref={threadGhostRef} fill="none" stroke="rgba(122,156,150,.20)" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
                    <path id="hs-thread-line" ref={threadLineRef} fill="none" stroke="#8fb8b1" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" style={{ filter: 'drop-shadow(0 0 5px rgba(122,156,150,.75))' }} />
                    <circle id="hs-thread-head" ref={threadHeadRef} r="4.2" fill="#E8E6E5" style={{ filter: 'drop-shadow(0 0 8px rgba(232,230,229,.85))' }} />
                  </svg>

                  <div style={{ position: 'absolute', left: '30px', bottom: '26px', zIndex: 3, display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="hs-stn-tick" style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.12em', color: '#3f5b63', background: 'rgba(255,255,255,.06)', padding: '5px 10px', borderRadius: '30px', transition: 'color .4s ease, background .4s ease' }}>01</span>
                    <span className="hs-stn-tick" style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.12em', color: '#3f5b63', background: 'rgba(255,255,255,.06)', padding: '5px 10px', borderRadius: '30px', transition: 'color .4s ease, background .4s ease' }}>02</span>
                    <span className="hs-stn-tick" style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.12em', color: '#3f5b63', background: 'rgba(255,255,255,.06)', padding: '5px 10px', borderRadius: '30px', transition: 'color .4s ease, background .4s ease' }}>03</span>
                    <span className="hs-stn-tick" style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.12em', color: '#3f5b63', background: 'rgba(255,255,255,.06)', padding: '5px 10px', borderRadius: '30px', transition: 'color .4s ease, background .4s ease' }}>04</span>
                    <span className="hs-stn-tick" style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.12em', color: '#3f5b63', background: 'rgba(255,255,255,.06)', padding: '5px 10px', borderRadius: '30px', transition: 'color .4s ease, background .4s ease' }}>05</span>
                    <span className="hs-stn-tick" style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.12em', color: '#3f5b63', background: 'rgba(255,255,255,.06)', padding: '5px 10px', borderRadius: '30px', transition: 'color .4s ease, background .4s ease' }}>06</span>
                  </div>
                </div>

                <div id="hs-flow-copy" style={{ position: 'absolute', right: '60px', top: '92px', bottom: '64px', width: '31%', zIndex: 4, display: 'flex', alignItems: 'center' }}>
                  <div className="hs-stn" style={{ position: 'absolute', right: 0, top: '50%', width: '100%', opacity: 0, transform: 'translateY(-50%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '26px' }}>
                      <span style={{ width: '23px', height: '23px', flex: 'none', borderRadius: '50%', border: '1px solid rgba(122,156,150,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#7A9C96' }}>1</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96', whiteSpace: 'nowrap' }}>THE DIGITAL IMPRESSION</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, calc(var(--hsvw) * 0.034), 3.4rem)', lineHeight: 1.0, letterSpacing: '-.04em', color: '#E8E6E5', marginBottom: '22px' }}>It starts in the chair.</h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.7, color: '#9baab0', marginBottom: '28px' }}>You scan the prep intraorally. No tray, no alginate, no second appointment because the impression pulled. The margin is either readable or it is not, and you know before the patient stands up.</p>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.16em', color: '#5e7a80' }}>T+00:00 · CHAIRSIDE</div>
                  </div>

                  <div className="hs-stn" style={{ position: 'absolute', right: 0, top: '50%', width: '100%', opacity: 0, transform: 'translateY(-50%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '26px' }}>
                      <span style={{ width: '23px', height: '23px', flex: 'none', borderRadius: '50%', border: '1px solid rgba(122,156,150,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#7A9C96' }}>2</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96', whiteSpace: 'nowrap' }}>INSTANT UPLOAD</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, calc(var(--hsvw) * 0.034), 3.4rem)', lineHeight: 1.0, letterSpacing: '-.04em', color: '#E8E6E5', marginBottom: '22px' }}>The scan leaves before the patient does.</h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.7, color: '#9baab0', marginBottom: '28px' }}>Straight into the Hesyra portal over an encrypted link, then auto-checked for margin clarity on arrival. If something is unreadable you hear about it in minutes, not on day three.</p>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.16em', color: '#5e7a80' }}>T+00:04 · ENCRYPTED TRANSFER</div>
                  </div>

                  <div className="hs-stn" style={{ position: 'absolute', right: 0, top: '50%', width: '100%', opacity: 0, transform: 'translateY(-50%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '26px' }}>
                      <span style={{ width: '23px', height: '23px', flex: 'none', borderRadius: '50%', border: '1px solid rgba(122,156,150,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#7A9C96' }}>3</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96', whiteSpace: 'nowrap' }}>LAB RECEPTION</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, calc(var(--hsvw) * 0.034), 3.4rem)', lineHeight: 1.0, letterSpacing: '-.04em', color: '#E8E6E5', marginBottom: '22px' }}>On a technician’s screen, not in a queue.</h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.7, color: '#9baab0', marginBottom: '28px' }}>The file opens on a named technician’s desk with your Rx attached. The design comes back to you for approval before anything is committed to resin.</p>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.16em', color: '#5e7a80' }}>T+01:12 · NAGPUR</div>
                  </div>

                  <div className="hs-stn" style={{ position: 'absolute', right: 0, top: '50%', width: '100%', opacity: 0, transform: 'translateY(-50%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '26px' }}>
                      <span style={{ width: '23px', height: '23px', flex: 'none', borderRadius: '50%', border: '1px solid rgba(122,156,150,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#7A9C96' }}>4</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96', whiteSpace: 'nowrap' }}>PRECISION PRINTING</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, calc(var(--hsvw) * 0.034), 3.4rem)', lineHeight: 1.0, letterSpacing: '-.04em', color: '#E8E6E5', marginBottom: '22px' }}>Built in planes, not carved.</h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.7, color: '#9baab0', marginBottom: '28px' }}>Cured one 62-micron layer at a time against a heated vat. Nothing is milled away and nothing is judged by eye — the file is the part, so the second unit matches the first.</p>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.16em', color: '#5e7a80' }}>T+11:20 · DLP VAT · 405NM</div>
                  </div>

                  <div className="hs-stn" style={{ position: 'absolute', right: 0, top: '50%', width: '100%', opacity: 0, transform: 'translateY(-50%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '26px' }}>
                      <span style={{ width: '23px', height: '23px', flex: 'none', borderRadius: '50%', border: '1px solid rgba(122,156,150,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#7A9C96' }}>5</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96', whiteSpace: 'nowrap' }}>ARTISTRY &amp; FINISHING</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, calc(var(--hsvw) * 0.034), 3.4rem)', lineHeight: 1.0, letterSpacing: '-.04em', color: '#E8E6E5', marginBottom: '22px' }}>The last hour is done by hand.</h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.7, color: '#9baab0', marginBottom: '28px' }}>Post-cured, de-supported, polished and characterised against the intraoral photograph you sent. This is the part a machine still cannot do, and we do not pretend otherwise.</p>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.16em', color: '#5e7a80' }}>T+26:00 · BY HAND</div>
                  </div>

                  <div className="hs-stn" style={{ position: 'absolute', right: 0, top: '50%', width: '100%', opacity: 0, transform: 'translateY(-50%)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '11px', marginBottom: '26px' }}>
                      <span style={{ width: '23px', height: '23px', flex: 'none', borderRadius: '50%', border: '1px solid rgba(122,156,150,.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#7A9C96' }}>6</span>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96', whiteSpace: 'nowrap' }}>24-HOUR DELIVERY</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, calc(var(--hsvw) * 0.034), 3.4rem)', lineHeight: 1.0, letterSpacing: '-.04em', color: '#E8E6E5', marginBottom: '22px' }}>Back on your bench tomorrow.</h2>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.7, color: '#9baab0', marginBottom: '28px' }}>Seated on a printed model, checked, boxed and handed to the courier with a tracking number that reaches you before the box does.</p>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.16em', color: '#5e7a80' }}>T+44:30 · DISPATCHED</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 04 Turnaround Hour Ruler */}
            <section data-screen-label="04 Hour ruler" data-pin="clock" style={{ height: 'calc(var(--hsvh) * 2.6)', position: 'relative' }}>
              <div data-pin-inner style={{ height: 'var(--hsvh)', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <div style={{ padding: '0 60px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: '40px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                      <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#7A9C96', boxShadow: '0 0 9px #7A9C96', display: 'block' }} />
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96' }}>TURNAROUND</span>
                    </div>
                    <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, calc(var(--hsvw) * 0.036), 3.4rem)', lineHeight: 1.04, letterSpacing: '-.036em', color: '#E8E6E5', maxWidth: '560px' }}>
                      Three numbers.<br />That is the whole promise.
                    </h2>
                  </div>
                  <div style={{ textAlign: 'right', flex: 'none' }}>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '9.5px', letterSpacing: '.18em', color: '#5e7a80', marginBottom: '8px' }}>ELAPSED SINCE UPLOAD</div>
                    <div id="hs-hour" ref={hourElRef} style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(2.2rem, calc(var(--hsvw) * 0.046), 4rem)', fontWeight: 700, letterSpacing: '-.03em', color: '#E8E6E5', lineHeight: 1 }}>
                      T+00:00
                    </div>
                  </div>
                </div>

                <div style={{ position: 'relative', marginTop: '70px', height: '214px', WebkitMaskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,.35) 9%, #000 24%, #000 76%, rgba(0,0,0,.35) 91%, transparent 100%)', maskImage: 'linear-gradient(90deg, transparent 0%, rgba(0,0,0,.35) 9%, #000 24%, #000 76%, rgba(0,0,0,.35) 91%, transparent 100%)' }}>
                  <div style={{ position: 'absolute', left: '50%', top: '34px', bottom: '6px', width: '1px', background: 'linear-gradient(180deg,rgba(122,156,150,0),rgba(122,156,150,.9) 26%,rgba(122,156,150,.9) 82%,transparent)', zIndex: 3, boxShadow: '0 0 18px rgba(122,156,150,.5)' }} />
                  <div style={{ position: 'absolute', left: '50%', top: '24px', width: '9px', height: '9px', marginLeft: '-4px', borderRadius: '50%', background: '#7A9C96', boxShadow: '0 0 16px rgba(122,156,150,.9)', zIndex: 4 }} />
                  <div id="hs-ruler" ref={rulerRef} style={{ position: 'absolute', top: '66px', left: 0, display: 'flex', alignItems: 'flex-start', willChange: 'transform' }} />
                </div>

                <div style={{ padding: '38px 60px 0', position: 'relative', height: '70px' }}>
                  <div className="hs-band" data-band="0" style={{ position: 'absolute', left: '60px', top: '38px', transition: 'opacity .45s ease, transform .55s cubic-bezier(.16,1,.3,1)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '21px', fontWeight: 600, letterSpacing: '-.022em', color: '#E8E6E5' }}>Surgical guides — 24 hours</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: '#9baab0', marginTop: '8px' }}>Scan today, place tomorrow. Mean apical deviation under 1 mm.</div>
                  </div>
                  <div className="hs-band" data-band="1" style={{ position: 'absolute', left: '60px', top: '38px', opacity: 0, transition: 'opacity .45s ease, transform .55s cubic-bezier(.16,1,.3,1)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '21px', fontWeight: 600, letterSpacing: '-.022em', color: '#E8E6E5' }}>Crowns, bridges, veneers, retainers — 48 hours</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: '#9baab0', marginTop: '8px' }}>Ceramic-hybrid resin. Zero metal, no grey gingival line, ever.</div>
                  </div>
                  <div className="hs-band" data-band="2" style={{ position: 'absolute', left: '60px', top: '38px', opacity: 0, transition: 'opacity .45s ease, transform .55s cubic-bezier(.16,1,.3,1)' }}>
                    <div style={{ fontFamily: 'var(--font-display)', fontSize: '21px', fontWeight: 600, letterSpacing: '-.022em', color: '#E8E6E5' }}>Full digital denture systems — 72 hours</div>
                    <div style={{ fontFamily: 'var(--font-body)', fontSize: '13.5px', color: '#9baab0', marginTop: '8px' }}>Base and teeth from one archived file. Remake from data, not from scratch.</div>
                  </div>
                </div>
              </div>
            </section>

            {/* 05 The Race */}
            <section id="race" data-screen-label="04 The race" data-pin="race" style={{ height: 'calc(var(--hsvh) * 3.4)', position: 'relative' }}>
              <div data-pin-inner style={{ height: 'var(--hsvh)', width: '100%', position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '0 60px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#7A9C96', boxShadow: '0 0 9px #7A9C96', display: 'block' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96' }}>THE SAME CROWN, TWO LABS</span>
                </div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2rem, calc(var(--hsvw) * 0.038), 3.6rem)', lineHeight: 1, letterSpacing: '-.038em', color: '#E8E6E5', marginBottom: 'calc(var(--hsvh) * 0.1)', maxWidth: '820px' }}>
                  Eight days of your patient’s life.
                </h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '52px' }}>
                  <div id="hs-race-a" ref={raceARef} style={{ transition: 'opacity .5s ease' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.18em', color: '#7A9C96' }}>HESYRA</span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px' }}>
                        <span id="hs-race-a-stamp" ref={raceAStampRef} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.16em', color: '#001A33', background: '#7A9C96', padding: '5px 11px', borderRadius: '30px', opacity: 0, transition: 'opacity .4s ease' }}>
                          SEATED
                        </span>
                        <span id="hs-race-a-num" ref={raceANumRef} style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.8rem, calc(var(--hsvw) * 0.032), 2.8rem)', fontWeight: 700, letterSpacing: '-.03em', color: '#E8E6E5', lineHeight: 1 }}>
                          00d 00h
                        </span>
                      </div>
                    </div>
                    <div style={{ position: 'relative', height: '3px', background: 'rgba(255,255,255,.09)' }}>
                      <div id="hs-race-a-bar" ref={raceABarRef} style={{ position: 'absolute', left: 0, top: 0, height: '3px', width: '0%', background: '#7A9C96', boxShadow: '0 0 14px rgba(122,156,150,.8)' }} />
                    </div>
                  </div>

                  <div id="hs-race-b">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '14px' }}>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', letterSpacing: '.18em', color: '#5e7a80' }}>CONVENTIONAL LAB</span>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '18px' }}>
                        <span id="hs-race-b-stamp" ref={raceBStampRef} style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.16em', color: '#9baab0', border: '1px solid rgba(255,255,255,.14)', padding: '5px 11px', borderRadius: '30px', opacity: 0, transition: 'opacity .4s ease' }}>
                          SEATED
                        </span>
                        <span id="hs-race-b-num" ref={raceBNumRef} style={{ fontFamily: 'var(--font-mono)', fontSize: 'clamp(1.8rem, calc(var(--hsvw) * 0.032), 2.8rem)', fontWeight: 700, letterSpacing: '-.03em', color: '#9baab0', lineHeight: 1 }}>
                          00d 00h
                        </span>
                      </div>
                    </div>
                    <div style={{ position: 'relative', height: '3px', background: 'rgba(255,255,255,.09)' }}>
                      <div id="hs-race-b-bar" ref={raceBBarRef} style={{ position: 'absolute', left: 0, top: 0, height: '3px', width: '0%', background: '#5e7a80' }} />
                    </div>
                  </div>
                </div>

                <p id="hs-race-note" ref={raceNoteRef} style={{ fontFamily: 'var(--font-body)', fontSize: '15px', lineHeight: 1.6, color: '#9baab0', marginTop: 'calc(var(--hsvh) * 0.09)', maxWidth: '520px', minHeight: '48px' }}>
                  Same prep. Same shade. Same patient. Both clocks start when you finish scanning.
                </p>
              </div>
            </section>

            {/* 06 Outputs Filmstrip */}
            <section id="outputs" data-screen-label="05 Outputs filmstrip" data-pin="strip" style={{ height: 'calc(var(--hsvh) * 5.2)', position: 'relative' }}>
              <div data-pin-inner style={{ height: 'var(--hsvh)', width: '100%', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: '88px', left: '60px', zIndex: 4, display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#7A9C96', boxShadow: '0 0 9px #7A9C96', display: 'block' }} />
                  <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96' }}>OUTPUTS</span>
                </div>
                <div id="hs-strip-idx" ref={stripIdxRef} style={{ position: 'absolute', top: '88px', right: '60px', zIndex: 4, fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.16em', color: '#5e7a80' }}>
                  01 / 05
                </div>

                <div id="hs-strip" ref={stripRef} style={{ position: 'absolute', inset: 0, display: 'flex', willChange: 'transform' }}>
                  <div className="hs-slide" style={{ flex: 'none', width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    <img src="/assets/p1.webp" alt="Crowns and bridges" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', willChange: 'transform' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,13,26,.9) 0%, rgba(0,13,26,.05) 52%, rgba(0,13,26,.45) 100%)' }} />
                    <div style={{ position: 'absolute', left: '60px', right: '60px', bottom: '76px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96', marginBottom: '14px' }}>RESTORATIONS · 48 HR</div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.4rem, calc(var(--hsvw) * 0.05), 4.6rem)', lineHeight: .98, letterSpacing: '-.04em', color: '#E8E6E5', marginBottom: '16px' }}>Crowns &amp; Bridges</h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', lineHeight: 1.6, color: '#9baab0', maxWidth: '420px' }}>Monolithic ceramic-hybrid resin. Sub-clinical marginal gap, no metal substructure to shear from.</p>
                    </div>
                  </div>
                  <div className="hs-slide" style={{ flex: 'none', width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    <img src="/assets/p3.webp" alt="Digital denture system" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', willChange: 'transform' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,13,26,.9) 0%, rgba(0,13,26,.05) 52%, rgba(0,13,26,.45) 100%)' }} />
                    <div style={{ position: 'absolute', left: '60px', right: '60px', bottom: '76px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96', marginBottom: '14px' }}>RESTORATIONS · 72 HR</div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.4rem, calc(var(--hsvw) * 0.05), 4.6rem)', lineHeight: .98, letterSpacing: '-.04em', color: '#E8E6E5', marginBottom: '16px' }}>Digital Dentures</h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', lineHeight: 1.6, color: '#9baab0', maxWidth: '420px' }}>Base and teeth printed from one archived file. A replacement takes hours, not a new set of appointments.</p>
                    </div>
                  </div>
                  <div className="hs-slide" style={{ flex: 'none', width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    <img src="/assets/p2.webp" alt="Ceramic veneers" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', willChange: 'transform' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,13,26,.9) 0%, rgba(0,13,26,.05) 52%, rgba(0,13,26,.45) 100%)' }} />
                    <div style={{ position: 'absolute', left: '60px', right: '60px', bottom: '76px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96', marginBottom: '14px' }}>RESTORATIONS · 48 HR</div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.4rem, calc(var(--hsvw) * 0.05), 4.6rem)', lineHeight: .98, letterSpacing: '-.04em', color: '#E8E6E5', marginBottom: '16px' }}>Ceramic Veneers</h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', lineHeight: 1.6, color: '#9baab0', maxWidth: '420px' }}>Down to 0.3 mm, characterised against your intraoral photograph rather than a shade-tab guess.</p>
                    </div>
                  </div>
                  <div className="hs-slide" style={{ flex: 'none', width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    <img src="/assets/p7.webp" alt="Surgical guide" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', willChange: 'transform' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,13,26,.9) 0%, rgba(0,13,26,.05) 52%, rgba(0,13,26,.45) 100%)' }} />
                    <div style={{ position: 'absolute', left: '60px', right: '60px', bottom: '76px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7aaff0', marginBottom: '14px' }}>SURGICAL · 24 HR</div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.4rem, calc(var(--hsvw) * 0.05), 4.6rem)', lineHeight: .98, letterSpacing: '-.04em', color: '#E8E6E5', marginBottom: '16px' }}>Surgical Guides</h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', lineHeight: 1.6, color: '#9baab0', maxWidth: '420px' }}>CBCT-matched and sleeve-ready, at a price that makes guided the default rather than the exception.</p>
                    </div>
                  </div>
                  <div className="hs-slide" style={{ flex: 'none', width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
                    <img src="/assets/p6.webp" alt="Retainers and clear aligners" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', willChange: 'transform' }} />
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(0deg, rgba(0,13,26,.9) 0%, rgba(0,13,26,.05) 52%, rgba(0,13,26,.45) 100%)' }} />
                    <div style={{ position: 'absolute', left: '60px', right: '60px', bottom: '76px' }}>
                      <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#c4a0e8', marginBottom: '14px' }}>ORTHODONTICS · 48–72 HR</div>
                      <h3 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.4rem, calc(var(--hsvw) * 0.05), 4.6rem)', lineHeight: .98, letterSpacing: '-.04em', color: '#E8E6E5', marginBottom: '16px' }}>Retainers &amp; Aligners</h3>
                      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14.5px', lineHeight: 1.6, color: '#9baab0', maxWidth: '420px' }}>Thermoformed on printed models, staged and archived. Replacements ship without a new scan.</p>
                    </div>
                  </div>
                </div>

                <div style={{ position: 'absolute', left: '60px', right: '60px', bottom: '44px', zIndex: 4, height: '1px', background: 'rgba(255,255,255,.1)' }}>
                  <div id="hs-strip-bar" ref={stripBarRef} style={{ position: 'absolute', left: 0, top: 0, height: '1px', width: '20%', background: '#7A9C96', boxShadow: '0 0 10px rgba(122,156,150,.7)' }} />
                </div>
              </div>
            </section>

            {/* 07 Why Dentists Switch */}
            <section id="voices" data-screen-label="05 Why switch" style={{ padding: 'calc(var(--hsvh) * 0.22) 60px', position: 'relative' }}>
              <div data-dz="-560,160" style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#7A9C96', boxShadow: '0 0 9px #7A9C96', display: 'block' }} />
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96' }}>WHY DENTISTS ACTUALLY SWITCH</span>
              </div>
              <h2
                data-dz="-320,300"
                data-dz-rot="4"
                style={{
                  fontFamily: 'var(--font-display)',
                  fontWeight: 700,
                  fontSize: 'clamp(2.2rem, calc(var(--hsvw) * 0.044), 4.4rem)',
                  lineHeight: 1,
                  letterSpacing: '-.04em',
                  color: '#E8E6E5',
                  maxWidth: '840px',
                  marginBottom: 'calc(var(--hsvh) * 0.14)'
                }}
              >
                <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '.06em' }}>
                  <span data-reveal="mask" style={{ display: 'block' }}>Nobody changes lab</span>
                </span>
                <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '.06em' }}>
                  <span data-reveal="mask" style={{ display: 'block' }}>because of a price list.</span>
                </span>
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 380px', gap: '52px', alignItems: 'start', padding: '52px 0', borderTop: '1px solid rgba(255,255,255,.08)' }}>
                  <div data-dz="-820,460" style={{ fontFamily: 'var(--font-display)', fontSize: '72px', fontWeight: 700, letterSpacing: '-.05em', lineHeight: .8, color: 'transparent', WebkitTextStroke: '1px rgba(122,156,150,.4)' }}>01</div>
                  <div data-dz="-360,240">
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.17em', color: '#7A9C96', marginBottom: '16px' }}>THE E.MAX FRACTURE</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.15rem, calc(var(--hsvw) * 0.018), 1.6rem)', lineHeight: 1.45, color: '#E8E6E5', fontStyle: 'italic', maxWidth: '660px' }}>“It survived nine months. The patient bit into something on a Sunday and I spent Monday morning apologising for work I did perfectly.”</p>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.1em', color: '#5e7a80', marginTop: '18px' }}>DR. ANAND BANSOD — PROSTHODONTIST, NAGPUR</div>
                  </div>
                  <div data-dz="-140,620" style={{ paddingTop: '34px' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, color: '#9baab0' }}>168 MPa bi-axial flexural strength and a monolithic print — no layered ceramic to shear off a coping. The file is still on our server, so the replacement is a 48-hour job, not a re-prep.</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 380px', gap: '52px', alignItems: 'start', padding: '52px 0', borderTop: '1px solid rgba(255,255,255,.08)' }}>
                  <div data-dz="-560,700" style={{ fontFamily: 'var(--font-display)', fontSize: '72px', fontWeight: 700, letterSpacing: '-.05em', lineHeight: .8, color: 'transparent', WebkitTextStroke: '1px rgba(122,156,150,.4)' }}>02</div>
                  <div data-dz="-520,150">
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.17em', color: '#7A9C96', marginBottom: '16px' }}>THE NERVE NEAR-MISS</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.15rem, calc(var(--hsvw) * 0.018), 1.6rem)', lineHeight: 1.45, color: '#E8E6E5', fontStyle: 'italic', maxWidth: '660px' }}>“Freehand, posterior mandible, and I could feel myself guessing. Nothing went wrong. I still think about it.”</p>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.1em', color: '#5e7a80', marginTop: '18px' }}>DR. GAURAV MAJUMDAR — IMPLANTOLOGIST, MUMBAI</div>
                  </div>
                  <div data-dz="-200,480" style={{ paddingTop: '34px' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, color: '#9baab0' }}>A CBCT-matched guide in 24 hours, priced so guided placement stops being the exception. Mean apical deviation under 1 mm.</p>
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '120px 1fr 380px', gap: '52px', alignItems: 'start', padding: '52px 0', borderTop: '1px solid rgba(255,255,255,.08)', borderBottom: '1px solid rgba(255,255,255,.08)' }}>
                  <div data-dz="-960,300" style={{ fontFamily: 'var(--font-display)', fontSize: '72px', fontWeight: 700, letterSpacing: '-.05em', lineHeight: .8, color: 'transparent', WebkitTextStroke: '1px rgba(122,156,150,.4)' }}>03</div>
                  <div data-dz="-260,380">
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.17em', color: '#7A9C96', marginBottom: '16px' }}>WHERE IS MY CASE?</div>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: 'clamp(1.15rem, calc(var(--hsvw) * 0.018), 1.6rem)', lineHeight: 1.45, color: '#E8E6E5', fontStyle: 'italic', maxWidth: '660px' }}>“The patient is in the chair. My receptionist is on hold with the lab. That is the whole problem, and it happens twice a month.”</p>
                    <div style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.1em', color: '#5e7a80', marginTop: '18px' }}>DR. SHIPRA MANDWAR — CLINIC DIRECTOR, PUNE</div>
                  </div>
                  <div data-dz="-110,700" style={{ paddingTop: '34px' }}>
                    <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', lineHeight: 1.7, color: '#9baab0' }}>A live timestamp per case, scan received to courier handover. The board says which hour it is on.</p>
                  </div>
                </div>
              </div>
            </section>

            {/* 08 CTA & Footer */}
            <section id="cta" data-screen-label="06 CTA and footer" style={{ position: 'relative' }}>
              <div style={{ position: 'relative', height: 'calc(var(--hsvh) * 0.92)', minHeight: '460px', overflow: 'hidden', display: 'flex', alignItems: 'center' }}>
                <img src="/assets/denture-1.png" alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', display: 'block', opacity: 0.5 }} />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(90deg, rgba(0,26,51,.97) 0%, rgba(0,26,51,.78) 44%, rgba(0,26,51,.2) 100%)' }} />
                <div style={{ position: 'relative', zIndex: 2, padding: '0 60px', maxWidth: '760px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }}>
                    <span style={{ width: '5px', height: '5px', borderRadius: '50%', background: '#7A9C96', boxShadow: '0 0 9px #7A9C96', display: 'block' }} />
                    <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', letterSpacing: '.18em', color: '#7A9C96' }}>[INITIATE_PROTOCOL]</span>
                  </div>
                  <h2 data-dz="-300,260" data-dz-rot="3" style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(2.2rem, calc(var(--hsvw) * 0.044), 4rem)', lineHeight: 1, letterSpacing: '-.04em', color: '#E8E6E5', marginBottom: '20px' }}>
                    <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '.06em' }}>
                      <span data-reveal="mask" style={{ display: 'block' }}>Start the clock on</span>
                    </span>
                    <span style={{ display: 'block', overflow: 'hidden', paddingBottom: '.06em' }}>
                      <span data-reveal="mask" style={{ display: 'block' }}>your first case.</span>
                    </span>
                  </h2>
                  <p data-dz="-540,120" style={{ fontFamily: 'var(--font-body)', fontSize: '15.5px', lineHeight: 1.65, color: '#9baab0', marginBottom: '34px', maxWidth: '480px' }}>
                    Tell us where you practise and we send portal access, the shipping kit and a pricing sheet. First case fabricated at cost.
                  </p>
                  <form onSubmit={(e) => { e.preventDefault(); alert("Access Request Received! We will get in touch with your clinic shortly."); }} data-dz="-160,420" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', maxWidth: '560px' }}>
                    <input
                      type="email"
                      required
                      placeholder="Clinic email address"
                      style={{
                        flex: 1,
                        minWidth: '250px',
                        padding: '15px 18px',
                        borderRadius: '8px',
                        border: '1px solid rgba(255,255,255,.12)',
                        background: 'rgba(0,13,26,.7)',
                        color: '#E8E6E5',
                        fontFamily: 'var(--font-body)',
                        fontSize: '14px',
                        outline: 'none'
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        padding: '15px 28px',
                        borderRadius: '8px',
                        border: 'none',
                        background: '#7A9C96',
                        color: '#001A33',
                        fontFamily: 'var(--font-display)',
                        fontSize: '14px',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      Request access
                    </button>
                  </form>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
