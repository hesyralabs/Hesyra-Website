import { Link } from 'react-router-dom'

export default function NotFound() {
    return (
        <main className="container" style={{ minHeight: '80vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
            <div className="mono-label" style={{ color: '#FF3366', border: '1px solid rgba(255,51,102,0.3)', background: 'rgba(255,51,102,0.1)', padding: '0.5rem 1rem', borderRadius: '100px', marginBottom: '2rem' }}>
                ERROR 404
            </div>
            
            <h1 style={{ fontSize: 'clamp(3rem, 6vw, 5rem)', marginBottom: '1rem', letterSpacing: '-0.03em' }}>
                Scan Data <span style={{ background: 'linear-gradient(135deg, #FF3366 0%, #FF9933 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Corrupted.</span>
            </h1>
            
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '600px', margin: '0 auto 3rem', lineHeight: '1.6' }}>
                We couldn't locate the 3D model or page you are looking for. It might have been moved or deleted from our secure portal.
            </p>

            <Link to="/" className="btn btn-brand" style={{ display: 'inline-flex', padding: '1rem 2rem', fontSize: '1.1rem' }}>
                Return to Clinic Portal
            </Link>
        </main>
    )
}
