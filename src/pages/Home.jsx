import { useEffect } from 'react'
import { motion } from 'framer-motion'
import IllocaHome from '../components/IllocaHome'
import { DUR, BEZIER } from '../motion/tokens'

export default function Home() {
  useEffect(() => {
    document.title = 'Hesyra Labs | 3D Printed Dental Prosthetics — Crowns, Dentures, Aligners in 48 Hours | Nagpur, India'
    document.querySelector('meta[name="description"]')?.setAttribute('content', "Hesyra Labs is India's precision 3D dental manufacturing lab. We deliver crowns, bridges, dentures, aligners, veneers & surgical guides in 48 hours using high-resolution DLP printing. Digital-first dental lab based in Nagpur, Maharashtra.")
  }, [])

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: DUR.element, ease: BEZIER.out }}
    >
      <IllocaHome />
    </motion.main>
  )
}
