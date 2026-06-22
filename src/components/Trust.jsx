import { useState, useEffect, useRef, useMemo } from 'react'
import { getVisitorProfile } from '../utils/analytics'
import './Trust.css'

const testimonials = [
    {
        quote: "Switching to Hesyra Labs completely changed our clinical workflow. The margins on their printed crowns are flawless — having a deep-tech lab right here in Central India means zero shipping delays.",
        name: "Dr. Akib Sheikh",
        title: "Prosthodontist, Nagpur",
        photo: "/Dr Akib Sheikh.jpeg"
    },
    {
        quote: "Their 48-hour clear aligner turnaround is unmatched. I can confidently start a patient's treatment within a week of consultation. The direct-print resin quality is exceptional.",
        name: "Dr. Anand Bansod",
        title: "Orthodontist, Nagpur",
        photo: "/Dr Anand Bansod.jpeg"
    },
    {
        quote: "The surgical guides are incredibly precise. They have practically eliminated guesswork in my implant placements, ensuring predictable and safe outcomes for every patient.",
        name: "Dr. Arushi Beri",
        title: "Implantologist, Delhi",
        photo: "/Dr Arushi Beri.jpeg"
    },
    {
        quote: "The translucency and aesthetic quality of their ceramic-filled resin veneers are simply beautiful. My patients are thrilled with the natural results every single time.",
        name: "Dr. Gaurav Majumdar",
        title: "Cosmetic Dentist, Mumbai",
        photo: "/Dr Gaurav Majumdar.jpeg"
    },
    {
        quote: "We made the full transition to their digital denture system last year. Reducing patient visits from five to just two has doubled our clinic's efficiency.",
        name: "Dr. Lovely Bharti",
        title: "General Dentist, Nagpur",
        photo: "/Dr Lovely Bharti.jpeg"
    },
    {
        quote: "The biocompatible clear retainers are very durable and patients love the comfort. The 3D fit is perfect every single time — zero chairside adjustments needed.",
        name: "Dr. Shipra Mandwar",
        title: "Pediatric Dentist, Nagpur",
        photo: "/Dr Shipra Mandwar.jpeg"
    },
    {
        quote: "What impresses me most is the consistency. Every case, every time — the quality is identical. That kind of reliability is rare in this industry.",
        name: "Dr. Sumukh Nerurkar",
        title: "Endodontist, Pune",
        photo: "/Dr Sumukh Nerurkar.jpeg"
    },
]

const metrics = [
    { val: '₹0', label: 'Upfront Investment', desc: 'Start sending cases instantly. No lock-in.' },
    { val: '48h', label: 'Guaranteed Turnaround', desc: 'Crowns, guides, aligners — all under 48 hours.' },
    { val: '100%', label: 'Digital Traceability', desc: 'Track every case from scan to dispatch.' },
    { val: '7+', label: 'Partner Clinics', desc: 'And growing across Vidarbha and beyond.' },
]

export default function Trust() {
    const scrollRef = useRef(null)

    const scroll = (direction) => {
        if (!scrollRef.current) return
        const cardWidth = scrollRef.current.querySelector('.trust-card')?.offsetWidth || 400
        scrollRef.current.scrollBy({ left: direction * (cardWidth + 24), behavior: 'smooth' })
    }

    // Geographic personalization: prioritize testimonials from visitor's city
    const sortedTestimonials = useMemo(() => {
        const profile = getVisitorProfile()
        if (!profile || !profile.city) return testimonials
        
        const city = profile.city.toLowerCase()
        return [...testimonials].sort((a, b) => {
            const aMatch = a.title.toLowerCase().includes(city)
            const bMatch = b.title.toLowerCase().includes(city)
            if (aMatch && !bMatch) return -1
            if (!aMatch && bMatch) return 1
            return 0
        })
    }, [])

    return (
        <section id="dentists" className="trust-section container">
            {/* ── Header ── */}
            <div className="trust-header">
                <div className="mono-label" style={{ marginBottom: '0.75rem' }}>FOR DENTISTS</div>
                <h2 className="trust-headline">Your Lab. Upgraded.</h2>
                <p className="trust-sub">Leave behind slow turnaround and quality variance. Partner with a deep-tech lab that matches your clinical standards.</p>
            </div>

            {/* ── Metrics Strip ── */}
            <div className="trust-metrics">
                {metrics.map((m, i) => (
                    <div key={i} className="trust-metric glass-panel">
                        <span className="trust-metric-val">{m.val}</span>
                        <span className="trust-metric-label">{m.label}</span>
                        <span className="trust-metric-desc">{m.desc}</span>
                    </div>
                ))}
            </div>

            {/* ── Compliance Badges ── */}
            <div className="trust-compliance">
                <div className="trust-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
                    ISO 13485 Certified
                </div>
                <div className="trust-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12l2 2 4-4"/><circle cx="12" cy="12" r="10"/></svg>
                    FDA Compliant Materials
                </div>
                <div className="trust-badge">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
                    Online Case Portal
                </div>
            </div>

            {/* ── Testimonials ── */}
            <div className="trust-testimonials-header">
                <h3>Trusted by Clinicians.</h3>
                <div className="trust-scroll-btns">
                    <button onClick={() => scroll(-1)} className="trust-scroll-btn" aria-label="Previous testimonial">←</button>
                    <button onClick={() => scroll(1)} className="trust-scroll-btn" aria-label="Next testimonial">→</button>
                </div>
            </div>

            <div className="trust-cards-track" ref={scrollRef}>
                {sortedTestimonials.map((t, i) => (
                    <div key={i} className="trust-card glass-panel">
                        <blockquote className="trust-quote">"{t.quote}"</blockquote>
                        <div className="trust-author">
                            <img src={t.photo} alt={t.name} className="trust-avatar" loading="lazy" />
                            <div>
                                <div className="trust-name">{t.name}</div>
                                <div className="trust-title">{t.title}</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
