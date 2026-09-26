import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import 'lenis/dist/lenis.css'

/**
 * Smooth scroll foundation.
 *
 * Lenis is driven from GSAP's ticker rather than its own requestAnimationFrame
 * loop, so scroll and every GSAP animation resolve on the same frame. Two
 * independent rAF loops are what make scroll-linked motion look like it's
 * lagging a frame behind the page.
 *
 * Lenis scrolls the window natively (it does not transform a wrapper), so
 * position: sticky, IntersectionObserver and framer-motion's useScroll all keep
 * working untouched.
 */

let lenis = null

/** Current Lenis instance, or null when reduced motion is active. */
export function getLenis() {
    return lenis
}

/**
 * Scroll to a target, routed through Lenis when it's running and falling back
 * to native scrolling when it isn't.
 */
export function scrollTo(target, options = {}) {
    if (lenis) {
        lenis.scrollTo(target, options)
        return
    }
    if (target === 0 || target === 'top') {
        window.scrollTo(0, 0)
    } else if (typeof target === 'string') {
        document.querySelector(target)?.scrollIntoView()
    } else if (target instanceof Element) {
        target.scrollIntoView()
    }
}

/**
 * Freeze or resume page scrolling, for full-screen overlays.
 * Falls back to an overflow lock when Lenis isn't running (reduced motion).
 */
export function setScrollLocked(locked) {
    if (lenis) {
        if (locked) lenis.stop()
        else lenis.start()
        return
    }
    document.body.style.overflow = locked ? 'hidden' : ''
}

export function useSmoothScroll() {
    useEffect(() => {
        const query = window.matchMedia('(prefers-reduced-motion: reduce)')

        let raf = null

        const start = () => {
            if (lenis) return

            lenis = new Lenis({
                duration: 1.1,
                // expo-out: fast pickup, long settle — reads as weight rather than delay
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
                smoothWheel: true,
                touchMultiplier: 1.5
            })

            raf = (time) => lenis.raf(time * 1000) // gsap.ticker passes seconds
            gsap.ticker.add(raf)
            // Without this GSAP fakes a fixed delta after a slow frame, which
            // desyncs Lenis from the real scroll position.
            gsap.ticker.lagSmoothing(0)
        }

        const stop = () => {
            if (raf) gsap.ticker.remove(raf)
            raf = null
            lenis?.destroy()
            lenis = null
        }

        const apply = () => (query.matches ? stop() : start())

        apply()
        query.addEventListener('change', apply)

        return () => {
            query.removeEventListener('change', apply)
            stop()
        }
    }, [])
}
