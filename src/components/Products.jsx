import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { productData } from '../data/productData'
import { trackHoverIntent } from '../utils/analytics'
import Reveal from '../motion/Reveal'
import './Products.css'

// Product JSON-LD for search engine rich results
const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Hesyra Labs Dental Products",
    "description": "Precision 3D-printed dental prosthetics including crowns, bridges, dentures, veneers, surgical guides, and aligners.",
    "itemListElement": productData.map((p, i) => ({
        "@type": "Product",
        "position": i + 1,
        "name": p.title,
        "description": p.shortDescription,
        "brand": { "@type": "Brand", "name": "Hesyra Labs" },
    }))
}

const categoryColors = {
    RESTORATIONS: 'pill-restoration',
    SURGICAL: 'pill-surgical',
    ORTHODONTICS: 'pill-ortho',
}

export default function Products() {
    const hoverTimers = useRef({})

    const handleMouseEnter = (productTitle) => {
        hoverTimers.current[productTitle] = setTimeout(() => {
            trackHoverIntent(`Product: ${productTitle}`)
        }, 2000)
    }

    const handleMouseLeave = (productTitle) => {
        if (hoverTimers.current[productTitle]) {
            clearTimeout(hoverTimers.current[productTitle])
        }
    }
    return (
        <section id="products" className="container" aria-label="Dental Products and Services">
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }} />
            <Reveal className="section-header">
                <div className="mono-label" style={{ marginBottom: '1rem' }}>OUTPUTS</div>
                <h2>Clinical Deliverables</h2>
                <p className="section-subtitle">Every restoration, guide, and appliance fabricated to clinical precision — in 48 hours.</p>
            </Reveal>

            <Reveal className="product-grid" stagger>
                {productData.map(product => (
                    <div 
                        key={product.id} 
                        className="product-card glass-panel"
                        onMouseEnter={() => handleMouseEnter(product.title)}
                        onMouseLeave={() => handleMouseLeave(product.title)}
                    >
                        {/* Image area */}
                        <div className="product-visual">
                            <span className={`product-category-pill ${categoryColors[product.category] || ''}`}>
                                {product.category}
                            </span>
                            <img
                                src={product.images[0]}
                                alt={product.title}
                                loading="lazy"
                                className="product-img"
                            />
                        </div>

                        {/* Info area */}
                        <div className="product-info">
                            <h3>{product.title}</h3>
                            <p>{product.shortDescription}</p>
                            <div className="product-specs-row">
                                {product.specs.slice(0, 2).map((spec, i) => (
                                    <div key={i} className="tech-data-row">
                                        <span className="td-label">{spec.label}</span>
                                        <span className="td-val">{spec.val}</span>
                                    </div>
                                ))}
                            </div>
                            <Link to={`/products/${product.slug}`} className="btn btn-primary product-cta">
                                View Details
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </Link>
                        </div>
                    </div>
                ))}
            </Reveal>
        </section>
    )
}
