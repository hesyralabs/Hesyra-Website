import React, { useEffect, useRef, useState } from 'react'
import {
  Play,
  Pause,
  RotateCcw,
  FastForward,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles,
  Plane,
  Layers,
  ScanLine
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './HeroMotionStory.css'

const CHAPTERS = [
  {
    id: 'scan',
    chapter: '01',
    timestamp: '08:14 AM',
    title: 'INTRAORAL SCAN INGESTION',
    badge: 'STAGE 01 · DIRECT OPTICAL INGEST',
    headline: 'From Your Intraoral Scanner to Our CAD In 120 Seconds',
    subtext:
      'Seamless optical stream upload (.PLY / .STL) directly from TRIOS, iTero, or Medit with zero mesh distortion.',
    statLabel: 'SCAN TRANSMISSION',
    statValue: '120 Seconds',
    statSub: '14.8M Triangles Ingested',
    visualType: 'video',
    mediaSrc: '/tooth-video.mp4',
    hudTag: 'TRIOS 5 STREAM · 14.8M POLYGONS RAW',
    specs: ['Format: Open .PLY / .STL', 'Resolution: 8.4 μm', 'Transfer: Encrypted Cloud']
  },
  {
    id: 'cad',
    chapter: '02',
    timestamp: '08:16 AM',
    title: 'AI MARGIN LOCK',
    badge: 'STAGE 02 · SUB-MICRON CAD CLEARANCE',
    headline: 'Sub-Micron Finish Line Margin Auto-Detection',
    subtext:
      'Neural margin detection locks subgingival contours to ±0.012mm tolerance, eliminating manual prep misalignments before milling.',
    statLabel: 'MARGIN ACCURACY',
    statValue: '±0.012 mm',
    statSub: '100% Subgingival Seal',
    visualType: 'image',
    mediaSrc: '/1.webp',
    hudTag: 'AI MARGIN LOCK: ±0.012mm [CONFIRMED]',
    specs: ['Cement Space: 25 μm', 'Axial Taper: 6.0°', 'Occlusal Clearance: 1.50mm']
  },
  {
    id: 'print',
    chapter: '03',
    timestamp: '11:30 AM',
    title: 'INDUSTRIAL 3D PRINTING & SINTERING',
    badge: 'STAGE 03 · 50μm DLP & 1530°C SINTERING',
    headline: 'High-Density Ceramic & 50μm Layer Resolution',
    subtext:
      'Industrial DLP arrays cure prosthetic geometries with aerospace precision, followed by 1530°C thermal vacuum sintering.',
    statLabel: 'PRINT RESOLUTION',
    statValue: '50 Microns',
    statSub: '1200 MPa Fracture Strength',
    visualType: 'image',
    mediaSrc: '/workflow_print.png',
    hudTag: 'PROTO DENTAL RS-1 · ACTIVE UV CURE',
    specs: ['Spindle: 60,000 RPM', 'Layer Height: 50 μm', 'Sinter Temp: 1530°C']
  },
  {
    id: 'dispatch',
    chapter: '04',
    timestamp: '04:00 PM',
    title: 'BLUEDART AIR PRIORITY DISPATCH',
    badge: 'STAGE 04 · GUARANTEED 48-HOUR SLA',
    headline: 'Laser Barcode Sealed & On Tonight’s Air Cargo',
    subtext:
      'Every case is packed in a tamper-evident shockproof capsule with live GPS waypoint tracking and guaranteed 48-hour bench delivery.',
    statLabel: 'DELIVERY SLA',
    statValue: '48 Hours',
    statSub: '100% On-Time Delivery',
    visualType: 'image',
    mediaSrc: '/4.webp',
    hudTag: 'BLUEDART AIR EXPRESS · WAYPOINT TRACKING',
    specs: ['Courier: BlueDart Priority 1', 'Air Flight: Direct Metro Hub', 'Tracking: Live Waypoint']
  },
  {
    id: 'seat',
    chapter: '05',
    timestamp: 'DAY 2 · 09:00 AM',
    title: '60-SECOND ZERO-ADJUSTMENT FIT',
    badge: 'STAGE 05 · CHAIRSIDE RESTORATION',
    headline: 'The Crown Drops Right In. Zero Occlusal Grinding.',
    subtext:
      'Flawless interproximal contacts and passive subgingival seating. No high spots, no remakes, no second appointment needed.',
    statLabel: 'CHAIRSIDE SEATING',
    statValue: '60 Seconds',
    statSub: 'Zero Occlusal Adjustments',
    visualType: 'image',
    mediaSrc: '/workflow_deliver.png',
    hudTag: 'CHAIRSIDE FIT CONFIRMED · ZERO REMAKES',
    specs: ['Grinding Required: 0.00 mm', 'Contact Fit: Passive Friction', 'Doctor SLA: 100%']
  }
]

export default function HeroMotionStory() {
  const [activeChapter, setActiveChapter] = useState(0)
  const [progress, setProgress] = useState(0) // 0 to 100%
  const [globalTime, setGlobalTime] = useState(0) // 0 to 10s
  const [isPlaying, setIsPlaying] = useState(true)
  const [speed, setSpeed] = useState(1.0)
  const videoRef = useRef(null)

  // 10-Second Continuous Story Reel Timeline
  useEffect(() => {
    let lastTime = performance.now()
    let frameId

    const loop = (now) => {
      const delta = (now - lastTime) / 1000
      lastTime = now

      if (isPlaying) {
        setGlobalTime((prev) => {
          const next = (prev + delta * speed) % 10.0
          const chapIdx = Math.min(Math.floor(next / 2.0), CHAPTERS.length - 1)
          const chapProgress = ((next % 2.0) / 2.0) * 100

          if (chapIdx !== activeChapter) {
            setActiveChapter(chapIdx)
          }
          setProgress(chapProgress)
          return next
        })
      }

      frameId = requestAnimationFrame(loop)
    }

    frameId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(frameId)
  }, [isPlaying, speed, activeChapter])

  const cur = CHAPTERS[activeChapter] || CHAPTERS[0]

  return (
    <div className="hms-cinema-container">
      {/* 1. Studio Header Bar */}
      <div className="hms-cinema-header">
        <div className="hms-header-left">
          <div className="hms-cinema-live-pill">
            <span className="hms-live-pulse-dot" />
            <span>48-HOUR DIGITAL WORKFLOW REEL</span>
          </div>
          <div className="hms-cinema-clock">
            <Clock size={11} />
            <span>{cur.timestamp}</span>
          </div>
        </div>

        <div className="hms-header-controls">
          <button
            className="hms-ctrl-btn"
            onClick={() => {
              const speeds = [1.0, 1.5, 2.0]
              const next = speeds[(speeds.indexOf(speed) + 1) % speeds.length]
              setSpeed(next)
            }}
            title="Playback Speed"
          >
            <FastForward size={11} />
            <span>{speed}x</span>
          </button>

          <button
            className="hms-ctrl-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Story' : 'Play Story'}
          >
            {isPlaying ? <Pause size={11} /> : <Play size={11} />}
            <span>{isPlaying ? 'PAUSE' : 'PLAY'}</span>
          </button>

          <button
            className="hms-ctrl-btn icon-only"
            onClick={() => {
              setGlobalTime(0)
              setActiveChapter(0)
              setProgress(0)
            }}
            title="Restart Reel"
          >
            <RotateCcw size={11} />
          </button>
        </div>
      </div>

      {/* 2. Visual Motion Graphic Stage */}
      <div className="hms-cinema-stage">
        {/* Background Visual Layer */}
        <AnimatePresence mode="wait">
          <motion.div
            key={cur.id}
            className="hms-media-layer"
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          >
            {cur.visualType === 'video' ? (
              <video
                ref={videoRef}
                src={cur.mediaSrc}
                autoPlay
                loop
                muted
                playsInline
                className="hms-stage-video"
              />
            ) : (
              <img
                src={cur.mediaSrc}
                alt={cur.title}
                className="hms-stage-img"
              />
            )}
            <div className="hms-media-vignette" />
          </motion.div>
        </AnimatePresence>

        {/* Dynamic Scanning Laser Grid Effect */}
        <div className="hms-optical-scan-plane" />

        {/* Top-Left Stage Chip */}
        <div className="hms-cinema-stage-chip">
          <span className="hms-stage-chip-dot" />
          <span>{cur.badge}</span>
        </div>

        {/* Top-Right Stat Card */}
        <div className="hms-cinema-stat-card">
          <div className="hms-stat-kicker">{cur.statLabel}</div>
          <div className="hms-stat-main">{cur.statValue}</div>
          <div className="hms-stat-subtext">{cur.statSub}</div>
        </div>

        {/* Center Live HUD Coordinate Stamp */}
        <div className="hms-center-hud-stamp">
          <span className="hms-hud-crosshair-icon" />
          <span>{cur.hudTag}</span>
        </div>

        {/* Bottom-Right Specs Card */}
        <div className="hms-cinema-specs-card">
          <div className="hms-specs-title">CLINICAL SPECIFICATIONS</div>
          <div className="hms-specs-list">
            {cur.specs.map((item, idx) => (
              <div key={idx} className="hms-spec-row">
                <span className="hms-spec-dot" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom-Left Kinetic Headline Overlay */}
        <div className="hms-cinema-narrative-overlay">
          <div className="hms-narrative-stage">
            STAGE {cur.chapter} / 05 · {cur.title}
          </div>
          <h2 className="hms-narrative-heading">{cur.headline}</h2>
          <p className="hms-narrative-desc">{cur.subtext}</p>
        </div>
      </div>

      {/* 3. Scrubbable Interactive Multi-Track Timeline */}
      <div className="hms-cinema-timeline">
        {/* Global Progress Line */}
        <div
          className="hms-scrub-bar"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect()
            const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
            const targetTime = ratio * 10.0
            setGlobalTime(targetTime)
            const chap = Math.min(Math.floor(targetTime / 2.0), CHAPTERS.length - 1)
            setActiveChapter(chap)
            setProgress(((targetTime % 2.0) / 2.0) * 100)
          }}
        >
          <div
            className="hms-scrub-fill"
            style={{ width: `${(globalTime / 10.0) * 100}%` }}
          />
        </div>

        {/* Chapter Steps */}
        <div className="hms-chapter-buttons">
          {CHAPTERS.map((chap, idx) => {
            const isActive = idx === activeChapter
            const isDone = idx < activeChapter

            return (
              <button
                key={chap.id}
                className={`hms-chapter-btn ${isActive ? 'active' : ''} ${isDone ? 'done' : ''}`}
                onClick={() => {
                  setActiveChapter(idx)
                  setGlobalTime(idx * 2.0)
                  setProgress(0)
                }}
              >
                <div className="hms-chapter-btn-track">
                  <div
                    className="hms-chapter-btn-fill"
                    style={{
                      width: isActive ? `${progress}%` : isDone ? '100%' : '0%'
                    }}
                  />
                </div>
                <div className="hms-chapter-btn-label">
                  <span className="hms-btn-num">{chap.chapter}</span>
                  <span className="hms-btn-text">{chap.title}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
