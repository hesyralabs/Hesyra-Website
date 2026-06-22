import React, { useRef, useState, useEffect } from 'react'
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion'
import { Search, Monitor, Box, CreditCard, Settings, Palette, Bell, LogOut, FileText, MoreHorizontal, Lock, Mail, X, CheckCircle, UploadCloud, ChevronRight } from 'lucide-react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import './PortalTeaser.css'

export default function PortalTeaser() {
    const containerRef = useRef(null)
    const appBodyRef = useRef(null)
    const inView = useInView(containerRef, { amount: 0.1, once: false })

    // Refs for cursor tracking
    const loginBtnRef = useRef(null)
    const newRxBtnRef = useRef(null)
    const caseTypeSelectRef = useRef(null)
    const nextBtn1Ref = useRef(null)
    const nextBtn2Ref = useRef(null)
    const submitBtnRef = useRef(null)
    const cardRef = useRef(null)
    
    // Sticky Scroll Animation Configuration
    // 250vh section = 100vh sticky viewport + 150vh of scroll travel for smooth crossfade
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    })
    
    // Text: stays fully visible for the first part, then quickly dissolves out
    const textOpacity = useTransform(scrollYProgress, [0, 0.08, 0.12], [1, 1, 0])
    const textY = useTransform(scrollYProgress, [0, 0.12], [0, -40])
    const textScale = useTransform(scrollYProgress, [0.08, 0.12], [1, 0.95])
    
    // Mockup: overlaps text fade-out for a true cross-dissolve, fully solid for a long span
    const mockupOpacity = useTransform(scrollYProgress, [0.12, 0.16, 0.94, 0.98], [0, 1, 1, 0])
    const mockupScale = useTransform(scrollYProgress, [0.12, 0.16], [0.95, 1])
    const mockupY = useTransform(scrollYProgress, [0.12, 0.16], [40, 0])

    // --- Demo Orchestration ---
    const [activeScreen, setActiveScreen] = useState('login')
    const [rxModalStep, setRxModalStep] = useState(0)
    const [mockScansUploaded, setMockScansUploaded] = useState(false)
    const [dashboardCases, setDashboardCases] = useState([])
    const [etaVisible, setEtaVisible] = useState(false)

    // Track when the mockup window is fully visible (scroll-driven opacity reaches 1)
    const [mockupVisible, setMockupVisible] = useState(false)
    const mockupVisibleRef = useRef(false)

    useEffect(() => {
        const unsubscribe = scrollYProgress.on('change', (v) => {
            if (v >= 0.16 && v < 0.94 && !mockupVisibleRef.current) {
                mockupVisibleRef.current = true
                setMockupVisible(true)
            } else if ((v < 0.08 || v >= 0.94) && mockupVisibleRef.current) {
                mockupVisibleRef.current = false
                setMockupVisible(false)
                setActiveScreen('login')
                setRxModalStep(0)
                setMockScansUploaded(false)
                setDashboardCases([])
                setEtaVisible(false)
            }
        })
        return () => unsubscribe()
    }, [scrollYProgress])

    const cursorRef = useRef(null)

    const demoActiveRef = useRef(false)

    useGSAP((context, contextSafe) => {
        if (!mockupVisible || !cursorRef.current || !appBodyRef.current) return;

        demoActiveRef.current = true

        const getCoords = (ref) => {
            if (!ref?.current || !appBodyRef.current) return { x: 0, y: 0 };
            
            const targetRect = ref.current.getBoundingClientRect();
            const bodyRect = appBodyRef.current.getBoundingClientRect();
            
            return {
                x: targetRect.left - bodyRect.left + targetRect.width / 2,
                y: targetRect.top - bodyRect.top + targetRect.height / 2
            };
        }

        const playDemo = () => {
            if (!demoActiveRef.current) return;

            // 0. Reset all states on every loop start
            setActiveScreen('login')
            setRxModalStep(0)
            setMockScansUploaded(false)
            setDashboardCases([])
            setEtaVisible(false)

            const pRect = appBodyRef.current.getBoundingClientRect()
            gsap.set(cursorRef.current, {
                x: pRect.width * 0.8,
                y: pRect.height * 0.9,
                scale: 1
            })

            const animateCursorTo = (targetRef, duration = 0.8, delay = 0.8, onComplete = null) => {
                gsap.delayedCall(delay, () => {
                    if (!demoActiveRef.current || !cursorRef.current || !targetRef.current) return;
                    
                    const coords = getCoords(targetRef);
                    gsap.to(cursorRef.current, {
                        x: coords.x,
                        y: coords.y,
                        duration: duration,
                        ease: "power2.inOut",
                        onStart: () => {
                            document.querySelectorAll('.mock-hover, .mock-active').forEach(el => {
                                el.classList.remove('mock-hover', 'mock-active');
                            });
                        },
                        onComplete: () => {
                            if (!demoActiveRef.current) return;
                            
                            targetRef.current?.classList.add('mock-hover');
                            
                            gsap.delayedCall(0.15, () => {
                                if (!demoActiveRef.current) return;
                                
                                targetRef.current?.classList.add('mock-active');
                                gsap.to(cursorRef.current, {
                                    scale: 0.8,
                                    duration: 0.1,
                                    yoyo: true,
                                    repeat: 1,
                                    onComplete: () => {
                                        if (!demoActiveRef.current) return;
                                        
                                        targetRef.current?.classList.remove('mock-active', 'mock-hover');
                                        if (onComplete) onComplete();
                                    }
                                });
                            });
                        }
                    });
                });
            };

            // 1. Move to Login Button
            animateCursorTo(loginBtnRef, 0.8, 1.5, () => {
                setActiveScreen('dashboard')

                // 2. Move to New Rx Request button
                animateCursorTo(newRxBtnRef, 0.8, 1.2, () => {
                    setRxModalStep(1)

                    // 3. Move to Case Type select
                    animateCursorTo(caseTypeSelectRef, 0.8, 0.8, () => {
                        
                        // 4. Click Next -> Step 2
                        animateCursorTo(nextBtn1Ref, 0.8, 0.8, () => {
                            setRxModalStep(2)

                            // 5. Click Next -> Step 3
                            animateCursorTo(nextBtn2Ref, 0.8, 1.0, () => {
                                setRxModalStep(3)

                                // 6. Processing upload
                                gsap.delayedCall(0.8, () => {
                                    if (!demoActiveRef.current) return;
                                    setMockScansUploaded(true)

                                    // 7. Click Submit Case
                                    animateCursorTo(submitBtnRef, 0.8, 0.8, () => {
                                        setRxModalStep(0)
                                        setDashboardCases([
                                            { id: 'MH31AL-26040007-006', count: 1, title: 'ALIGNER KIT UI', type: 'CLEAR ALIGNER', date: 'Apr 15' }
                                        ])

                                        // 8. Move cursor away
                                        gsap.delayedCall(0.8, () => {
                                            if (!demoActiveRef.current || !cursorRef.current) return;
                                            
                                            const rect = appBodyRef.current?.getBoundingClientRect();
                                            gsap.to(cursorRef.current, {
                                                x: rect ? rect.width * 0.8 : 0,
                                                y: rect ? rect.height * 0.9 : 0,
                                                duration: 0.8,
                                                ease: "power2.inOut",
                                                onComplete: () => {
                                                    if (!demoActiveRef.current) return;
                                                    setEtaVisible(true)
                                                    
                                                    // Restart loop after 5 seconds
                                                    gsap.delayedCall(5.0, playDemo)
                                                }
                                            })
                                        })
                                    })
                                })
                            })
                        })
                    })
                })
            })
        }
        // Start the recursive demo loop
        playDemo()

        return () => {
            demoActiveRef.current = false
            gsap.killTweensOf(cursorRef.current)
            gsap.killTweensOf(playDemo)
        }
    }, { dependencies: [mockupVisible], scope: appBodyRef })

    return (
        <section className="portal-teaser" ref={containerRef}>
            {/* Sticky Container */}
            <div className="portal-teaser-inner">
                
                {/* 1. Introductory Text that Fades Out */}
                <motion.div 
                    className="portal-header"
                    style={{ opacity: textOpacity, y: textY, scale: textScale }}
                >
                    <div className="portal-badge">HOW IT WORKS</div>
                    <h2>From scan to clinic <span>in 3 steps</span></h2>
                    <p>Upload your digital scan, we design and 3D print it, and deliver the finished prosthetic to your door — all tracked in real-time through our cloud portal.</p>
                    
                    <div className="portal-workflow-steps">
                        <div className="pw-step">
                            <div className="pw-num">01</div>
                            <div className="pw-text">
                                <strong>Send Digital Scan</strong>
                                <span>Export STL/PLY from any intraoral scanner</span>
                            </div>
                        </div>
                        <div className="pw-step">
                            <div className="pw-num">02</div>
                            <div className="pw-text">
                                <strong>We Design & Print</strong>
                                <span>CAD modeling → Industrial DLP print farm</span>
                            </div>
                        </div>
                        <div className="pw-step">
                            <div className="pw-num">03</div>
                            <div className="pw-text">
                                <strong>Delivered in 48H</strong>
                                <span>Polished prosthetic at your clinic door</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="pw-watch-label">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                        Scroll to watch it happen live
                    </div>
                </motion.div>

                {/* 2. Mockup Application that Fades In */}
                <motion.div 
                    className="portal-mockup-wrapper"
                    style={{ 
                        opacity: mockupOpacity, 
                        scale: mockupScale, 
                        y: mockupY
                    }}
                >
                    <div className="portal-traffic-lights">
                        <span className="light light-red"></span>
                        <span className="light light-yellow"></span>
                        <span className="light light-green"></span>
                        <div className="window-title">portal.hesyralabs.com</div>
                    </div>

                    <div className="portal-app-body" ref={appBodyRef}>
                        
                        {/* Automated Cursor */}
                        <div
                            ref={cursorRef}
                            style={{ position: 'absolute', zIndex: 1000, pointerEvents: 'none', filter: 'drop-shadow(0 6px 8px rgba(0,0,0,0.4))', left: 0, top: 0 }}
                        >
                            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ transform: 'rotate(-10deg) translate(-5px, -5px)' }}>
                                <path d="M5.5 3.21V20.8c0 .45.54.67.85.35l4.86-4.86a.5.5 0 0 1 .35-.15h6.42c.45 0 .67-.54.35-.85L5.85 2.86a.5.5 0 0 0-.85.35Z" fill="#ffffff" stroke="#001A33" strokeWidth="1.5"/>
                            </svg>
                        </div>

                        <AnimatePresence mode="wait">
                            {activeScreen === 'login' && (
                                <motion.div 
                                    key="login-screen"
                                    className="login-view-container"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="login-card">
                                        <div className="login-left">
                                            <div className="login-logo-box">
                                                <img src="/logo-small.webp" alt="Hesyra Labs" style={{ width: '28px', height: '28px', objectFit: 'contain', filter: 'invert(1)' }} />
                                            </div>
                                            <h1>Hesyra<br/>Portal</h1>
                                            <p>Unified workflow management for high-precision dental labs.</p>
                                            <div className="system-status">
                                                <span className="status-dot"></span> SYSTEMS OPERATIONAL
                                            </div>
                                        </div>
                                        <div className="login-right">
                                            <div className="login-label">ACCESS TIER</div>
                                            <div className="access-tier-group">
                                                <button className="tier-btn active">
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                                                    Clinic
                                                </button>
                                                <button className="tier-btn">
                                                    <Settings size={14} /> Lab
                                                </button>
                                                <button className="tier-btn">
                                                    <Lock size={14} /> Admin
                                                </button>
                                            </div>

                                            <div className="login-label">Email or Username</div>
                                            <div className="login-input-group">
                                                <div className="login-input-wrap">
                                                    <Mail size={14} className="login-input-icon" />
                                                    <input type="text" className="login-input" value="doctor@hesyra.com" readOnly />
                                                </div>
                                            </div>

                                            <div className="login-label">Password</div>
                                            <div className="login-input-group">
                                                <div className="login-input-wrap">
                                                    <Lock size={14} className="login-input-icon" />
                                                    <input type="password" className="login-input" value="••••••••••••" readOnly />
                                                    <div className="login-input-icon-right">
                                                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                                    </div>
                                                </div>
                                            </div>

                                            <button className="login-submit-btn" ref={loginBtnRef}>
                                                Enter Portal 
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {activeScreen === 'dashboard' && (
                                <motion.div 
                                    key="dashboard-screen"
                                    className="dashboard-container"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    exit={{ opacity: 0 }}
                                    transition={{ duration: 0.5 }}
                                >
                                    <div className="dash-navbar">
                                        <div className="dash-nav-left">
                                            <img src="/logo-small.webp" alt="Hesyra Labs" style={{ width: '20px', height: '20px', objectFit: 'contain', filter: 'invert(1)', marginRight: '8px' }} />
                                            Hesyra Dental Lab
                                        </div>
                                        
                                        <div className="dash-search-bar">
                                            <Search size={14} color="rgba(255,255,255,0.4)" />
                                            <input type="text" placeholder="Search cases, patients..." readOnly />
                                        </div>

                                        <div className="dash-nav-icons">
                                            <div className="nav-icon"><Monitor size={16} /></div>
                                            <div className="nav-icon"><Box size={16} /></div>
                                            <div className="nav-icon"><CreditCard size={16} /></div>
                                            <div className="nav-icon"><Settings size={16} /></div>
                                            <div className="nav-icon"><Palette size={16} /></div>
                                            <div className="nav-icon">
                                                <Bell size={16} />
                                                <div className="nav-badge">1</div>
                                            </div>
                                            <div className="nav-icon"><LogOut size={16} /></div>
                                            <div className="nav-avatar">DR</div>
                                        </div>
                                    </div>

                                    <div className="dash-content">
                                        <div className="dash-header">
                                            <div className="dash-title">
                                                <h2>{rxModalStep > 0 ? 'Creating Case...' : 'Active Cases'}</h2>
                                                <p>{dashboardCases.length} total cases • {dashboardCases.length} active</p>
                                            </div>
                                            <div className="dash-actions">
                                                <div className="dash-wallet">
                                                    <CreditCard size={18} color="rgba(255,255,255,0.6)" />
                                                    ₹13,500.00
                                                </div>
                                                <button className="dash-new-btn" ref={newRxBtnRef}>
                                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 5v14M5 12h14"/></svg>
                                                    New Rx Request
                                                </button>
                                            </div>
                                        </div>

                                        <div className="kanban-tabs">
                                            <div className="k-tab k-tab-action">ACTION REQUIRED <span>0</span></div>
                                            <div className="k-tab">DRAFT RX <span>0</span></div>
                                            <div className={`k-tab k-tab-submitted ${dashboardCases.length > 0 ? 'active' : ''}`}>SUBMITTED <span>{dashboardCases.length}</span></div>
                                            <div className="k-tab k-tab-design">DESIGNING <span>0</span></div>
                                            <div className="k-tab k-tab-print">PRINTING / QC <span>0</span></div>
                                        </div>

                                        <div className="kanban-board">
                                            <div className="k-col"><div className="k-empty"><Box size={24} /> NO CASES CURRENTLY HERE</div></div>
                                            <div className="k-col"><div className="k-empty"><Box size={24} /> NO CASES CURRENTLY HERE</div></div>
                                            
                                            <div className="k-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                {dashboardCases.length === 0 && (
                                                    <div className="k-empty"><Box size={24} /> NO CASES CURRENTLY HERE</div>
                                                )}
                                                {dashboardCases.map((c, i) => (
                                                    <motion.div 
                                                        key={c.id}
                                                        className="k-card"
                                                        ref={i === 0 ? cardRef : null}
                                                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                                        transition={{ duration: 0.4, ease: "easeOut" }}
                                                    >
                                                        <div className="kc-top">
                                                            <div className="kc-id">
                                                                <div className="kc-dot"></div>
                                                                {c.id}
                                                            </div>
                                                            <div className="kc-count">{c.count}</div>
                                                        </div>
                                                        <div className="kc-title">{c.title}</div>
                                                        <div className="kc-type">
                                                            <FileText size={12} /> {c.type}
                                                        </div>
                                                        <div className="kc-bot">
                                                            <div className="kc-date">RECEIVED <span>{c.date}</span></div>
                                                            <div className="kc-more"><MoreHorizontal size={14} /></div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                            
                                            <div className="k-col"><div className="k-empty"><Box size={24} /> NO CASES CURRENTLY HERE</div></div>
                                            <div className="k-col"><div className="k-empty"><Box size={24} /> NO CASES CURRENTLY HERE</div></div>
                                        </div>

                                        {/* ETA Toast */}
                                        <AnimatePresence>
                                            {etaVisible && (
                                                <motion.div 
                                                    className="eta-toast"
                                                    initial={{ opacity: 0, y: 20, x: '-50%' }}
                                                    animate={{ opacity: 1, y: 0, x: '-50%' }}
                                                    exit={{ opacity: 0, y: 20, x: '-50%' }}
                                                    transition={{ duration: 0.5, ease: 'easeOut' }}
                                                >
                                                    <CheckCircle size={18} color="#10B981" />
                                                    <div className="eta-toast-text">
                                                        <strong>Case Submitted Successfully</strong>
                                                        <span>Estimated delivery: 48 hours</span>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* New Rx Modal Overlay - Multi-step */}
                                        <AnimatePresence>
                                            {rxModalStep > 0 && (
                                                <motion.div 
                                                    className="rx-modal-overlay"
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                >
                                                    <motion.div 
                                                        className="rx-modal-card"
                                                        initial={{ scale: 0.9, y: 20 }}
                                                        animate={{ scale: 1, y: 0 }}
                                                        exit={{ scale: 0.9, y: 20 }}
                                                    >
                                                        <div className="rx-modal-header">
                                                            <div className="rx-modal-htop">
                                                                <h3>New Rx Request</h3>
                                                                <X size={18} color="rgba(255,255,255,0.5)" />
                                                            </div>
                                                            
                                                            <div className="rx-stepper" style={{ position: 'relative' }}>
                                                                <div className={`rx-step ${rxModalStep >= 1 ? 'completed' : ''} ${rxModalStep === 1 ? 'active' : ''}`}>
                                                                    <div className="rx-step-circle">1</div>
                                                                    <span>Type</span>
                                                                </div>
                                                                <div className={`rx-step ${rxModalStep >= 2 ? 'completed' : ''} ${rxModalStep === 2 ? 'active' : ''}`}>
                                                                    <div className="rx-step-circle">2</div>
                                                                    <span>Rx</span>
                                                                </div>
                                                                <div className={`rx-step ${rxModalStep >= 3 ? 'completed' : ''} ${rxModalStep === 3 ? 'active' : ''}`}>
                                                                    <div className="rx-step-circle">3</div>
                                                                    <span>Scans</span>
                                                                </div>
                                                                <div className="rx-stepper-line" style={{ top: '12px' }}></div>
                                                            </div>
                                                        </div>

                                                        <div className="rx-modal-body">
                                                            <AnimatePresence mode="wait">
                                                                {rxModalStep === 1 && (
                                                                    <motion.div key="st1" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                                                        <div className="rx-modal-field" style={{ marginBottom: '1rem' }}>
                                                                            <label>Select Appliance Protocol</label>
                                                                        </div>
                                                                        <div className="rx-grid-2">
                                                                            <div className="rx-box-select">
                                                                                <FileText size={20} />
                                                                                Crown & Bridge
                                                                            </div>
                                                                            <div className="rx-box-select selected" ref={caseTypeSelectRef}>
                                                                                <Palette size={20} />
                                                                                Clear Aligner Kit
                                                                            </div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                                {rxModalStep === 2 && (
                                                                    <motion.div key="st2" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                                                        <div className="rx-modal-field">
                                                                            <label>Patient ID</label>
                                                                            <div className="rx-modal-input-mock">PT-2026-ASHISH</div>
                                                                        </div>
                                                                        <div className="rx-modal-field">
                                                                            <label>Arch Selection</label>
                                                                            <div className="rx-modal-input-mock">Full Dual Arch (Upper & Lower)</div>
                                                                        </div>
                                                                        <div className="rx-modal-field">
                                                                            <label>Clinical Notes</label>
                                                                            <div className="rx-modal-input-mock" style={{ color: 'rgba(255,255,255,0.4)', fontStyle: 'italic' }}>Please generate IPR charts and stage carefully for severe anterior crowding.</div>
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                                {rxModalStep === 3 && (
                                                                    <motion.div key="st3" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}>
                                                                        <div className="rx-modal-field" style={{ marginBottom: '1rem' }}>
                                                                            <label>Upload 3D Intraoral Scans</label>
                                                                        </div>
                                                                        <div className={`rx-file-upload ${mockScansUploaded ? 'uploaded' : ''}`}>
                                                                            {mockScansUploaded ? (
                                                                                <>
                                                                                    <CheckCircle size={32} color="#10B981" />
                                                                                    <span style={{ fontSize: '0.85rem', color: '#10B981' }}>Upper.stl (12 MB)</span>
                                                                                    <span style={{ fontSize: '0.85rem', color: '#10B981' }}>Lower.stl (14 MB)</span>
                                                                                </>
                                                                            ) : (
                                                                                <>
                                                                                    <UploadCloud size={32} color="rgba(255,255,255,0.4)" />
                                                                                    <span style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)' }}>Processing uploaded scans...</span>
                                                                                </>
                                                                            )}
                                                                        </div>
                                                                    </motion.div>
                                                                )}
                                                            </AnimatePresence>
                                                        </div>

                                                        {rxModalStep === 1 && (
                                                            <button className="rx-modal-btn next-step" ref={nextBtn1Ref}>
                                                                Next Step <ChevronRight size={16} />
                                                            </button>
                                                        )}
                                                        {rxModalStep === 2 && (
                                                            <button className="rx-modal-btn next-step" ref={nextBtn2Ref}>
                                                                Next Step <ChevronRight size={16} />
                                                            </button>
                                                        )}
                                                        {rxModalStep === 3 && (
                                                            <button className="rx-modal-btn" ref={submitBtnRef}>
                                                                Submit Case for Design
                                                            </button>
                                                        )}
                                                    </motion.div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                    </div>
                </motion.div>
            </div>
        </section>
    )
}
