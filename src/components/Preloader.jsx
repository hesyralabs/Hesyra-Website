import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import './Preloader.css'

export default function Preloader({ onComplete }) {
  const [loadingText, setLoadingText] = useState('Initializing Systems...')
  
  useEffect(() => {
    const messages = [
      { text: 'Initializing Digital Workflows...', time: 0 },
      { text: 'Calibrating DLP Arrays...', time: 300 },
      { text: 'Ready.', time: 600 }
    ]

    messages.forEach(({ text, time }) => {
      setTimeout(() => setLoadingText(text), time)
    })

    const timer = setTimeout(() => {
      onComplete()
    }, 900)

    return () => clearTimeout(timer)
  }, [onComplete])

  return (
    <motion.div 
      className="preloader-container"
      initial={{ y: 0 }}
      exit={{ y: '-100vh', opacity: 0 }}
      transition={{ duration: 0.8, ease: [0.76, 0, 0.24, 1] }} 
    >
      <div className="preloader-content">
        <motion.div 
          className="preloader-logo"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        >
          <motion.img 
            src="/logo.png" 
            alt="Hesyra Labs Logo"
            className="preloader-real-logo"
            initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
        </motion.div>
        
        <div className="preloader-text-wrapper">
            <AnimatePresence mode="wait">
                <motion.div
                    key={loadingText}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="preloader-text mono-label"
                    style={{ marginTop: '1.5rem', justifyContent: 'center' }}
                >
                    {loadingText}
                </motion.div>
            </AnimatePresence>
        </div>
        
        <motion.div 
          className="preloader-progress-bar"
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  )
}
