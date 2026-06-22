import { useEffect } from 'react'
import { motion } from 'framer-motion'
import './About.css'

export default function About() {
  useEffect(() => {
    document.title = 'About Hesyra Labs | Our Story, Team & Mission — Digital Dental Manufacturing in Nagpur'
    document.querySelector('meta[name="description"]')?.setAttribute('content', "Learn about Hesyra Labs — India's digital-first dental lab founded in Nagpur. Meet our founders, advisory board of leading dentists, and discover how we're transforming dental manufacturing with 3D printing technology.")
  }, [])
  return (
    <motion.main 
      className="about-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="container">
        <section className="about-header">
          <div className="mono-label" style={{ marginBottom: '1.5rem', display: 'inline-flex', padding: '0.5rem 1rem', background: 'var(--accent-glow)', borderRadius: '100px', border: '1px solid var(--border-default)' }}>
            [OUR_STORY] GENESIS
          </div>
          <h1>
            Engineered for Precision.<br />
            <span className="text-gradient-brand">Built for Vidarbha.</span>
          </h1>
          <p className="lead-text">
            For decades, dentists in Central India compromised on speed and precision,
            waiting weeks for analog labs to deliver restorations that often required
            chairside adjustments. We built Hesyra Labs to fix this pipeline.
          </p>
        </section>

        <section className="about-content grid-2-col">
          <div className="text-content">
            <h3>The Analog Problem</h3>
            <p>
              Traditional dental lab work is slow, inconsistent, and heavily reliant on manual labor. 
              Taking physical impressions and shipping them across state lines introduces countless opportunities 
              for error, distortion, and delays. When a crown didn't fit perfectly, it meant sending 
              the patient home and restarting the entire two-week cycle.
            </p>
            
            <h3 style={{ marginTop: '3rem' }}>The Digital Future</h3>
            <p>
              We realized that the future of dentistry isn't just about better materials—it's about 
              <strong> better data</strong> and <strong>advanced manufacturing</strong>.
              By establishing a state-of-the-art DLP 3D print facility right here in Nagpur, 
              we've eliminated the logistics bottleneck entirely.
            </p>
            <p>
              When a clinic partners with Hesyra Labs, they aren't just sending us a case; 
              they are plugging their clinic directly into an industrial-grade CAD/CAM ecosystem. 
              We take their digital intraoral scans, process them through high-end engineering software, 
              and print restorations with 62 µm pixel accuracy using medical-grade ceramic-hybrid resins.
            </p>
          </div>
          
          <div className="visual-content">
            <div className="glass-panel feature-card">
               <div className="tech-stat">
                  <h4>4,600 Years</h4>
                  <p>Hesy-Ra, an ancient Egyptian, was the world's first recorded dental practitioner. Our name honors the origin of the profession, while our technology pushes it forward.</p>
               </div>
               <div className="tech-stat" style={{ marginTop: '2rem' }}>
                   <h4>62 µm</h4>
                   <p>The pixel resolution of our industrial DLP print farms, ensuring perfect marginal integrity that manual hand-stacking simply cannot match.</p>
               </div>
            </div>
          </div>
        </section>

        <section className="founders-section">
          <div className="mono-label" style={{ marginBottom: '2rem', display: 'inline-flex', padding: '0.5rem 1rem', background: 'var(--accent-glow)', borderRadius: '100px', border: '1px solid var(--border-default)' }}>
            [OUR_TEAM] THE FOUNDERS
          </div>
          <h2 className="founders-title">Driven by Experts.</h2>
          
          <div className="founders-grid">
            {/* Dr. Shubham Lotiya */}
            <div className="founder-card glass-panel">
              <div className="founder-avatar-wrapper">
                <div className="founder-avatar">
                   {/* Placeholder for actual image */}
                   <span className="avatar-placeholder">SL</span>
                </div>
              </div>
              <div className="founder-info">
                <h3>Dr. Shubham Lotiya</h3>
                <span className="founder-role text-gradient-brand">Co-Founder</span>
                <p>Leading the clinical vision and ensuring every restoration meets the highest standard of dental anatomy and function.</p>
              </div>
            </div>

            {/* Dr. Akhilesh Agrawal */}
            <div className="founder-card glass-panel">
              <div className="founder-avatar-wrapper">
                <div className="founder-avatar">
                   {/* Placeholder for actual image */}
                   <span className="avatar-placeholder">AA</span>
                </div>
              </div>
              <div className="founder-info">
                <h3>Dr. Akhilesh Agrawal</h3>
                <span className="founder-role text-gradient-brand">Co-Founder</span>
                <p>Driving technological adoption and integrating advanced CAD/CAM processes into seamless clinic-to-lab workflows.</p>
              </div>
            </div>

            {/* Mr. Hrishikesh Kumbar */}
            <div className="founder-card glass-panel">
              <div className="founder-avatar-wrapper">
                <div className="founder-avatar">
                   {/* Placeholder for actual image */}
                   <span className="avatar-placeholder">HK</span>
                </div>
              </div>
              <div className="founder-info">
                <h3>Mr. Hrishikesh Kumbar</h3>
                <span className="founder-role text-gradient-brand">Co-Founder & Operations</span>
                <p>Overseeing the manufacturing pipeline, logistics, and ensuring our 48-hour delivery promise is kept every single time.</p>
              </div>
            </div>
          </div>
          
          <div className="founders-note glass-panel">
            <h4>A Note from the Founders</h4>
            <p>
              "We started Hesyra Labs because we experienced the frustrations of analog dentistry firsthand. We believe that 
              technology should empower clinicians, not complicate their lives. Our mission is to provide you with the exact 
              restorations you need, perfectly designed, predictably delivered, so you can focus entirely on what matters most: your patients."
            </p>
          </div>
        </section>

        <section className="advisory-section">
          <div className="mono-label" style={{ marginBottom: '2rem', display: 'inline-flex', padding: '0.5rem 1rem', background: 'rgba(122, 156, 150, 0.1)', borderRadius: '100px', border: '1px solid rgba(122,156,150,0.2)' }}>
            [GUIDANCE] ADVISORY BOARD
          </div>
          <h2 className="advisory-title">Clinical Excellence, Verified.</h2>
          <p className="advisory-subtitle">
            Our workflows are continuously refined with the guidance of leading practitioners.
          </p>
          
          <div className="advisory-compact-grid">
            <div className="advisor-chip">
              <img src="/Dr Gaurav Majumdar.jpeg" alt="Dr. Gaurav Majumdar" />
              <div className="advisor-chip-info">
                <span className="advisor-chip-name">Dr. Gaurav Majumdar</span>
                <span className="advisor-chip-spec">Prosthodontics</span>
              </div>
              <div className="advisor-bio-overlay">
                <p>Prosthodontist, Implantologist & Digital Dentist integrating CAD-CAM, digital smile design, and guided implantology with evidence-based clinical practice.</p>
              </div>
            </div>

            <div className="advisor-chip">
              <img src="/Dr Shipra Mandwar.jpeg" alt="Dr. Shipra Mandwar" />
              <div className="advisor-chip-info">
                <span className="advisor-chip-name">Dr. Shipra Mandwar</span>
                <span className="advisor-chip-spec">Prosthodontics</span>
              </div>
              <div className="advisor-bio-overlay">
                <p>Prosthodontist & Implantologist, founder of Reform Dental Clinic, specializing in functional rehabilitation and aesthetic smile transformations.</p>
              </div>
            </div>

            <div className="advisor-chip">
              <img src="/Dr Arushi Beri.jpeg" alt="Dr. Arushi Beri" />
              <div className="advisor-chip-info">
                <span className="advisor-chip-name">Dr. Arushi Beri</span>
                <span className="advisor-chip-spec">Prosthodontics</span>
              </div>
              <div className="advisor-bio-overlay">
                <p>Prosthodontist & researcher focused on 3D printing technologies in dental and maxillofacial rehabilitation, utilizing SLA printing and high-precision digital scanning.</p>
              </div>
            </div>

            <div className="advisor-chip">
              <img src="/Dr Sumukh Nerurkar.jpeg" alt="Dr. Sumukh Nerurkar" />
              <div className="advisor-chip-info">
                <span className="advisor-chip-name">Dr. Sumukh Nerurkar</span>
                <span className="advisor-chip-spec">Orthodontics</span>
              </div>
              <div className="advisor-bio-overlay">
                <p>Orthodontist with 20+ publications, specializing in clear aligner planning and CAD-CAM–driven solutions for precision orthodontic appliances.</p>
              </div>
            </div>

            <div className="advisor-chip">
              <img src="/Dr Lovely Bharti.jpeg" alt="Dr. Lovely Bharti" />
              <div className="advisor-chip-info">
                <span className="advisor-chip-name">Dr. Lovely Bharti</span>
                <span className="advisor-chip-spec">Orthodontics</span>
              </div>
              <div className="advisor-bio-overlay">
                <p>Orthodontist with expertise in braces treatment, clear aligner therapy, cleft lip & palate orthodontic care, and TMJ disorder management.</p>
              </div>
            </div>

            <div className="advisor-chip">
              <img src="/Dr Anand Bansod.jpeg" alt="Dr. Anand Bansod" />
              <div className="advisor-chip-info">
                <span className="advisor-chip-name">Dr. Anand Bansod</span>
                <span className="advisor-chip-spec">Endodontics</span>
              </div>
              <div className="advisor-bio-overlay">
                <p>Endodontist championing the integration of 3D printing into daily practice for producing highly aesthetic restorations in significantly less time.</p>
              </div>
            </div>

            <div className="advisor-chip">
              <img src="/Dr Akib Sheikh.jpeg" alt="Dr. Akib Sheikh" />
              <div className="advisor-chip-info">
                <span className="advisor-chip-name">Dr. Akib Sheikh</span>
                <span className="advisor-chip-spec">Pediatric Dentistry</span>
              </div>
              <div className="advisor-bio-overlay">
                <p>Pediatric & Preventive Dentist specializing in full-mouth rehabilitation, interceptive orthodontics, and ensuring 3D-printed innovations meet top-tier safety standards.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="about-cta glass-panel text-center">
            <h2>Ready to upgrade your workflow?</h2>
            <p>Join the growing network of modern dental clinics across India.</p>
            <a href="/#cta" className="btn btn-brand" style={{ display: 'inline-flex', marginTop: '2rem', padding: '1rem 2rem' }}>
                Join the Network
            </a>
        </section>
      </div>
    </motion.main>
  )
}
