/**
 * Hesyra Analytics Engine v2
 * - Session management, device/referrer/UTM/geo capture
 * - Mouse movement recording for session replay
 * - Google sign-in linking
 * - Fire-and-forget backend sync
 */

const BACKEND = 'http://localhost:3001'
const STORAGE_KEY = 'hesyra_session'

// ─── Session state ────────────────────────────────────────────────
let session = null
let activeTimer = null
let trueActiveTime = 0

// ─── Boot ─────────────────────────────────────────────────────────
export async function initAnalytics() {
  if (session) return
  session = buildSession()
  await enrichWithGeo(session)
  sendSession()

  // Periodic session update every 30s
  setInterval(() => {
    session.time_on_site_sec = Math.round((Date.now() - session._startedAt) / 1000)
    session.active_time_sec = trueActiveTime
    sendSession()
  }, 30_000)

  // ── True Active Time Tracker ─────────────────────────────────
  let lastActiveTs = Date.now()
  function updateActiveTime() {
    if (document.visibilityState === 'visible') {
      lastActiveTs = Date.now()
    } else {
      trueActiveTime += Math.round((Date.now() - lastActiveTs) / 1000)
    }
  }

  window.addEventListener('visibilitychange', () => {
    updateActiveTime()
    if (document.visibilityState === 'hidden') {
      session.time_on_site_sec = Math.round((Date.now() - session._startedAt) / 1000)
      session.active_time_sec = trueActiveTime
      navigator.sendBeacon(`${BACKEND}/api/track`, JSON.stringify(session))
    }
  })

  // ── Copy Intent Tracker ──────────────────────────────────────
  document.addEventListener('copy', () => {
    const text = window.getSelection().toString().trim()
    if (text.length > 5 && text.length < 200) {
      trackIntent('copy', text)
    }
  })
}

// ─── Track Intents ────────────────────────────────────────────────
export function trackIntent(type, detail) {
  if (!session) return
  // Don't duplicate identical logs rapidly
  const recent = session.intent_logs.find(l => l.type === type && l.detail === detail)
  if (recent) return
  
  session.intent_logs.push({ type, detail, ts: new Date().toISOString() })
  sendSession()
}

export function trackGhostInput(field, value) {
  if (!value) return
  trackIntent('ghost_input', `${field}: ${value}`)
}

export function trackHoverIntent(item) {
  trackIntent('hover', item)
}

// ─── Track a section becoming visible ────────────────────────────
export function trackSection(sectionId) {
  if (!session) return
  if (!session.sections_viewed.includes(sectionId)) {
    session.sections_viewed.push(sectionId)
    // Save to profile for next visit personalization
    const profile = getVisitorProfile() || { sections: [], visitCount: 0 }
    if (!profile.sections) profile.sections = []
    if (!profile.sections.includes(sectionId)) {
      profile.sections.push(sectionId)
      saveVisitorProfile(profile)
    }
  }
}

// ─── Track a CTA button click ─────────────────────────────────────
export function trackCTA(label) {
  if (!session) return
  session.cta_clicks.push({ label, ts: new Date().toISOString() })
  sendSession()
}

// ─── Update scroll depth ─────────────────────────────────────────
export function updateScrollDepth(pct) {
  if (!session) return
  if (pct > session.scroll_depth_pct) {
    session.scroll_depth_pct = Math.round(pct)
  }
}

// ─── Track page navigation ────────────────────────────────────────
export function trackPage(path) {
  if (!session) return
  if (!session.pages_visited.includes(path)) {
    session.pages_visited.push(path)
  }
}

// ─── Link Google sign-in to this session ─────────────────────────
export function linkGoogleEmail(email) {
  if (!session) return
  session.google_email = email
  sendSession()
}

// ─── Get session data for personalization ────────────────────────
export function getSessionData() {
  return session
}

export function getVisitorProfile() {
  // Read from localStorage — persists across sessions
  const data = localStorage.getItem('hesyra_visitor_profile')
  return data ? JSON.parse(data) : null
}

export function saveVisitorProfile(profile) {
  localStorage.setItem('hesyra_visitor_profile', JSON.stringify(profile))
}

// ─── Internal ─────────────────────────────────────────────────────
function buildSession() {
  const params   = new URLSearchParams(window.location.search)
  const stored   = sessionStorage.getItem(STORAGE_KEY)
  const existing = stored ? JSON.parse(stored) : null
  const session_id = existing?.session_id ?? crypto.randomUUID()
  sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ session_id }))

  // Persistent Visitor ID
  let visitor_id = localStorage.getItem('hesyra_visitor_id')
  if (!visitor_id) {
    visitor_id = crypto.randomUUID()
    localStorage.setItem('hesyra_visitor_id', visitor_id)
  }

  // Load/update persistent profile
  const profile = getVisitorProfile() || { sections: [], visitCount: 0, city: null }
  profile.visitCount++
  saveVisitorProfile(profile)

  const ua = navigator.userAgent
  return {
    session_id,
    visitor_id,
    device:           getDevice(ua),
    os:               getOS(ua),
    browser:          getBrowser(ua),
    screen_res:       `${window.screen.width}x${window.screen.height}`,
    referrer:         document.referrer || null,
    utm_source:       params.get('utm_source')   || null,
    utm_medium:       params.get('utm_medium')    || null,
    utm_campaign:     params.get('utm_campaign')  || null,
    landing_page:     window.location.pathname + window.location.search,
    pages_visited:    [window.location.pathname],
    sections_viewed:  [],
    scroll_depth_pct: 0,
    time_on_site_sec: 0,
    active_time_sec:  0,
    intent_logs:      [],
    cta_clicks:       [],
    visit_count:      profile.visitCount,
    google_email:     null,
    city: null, region: null, country: null,
    _startedAt: Date.now(),
  }
}

async function enrichWithGeo(s) {
  try {
    const r = await fetch('https://ip-api.com/json/?fields=city,regionName,country', { signal: AbortSignal.timeout(3000) })
    if (r.ok) {
      const geo = await r.json()
      s.city    = geo.city       || null
      s.region  = geo.regionName || null
      s.country = geo.country    || null

      // Save to profile for geo personalization
      const profile = getVisitorProfile() || {}
      profile.city    = s.city
      profile.region  = s.region
      profile.country = s.country
      saveVisitorProfile(profile)
    }
  } catch {}
}

function sendSession() {
  if (!session) return
  const { _startedAt, ...payload } = session
  fetch(`${BACKEND}/api/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {})
}

function incrementVisitCount() {
  const key = 'hesyra_visit_count'
  const count = parseInt(localStorage.getItem(key) || '0', 10) + 1
  localStorage.setItem(key, String(count))
  return count
}

function getDevice(ua) {
  if (/tablet|ipad/i.test(ua)) return 'Tablet'
  if (/mobile|android|iphone/i.test(ua)) return 'Mobile'
  return 'Desktop'
}

function getOS(ua) {
  if (/windows/i.test(ua))      return 'Windows'
  if (/mac os x/i.test(ua))     return 'macOS'
  if (/android/i.test(ua))      return 'Android'
  if (/iphone|ipad/i.test(ua))  return 'iOS'
  if (/linux/i.test(ua))        return 'Linux'
  return 'Unknown'
}

function getBrowser(ua) {
  if (/edg\//i.test(ua))          return 'Edge'
  if (/chrome\/[0-9]/i.test(ua))  return 'Chrome'
  if (/firefox\//i.test(ua))      return 'Firefox'
  if (/safari\//i.test(ua))       return 'Safari'
  if (/opr\//i.test(ua))          return 'Opera'
  return 'Unknown'
}
