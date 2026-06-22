import React, { useState, useEffect, useCallback, useMemo } from 'react'
import './AdminInsights.css'

const BACKEND = 'http://localhost:3001'
const TOKEN_KEY = 'hesyra_admin_token'

export default function AdminInsights() {
  const [open, setOpen]       = useState(false)
  const [tab, setTab]         = useState('visitors')   // 'visitors' | 'leads'
  const [password, setPassword] = useState('')
  const [token, setToken]     = useState(() => sessionStorage.getItem(TOKEN_KEY))
  const [loginErr, setLoginErr] = useState('')
  const [loading, setLoading] = useState(false)
  const [stats, setStats]     = useState(null)
  const [visitors, setVisitors] = useState([])
  const [leads, setLeads]     = useState([])
  const [campaigns, setCampaigns] = useState([])
  const [expandedVisitor, setExpandedVisitor] = useState(null)

  // ── Group Visitors by Identity ───────────────────────────────
  const groupedVisitors = useMemo(() => {
    const groups = {}
    visitors.forEach(v => {
      const vid = v.visitor_id || v.session_id // Fallback for old data
      if (!groups[vid]) {
        groups[vid] = {
          visitor_id: vid,
          sessions: [],
          totalActiveTime: 0,
          maxHeatScore: 0,
          location: [v.city, v.country].filter(Boolean).join(', ') || 'Unknown',
          device: v.device,
          browser: v.browser,
          referrer: v.referrer,
          latestDate: v.created_at,
          google_email: null
        }
      }
      const g = groups[vid]
      g.sessions.push(v)
      g.totalActiveTime += (v.active_time_sec || v.time_on_site_sec || 0)
      if (v.heat_score > g.maxHeatScore) g.maxHeatScore = v.heat_score
      if (v.google_email && !g.google_email) g.google_email = v.google_email
      
      // Update to most recent session metadata
      if (new Date(v.created_at) > new Date(g.latestDate)) {
        g.latestDate = v.created_at
        g.location = [v.city, v.country].filter(Boolean).join(', ') || 'Unknown'
        g.device = v.device
        g.browser = v.browser
        g.referrer = v.referrer
      }
    })
    
    // Sort groups by latest activity
    return Object.values(groups).sort((a,b) => new Date(b.latestDate) - new Date(a.latestDate))
  }, [visitors])

  // ── Toggle on Ctrl+Shift+H ───────────────────────────────────
  useEffect(() => {
    const handleKey = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'H') {
        e.preventDefault()
        setOpen(o => !o)
      }
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [])

  // ── Load data when panel opens and user is authenticated ─────
  useEffect(() => {
    if (open && token) loadData()
  }, [open, token])

  const authHeaders = useCallback(() => ({
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  }), [token])

  async function login() {
    setLoginErr('')
    setLoading(true)
    try {
      const res = await fetch(`${BACKEND}/api/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Login failed')
      sessionStorage.setItem(TOKEN_KEY, data.token)
      setToken(data.token)
      setPassword('')
    } catch (err) {
      setLoginErr(err.message)
    } finally {
      setLoading(false)
    }
  }

  async function loadData() {
    setLoading(true)
    try {
      const [statsRes, visitorsRes, leadsRes, campaignsRes] = await Promise.all([
        fetch(`${BACKEND}/api/admin/stats`,    { headers: authHeaders() }),
        fetch(`${BACKEND}/api/admin/visitors`, { headers: authHeaders() }),
        fetch(`${BACKEND}/api/admin/leads`,    { headers: authHeaders() }),
        fetch(`${BACKEND}/api/admin/campaigns`,{ headers: authHeaders() }),
      ])
      if (statsRes.status === 401) { setToken(null); sessionStorage.removeItem(TOKEN_KEY); return }
      setStats(await statsRes.json())
      setVisitors(await visitorsRes.json())
      setLeads(await leadsRes.json())
      setCampaigns(await campaignsRes.json())
    } catch (err) {
      console.error('Admin load error:', err)
    } finally {
      setLoading(false)
    }
  }

  async function exportCSV(type) {
    try {
      const res = await fetch(`${BACKEND}/api/admin/export/${type}`, {
        headers: authHeaders(),
      })
      if (!res.ok) return
      const blob = await res.blob()
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement('a')
      a.href     = url
      a.download = `hesyra_${type}_${Date.now()}.csv`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error('Export error:', err)
    }
  }

  function logout() {
    setToken(null)
    sessionStorage.removeItem(TOKEN_KEY)
  }

  if (!open) return null

  return (
    <div className="ai-overlay" role="dialog" aria-label="Hesyra Admin Panel">
      <div className="ai-panel">

        {/* ── Header ── */}
        <div className="ai-header">
          <div className="ai-header-left">
            <img src="/logo-small.webp" alt="Hesyra" className="ai-logo" />
            <div>
              <div className="ai-title">Hesyra Intelligence</div>
              <div className="ai-subtitle">Admin Panel · {new Date().toLocaleDateString('en-IN', { dateStyle: 'medium' })}</div>
            </div>
          </div>
          <div className="ai-header-right">
            {token && <button className="ai-logout-btn" onClick={logout}>Sign out</button>}
            <button className="ai-close-btn" onClick={() => setOpen(false)}>✕</button>
          </div>
        </div>

        {/* ── Login Gate ── */}
        {!token ? (
          <div className="ai-login-wrap">
            <div className="ai-login-card">
              <div className="ai-lock-icon">🔒</div>
              <h2>Admin Access</h2>
              <p>This panel is private. Enter your admin password to continue.</p>
              <input
                type="password"
                className="ai-pw-input"
                placeholder="Admin password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && login()}
                autoFocus
              />
              {loginErr && <div className="ai-error">{loginErr}</div>}
              <button className="ai-login-btn" onClick={login} disabled={loading}>
                {loading ? 'Verifying…' : 'Enter'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* ── Stats Bar ── */}
            {stats && (
              <div className="ai-stats-bar">
                <div className="ai-stat">
                  <span className="ai-stat-val">{stats.visitors?.total_visits ?? 0}</span>
                  <span className="ai-stat-label">Total Visits</span>
                </div>
                <div className="ai-stat">
                  <span className="ai-stat-val">{stats.visitors?.visits_today ?? 0}</span>
                  <span className="ai-stat-label">Today</span>
                </div>
                <div className="ai-stat">
                  <span className="ai-stat-val">{stats.visitors?.unique_ips ?? 0}</span>
                  <span className="ai-stat-label">Unique IPs</span>
                </div>
                <div className="ai-stat">
                  <span className="ai-stat-val">{stats.visitors?.avg_scroll_depth ?? 0}%</span>
                  <span className="ai-stat-label">Avg Scroll</span>
                </div>
                <div className="ai-stat">
                  <span className="ai-stat-val" style={{color: '#ff6b6b'}}>{stats.visitors?.hot_leads ?? 0}</span>
                  <span className="ai-stat-label">Hot Leads</span>
                </div>
                <div className="ai-stat">
                  <span className="ai-stat-val">{formatTime(stats.visitors?.avg_time_sec ?? 0)}</span>
                  <span className="ai-stat-label">Avg Time</span>
                </div>
                <div className="ai-stat">
                  <span className="ai-stat-val ai-stat-leads">{stats.leads?.total_leads ?? 0}</span>
                  <span className="ai-stat-label">Total Leads</span>
                </div>
                <div className="ai-stat">
                  <span className="ai-stat-val ai-stat-leads">{stats.leads?.leads_today ?? 0}</span>
                  <span className="ai-stat-label">Leads Today</span>
                </div>
              </div>
            )}

            {/* ── Tabs ── */}
            <div className="ai-tabs">
              <button className={`ai-tab ${tab === 'visitors' ? 'active' : ''}`} onClick={() => setTab('visitors')}>
                Visitors <span className="ai-badge">{visitors.length}</span>
              </button>
              <button className={`ai-tab ${tab === 'leads' ? 'active' : ''}`} onClick={() => setTab('leads')}>
                Leads <span className="ai-badge ai-badge-leads">{leads.length}</span>
              </button>
              <button className={`ai-tab ${tab === 'campaigns' ? 'active' : ''}`} onClick={() => setTab('campaigns')}>
                Campaigns
              </button>
              <button className="ai-refresh-btn" onClick={loadData} disabled={loading}>⟳ Refresh</button>
              <button className="ai-export-btn" onClick={() => exportCSV(tab === 'visitors' ? 'visitors' : 'leads')}>
                ↓ Export CSV
              </button>
            </div>

            {/* ── Content ── */}
            <div className="ai-content">
              {loading && <div className="ai-loading">Loading…</div>}

              {!loading && tab === 'visitors' && (
                <div className="ai-table-wrap">
                  <table className="ai-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Heat</th>
                        <th>Visitor Profile</th>
                        <th>Location</th>
                        <th>Device</th>
                        <th>Referrer</th>
                        <th>Sessions</th>
                        <th>Total Time</th>
                        <th>Last Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedVisitors.map((g, i) => (
                        <React.Fragment key={g.visitor_id}>
                          <tr 
                            className="ai-group-row" 
                            onClick={() => setExpandedVisitor(expandedVisitor === g.visitor_id ? null : g.visitor_id)}
                            style={{ cursor: 'pointer', background: expandedVisitor === g.visitor_id ? 'rgba(255,255,255,0.02)' : 'transparent' }}
                          >
                            <td className="ai-td-dim">
                              <span style={{ display: 'inline-block', width: '20px' }}>
                                {expandedVisitor === g.visitor_id ? '▼' : '▶'}
                              </span>
                              {i + 1}
                            </td>
                            <td>
                              <div className={`ai-heat-score ${g.maxHeatScore >= 70 ? 'hot' : ''}`}>{g.maxHeatScore}</div>
                            </td>
                            <td className="ai-td-mono" style={{ color: 'var(--text-primary)' }}>
                              Visitor-{g.visitor_id.slice(0, 4).toUpperCase()}
                              {g.google_email && <div className="ai-google-badge" style={{ marginTop: '4px' }}>{g.google_email}</div>}
                            </td>
                            <td>{g.location}</td>
                            <td>{g.device} {g.browser}</td>
                            <td className="ai-td-url">{g.referrer ? shortUrl(g.referrer) : 'Direct'}</td>
                            <td>
                              <span className="ai-badge" style={{ background: 'var(--border-light)' }}>
                                {g.sessions.length} Session{g.sessions.length !== 1 ? 's' : ''}
                              </span>
                            </td>
                            <td>{formatTime(g.totalActiveTime)}</td>
                            <td className="ai-td-dim">{shortDate(g.latestDate)}</td>
                          </tr>

                          {/* Expanded Session Timeline */}
                          {expandedVisitor === g.visitor_id && g.sessions.map((v, sIdx) => (
                            <tr key={v.id} className="ai-child-row" style={{ background: 'rgba(0,0,0,0.2)' }}>
                              <td></td>
                              <td className="ai-td-dim" style={{ textAlign: 'right' }}>Score: {v.heat_score}</td>
                              <td colSpan={2} className="ai-td-mono ai-td-dim">
                                ↳ Session {g.sessions.length - sIdx} ({v.session_id.slice(0, 6)})
                                <div style={{ fontSize: '0.7rem', marginTop: '4px', color: 'var(--text-tertiary)' }}>
                                  {shortDate(v.created_at)}
                                </div>
                              </td>
                              <td colSpan={2}>
                                <div className="ai-pills">
                                  {(v.sections_viewed ?? []).map(s => (
                                    <span key={s} className="ai-pill">{s}</span>
                                  ))}
                                </div>
                                <div style={{fontSize:'0.6rem', color:'var(--text-tertiary)', marginTop:'4px'}}>
                                   {(v.score_signals ?? []).join(', ')}
                                </div>
                              </td>
                              <td colSpan={2}>
                                <div className="ai-pills" style={{flexDirection: 'column', alignItems: 'flex-start'}}>
                                  {(v.intent_logs ?? []).map((l, idx) => (
                                    <span key={idx} className="ai-pill" style={{background:'rgba(255,107,107,0.1)', color:'#ff6b6b'}}>
                                      {l.type}: {l.detail.slice(0, 20)}
                                    </span>
                                  ))}
                                  {(!v.intent_logs || !v.intent_logs.length) && <span className="ai-td-dim">No explicit intents</span>}
                                </div>
                              </td>
                              <td className="ai-td-dim">{formatTime(v.active_time_sec || v.time_on_site_sec)}</td>
                            </tr>
                          ))}
                        </React.Fragment>
                      ))}
                      {!groupedVisitors.length && (
                        <tr><td colSpan={9} className="ai-empty">No visitors yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && tab === 'leads' && (
                <div className="ai-table-wrap">
                  <table className="ai-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Photo</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Visits</th>
                        <th>First Seen</th>
                        <th>Last Seen</th>
                      </tr>
                    </thead>
                    <tbody>
                      {leads.map((l, i) => (
                        <tr key={l.id}>
                          <td className="ai-td-dim">{i + 1}</td>
                          <td>
                            {l.photo_url
                              ? <img src={l.photo_url} alt={l.name} className="ai-lead-photo" />
                              : <div className="ai-lead-initials">{initials(l.name)}</div>
                            }
                          </td>
                          <td className="ai-td-name">{l.name || '—'}</td>
                          <td className="ai-td-mono">{l.email}</td>
                          <td>{l.visit_count}</td>
                          <td className="ai-td-dim">{shortDate(l.first_seen)}</td>
                          <td className="ai-td-dim">{shortDate(l.last_seen)}</td>
                        </tr>
                      ))}
                      {!leads.length && (
                        <tr><td colSpan={7} className="ai-empty">No leads captured yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {!loading && tab === 'campaigns' && (
                <div className="ai-table-wrap">
                  <table className="ai-table">
                    <thead>
                      <tr>
                        <th>Source</th>
                        <th>Medium</th>
                        <th>Campaign</th>
                        <th>Visitors</th>
                        <th>Hot Leads</th>
                        <th>Avg Score</th>
                        <th>Avg Scroll</th>
                        <th>Avg Time</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campaigns.map((c, i) => (
                        <tr key={i}>
                          <td className="ai-td-name">{c.source}</td>
                          <td>{c.medium}</td>
                          <td className="ai-td-mono">{c.campaign}</td>
                          <td>{c.visitors}</td>
                          <td style={{color: '#ff6b6b'}}>{c.hot_count}</td>
                          <td>{c.avg_score}</td>
                          <td>{c.avg_scroll}%</td>
                          <td>{formatTime(c.avg_time)}</td>
                        </tr>
                      ))}
                      {!campaigns.length && (
                        <tr><td colSpan={8} className="ai-empty">No campaign data yet</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

      </div>
    </div>
  )
}

// ─── Helpers ──────────────────────────────────────────────────────
function formatTime(sec) {
  if (!sec || sec < 60) return `${sec}s`
  return `${Math.floor(sec / 60)}m ${sec % 60}s`
}

function shortDate(iso) {
  if (!iso) return '—'
  return new Date(iso).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

function shortUrl(url) {
  try { return new URL(url).hostname } catch { return url.slice(0, 30) }
}

function initials(name) {
  if (!name) return '?'
  return name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
}
