import { useState, useEffect } from 'react'
import useMagneticEffect from '../hooks/useMagneticEffect'
import { getVisitorProfile } from '../utils/analytics'
import './Hero.css'

export default function Hero() {
    const magneticBtnRef = useMagneticEffect(15)
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        setProfile(getVisitorProfile())
    }, [])

    const isReturn = profile?.visitCount > 1
    const sections = profile?.sections || []
    
    // Personalize subtitle
    let subtitle = (
        <>
            Industrial DLP fabrication and medical-grade resins
            <br />
            designed to streamline your clinical workflow.
        </>
    )
    if (isReturn && sections.includes('portal-teaser')) {
        subtitle = (
            <>
                Welcome back. Get early access to the Hesyra Portal
                <br />
                and manage your cases with unprecedented ease.
            </>
        )
    } else if (isReturn && sections.includes('products')) {
        subtitle = (
            <>
                Welcome back. Explore our specialized resins
                <br />
                and high-precision fabrication solutions.
            </>
        )
    }

    const ctaText = isReturn ? 'Welcome Back — Book Consult' : 'Explore Products'
    const ctaHref = isReturn ? '#cta' : '#products'

    return (
        <section className="hero" aria-label="Hesyra Labs — Precision 3D Dental Manufacturing">
            <div className="hero-video-wrapper">
                <video 
                    className="hero-video" 
                    autoPlay 
                    loop 
                    muted 
                    playsInline
                >
                    <source src="" type="video/mp4" />
                </video>
                <div className="hero-video-overlay"></div>
            </div>

            <div className="container hero-grid" style={{ position: 'relative', zIndex: 2 }}>
                <div className="hero-content">
                    <h1>
                        <span className="hero-line-1">Precision-Crafted</span>
                        <span className="hero-line-2">Prosthetics.</span>
                        <span className="hero-line-3">
                            Any Case.{' '}
                            <em className="hero-accent">48 Hours.</em>
                        </span>
                    </h1>

                    <p className="hero-subtitle">
                        {subtitle}
                    </p>

                    <div className="hero-actions">
                        <a ref={magneticBtnRef} href={ctaHref} className="btn btn-primary hero-btn-primary">
                            <span className="btn-magnetic-inner">
                                {ctaText}
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </span>
                        </a>
                        <a href="#workflow" className="hero-btn-ghost">
                            Our Workflow
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <polyline points="9 18 15 12 9 6" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>
        </section>
    )
}
