import { useState } from 'react'
import { Linkedin, Instagram, MessageCircle, Twitter, Share2, X } from 'lucide-react'
import './SocialMediaFloat.css'

export default function SocialMediaFloat() {
    const [isOpen, setIsOpen] = useState(false)

    // Replace these with actual business links
    const socialLinks = [
        {
            name: "WhatsApp",
            icon: <MessageCircle size={24} />,
            url: "https://wa.me/919876543210?text=" + encodeURIComponent("Hi Hesyra Labs team, I'd like to know more about your digital workflow."),
            color: "#25D366"
        },
        {
            name: "LinkedIn",
            icon: <Linkedin size={24} />,
            url: "https://linkedin.com/company/hesyralabs",
            color: "#0A66C2"
        },
        {
            name: "Instagram",
            icon: <Instagram size={24} />,
            url: "https://instagram.com/hesyralabs",
            color: "#E1306C"
        },
        {
            name: "Twitter",
            icon: <Twitter size={24} />,
            url: "https://twitter.com/hesyralabs",
            color: "#1DA1F2"
        }
    ]

    return (
        <div 
            className="social-float-container"
            onMouseEnter={() => setIsOpen(true)}
            onMouseLeave={() => setIsOpen(false)}
        >
            <div className={`social-links-wrapper ${isOpen ? 'open' : ''}`}>
                {socialLinks.map((link, index) => (
                    <a
                        key={link.name}
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="social-link-item"
                        aria-label={`Visit our ${link.name}`}
                        style={{ '--hover-color': link.color, '--link-index': index }}
                    >
                        <span className="social-tooltip">{link.name}</span>
                        <div className="social-icon">
                            {link.icon}
                        </div>
                    </a>
                ))}
            </div>

            <button 
                className={`social-main-btn ${isOpen ? 'active' : ''}`}
                aria-label="Connect with us on social media"
                onClick={() => setIsOpen(!isOpen)}
            >
                <div className="icon-container-main">
                    {isOpen ? <X size={28} /> : <Share2 size={28} />}
                </div>
            </button>
        </div>
    )
}
