import { Link } from 'react-router-dom'
import './LegalPage.css'

export default function Privacy() {
    return (
        <section className="legal-page">
            <div className="container legal-inner">
                <div className="mono-label" style={{ marginBottom: '1rem' }}>[LEGAL]</div>
                <h1>Privacy Policy</h1>
                <p className="legal-updated">Last Updated: March 19, 2026</p>

                <p>Hesyra Labs Pvt Ltd ("Hesyra Labs", "we", "our", or "us") is committed to protecting the privacy of dentists, clinics, and patients who interact with our platform. This Privacy Policy explains how we collect, use, store, and safeguard your information.</p>

                <h2>1. Information We Collect</h2>
                <p>We collect the following types of information when you use our services:</p>
                <ul>
                    <li><strong>Contact Information:</strong> Name, phone number, email address, clinic name, and location submitted through our contact forms.</li>
                    <li><strong>Clinical Data:</strong> Digital scan files (STL/PLY), case specifications, shade selections, and treatment notes uploaded through our cloud portal for prosthetic fabrication.</li>
                    <li><strong>Usage Data:</strong> Pages visited, browser type, device information, and interaction data collected automatically to improve our website experience.</li>
                    <li><strong>Cookies:</strong> We use essential cookies for website functionality and theme preferences. No third-party advertising cookies are used.</li>
                </ul>

                <h2>2. How We Use Your Information</h2>
                <ul>
                    <li>To fabricate and deliver dental prosthetics as requested by your clinic.</li>
                    <li>To communicate about your orders, provide case updates, and respond to inquiries.</li>
                    <li>To improve our manufacturing processes, website, and service quality.</li>
                    <li>To send relevant product updates and clinical resources (only with your consent).</li>
                    <li>To comply with applicable medical device regulations and quality standards.</li>
                </ul>

                <h2>3. Clinical Data Protection</h2>
                <div className="legal-highlight">
                    <p>All clinical scan data is processed exclusively for prosthetic fabrication and is stored on secure, encrypted servers within India. We never sell, share, or use patient scan data for any purpose other than fulfilling your order.</p>
                </div>
                <ul>
                    <li>Scan files are encrypted during transmission and at rest.</li>
                    <li>Access to clinical data is restricted to authorized technicians only.</li>
                    <li>Digital records are retained as per ISO 13485 requirements and can be deleted upon written request from the ordering clinician.</li>
                </ul>

                <h2>4. Data Sharing</h2>
                <p>We do not sell or rent your personal information. We may share data only in these cases:</p>
                <ul>
                    <li><strong>Service Providers:</strong> Trusted logistics partners for delivery of finished prosthetics.</li>
                    <li><strong>Legal Compliance:</strong> When required by law, regulation, or valid legal process.</li>
                    <li><strong>Business Transfers:</strong> In connection with any merger, acquisition, or sale of company assets (with prior notice).</li>
                </ul>

                <h2>5. Data Retention</h2>
                <p>Contact form submissions are retained for 24 months. Clinical scan data and case records are retained for the duration required by ISO 13485 quality management standards (minimum 5 years), after which they are securely deleted unless retention is requested by the ordering clinic.</p>

                <h2>6. Your Rights</h2>
                <p>You have the right to:</p>
                <ul>
                    <li>Request access to your personal data that we hold.</li>
                    <li>Request correction of inaccurate information.</li>
                    <li>Request deletion of your data (subject to regulatory retention requirements).</li>
                    <li>Withdraw consent for marketing communications at any time.</li>
                    <li>Lodge a complaint with applicable data protection authorities.</li>
                </ul>

                <h2>7. Security</h2>
                <p>We implement industry-standard security measures including SSL/TLS encryption, access controls, regular security audits, and secure data centers located within India. Our processes comply with ISO 13485 quality management standards for medical device manufacturing.</p>

                <h2>8. Third-Party Links</h2>
                <p>Our website may contain links to third-party websites. We are not responsible for the privacy practices of external sites and encourage you to review their policies independently.</p>

                <h2>9. Changes to This Policy</h2>
                <p>We may update this Privacy Policy periodically. Material changes will be communicated via our website. Continued use of our services after updates constitutes acceptance of the revised policy.</p>

                <h2>10. Contact Us</h2>
                <p>For any privacy-related questions, data requests, or concerns:</p>
                <p>
                    <strong>Hesyra Labs Pvt Ltd</strong><br />
                    Tech Park, MIDC, Nagpur, Maharashtra, India<br />
                    Email: <a href="mailto:hesyralabs@gmail.com">hesyralabs@gmail.com</a>
                </p>

                <Link to="/" className="legal-back">← Back to Home</Link>
            </div>
        </section>
    )
}
