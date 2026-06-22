import { useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProductBySlug, getAdjacentProducts, productData } from '../data/productData'
import './ProductDetail.css'

export default function ProductDetail() {
    const { slug } = useParams()
    const navigate = useNavigate()
    const product = getProductBySlug(slug)
    const { prev, next } = getAdjacentProducts(slug)

    useEffect(() => {
        if (!product) return
        document.title = `${product.title} | Hesyra Labs`
        document.querySelector('meta[name="description"]')?.setAttribute('content', product.shortDescription)
        window.scrollTo(0, 0)
    }, [product, slug])

    if (!product) {
        return (
            <div className="prd-not-found container">
                <h2>Product not found.</h2>
                <Link to="/#products" className="btn btn-primary">Back to Products</Link>
            </div>
        )
    }

    const categoryColors = {
        RESTORATIONS: 'pill-restoration',
        SURGICAL: 'pill-surgical',
        ORTHODONTICS: 'pill-ortho',
    }

    return (
        <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35 }}
            className="product-detail-page"
        >
            {/* ── Sleek Top Nav Bar: breadcrumb + prev/next + product dots ── */}
            <div className="prd-topbar">
                <div className="container prd-topbar-inner">
                    {/* Left: breadcrumb */}
                    <div className="prd-topbar-breadcrumb">
                        <Link to="/">Home</Link>
                        <span className="prd-bc-sep">›</span>
                        <Link to="/#products">Products</Link>
                        <span className="prd-bc-sep">›</span>
                        <span className="prd-bc-current">{product.title}</span>
                    </div>

                    {/* Center: product dot indicators */}
                    <div className="prd-topbar-dots">
                        {productData.map(p => (
                            <Link
                                key={p.slug}
                                to={`/products/${p.slug}`}
                                className={`prd-dot ${p.slug === slug ? 'prd-dot-active' : ''}`}
                                title={p.title}
                            />
                        ))}
                    </div>

                    {/* Right: prev / next */}
                    <div className="prd-topbar-nav">
                        {prev ? (
                            <Link to={`/products/${prev.slug}`} className="prd-topbar-btn" title={`← ${prev.title}`}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
                                <span>{prev.title}</span>
                            </Link>
                        ) : <div />}
                        {next ? (
                            <Link to={`/products/${next.slug}`} className="prd-topbar-btn" title={`${next.title} →`}>
                                <span>{next.title}</span>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
                            </Link>
                        ) : <div />}
                    </div>
                </div>
            </div>

            {/* ── Hero Banner ── */}
            <section className="prd-hero">
                <div className="container prd-hero-inner">
                    <div className="prd-hero-content">
                        <span className={`product-category-pill-lg ${categoryColors[product.category] || ''}`}>
                            {product.category}
                        </span>
                        <h1>{product.title}</h1>
                        <p className="prd-hero-desc">{product.fullDescription}</p>
                        <div className="prd-hero-actions">
                            <a href="/#cta" className="btn btn-primary">
                                Get a Quote
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                                </svg>
                            </a>
                            <Link to="/#products" className="btn btn-outline">← All Products</Link>
                        </div>
                    </div>
                    <div className="prd-hero-image">
                        <img src={product.images[0]} alt={product.title} />
                    </div>
                </div>
            </section>

            {/* ── Quick Specs Strip ── */}
            <section className="prd-specs-strip">
                <div className="container prd-specs-inner">
                    {product.specs.map((spec, i) => (
                        <div key={i} className="prd-spec-card glass-panel">
                            <span className="prd-spec-label">{spec.label}</span>
                            <span className="prd-spec-val">{spec.val}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Key Advantages ── */}
            <section className="prd-advantages container">
                <div className="mono-label" style={{ marginBottom: '0.75rem' }}>WHY HESYRA</div>
                <h2>Built Different.</h2>
                <div className="prd-advantages-grid">
                    {product.advantages.map((adv, i) => (
                        <div key={i} className="prd-advantage-item glass-panel">
                            <span className="prd-adv-icon">✓</span>
                            <span>{adv}</span>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── Comparison Section ── */}
            <section className="prd-comparisons container">
                <div className="mono-label" style={{ marginBottom: '0.75rem' }}>CLINICAL COMPARISON</div>
                <h2>How We Stack Up.</h2>
                <p className="prd-section-subtitle">Honest, spec-for-spec comparisons against the conventional methods you use today.</p>

                {product.comparisons.map((comp, i) => (
                    <div key={i} className="prd-comparison-block glass-panel">
                        <div className="prd-comp-header">
                            <span className="prd-comp-versus">Hesyra Labs  vs  {comp.conventional}</span>
                        </div>
                        <div className="prd-comp-grid">
                            {/* Conventional */}
                            <div className="prd-comp-col prd-comp-conventional">
                                <div className="prd-comp-col-header">
                                    <span className="prd-col-badge conventional">CONVENTIONAL</span>
                                    <h4>{comp.conventional}</h4>
                                </div>
                                <ul>
                                    {comp.conventionalProblems.map((problem, j) => (
                                        <li key={j}>
                                            <span className="prd-bullet-bad">✕</span>
                                            {problem}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            {/* Hesyra */}
                            <div className="prd-comp-col prd-comp-hesyra">
                                <div className="prd-comp-col-header">
                                    <span className="prd-col-badge hesyra">HESYRA LABS</span>
                                    <h4>3D Digital Workflow</h4>
                                </div>
                                <ul>
                                    {comp.hesyraAdvantages.map((adv, j) => (
                                        <li key={j}>
                                            <span className="prd-bullet-good">✓</span>
                                            {adv}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                ))}
            </section>

            {/* ── Pain Points Section ── */}
            <section className="prd-pain-points container">
                <div className="mono-label" style={{ marginBottom: '0.75rem' }}>SOUND FAMILIAR?</div>
                <h2>Cases That Keep You Up At Night.</h2>
                <p className="prd-section-subtitle">If you've been in practice longer than a week, you've lived through at least one of these.</p>
                <div className="prd-pain-grid">
                    {product.painPoints.map((point, i) => (
                        <div key={i} className="prd-pain-card glass-panel">
                            <div className="prd-pain-icon">{point.icon}</div>
                            <div className="prd-pain-scenario">{point.scenario}</div>
                            <blockquote className="prd-pain-quote">"{point.quote}"</blockquote>
                        </div>
                    ))}
                </div>
            </section>

            {/* ── CTA Section ── */}
            <section className="prd-cta-section container">
                <div className="prd-cta-box glass-panel">
                    <div className="mono-label" style={{ justifyContent: 'center', marginBottom: '1rem' }}>READY TO SWITCH?</div>
                    <h2>Stop Settling for Conventional.</h2>
                    <p>Send us your first case today. We'll turn it around in 48 hours, or it's on us.</p>
                    <div className="prd-cta-actions">
                        <a href="/#cta" className="btn btn-primary">
                            Partner With Hesyra Labs
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
                            </svg>
                        </a>
                        <Link to="/#products" className="btn btn-outline">Browse All Products</Link>
                    </div>
                </div>
            </section>


        </motion.main>
    )
}
