import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import './Navbar.css'
import LogoIcon from './LogoIcon'
import { setScrollLocked } from '../hooks/useSmoothScroll'

export default function Navbar() {
    const { pathname } = useLocation()
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

    // The mobile menu is a fixed full-height overlay — without this the page
    // keeps scrolling underneath it.
    useEffect(() => {
        setScrollLocked(isMobileMenuOpen)
        return () => setScrollLocked(false)
    }, [isMobileMenuOpen])

    // Helper to determine if we need to route to home first
    const getLinkPath = (hash) => pathname === '/' ? hash : `/${hash}`

    const closeMobileMenu = () => setIsMobileMenuOpen(false)

    return (
        <nav className="navbar" aria-label="Main navigation">
            <div className="container nav-inner">
                <Link to="/" className="logo" onClick={closeMobileMenu}>
                    <LogoIcon size={28} />
                    <span className="logo-text">HESYRA <span className="logo-bold">LABS</span></span>
                </Link>
                
                {/* Desktop Links */}
                <div className="nav-links">
                    <a href={getLinkPath('#products')}>Products</a>
                    <a href={getLinkPath('#technology')}>Technology</a>
                    <a href={getLinkPath('#dentists')}>For Dentists</a>
                    <a href={getLinkPath('#contact')}>Contact</a>
                </div>
                
                <div className="nav-right">
                    <a href={getLinkPath('#cta')} className="btn btn-brand desktop-only-btn">Partner With Us</a>
                    <button 
                        className="mobile-menu-btn" 
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
                <div className="mobile-menu-links">
                    <a href={getLinkPath('#products')} onClick={closeMobileMenu}>Products</a>
                    <a href={getLinkPath('#technology')} onClick={closeMobileMenu}>Technology</a>
                    <a href={getLinkPath('#dentists')} onClick={closeMobileMenu}>For Dentists</a>
                    <a href={getLinkPath('#contact')} onClick={closeMobileMenu}>Contact</a>
                    <a href={getLinkPath('#cta')} className="btn btn-brand" onClick={closeMobileMenu} style={{marginTop: '2rem'}}>Partner With Us</a>
                </div>
            </div>
        </nav>
    )
}
