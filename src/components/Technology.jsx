import { useRef, useState, useEffect } from 'react'
import { motion, useInView } from 'framer-motion'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import './Technology.css'

// --- Animated Counter Hook ---
function useCountUp(target, duration = 1800, active = false) {
    const [val, setVal] = useState(0)
    useEffect(() => {
        if (!active) return
        const obj = { value: 0 }
        const tween = gsap.to(obj, {
            value: target,
            duration: duration / 1000,
            ease: "power3.out",
            onUpdate: () => setVal(Math.round(obj.value))
        })
        return () => tween.kill()
    }, [active, target, duration])
    return val
}

// --- Mouse-Tracking Glow Card ---
function GlowCard({ children, className = '', style = {} }) {
    const cardRef = useRef(null)
    const spotlightRef = useRef(null)

    useGSAP((context, contextSafe) => {
        if (!cardRef.current || !spotlightRef.current) return;

        const xTo = gsap.quickTo(cardRef.current, "--glow-x", { duration: 0.3, ease: "power2.out" });
        const yTo = gsap.quickTo(cardRef.current, "--glow-y", { duration: 0.3, ease: "power2.out" });
        const opacityTo = gsap.quickTo(spotlightRef.current, "opacity", { duration: 0.3, ease: "power2.out" });

        const handleMove = contextSafe((e) => {
            const rect = cardRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;

            xTo(x);
            yTo(y);
            opacityTo(1);
        });

        const handleLeave = contextSafe(() => {
            opacityTo(0);
        });

        cardRef.current.addEventListener('mousemove', handleMove);
        cardRef.current.addEventListener('mouseleave', handleLeave);

        return () => {
            cardRef.current?.removeEventListener('mousemove', handleMove);
            cardRef.current?.removeEventListener('mouseleave', handleLeave);
        };
    }, { scope: cardRef });

    return (
        <div
            ref={cardRef}
            className={`glow-card glass-panel ${className}`}
            style={style}
        >
            <div
                ref={spotlightRef}
                className="glow-card-spotlight"
                style={{
                    background: `radial-gradient(circle at calc(var(--glow-x, 50) * 1%) calc(var(--glow-y, 50) * 1%), rgba(122,156,150,0.18) 0%, transparent 60%)`,
                    opacity: 0,
                    pointerEvents: 'none',
                }}
            />
            {children}
        </div>
    )
}

// --- DLP Printer Animation ---
// Fewer layers, each fits cleanly inside the resin vat
const CROWN_LAYERS = [
    [24, 36], [22, 40], [20, 44], [19, 46],
    [18, 48], [18, 48], [19, 46], [21, 42],
]

const PARTICLES = [
    { cx: 30, cy: 76, r: 0.8, delay: 0.2 },
    { cx: 42, cy: 74, r: 0.6, delay: 0.8 },
    { cx: 55, cy: 75, r: 0.7, delay: 1.4 },
    { cx: 35, cy: 73, r: 0.5, delay: 2.1 },
    { cx: 50, cy: 77, r: 0.9, delay: 0.6 },
    { cx: 26, cy: 75, r: 0.6, delay: 1.7 },
    { cx: 60, cy: 74, r: 0.5, delay: 0.4 },
]

