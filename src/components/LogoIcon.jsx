export default function LogoIcon({ size = 32, className = '' }) {
    return (
        <img
            src="/logo.png"
            alt="Hesyra Labs"
            width={size}
            height={size}
            className={className}
            style={{ filter: 'var(--logo-filter)', objectFit: 'contain' }}
        />
    )
}
