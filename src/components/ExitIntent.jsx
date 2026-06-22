import { useState, useEffect } from 'react'
import { getVisitorProfile, trackCTA } from '../utils/analytics'
import './ExitIntent.css'

export default function ExitIntent() {
  const [show, setShow] = useState(false)
  const [hasTriggered, setHasTriggered] = useState(false)
  const [content, setContent] = useState(null)

  useEffect(() => {
    // Only trigger once per session
    if (sessionStorage.getItem('hesyra_exit_triggered')) {
      setHasTriggered(true)
      return
    }

    const handleMouseLeave = (e) => {
      // If mouse leaves towards the top of the window (exit intent)
      if (e.clientY <= 0 && !hasTriggered) {
        triggerExitIntent()
      }
    }

    document.addEventListener('mouseleave', handleMouseLeave)
    return () => document.removeEventListener('mouseleave', handleMouseLeave)
  }, [hasTriggered])

  function triggerExitIntent() {
    setHasTriggered(true)
    sessionStorage.setItem('hesyra_exit_triggered', 'true')

    const profile = getVisitorProfile() || {}
    const sections = profile.sections || []

    let config = {
      title: "Wait, don't leave just yet.",
      text: "Have a case in mind? WhatsApp us for a same-day quote.",
      btn: "Chat on WhatsApp",
      link: "https://wa.me/1234567890",
      ctaLabel: 'Exit Intent - WhatsApp'
    }

    if (sections.includes('products')) {
      config = {
        title: "Ready to test our quality?",
        text: "Request our provider pricing and see the Hesyra difference for yourself.",
        btn: "Request Pricing",
        link: "#cta",
        ctaLabel: 'Exit Intent - Request Pricing'
      }
    } else if (sections.includes('portal-teaser')) {
      config = {
        title: "Ready to upgrade your workflow?",
        text: "Get early access to the Hesyra Portal and manage your cases seamlessly.",
        btn: "Request Access",
        link: "#",
        ctaLabel: 'Exit Intent - Portal Access'
      }
    }

    setContent(config)
    setShow(true)
  }

  function handleAction() {
    if (content?.ctaLabel) trackCTA(content.ctaLabel)
    setShow(false)
  }

  if (!show || !content) return null

  return (
    <div className="exit-overlay" onClick={() => setShow(false)}>
      <div className="exit-modal" onClick={e => e.stopPropagation()}>
        <button className="exit-close" onClick={() => setShow(false)}>✕</button>
        <div className="exit-icon">💡</div>
        <h2 className="exit-title">{content.title}</h2>
        <p className="exit-text">{content.text}</p>
        <a href={content.link} className="exit-btn" onClick={handleAction} target={content.link.startsWith('http') ? '_blank' : '_self'} rel="noreferrer">
          {content.btn}
        </a>
      </div>
    </div>
  )
}
