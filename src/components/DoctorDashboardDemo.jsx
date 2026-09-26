import React, { useState, useEffect, useRef } from 'react'
import {
  Plus,
  Search,
  CreditCard,
  Monitor,
  FolderKanban,
  Settings,
  HelpCircle,
  Bell,
  LogOut
} from 'lucide-react'
import './DoctorDashboardDemo.css'

const STAGES = ['Submitted', 'Design', 'Approved', 'Production', 'Dispatched']

// Catalog of realistic clinical cases to cycle through
const CASE_POOL = [
  { patient: 'krisha', code: 'CB-26090001-001', type: 'SINGLE CROWN', date: '13 Sep, 2026' },
  { patient: 'Vikram S.', code: 'CR-26090002-004', type: 'BIOZIR ZIRCONIA CROWN', date: '13 Sep, 2026' },
  { patient: 'Pooja M.', code: 'BR-26090003-002', type: '3-UNIT ANTERIOR BRIDGE', date: '13 Sep, 2026' },
  { patient: 'Ananya R.', code: 'AL-26090004-006', type: 'CLEAR ALIGNER SET', date: '13 Sep, 2026' },
  { patient: 'Rajesh G.', code: 'CR-26090005-001', type: 'FULL CONTOUR ZIRCONIA', date: '13 Sep, 2026' },
  { patient: 'Meera N.', code: 'IN-26090006-003', type: 'CERAMIC INLAY', date: '13 Sep, 2026' },
  { patient: 'Dr. Anand Model', code: 'SG-26090007-001', type: 'SURGICAL GUIDE', date: '13 Sep, 2026' },
  { patient: 'Sunita D.', code: 'AL-26090008-014', type: 'ALIGNER REVISION (1-14)', date: '13 Sep, 2026' }
]

const CASE_LIFETIME = 10.0 // 10 seconds from submission to delivery
const DELIVERED_HOLD = 1.6 // Stays visible as 'Delivered to you' for 1.6s before exiting the dashboard