function DLPPrinterAnimation({ active }) {
    const totalLayers = CROWN_LAYERS.length

    return (
        <div className="dlp-diagram-wrap">
            <svg viewBox="0 0 84 130" className="dlp-svg" aria-hidden="true">
                <defs>
                    <linearGradient id="uvGrad" x1="0.5" y1="0" x2="0.5" y2="1">
                        <stop offset="0%" stopColor="#6d28d9" stopOpacity="0" />
                        <stop offset="40%" stopColor="#7c3aed" stopOpacity="0.55" />
                        <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.9" />
                    </linearGradient>
                    <linearGradient id="crownGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#7dd3c8" stopOpacity="0.95" />
                        <stop offset="50%" stopColor="#7A9C96" stopOpacity="0.85" />
                        <stop offset="100%" stopColor="#3d6e68" stopOpacity="0.7" />
                    </linearGradient>
                    <linearGradient id="cureGrad" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="transparent" />
                        <stop offset="20%" stopColor="#a78bfa" stopOpacity="0.9" />
                        <stop offset="50%" stopColor="#c4b5fd" stopOpacity="1" />
                        <stop offset="80%" stopColor="#a78bfa" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="transparent" />
                    </linearGradient>
                    <linearGradient id="resinGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#0f1f35" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#050e1c" stopOpacity="1" />
                    </linearGradient>
                    <linearGradient id="projGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#1a2540" />
                        <stop offset="100%" stopColor="#0a1020" />
                    </linearGradient>
                    <linearGradient id="platGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#2a4060" />
                        <stop offset="100%" stopColor="#0f1e30" />
                    </linearGradient>
                    <filter id="cureGlow" x="-30%" y="-300%" width="160%" height="700%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1.2" result="blur" />
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="uvGlow" x="-20%" y="-20%" width="140%" height="140%">
                        <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" result="blur" />
                        <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
                    </filter>
                    <filter id="crownEdge" x="-5%" y="-5%" width="110%" height="110%">
                        <feGaussianBlur in="SourceAlpha" stdDeviation="0.4" result="blur" />
                        <feOffset dx="0" dy="-0.5" in="blur" result="shifted" />
                        <feComposite in="SourceGraphic" in2="shifted" operator="over" />
                    </filter>
                    <clipPath id="vatClip">
                        <rect x="11" y="68" width="62" height="35" rx="1" />
                    </clipPath>
                    <radialGradient id="projectorLens" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="#a78bfa" stopOpacity="0.9" />
                        <stop offset="60%" stopColor="#7c3aed" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="#4c1d95" stopOpacity="0.1" />
                    </radialGradient>
                    <radialGradient id="vatGlow" cx="50%" cy="0%" r="80%">
                        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="transparent" />
                    </radialGradient>
                </defs>

                <ellipse cx="42" cy="90" rx="28" ry="8" fill="#6d28d9" opacity="0.08" />

                {/* Guide rails */}
                <rect x="8.5" y="10" width="1.5" height="88" rx="0.75" fill="url(#platGrad)" opacity="0.5" />
                <rect x="74" y="10" width="1.5" height="88" rx="0.75" fill="url(#platGrad)" opacity="0.5" />
                {[15, 25, 35, 45, 55, 65, 75, 85].map(y => (
                    <g key={y}>
                        <rect x="7" y={y} width="4" height="0.8" rx="0.4" fill="rgba(255,255,255,0.08)" />
                        <rect x="73" y={y} width="4" height="0.8" rx="0.4" fill="rgba(255,255,255,0.08)" />
                    </g>
                ))}

                {/* Resin vat */}
                <rect x="11" y="68" width="62" height="35" rx="1.5" fill="url(#resinGrad)" stroke="rgba(100,130,180,0.2)" strokeWidth="0.5" />
                <rect x="11" y="68" width="1" height="35" fill="rgba(255,255,255,0.04)" />
                <rect x="72" y="68" width="1" height="35" fill="rgba(255,255,255,0.04)" />
                {active && <rect x="12" y="69" width="60" height="33" fill="url(#vatGlow)" clipPath="url(#vatClip)" className="vat-glow-pulse" />}
                <rect x="11" y="68" width="62" height="1.5" rx="0.5" fill="rgba(100,160,200,0.08)" />

                {/* Particles */}
                {active && PARTICLES.map((p, i) => (
                    <motion.circle
                        key={i} cx={p.cx} cy={p.cy + 25} r={p.r} fill="#a78bfa" opacity={0}
                        animate={{ opacity: [0, 0.7, 0], cy: [p.cy + 25, p.cy + 22, p.cy + 25] }}
                        transition={{ duration: 2.5, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
                    />
                ))}

                {/* UV Projector — sits below the vat */}
                <rect x="10" y="107" width="64" height="12" rx="3" fill="url(#projGrad)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" />
                <rect x="18" y="105" width="48" height="3" rx="1.5" fill="#080f1e" stroke="rgba(124,58,237,0.3)" strokeWidth="0.4" />
                {[21, 29, 37, 45, 53, 61].map((x, i) => (
                    <ellipse key={i} cx={x} cy={106.5} rx="2.5" ry="1"
                        fill={active ? 'url(#projectorLens)' : 'rgba(100,60,180,0.15)'}
                        className={active ? 'lens-cell' : ''}
                        style={{ animationDelay: `${i * 0.1}s` }}
                    />
                ))}
                {active && <ellipse cx="12.5" cy="113" rx="1.2" ry="1.2" fill="#10b981" className="status-blink" />}

                {/* UV beam — projects upward from projector into the vat */}
                {active && (
                    <g filter="url(#uvGlow)">
                        <polygon points="22,105 62,105 68,103 16,103" fill="url(#uvGrad)" className="uv-beam-main" />
                        <polygon points="34,105 50,105 54,103 30,103" fill="url(#uvGrad)" opacity="0.6" className="uv-beam-core" />
                        {[21, 29, 37, 45, 53, 61].map((x, i) => (
                            <line key={i} x1={x} y1={105.5} x2={x + (42 - x) * 0.3} y2={104}
                                stroke="#c4b5fd" strokeWidth="0.4" opacity="0.4" strokeDasharray="1 2"
                                className="uv-ray" style={{ animationDelay: `${i * 0.08}s` }}
                            />
                        ))}
                    </g>
                )}

                {/* Platform + Layers — layers attach below platform, group rises after all layers form */}
                <motion.g
                    animate={active ? { y: [0, 0, -(totalLayers * 3.5)] } : { y: 0 }}
                    transition={{ 
                        duration: 2.5,
                        times: [0, 0.01, 1],
                        ease: [0.22, 1, 0.36, 1],
                        delay: 0.4 + totalLayers * 0.6 + 0.8
                    }}
                >
                    {/* The platform bar */}
                    <rect x="13" y="70" width="58" height="3" rx="1" fill="url(#platGrad)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
                    <rect x="14" y="70" width="56" height="1" rx="0.5" fill="rgba(255,255,255,0.08)" />
                    <circle cx="16" cy="71.5" r="0.8" fill="rgba(255,255,255,0.1)" />
                    <circle cx="68" cy="71.5" r="0.8" fill="rgba(255,255,255,0.1)" />

                    {/* Crown layers — build one by one below the platform */}
                    {CROWN_LAYERS.map(([x, w], i) => (
                        <motion.rect
                            key={i} x={x} y={73 + i * 3.5} width={w} height={3}
                            rx={0.8}
                            fill="url(#crownGrad)" filter="url(#crownEdge)"
                            initial={{ opacity: 0, scaleX: 0 }}
                            animate={active ? { opacity: 1, scaleX: 1 } : { opacity: 0, scaleX: 0 }}
                            transition={{ delay: 0.4 + i * 0.6, duration: 0.4, ease: 'easeOut' }}
                            style={{ transformOrigin: `${x + w / 2}px ${73 + i * 3.5 + 1.5}px` }}
                        />
                    ))}

                    {/* Highlight shine on each layer */}
                    {CROWN_LAYERS.map(([x, w], i) => (
                        <motion.rect
                            key={`h${i}`} x={x + 2} y={73 + i * 3.5 + 0.3} width={w - 4} height={0.6} rx={0.3}
                            fill="rgba(200,240,235,0.3)"
                            initial={{ opacity: 0 }}
                            animate={active ? { opacity: 1 } : { opacity: 0 }}
                            transition={{ delay: 0.5 + i * 0.6, duration: 0.25 }}
                        />
                    ))}
                </motion.g>

                {/* Spec callouts */}
                {active && (
                    <>
                        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3, duration: 0.6 }}>
                            <line x1="9" y1="85" x2="2" y2="85" stroke="rgba(122,156,150,0.6)" strokeWidth="0.4" />
                            <text x="1.5" y="83" fontSize="2.8" fill="#7A9C96" textAnchor="end" fontFamily="JetBrains Mono,monospace" fontWeight="700">62&#181;m</text>
                            <text x="1.5" y="87" fontSize="2" fill="rgba(122,156,150,0.55)" textAnchor="end" fontFamily="JetBrains Mono,monospace">XY RES</text>
                        </motion.g>
                        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.4, duration: 0.6 }}>
                            <line x1="75" y1="110" x2="82" y2="110" stroke="rgba(167,139,250,0.6)" strokeWidth="0.4" />
                            <text x="82.5" y="108" fontSize="2.8" fill="#a78bfa" textAnchor="start" fontFamily="JetBrains Mono,monospace" fontWeight="700">385nm</text>
                            <text x="82.5" y="112" fontSize="2" fill="rgba(167,139,250,0.55)" textAnchor="start" fontFamily="JetBrains Mono,monospace">UV LED</text>
                        </motion.g>
                        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 3.8, duration: 0.6 }}>
                            <line x1="42" y1="8" x2="42" y2="3" stroke="rgba(255,255,255,0.25)" strokeWidth="0.4" />
                            <text x="42" y="2" fontSize="2.4" fill="rgba(255,255,255,0.4)" textAnchor="middle" fontFamily="JetBrains Mono,monospace">25&#8211;100&#181;m / LAYER</text>
                        </motion.g>
                    </>
                )}
            </svg>

            <div className="dlp-legend">
                <div className="dlp-legend-item">
                    <span className="dlp-dot" style={{ background: 'linear-gradient(135deg,#7dd3c8,#7A9C96)' }} />
                    Ceramic-Hybrid Crown
                </div>
                <div className="dlp-legend-item">
                    <span className="dlp-dot" style={{ background: 'linear-gradient(135deg,#a78bfa,#7c3aed)' }} />
                    385nm UV Projection
                </div>
                <div className="dlp-legend-item">
                    <span className="dlp-dot" style={{ background: 'rgba(255,255,255,0.25)' }} />
                    Build Platform
                </div>
            </div>
        </div>
    )
}

