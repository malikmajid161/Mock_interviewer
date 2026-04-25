import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import Landing from './pages/Landing'
import SignUp from './pages/SignUp'
import SignIn from './pages/SignIn'
import Verify from './pages/Verify'
import Profile from './pages/Profile'
import Dashboard from './pages/Dashboard'

function App() {
  const [currentView, setCurrentView] = useState(() => {
    const hash = window.location.hash.replace('#', '')
    return hash || 'landing'
  })
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        setCurrentView('dashboard')
      } else {
        const hash = window.location.hash.replace('#', '')
        if (hash) setCurrentView(hash)
      }
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        setCurrentView('dashboard')
      } else if (currentView === 'dashboard') {
        setCurrentView('landing')
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const navigate = (view) => {
    setCurrentView(view)
    window.location.hash = view
    window.scrollTo(0, 0)
  }

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--warm-white)',
        color: 'var(--teal)',
        fontFamily: 'DM Sans'
      }}>
        <div className="mono">Loading Interview Forge...</div>
      </div>
    )
  }

  const renderView = () => {
    switch (currentView) {
      case 'landing': return <Landing navigate={navigate} />
      case 'signup': return <SignUp navigate={navigate} />
      case 'signin': return <SignIn navigate={navigate} />
      case 'verify': return <Verify navigate={navigate} />
      case 'profile': return <Profile navigate={navigate} />
      case 'dashboard': return <Dashboard navigate={navigate} session={session} />
      default: return <Landing navigate={navigate} />
    }
  }

  return (
    <div className="app-container">
      {renderView()}
    </div>
  )
}

export default App
