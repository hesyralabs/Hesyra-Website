import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { SERVICES } from '../data/landingData'
import './LandingPage.css'

export default function ServiceLanding() {
    const { service } = useParams()
    const data = SERVICES.find(s => s.slug === service)

    useEffect(() => {
        if (!data) return
        document.title = `${data.name} | 48-Hour Delivery Across India | Hesyra Labs`
        document.querySelector('meta[name="description"]')?.setAttribute('content',
            `${data.intro.slice(0, 155)}...`
        )
    }, [data])

    if (!data) return (
        <div className="landing-404">
            <h1>Service page not found</h1>
            <Link to="/">← Back to Home</Link>
        </div>
    )

    return (
        <main className="landing-page">
            {/* Structured Data — Service + FAQ */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                "mainEntity": data.faq.map(f => ({
                    "@type": "Question",
                    "name": f.q,
                    "acceptedAnswer": { "@type": "Answer", "text": f.a }
                }))
            })}} />

            <section className="landing-hero">
                <div className="landing-hero-inner">
                    <div className="landing-badge">Hesyra Labs</div>
                    <h1>{data.headline}</h1>
                    <p className="landing-intro">{data.intro}</p>
                    <div className="landing-ctas">
                        <Link to="/#contact" className="btn btn-primary">Get a Free Test Case</Link>
                        <Link to={`/products/${data.productSlug}`} className="btn btn-ghost">Product Details →</Link>
                    </div>
                </div>
            </section>

            <section className="landing-specs">
                <div className="landing-specs-inner">
                    <h2>Specifications</h2>
                    <div className="specs-grid">
                        {data.keyPoints.map((kp, i) => (
                            <div key={i} className="spec-item">
                                <span className="spec-label">{kp.label}</span>
                                <span className="spec-value">{kp.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="landing-how">
                <div className="landing-how-inner">
                    <h2>How It Works</h2>
                    <div className="landing-steps">
                        <div className="lstep">
                            <div className="lstep-num">01</div>
                            <div><strong>Upload Your Scan</strong><p>Export STL/PLY from your intraoral scanner and send through the Hesyra Portal.</p></div>
                        </div>
                        <div className="lstep">
                            <div className="lstep-num">02</div>
                            <div><strong>We Design & Manufacture</strong><p>Our team designs, prints, cures, and finishes your {data.name.toLowerCase()} in our DLP facility.</p></div>
                        </div>
                        <div className="lstep">
                            <div className="lstep-num">03</div>
                            <div><strong>Delivered in 48 Hours</strong><p>Packaged and dispatched to your clinic anywhere in India.</p></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="landing-faq">
                <div className="landing-faq-inner">
                    <h2>Frequently Asked Questions</h2>
                    <div className="faq-list">
                        {data.faq.map((f, i) => (
                            <div key={i} className="faq-item">
                                <h3>{f.q}</h3>
                                <p>{f.a}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <section className="landing-cta-band">
                <h2>Ready to try {data.name}?</h2>
                <p>Free test case for first-time partner clinics. No fees, no contracts.</p>
                <Link to="/#contact" className="btn btn-primary btn-lg">Request Free Sample</Link>
            </section>
        </main>
    )
}