export default function DoctorDashboardDemo() {
  const nextPoolIndexRef = useRef(4)
  const [deliveredCounter, setDeliveredCounter] = useState(0)
  const [activeSegment, setActiveSegment] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Initialize 4 active cases with staggered elapsed times
  const [activeCases, setActiveCases] = useState(() => {
    return [
      {
        uid: 'case-init-1',
        ...CASE_POOL[1], // Vikram S. - almost done
        elapsed: 8.2,
        isExiting: false
      },
      {
        uid: 'case-init-2',
        ...CASE_POOL[3], // Ananya R. - in production
        elapsed: 5.4,
        isExiting: false
      },
      {
        uid: 'case-init-3',
        ...CASE_POOL[0], // krisha - in design
        elapsed: 2.6,
        isExiting: false
      },
      {
        uid: 'case-init-4',
        ...CASE_POOL[2], // Pooja M. - just submitted
        elapsed: 0.3,
        isExiting: false
      }
    ]
  })

  // High-frequency tick (runs every 60ms) to progress cases realistically
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveCases((prevCases) => {
        let updated = prevCases.map((c) => ({
          ...c,
          elapsed: c.elapsed + 0.06
        }))

        // Check if any case has passed the full lifecycle + delivered hold
        const expiredCases = updated.filter((c) => c.elapsed >= CASE_LIFETIME + DELIVERED_HOLD)

        if (expiredCases.length > 0) {
          // Increment delivered counter
          setDeliveredCounter((prev) => prev + expiredCases.length)

          // Remove expired cases from active dashboard
          const remaining = updated.filter((c) => c.elapsed < CASE_LIFETIME + DELIVERED_HOLD)

          // Introduce new cases to maintain 4 active cases on the board
          const newCasesToAdd = []
          for (let i = 0; i < expiredCases.length; i++) {
            const template = CASE_POOL[nextPoolIndexRef.current % CASE_POOL.length]
            nextPoolIndexRef.current += 1
            newCasesToAdd.push({
              uid: 'case-' + Date.now() + '-' + Math.random().toString(36).substr(2, 4),
              ...template,
              elapsed: 0.0,
              isExiting: false
            })
          }

          return [...remaining, ...newCasesToAdd]
        }

        return updated
      })
    }, 60)

    return () => clearInterval(interval)
  }, [])

  // Derive stage and plain text status for each case
  const renderedCases = activeCases.map((c) => {
    let stageIndex = 0
    let statusText = 'Received by lab'
    let isDelivered = false

    if (c.elapsed < 2.0) {
      stageIndex = 0
      statusText = 'Received by lab'
    } else if (c.elapsed < 4.0) {
      stageIndex = 1
      statusText = 'Being designed'
    } else if (c.elapsed < 6.0) {
      stageIndex = 2
      statusText = 'Approved for production'
    } else if (c.elapsed < 8.0) {
      stageIndex = 3
      statusText = 'Printing'
    } else if (c.elapsed < 10.0) {
      stageIndex = 4
      statusText = 'Dispatched'
    } else {
      stageIndex = 4
      statusText = 'Delivered to you'
      isDelivered = true
    }

    return {
      ...c,
      stageIndex,
      statusText,
      isDelivered
    }
  })

  // Dynamic counts for segments
  const inProgressCount = renderedCases.filter((c) => !c.isDelivered).length
  const atLabCount = renderedCases.filter((c) => c.stageIndex >= 0 && c.stageIndex <= 3).length
  const onWayCount = renderedCases.filter((c) => c.stageIndex === 4 && !c.isDelivered).length

  // Filter cases based on segment and search query
  const visibleCases = renderedCases.filter((c) => {
    if (activeSegment === 'at_lab') return c.stageIndex <= 3
    if (activeSegment === 'on_way') return c.stageIndex === 4 && !c.isDelivered
    if (activeSegment === 'delivered') return c.isDelivered
    if (activeSegment === 'needs_you') return false
    return true
  }).filter((c) => {
    if (!searchQuery) return true
    const q = searchQuery.toLowerCase()
    return (
      c.patient.toLowerCase().includes(q) ||
      c.code.toLowerCase().includes(q) ||
      c.type.toLowerCase().includes(q)
    )
  })

  return (
    <div className="hpd-window-frame">
      {/* 1. Portal Top Navigation Bar */}
      <header className="hpd-topbar">
        <div className="hpd-topbar-left">
          <div className="hpd-logo-brand">
            <img
              src="/logo.png"
              alt="Hesyra Dental Lab"
              className="hpd-official-logo"
            />
            <span className="hpd-logo-title">Hesyra Dental Lab</span>
          </div>

          <div className="hpd-search-pill">
            <Search size={13} className="hpd-search-icon" />
            <input
              type="text"
              placeholder="Search cases, patients..."
              className="hpd-search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="hpd-topbar-right">
          <button className="hpd-nav-icon-btn active" title="Dashboard">
            <Monitor size={15} />
          </button>
          <button className="hpd-nav-icon-btn" title="Cases">
            <FolderKanban size={15} />
          </button>
          <button className="hpd-nav-icon-btn" title="Billing">
            <CreditCard size={15} />
          </button>
          <button className="hpd-nav-icon-btn" title="Settings">
            <Settings size={15} />
          </button>
          <button className="hpd-nav-icon-btn" title="Help">
            <HelpCircle size={15} />
          </button>
          <div className="hpd-nav-notif-wrap">
            <button className="hpd-nav-icon-btn" title="Notifications">
              <Bell size={15} />
            </button>
            <span className="hpd-notif-badge">1</span>
          </div>
          <button className="hpd-nav-icon-btn" title="Logout">
            <LogOut size={15} />
          </button>
          <div className="hpd-user-avatar" title="Dr. Anand Bansod (MH272)">
            DR
          </div>
        </div>
      </header>

      {/* 2. Workspace Body */}
      <div className="hpd-body">
        {/* Workspace Header */}
        <div className="hpd-workspace-header">
          <div>
            <h1 className="hpd-workspace-title">Active Cases</h1>
            <p className="hpd-workspace-subtitle">
              {renderedCases.length} total · {inProgressCount} in progress
            </p>
          </div>

          <div className="hpd-header-actions">
            <div className="hpd-wallet-chip">
              <CreditCard size={13} />
              <span>₹0.00</span>
            </div>
            <button className="hpd-btn-new-rx">
              <Plus size={15} />
              <span>New Rx Request</span>
            </button>
          </div>
        </div>

        {/* Toolbar with Segments and Filter Search */}
        <div className="hpd-toolbar">
          <div className="hpd-segments">
            <button
              className={`hpd-segment ${activeSegment === 'all' ? 'on' : ''}`}
              onClick={() => setActiveSegment('all')}
            >
              <span>All</span>
              <span className="hpd-seg-count">{renderedCases.length}</span>
            </button>
            <button
              className={`hpd-segment ${activeSegment === 'needs_you' ? 'on' : ''}`}
              onClick={() => setActiveSegment('needs_you')}
            >
              <span>Needs you</span>
              <span className="hpd-seg-count">0</span>
            </button>
            <button
              className={`hpd-segment ${activeSegment === 'at_lab' ? 'on' : ''}`}
              onClick={() => setActiveSegment('at_lab')}
            >
              <span>At the lab</span>
              <span className="hpd-seg-count">{atLabCount}</span>
            </button>
            <button
              className={`hpd-segment ${activeSegment === 'on_way' ? 'on' : ''}`}
              onClick={() => setActiveSegment('on_way')}
            >
              <span>On the way</span>
              <span className="hpd-seg-count">{onWayCount}</span>
            </button>
            <button
              className={`hpd-segment ${activeSegment === 'delivered' ? 'on' : ''}`}
              onClick={() => setActiveSegment('delivered')}
            >
              <span>Delivered</span>
              <span className="hpd-seg-count">{deliveredCounter}</span>
            </button>
          </div>

          <div className="hpd-filter-input-wrap">
            <input
              type="text"
              placeholder="Filter by patient or case ID"
              className="hpd-filter-search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Cases Table List */}
        <div className="hpd-case-list">
          <div className="hpd-list-head">
            <span className="hpd-col-patient">PATIENT</span>
            <span className="hpd-col-progress">PROGRESS</span>
            <span className="hpd-col-status">STATUS</span>
            <span className="hpd-col-received">RECEIVED</span>
          </div>

          <div className="hpd-list-body">
            {visibleCases.map((c) => {
              return (
                <div
                  key={c.uid}
                  className={`hpd-case-row ${c.isDelivered ? 'hpd-row-delivered' : ''}`}
                >
                  {/* Patient Col */}
                  <div className="hpd-cell-patient">
                    <span className="hpd-patient-name" title={c.patient}>
                      {c.patient}
                    </span>
                    <span className="hpd-case-meta">
                      <span>{c.code}</span>
                      <span className="hpd-dot" />
                      <span className="hpd-case-type">{c.type}</span>
                    </span>
                  </div>

                  {/* 5-Milestone Track */}
                  <div
                    className="hpd-track"
                    aria-label={`Stage ${c.stageIndex + 1} of ${STAGES.length}`}
                  >
                    {STAGES.map((label, idx) => {
                      const isDone = idx < c.stageIndex || c.isDelivered
                      const isNow = idx === c.stageIndex && !c.isDelivered
                      return (
                        <span
                          key={label}
                          className={`hpd-step ${isDone ? 'step-done' : ''} ${
                            isNow ? 'step-now' : ''
                          }`}
                        >
                          <span className="hpd-step-bar" />
                          <span className="hpd-step-label">{label}</span>
                        </span>
                      )
                    })}
                  </div>

                  {/* Status Col - Plain, clean clinical text matching the real portal */}
                  <div className="hpd-cell-status">
                    <span className={`hpd-lab-state ${c.isDelivered ? 'delivered-state' : ''}`}>
                      {c.statusText}
                    </span>
                  </div>

                  {/* Received Col */}
                  <div className="hpd-cell-received">
                    <span>{c.date}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
