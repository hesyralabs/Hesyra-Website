import { useState, useEffect, lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Toaster } from 'react-hot-toast'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import FloatingContact from './components/FloatingContact'
// Eager: home is the default route
import Home from './pages/Home'
// Lazy: below-the-fold pages
const About = lazy(() => import('./pages/About'))
const NotFound = lazy(() => import('./pages/NotFound'))
const PortalDocs = lazy(() => import('./pages/PortalDocs'))
const ProductDetail = lazy(() => import('./pages/ProductDetail'))
const BlogPost = lazy(() => import('./pages/BlogPost'))
const CityLanding = lazy(() => import('./pages/CityLanding'))
const ServiceLanding = lazy(() => import('./pages/ServiceLanding'))
import Preloader from './components/Preloader'
import GoogleOneTap from './components/GoogleOneTap'
import AnalyticsTracker from './components/AnalyticsTracker'
import AdminInsights from './components/AdminInsights'
import ExitIntent from './components/ExitIntent'
import { useSmoothScroll, scrollTo } from './hooks/useSmoothScroll'
import { DUR, BEZIER } from './motion/tokens'

export default function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const { pathname, hash } = useLocation()

  useSmoothScroll()

  // Handle scroll to top on path change, or scroll to hash if present
  useEffect(() => {
    if (hash) {
      // Small delay to ensure the page has rendered
      setTimeout(() => {
        const id = hash.replace('#', '')
        const element = document.getElementById(id)
        if (element) {
          scrollTo(element)
        }
      }, 100)
    } else {
      // immediate: a route change should land at the top, not animate there
      scrollTo(0, { immediate: true })
    }
  }, [pathname, hash])

  return (
    <>
      <AnimatePresence mode="wait">
        {!isLoaded && <Preloader key="preloader" onComplete={() => setIsLoaded(true)} />}
      </AnimatePresence>

      {isLoaded && (
        <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           transition={{ duration: DUR.section, ease: BEZIER.out }}
        >
          <Toaster 
        position="top-center" 
        toastOptions={{
          style: {
            background: 'var(--bg-secondary)',
            color: 'var(--text-primary)',
            border: '1px solid var(--border)',
            padding: '16px',
            borderRadius: '12px'
          },
          success: {
            iconTheme: { primary: 'var(--brand-accent)', secondary: '#fff' }
          }
        }} 
      />

      {/* Background effects */}
      <div className="bg-grid-pattern" />
      <div className="ambient-glow" />
      <div className="ambient-glow-alt" />

      <Navbar />
      
      <Suspense fallback={<div style={{ minHeight: '100vh' }} />}>
      <AnimatePresence mode="wait">
        <Routes location={pathname} key={pathname}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/portal-docs" element={<PortalDocs />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/dental-lab/:city" element={<CityLanding />} />
          <Route path="/services/:service" element={<ServiceLanding />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      </Suspense>
      
      <GoogleOneTap />
      <AnalyticsTracker />
      <AdminInsights />
      <ExitIntent />
      {pathname !== '/' && <Footer />}
      <FloatingContact />
      </motion.div>
      )}
    </>
  )
}