// --- Main Component ---
const MATERIALS = [
    { name: 'Ceramic-Filled Hybrid', accent: '#7dd3c8' },
    { name: 'Zirconia-Infused Composite', accent: '#a78bfa' },
    { name: 'High-Flexure Polyurethane', accent: '#60a5fa' },
    { name: 'Biocompatible Clear', accent: '#34d399' },
    { name: 'Impact-Resistant Compound', accent: '#f59e0b' },
]

export default function Technology() {
    const sectionRef = useRef(null)
    const inView = useInView(sectionRef, { once: true, amount: 0.25 })

    const hrs = useCountUp(48, 1200, inView)
    const res = useCountUp(62, 1400, inView)

    const cardReveal = {
        hidden: { opacity: 0, y: 28 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 1, 0.5, 1] } }
    }

    return (
        <section id="technology" className="tech-section container" ref={sectionRef}>
            <motion.div
                className="section-header"
                initial={{ opacity: 0, y: 24 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.7 }}
            >
                <div className="mono-label" style={{ marginBottom: '1rem' }}>INFRASTRUCTURE</div>
                <h2>Next-Gen Lab Technology</h2>
            </motion.div>

            {/* 3-column strip */}
            <motion.div
                className="tech-strip"
                initial="hidden"
                animate={inView ? 'visible' : 'hidden'}
                variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
            >
                {/* Column 1 - DLP + Precision */}
                <motion.div variants={cardReveal}>
                    <GlowCard className="tech-col tech-col-dlp">
                        <div className="tech-col-top">
                            <DLPPrinterAnimation active={inView} />
                        </div>
                        <div className="tech-col-bottom">
                            <span className="tech-col-stat">{res}<span className="tech-col-unit">&#181;m</span></span>
                            <span className="tech-col-label">DLP Pixel Resolution</span>
                            <p className="tech-col-desc">Industrial Digital Light Processing with auto-calibrating 385nm UV &#8212; margin accuracy analog casting cannot match.</p>
                        </div>
                    </GlowCard>
                </motion.div>

                {/* Column 2 - Speed */}
                <motion.div variants={cardReveal}>
                    <GlowCard className="tech-col tech-col-speed">
                        <div className="tech-col-top tech-col-clock">
                            <svg viewBox="0 0 100 100" className="clock-ring-svg">
                                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="5" />
                                <motion.circle
                                    cx="50" cy="50" r="42"
                                    fill="none" stroke="url(#ringGrad)" strokeWidth="5" strokeLinecap="round"
                                    strokeDasharray="263.9" strokeDashoffset="263.9"
                                    animate={inView ? { strokeDashoffset: 66 } : {}}
                                    transition={{ duration: 2, ease: [0.25, 1, 0.5, 1], delay: 0.5 }}
                                    style={{ transformOrigin: '50px 50px', rotate: '-90deg' }}
                                />
                                <defs>
                                    <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="0">
                                        <stop offset="0%" stopColor="#7A9C96" />
                                        <stop offset="100%" stopColor="#90b5ae" />
                                    </linearGradient>
                                </defs>
                                <text x="50" y="47" textAnchor="middle" fontSize="24" fontWeight="700" fill="var(--text-primary)" fontFamily="JetBrains Mono,monospace">{hrs}</text>
                                <text x="50" y="62" textAnchor="middle" fontSize="10" fill="var(--text-tertiary)" fontFamily="JetBrains Mono,monospace">hours</text>
                            </svg>
                        </div>
                        <div className="tech-col-bottom">
                            <span className="tech-col-stat">{hrs}<span className="tech-col-unit">hr</span></span>
                            <span className="tech-col-label">Scan-to-Ship</span>
                            <p className="tech-col-desc">Automated print farms in Central India. Upload a scan today, receive finished prosthetics at your clinic within 48 hours.</p>
                        </div>
                    </GlowCard>
                </motion.div>

                {/* Column 3 - Materials */}
                <motion.div variants={cardReveal}>
                    <GlowCard className="tech-col tech-col-materials">
                        <div className="tech-col-top tech-col-mat-list">
                            {MATERIALS.map((mat, i) => (
                                <motion.div
                                    key={mat.name}
                                    className="mat-pill"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={inView ? { opacity: 1, x: 0 } : {}}
                                    transition={{ delay: 0.5 + i * 0.08, duration: 0.35 }}
                                >
                                    <span className="mat-pill-dot" style={{ background: mat.accent }} />
                                    <span>{mat.name}</span>
                                </motion.div>
                            ))}
                        </div>
                        <div className="tech-col-bottom">
                            <span className="tech-col-stat">{MATERIALS.length}<span className="tech-col-unit">+</span></span>
                            <span className="tech-col-label">Material Options</span>
                            <p className="tech-col-desc">Choose the optimal resin per case. All CE Class IIa / FDA 510(k) / ISO 13485 certified.</p>
                        </div>
                    </GlowCard>
                </motion.div>
            </motion.div>

            {/* Workflow strip */}
            <motion.div
                className="tech-workflow"
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.4 }}
            >
                {['Upload STL/PLY scan', 'We design & fabricate', 'Delivered in 48h'].map((step, i) => (
                    <div key={i} className="tech-wf-step">
                        <span className="tech-wf-num">{i + 1}</span>
                        <span className="tech-wf-text">{step}</span>
                        {i < 2 && <span className="tech-wf-arrow">&#8594;</span>}
                    </div>
                ))}
            </motion.div>
        </section>
    )
}
