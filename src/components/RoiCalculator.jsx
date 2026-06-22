import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { trackGhostInput } from '../utils/analytics'
import './RoiCalculator.css'

export default function RoiCalculator() {
    const [casesPerMonth, setCasesPerMonth] = useState(20);

    const hoursSaved = useMemo(() => casesPerMonth * 1, [casesPerMonth]);
    const revenuePotential = useMemo(() => hoursSaved * 3000, [hoursSaved]);

    return (
        <section className="roi-section container">
            <div className="roi-inner">
                <div className="roi-text">
                    <div className="mono-label">CLINICAL EFFICIENCY</div>
                    <h3>Your Digital Advantage</h3>
                    <p>Slide to estimate how much chair time and revenue your clinic could recover by switching to a fully digital workflow.</p>
                    <div className="roi-disclaimer">
                        *Based on avg. 60 min saved per case at ₹3,000/hr clinic value.
                    </div>
                </div>

                <div className="roi-widget">
                    <label className="roi-slider-label">
                        Monthly Cases
                        <span className="roi-slider-val">{casesPerMonth}</span>
                    </label>
                    <input 
                        type="range" 
                        min="5" 
                        max="100" 
                        step="5"
                        value={casesPerMonth} 
                        onChange={(e) => setCasesPerMonth(Number(e.target.value))}
                        onMouseUp={() => trackGhostInput('ROI Cases Per Month', casesPerMonth)}
                        onTouchEnd={() => trackGhostInput('ROI Cases Per Month', casesPerMonth)}
                        className="roi-range"
                    />
                    <div className="roi-range-marks">
                        <span>5</span>
                        <span>50</span>
                        <span>100</span>
                    </div>

                    <div className="roi-output-row">
                        <div className="roi-output">
                            <motion.span
                                className="roi-output-val"
                                key={hoursSaved}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25 }}
                            >
                                {hoursSaved}<span className="roi-output-unit">hrs</span>
                            </motion.span>
                            <span className="roi-output-label">Time Saved</span>
                        </div>
                        <div className="roi-output">
                            <motion.span
                                className="roi-output-val accent"
                                key={revenuePotential}
                                initial={{ opacity: 0, y: 6 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.25, delay: 0.05 }}
                            >
                                ₹{revenuePotential.toLocaleString('en-IN')}
                            </motion.span>
                            <span className="roi-output-label">Revenue Potential</span>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
