import { useRef } from 'react'
import { gsap } from 'gsap'
import { useGSAP } from '@gsap/react'
import './PartnerCarousel.css'

export default function PartnerCarousel() {
    const trackRef = useRef(null)
    const loopRef = useRef(null)

    const partners = [
        { name: 'Graphy', src: '/partners/graphy.svg' },
        { name: 'Asiga', src: '/partners/asiga.svg' },
        { name: 'SprintRay', src: '/partners/sprintray.svg' },
        { name: 'NextDent', src: '/partners/nextdent.svg' },
        { name: 'VITA', src: '/partners/vita.svg' },
        { name: 'Bego', src: '/partners/bego.svg' },
        { name: 'Phrozen', src: '/partners/phrozen.svg' },
        { name: 'HeyGears', src: '/partners/heygears.svg' },
        { name: 'Dentsply Sirona', src: '/partners/dentsply-sirona.svg' }
    ];

    // Double the array to ensure seamless infinite scrolling
    const scrollingPartners = [...partners, ...partners];

    useGSAP(() => {
        if (!trackRef.current) return;
        loopRef.current = gsap.to(trackRef.current, {
            xPercent: -50,
            ease: "none",
            duration: 30,
            repeat: -1
        });
    }, { scope: trackRef });

    const handleMouseEnter = () => {
        if (loopRef.current) {
            gsap.to(loopRef.current, { timeScale: 0, duration: 0.6, ease: "power2.out" });
        }
    };

    const handleMouseLeave = () => {
        if (loopRef.current) {
            gsap.to(loopRef.current, { timeScale: 1, duration: 0.6, ease: "power2.out" });
        }
    };

    return (
        <div className="partner-section fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="partner-label">Powered by Global Industry Leaders</div>
            <div 
                className="partner-carousel"
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="partner-track" ref={trackRef}>
                    {scrollingPartners.map((partner, idx) => (
                        <div key={idx} className="partner-logo">
                            <img src={partner.src} alt={`${partner.name} logo`} loading="lazy" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
