import { useState } from 'react'
import { toast } from 'react-hot-toast'
import useMagneticEffect from '../hooks/useMagneticEffect'
import './CtaBanner.css'

export default function CtaBanner() {
    const magneticBtnRef = useMagneticEffect(15);
    const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'success', 'error'

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('loading');
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        
        try {
            // Your Live Google Apps Script Web App URL
            const GOOGLE_SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzGyzEQlmOor2YxDv94r01UVCBSNx5EYCB9aLzHVoRtfVnZ0mV9MJAubw7QNF3lONFR/exec';
            
            // We use 'no-cors' mode because Google Apps Script doesn't always 
            // return standard CORS headers on successful form submissions.
            await fetch(GOOGLE_SCRIPT_URL, {
                method: 'POST',
                mode: 'no-cors',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });

            // Even with no-cors, if the fetch didn't throw a network error, it likely succeeded.
            setStatus('success');
            e.target.reset();

            // Simulate API call
            setTimeout(() => {
                toast.success("Request received! Our team will contact you within 2-4 hours to verify your trial requirements.");
                setStatus('idle'); // Reset status after toast
            }, 1500);
            
        } catch (error) {
            console.error('Submission error:', error);
            setStatus('error');
            setTimeout(() => setStatus('idle'), 3000);
        }
    };
    return (
        <section id="cta" className="cta-banner">
            <div className="container cta-banner-inner">
                <div className="mono-label" style={{ justifyContent: 'center', marginBottom: '1.5rem' }}>
                    [INITIATE_PROTOCOL]
                </div>
                <h2>Send Your First Case.</h2>
                <p>
                    Ready to transition your clinic to a fully digital workflow? Partner with Hesyra Labs today
                    and experience zero-compromise precision and predictable turnaround times.
                </p>
                
                <form onSubmit={handleSubmit} className="lead-capture-form" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '500px', margin: '2rem auto 0' }}>
                    <div className="cta-input-group">
                        <input 
                            type="text" 
                            name="name"
                            placeholder="Full Name *" 
                            required 
                            disabled={status === 'loading' || status === 'success'}
                            className="cta-input"
                        />
                        <input 
                            type="tel" 
                            name="phone"
                            placeholder="Phone Number *" 
                            required 
                            disabled={status === 'loading' || status === 'success'}
                            className="cta-input"
                        />
                    </div>
                    
                    <div className="cta-input-group">
                        <input 
                            type="email" 
                            name="email"
                            placeholder="Email Address *" 
                            required 
                            disabled={status === 'loading' || status === 'success'}
                            className="cta-input"
                        />
                        <input 
                            type="text" 
                            name="location"
                            placeholder="City / Location *" 
                            required 
                            disabled={status === 'loading' || status === 'success'}
                            className="cta-input"
                        />
                    </div>

                    <input 
                        type="text" 
                        name="clinic"
                        placeholder="Clinic Name (Optional)" 
                        disabled={status === 'loading' || status === 'success'}
                        className="cta-input cta-input-full"
                    />
                    
                    <button 
                        ref={magneticBtnRef}
                        type="submit" 
                        className="btn btn-brand" 
                        disabled={status === 'loading' || status === 'success'}
                        style={{ padding: '1rem 2rem', fontSize: '1rem' }}
                    >
                        <span className="btn-magnetic-inner" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                            {status === 'idle' && (
                                <>
                                    Request Starter Kit & Pricing
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ marginLeft: '0.5rem' }}>
                                        <line x1="5" y1="12" x2="19" y2="12" />
                                        <polyline points="12 5 19 12 12 19" />
                                    </svg>
                                </>
                            )}
                            {status === 'loading' && 'Sending...'}
                            {status === 'success' && 'Details Sent! ✓'}
                            {status === 'error' && 'Error. Try Again.'}
                        </span>
                    </button>
                </form>
            </div>
        </section>
    )
}
