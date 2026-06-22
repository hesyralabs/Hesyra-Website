import { Link } from 'react-router-dom'
import './LegalPage.css'

export default function Terms() {
    return (
        <section className="legal-page">
            <div className="container legal-inner">
                <div className="mono-label" style={{ marginBottom: '1rem' }}>[LEGAL]</div>
                <h1>Terms of Service</h1>
                <p className="legal-updated">Last Updated: March 19, 2026</p>

                <p>These Terms of Service ("Terms") govern your use of the Hesyra Labs website (hesyralabs.com) and dental manufacturing services provided by Hesyra Labs Pvt Ltd ("Hesyra Labs", "we", "our", or "us"). By using our services, you agree to these Terms.</p>

                <h2>1. Services</h2>
                <p>Hesyra Labs provides 3D-printed dental prosthetics including crowns, bridges, dentures, veneers, surgical guides, aligners, and retainers. Our services are available exclusively to licensed dental professionals, clinics, and authorized resellers.</p>
                <div className="legal-highlight">
                    <p>Hesyra Labs products are custom medical devices manufactured to the prescribing clinician's specifications. The ordering dentist bears full clinical responsibility for case planning, patient assessment, and prosthetic fit verification.</p>
                </div>

                <h2>2. Ordering &amp; Delivery</h2>
                <ul>
                    <li>Orders are placed by submitting digital scans (STL/PLY) through our secure cloud portal along with the required case specifications.</li>
                    <li>Standard turnaround is 48 hours from receipt of a complete, accepted scan. Complex prosthetics (full dentures, multi-unit bridges) may require 72 hours.</li>
                    <li>Delivery timelines are estimates and may be affected by scan quality issues, incomplete specifications, or logistics circumstances beyond our control.</li>
                    <li>We reserve the right to reject or request re-submission of scans that do not meet minimum quality standards for accurate fabrication.</li>
                </ul>

                <h2>3. Quality &amp; Warranty</h2>
                <ul>
                    <li>All prosthetics are manufactured using medical-grade, biocompatible resins in accordance with ISO 13485 certified quality processes.</li>
                    <li>We provide a <strong>fit guarantee</strong>: if a prosthetic does not fit as per the submitted specifications, we will remake it at no additional cost within 14 days of delivery.</li>
                    <li>This guarantee does not cover cases where the original scan was inaccurate, specifications were incomplete, or chairside modifications were made that alter the prosthetic.</li>
                    <li>Hesyra Labs is not liable for clinical outcomes, patient complications, or issues arising from improper use or placement of our products.</li>
                </ul>

                <h2>4. Intellectual Property</h2>
                <ul>
                    <li>All content on this website — including text, graphics, logos, software, and design — is the property of Hesyra Labs Pvt Ltd and is protected by applicable intellectual property laws.</li>
                    <li>You may not reproduce, distribute, modify, or create derivative works from any content on this site without prior written permission.</li>
                    <li>Scan data submitted by clinics remains the intellectual property of the submitting party. Hesyra Labs claims no ownership over clinical scan data.</li>
                </ul>

                <h2>5. Payment Terms</h2>
                <ul>
                    <li>Pricing for prosthetics is as quoted at the time of order confirmation.</li>
                    <li>Payment is due within 15 days of delivery unless alternate terms have been agreed in writing.</li>
                    <li>We reserve the right to suspend services for accounts with outstanding payments exceeding 30 days.</li>
                    <li>All prices are in Indian Rupees (INR) and are exclusive of applicable taxes.</li>
                </ul>

                <h2>6. Limitation of Liability</h2>
                <div className="legal-highlight">
                    <p>To the maximum extent permitted by law, Hesyra Labs' total liability for any claim related to our products or services shall not exceed the amount paid by you for the specific product giving rise to the claim.</p>
                </div>
                <ul>
                    <li>We are not liable for any indirect, incidental, consequential, or punitive damages arising from the use of our products or services.</li>
                    <li>We are not liable for delays caused by incomplete scan submissions, courier service failures, or force majeure events.</li>
                    <li>The ordering clinician is solely responsible for verifying prosthetic fit before cementation or permanent placement.</li>
                </ul>

                <h2>7. Indemnification</h2>
                <p>You agree to indemnify, defend, and hold harmless Hesyra Labs, its directors, employees, and affiliates from any claims, damages, losses, or expenses (including legal fees) arising from your use of our services, your violation of these Terms, or any claim by a patient related to the clinical application of our products.</p>

                <h2>8. Account Suspension</h2>
                <p>We reserve the right to suspend or terminate your access to our services if you violate these Terms, provide fraudulent information, or engage in conduct that we reasonably believe may harm Hesyra Labs or other users.</p>

                <h2>9. Governing Law</h2>
                <p>These Terms are governed by the laws of India, and any disputes shall be subject to the exclusive jurisdiction of the courts in Nagpur, Maharashtra.</p>

                <h2>10. Changes to Terms</h2>
                <p>We may modify these Terms at any time. Updated Terms will be posted on this page with a revised "Last Updated" date. Continued use of our services after changes constitutes acceptance of the revised Terms.</p>

                <h2>11. Contact</h2>
                <p>For questions about these Terms:</p>
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
