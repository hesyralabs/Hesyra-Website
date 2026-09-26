/**
 * Motion tokens.
 *
 * Before this existed the site used 16 different durations and 11 different
 * easing curves spread across CSS, framer-motion and GSAP. Everything moved,
 * but nothing moved the *same way* — which is what separates a site that feels
 * designed from one that feels merely animated.
 *
 * The signature curve is expo-out, chosen to match the Lenis scroll easing in
 * hooks/useSmoothScroll.js: fast pickup, long settle. When the page and its
 * contents decelerate on the same curve, scrolling and revealing read as one
 * system rather than two.
 *
 * Mirrored as CSS custom properties in index.css — keep the two in sync.
 */

/** GSAP easing names. */
export const EASE = {
    out: 'expo.out',        // entrances, reveals, anything settling into place
    inOut: 'power2.inOut',  // state that goes and comes back
    linear: 'none'          // marquees, continuous loops
}

/** CSS equivalents of the above. */
export const CSS_EASE = {
    out: 'cubic-bezier(0.16, 1, 0.3, 1)',
    inOut: 'cubic-bezier(0.65, 0, 0.35, 1)'
}

/** Same curves as bezier control points, the form framer-motion takes. */
export const BEZIER = {
    out: [0.16, 1, 0.3, 1],
    inOut: [0.65, 0, 0.35, 1]
}

/** Seconds. A five-step scale — resist adding a sixth. */
export const DUR = {
    micro: 0.15,   // hover, focus, tap feedback
    ui: 0.3,       // buttons, cards, accordions
    element: 0.5,  // a single element revealing
    section: 0.8,  // a whole section, or a large move
    hero: 1.2      // deliberate, once-per-page moments
}

/** Travel distance in px for reveals. */
export const RISE = {
    sm: 12,
    md: 24,
    lg: 40
}

/** Base gap between staggered siblings, in seconds. */
export const STAGGER = 0.07
