import { useParams, Link } from 'react-router-dom'
import { useEffect } from 'react'
import { CITIES } from '../data/landingData'
import './LandingPage.css'

export default function CityLanding() {
    const { city } = useParams()
    const data = CITIES.find(c => c.slug === city)

    useEffect(() => {
        if (!data) return
        document.title = `Best Dental Lab in ${data.name} | 48-Hour 3D Printed Prosthetics | Hesyra Labs`
        document.querySelector('meta[name="description"]')?.setAttribute('content',
            `Hesyra Labs delivers precision 3D printed dental crowns, dentures, aligners & surgical guides to ${data.name} clinics in 48 hours. 100% digital — upload your scan, track your case, receive at your door.`
        )
    }, [data])

    if (!data) return (
        <div className="landing-404">
            <h1>City page not found</h1>
            <Link to="/">← Back to Home</Link>
        </div>
    )

    return (
        <main className="landing-page">
            {/* Structured Data */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                "name": `Hesyra Labs — ${data.name}`,
                "description": data.intro,
                "areaServed": { "@type": "City", "name": data.name, "containedIn": data.state },
                "url": `https://hesyralabs.com/dental-lab/${data.slug}`,
                "logo": "https://hesyralabs.com/logo.png",
                "serviceType": ["3D Printed Dental Crowns", "Digital Dentures", "Clear Aligners", "Surgical Guides"],
            })}} />

            <section className="landing-hero">
                <div className="landing-hero-inner">
                    <div className="landing-badge">{data.tagline}</div>
                    <h1>Best Dental Lab in <span className="accent">{data.name}</span></h1>
                    <p className="landing-intro">{data.intro}</p>
                    <div className="landing-ctas">
                        <Link to="/#contact" className="btn btn-primary">Book a Free Demo</Link>
                        <Link to="/products/crowns-bridges" className="btn btn-ghost">See Products →</Link>
                    </div>
                </div>
            </section>

            <section className="landing-facts">
                <div className="landing-facts-inner">
                    <h2>Why Dental Clinics in {data.name} Choose Hesyra Labs</h2>
                    <ul className="facts-list">
                        {data.facts.map((f, i) => (
                            <li key={i}><span className="fact-check">✓</span> {f}</li>
                        ))}
                        <li><span className="fact-check">✓</span> ISO 13485 certified DLP 3D printing</li>
                        <li><span className="fact-check">✓</span> 62-micron pixel resolution — 5× more precise than milling</li>
                        <li><span className="fact-check">✓</span> Real-time case tracking via Hesyra Portal</li>
                        <li><span className="fact-check">✓</span> Free test crown for new {data.name} partner clinics</li>
                    </ul>
                </div>
            </section>

            <section className="landing-how">
                <div className="landing-how-inner">
                    <h2>How It Works</h2>
                    <div className="landing-steps">
                        <div className="lstep">
                            <div className="lstep-num">01</div>
                            <div><strong>Send Digital Scan</strong><p>Export STL/PLY from your intraoral scanner and upload to our portal — takes under 2 minutes.</p></div>
                        </div>
                        <div className="lstep">
                            <div className="lstep-num">02</div>
                            <div><strong>We Design & Print</strong><p>Our technicians design and route the case to our industrial DLP print farm.</p></div>
                        </div>
                        <div className="lstep">
                            <div className="lstep-num">03</div>
                            <div><strong>Delivered in 48H</strong><p>Finished, cured, and polished prosthetic delivered to your {data.name} clinic.</p></div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="landing-products">
                <div className="landing-products-inner">
                    <h2>Products Available in {data.name}</h2>
                    <div className="landing-product-grid">
                        {[
                            { name: 'Crowns & Bridges', slug: 'crowns-bridges', tag: '48H' },
                            { name: 'Digital Dentures', slug: 'dentures', tag: '48-72H' },
                            { name: 'Clear Aligners', slug: 'aligners', tag: '48H' },
                            { name: 'Surgical Guides', slug: 'surgical-guides', tag: '24H' },
                            { name: 'Veneers', slug: 'veneers', tag: '48H' },
                        ].map(p => (
                            <Link key={p.slug} to={`/products/${p.slug}`} className="landing-product-card">
                                <span className="lp-tag">{p.tag}</span>
                                <span className="lp-name">{p.name}</span>
                                <span className="lp-arrow">→</span>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <section className="landing-cta-band">
                <h2>Start sending cases from {data.name} today</h2>
                <p>No joining fees. No minimum orders. Just better dental prosthetics, faster.</p>
                <Link to="/#contact" className="btn btn-primary btn-lg">Get Your Free Test Crown</Link>
            </section>
        </main>
    )
}
