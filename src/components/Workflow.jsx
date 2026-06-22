import React, { useState } from 'react'
import Workflow3DViewer from './Workflow3DViewer'
import './Workflow.css'

export default function Workflow() {
    const [activeStep, setActiveStep] = useState(0)

    const steps = [
        {
            title: "01. Send Digital Scan",
            desc: "Export STL/PLY from your intraoral scanner to our secure cloud portal.",
            badge: null
        },
        {
            title: "02. We Design & Print",
            desc: "Our technicians design the prosthetic and route it to our industrial DLP print farm.",
            badge: null
        },
        {
            title: "03. Delivered to Clinic",
            desc: "Finished, cured, and polished prosthetic delivered locally.",
            badge: "[48H GUARANTEED]"
        }
    ]

    return (
        <section id="workflow" className="container workflow-living-section" style={{ paddingBottom: '8rem', paddingTop: '6rem' }}>
            <div className="section-header text-center" style={{ marginBottom: '4rem' }}>
                <div className="mono-label" style={{ marginBottom: '1rem', justifyContent: 'center' }}>WORKFLOW</div>
                <h2>Seamless Integration</h2>
            </div>

            <div className="workflow-living-grid glass-panel">
                {/* Left Side: Interactive Steps */}
                <div className="workflow-sidebar">
                    {steps.map((step, idx) => (
                        <div 
                            key={idx}
                            className={`workflow-step-btn ${activeStep === idx ? 'active' : ''}`}
                            onClick={() => setActiveStep(idx)}
                        >
                            <div className="step-progress-indicator">
                                <div className="step-dot"></div>
                                {idx < steps.length - 1 && <div className="step-line"></div>}
                            </div>
                            <div className="step-content">
                                {step.badge && <div className="mono-label" style={{ marginBottom: '0.25rem', color: 'var(--brand-blue)', fontSize: '0.75rem' }}>{step.badge}</div>}
                                <h3>{step.title}</h3>
                                <p>{step.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Side: The Living STL Canvas */}
                <div className="workflow-canvas-container">
                    <Workflow3DViewer url="/Upper.stl" step={activeStep} />
                    
                    {/* Status overlay */}
                    <div className="canvas-status-overlay">
                        <div className="status-dot pulsing"></div>
                        <span className="mono-label" style={{ letterSpacing: '2px' }}>
                            {activeStep === 0 && "SYSTEM_MODE: INGEST_SCAN"}
                            {activeStep === 1 && "SYSTEM_MODE: CAD_PRINT_ACTIVE"}
                            {activeStep === 2 && "SYSTEM_MODE: FINAL_QA_PASSED"}
                        </span>
                    </div>
                </div>
            </div>
        </section>
    )
}
