import { Link } from 'react-router-dom'
import './Footer.css'
import LogoIcon from './LogoIcon'

export default function Footer() {
    return (
        <footer id="contact" aria-label="Site footer">
            <div className="container">
                <div className="footer-grid">
                    <div className="footer-col">
                        <a href="/" className="logo footer-logo">
                            <LogoIcon size={20} />
                            <span className="logo-text">HESYRA <span className="logo-bold">LABS</span></span>
                        </a>
                        <p className="footer-description">
                            Digitalizing dental &amp; medical fabrication. Cutting-edge 3D manufacturing lab based in Central India.
                        </p>
                    </div>
                    <div className="footer-col">
                        <h5>PLATFORM</h5>
                        <ul>
                            <li><a href="/#products">Products</a></li>
                            <li><a href="/#technology">Technology</a></li>
                            <li><a href="/#products">Materials Data</a></li>
                            <li><Link to="/portal-docs">Portal Login</Link></li>
                        </ul>
                    </div>
                    <div className="footer-col">
                        <h5>COMPANY</h5>
                        <ul>
                            <li><Link to="/about">About Us</Link></li>
                            <li><a href="/#dentists">For Dentists</a></li>
                            <li><a href="mailto:hesyralabs@gmail.com">Careers</a></li>
                            <li><a href="/#contact">Contact</a></li>
                        </ul>
                    </div>
                    <div className="footer-col" itemScope itemType="https://schema.org/PostalAddress">
                        <h5>HQ</h5>
                        <ul className="footer-address">
                            <li itemProp="streetAddress">Tech Park, MIDC</li>
                            <li itemProp="addressLocality">Nagpur, <span itemProp="addressRegion">Maharashtra</span></li>
                            <li>Vidarbha Region, <span itemProp="addressCountry">India</span></li>
                            <li><a href="mailto:hesyralabs@gmail.com" className="footer-email" itemProp="email">hesyralabs@gmail.com</a></li>
                        </ul>
                    </div>
                </div>
                <div className="footer-bottom">
                    <div>© {new Date().getFullYear()} Hesyra Labs Pvt Ltd. All rights reserved.</div>
                    <div className="footer-legal-links">
                        <a href="/privacy">Privacy</a>
                        <a href="/terms">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
