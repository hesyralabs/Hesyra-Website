import { useEffect, useState } from 'react'
import { linkGoogleEmail } from '../utils/analytics'
import './GoogleOneTap.css'

const BACKEND = 'http://localhost:3001'
// 🔑 Replace with your real Google Client ID from Google Cloud Console
const GOOGLE_CLIENT_ID = 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com'

export default function GoogleOneTap() {
  const [user, setUser] = useState(null)

  useEffect(() => {
    // Don't show if already signed in this session
    const saved = sessionStorage.getItem('hesyra_google_user')
    if (saved) {
      setUser(JSON.parse(saved))
      return
    }

    // Load Google Identity Services SDK
    const script = document.createElement('script')
    script.src = 'https://accounts.google.com/gsi/client'
    script.async = true
    script.defer = true
    script.onload = initOneTap
    document.head.appendChild(script)

    return () => {
      // Cleanup: cancel the prompt if component unmounts
      window.google?.accounts.id.cancel()
    }
  }, [])

  function initOneTap() {
    if (!window.google || GOOGLE_CLIENT_ID.startsWith('YOUR_')) return

    window.google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleCredential,
      auto_select: false,
      cancel_on_tap_outside: true,
      context: 'signin',
      itp_support: true,
    })

    // Show the One Tap prompt (native Google UI, top-right)
    window.google.accounts.id.prompt((notification) => {
      if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
        // User dismissed or browser blocked — silently skip
        console.debug('Google One Tap not shown:', notification.getNotDisplayedReason?.() ?? notification.getSkippedReason?.())
      }
    })
  }

  async function handleCredential(response) {
    try {
      // Decode the JWT from Google (no library needed — just base64 decode the payload)
      const payload = JSON.parse(atob(response.credential.split('.')[1]))
      const { email, name, picture: photo_url, sub: google_sub } = payload

      const userData = { email, name, photo_url, google_sub }

      // Save to session so prompt doesn't re-appear this tab
      sessionStorage.setItem('hesyra_google_user', JSON.stringify(userData))
      setUser(userData)

      // Link to analytics session for heat scoring
      linkGoogleEmail(email)

      // Send lead to backend (fire-and-forget)
      fetch(`${BACKEND}/api/lead`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
      }).catch(() => {})

    } catch (err) {
      console.error('Google One Tap decode error:', err)
    }
  }

  if (!user) return null

  return (
    <div className="got-welcome">
      <img src={user.photo_url} alt={user.name} className="got-avatar" />
      <div className="got-info">
        <span className="got-name">Welcome, {user.name.split(' ')[0]}</span>
        <span className="got-email">{user.email}</span>
      </div>
    </div>
  )
}
