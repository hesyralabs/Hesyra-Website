import { useState } from 'react'
import { Plus, Minus } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import './FaqSection.css'

const faqs = [
    {
        question: "How does the 48-hour turnaround work? Is it guaranteed?",
        answer: "Yes. Once we receive your intraoral scan (STL/PLY format) via our secure portal before 2 PM, our CAD team immediately begins design. Your restoration is printed on our industrial DLP print farms overnight, processed the next morning, and dispatched. For clients within the Vidarbha region, this guarantees physical delivery within 48 hours."
    },
    {
        question: "Is your printed resin as strong as Zirconia?",
        answer: "Our ceramic-hybrid crown resin achieves ≥ 110 MPa flexural strength with 30–50% inorganic micro-fillers, comparable to lithium disilicate (E.max) and perfectly suited for monolithic single crowns, inlays, and onlays. For bridges, our polyurethane resin reaches ≥ 350 MPa bi-axial strength. While full-contour Zirconia boasts higher absolute strength (~1000 MPa), our printed resins offer superior aesthetic translucency, natural fluorescence, and elasticity matching natural dentin."
    },
    {
        question: "What happens if a printed crown requires adjustment?",
        answer: "Because our digital pipeline ensures 62 µm-resolution marginal integrity matching your scan exactly, chairside adjustments are rarely needed. However, if a remake is ever necessary due to a fit issue on an unaltered prep, we offer a no-questions-asked, free digital reprint and 24-hour rush replacement."
    },
    {
        question: "Do you accept analog (physical) impressions?",
        answer: "Hesyra Labs is a 100% digital-first laboratory. We require digital intraoral scans (Trios, Medit, iTero, Primescan, etc.) to guarantee our speed and sub-micron quality. We do not accept physical elastomeric impressions to completely eliminate the distortion errors inherent to analog processes."
    }
]

// Generate FAQPage JSON-LD for Google rich snippets
const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer
        }
    }))
}

export default function FaqSection() {
    const [openIndex, setOpenIndex] = useState(0);

    const toggleFaq = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    }

    return (
        <section className="faq-section container" style={{ marginTop: '3rem', marginBottom: '5rem' }} aria-label="Frequently Asked Questions">
            {/* FAQ structured data for search engines */}
            <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />

            <div className="faq-header text-center" style={{ marginBottom: '4rem' }}>
                <div className="mono-label">CLINICAL SUPPORT</div>
                <h2 style={{ fontSize: '3rem', margin: '1rem 0' }}>Frequently Asked Questions</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>Everything you need to know about transitioning to a digital lab.</p>
            </div>

            <div className="faq-accordion" role="list">
                {faqs.map((faq, idx) => {
                    const isOpen = openIndex === idx;
                    return (
                        <div key={idx} className={`faq-item ${isOpen ? 'open' : ''}`} role="listitem">
                            <button className="faq-trigger" onClick={() => toggleFaq(idx)} aria-expanded={isOpen}>
                                <span>{faq.question}</span>
                                <div className="faq-icon-wrapper">
                                    {isOpen ? <Minus size={20} /> : <Plus size={20} />}
                                </div>
                            </button>
                            <AnimatePresence initial={false}>
                                {isOpen && (
                                    <motion.div 
                                        className="faq-content"
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                                    >
                                        <div className="faq-answer">
                                            {faq.answer}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
