import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import {
  initAnalytics,
  trackSection,
  trackCTA,
  updateScrollDepth,
  trackPage,
} from '../utils/analytics'

/**
 * Invisible component mounted at app root.
 * Handles: analytics init, scroll depth, section visibility, CTA clicks, route changes.
 */
export default function AnalyticsTracker() {
  const location = useLocation()
  const observerRef = useRef(null)

  // ── Boot analytics on first mount ────────────────────────────
  useEffect(() => {
    initAnalytics()
  }, [])

  // ── Track route changes ───────────────────────────────────────
  useEffect(() => {
    trackPage(location.pathname + location.search)
  }, [location])

  // ── Scroll depth tracker ──────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const scrolled  = window.scrollY + window.innerHeight
      const total     = document.documentElement.scrollHeight
      const pct       = (scrolled / total) * 100
      updateScrollDepth(pct)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ── Section visibility tracker ────────────────────────────────
  useEffect(() => {
    // Watch all sections with an id attribute
    const sections = document.querySelectorAll('section[id]')
    if (!sections.length) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            trackSection(entry.target.id)
          }
        })
      },
      { threshold: 0.3 }   // Section must be 30% visible to count
    )

    sections.forEach(s => observerRef.current.observe(s))

    return () => observerRef.current?.disconnect()
  }, [location.pathname])   // Re-run on page change

  // ── CTA click tracker ────────────────────────────────────────
  useEffect(() => {
    const CTA_SELECTORS = [
      { sel: 'a[href="#products"]',    label: 'Explore Products' },
      { sel: '.hero-btn-primary',      label: 'Hero CTA' },
      { sel: '.floating-contact-btn',  label: 'Book a Demo Float' },
      { sel: '.cta-banner a, .cta-banner button', label: 'CTA Banner' },
      { sel: '[data-track]',           label: null },  // data-track="Custom Label"
    ]

    const handlers = CTA_SELECTORS.flatMap(({ sel, label }) => {
      const els = document.querySelectorAll(sel)
      return Array.from(els).map(el => {
        const handler = () => trackCTA(label ?? el.dataset.track ?? el.textContent?.trim().slice(0, 40))
        el.addEventListener('click', handler)
        return { el, handler }
      })
    })

    return () => {
      handlers.forEach(({ el, handler }) => el.removeEventListener('click', handler))
    }
  }, [location.pathname])

  return null  // Renders nothing
}
