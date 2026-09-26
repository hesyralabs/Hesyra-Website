import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { DUR, EASE, RISE, STAGGER } from './tokens'

/**
 * The one way things enter the page.
 *
 * Runs on GSAP's ticker — the same one driving Lenis — so a reveal firing while
 * the user scrolls resolves on the same frame as the scroll itself.
 *
 * Progressive enhancement, deliberately: the markup renders visible and is only
 * hidden once JS decides to animate it. If scripting fails, or the visitor
 * prefers reduced motion, the content is simply there. Every reveal is tagged
 * `data-reveal` so prerender.mjs can clear the hidden state before serialising
 * the HTML — otherwise crawlers would receive opacity:0 content.
 */

// A single observer serves every reveal on the page rather than one each.
let observer = null
const pending = new Map()

function getObserver() {
    if (observer) return observer
    observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue
                const run = pending.get(entry.target)
                if (!run) continue
                pending.delete(entry.target)
                observer.unobserve(entry.target)
                run()
            }
        },
        // Fire a little before the element is fully on screen, so motion has
        // finished by the time it's properly in view.
        { rootMargin: '0px 0px -10% 0px', threshold: 0.01 }
    )
    return observer
}

export default function Reveal(props) {
    // Destructured here rather than in the signature so `Tag` counts as a
    // variable for no-unused-vars — this config has no eslint-plugin-react, so
    // it cannot see JSX usage, and only varsIgnorePattern is set.
    const {
        as: Tag = 'div',
        children,
        delay = 0,
        duration = DUR.element,
        distance = RISE.md,
        stagger = false,
        className,
        ...rest
    } = props

    const ref = useRef(null)

    useLayoutEffect(() => {
        const el = ref.current
        if (!el) return

        if (
            typeof IntersectionObserver === 'undefined' ||
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return // leave it visible
        }

        // Animate direct children when staggering, otherwise the wrapper.
        const targets = stagger ? Array.from(el.children) : el
        if (stagger && targets.length === 0) return

        gsap.set(targets, { opacity: 0, y: distance, willChange: 'transform, opacity' })

        const run = () => {
            gsap.to(targets, {
                opacity: 1,
                y: 0,
                duration,
                delay,
                ease: EASE.out,
                stagger: stagger ? (typeof stagger === 'number' ? stagger : STAGGER) : 0,
                onComplete: () => {
                    // Drop the transform so it can't interfere with sticky,
                    // fixed descendants or hover transforms later on.
                    gsap.set(targets, { clearProps: 'transform,willChange' })
                    el.dataset.reveal = 'done'
                }
            })
        }

        pending.set(el, run)
        getObserver().observe(el)

        return () => {
            pending.delete(el)
            observer?.unobserve(el)
            gsap.killTweensOf(targets)
        }
    }, [delay, duration, distance, stagger])

    return (
        <Tag ref={ref} className={className} data-reveal="pending" {...rest}>
            {children}
        </Tag>
    )
}
