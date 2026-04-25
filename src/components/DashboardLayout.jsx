import React from 'react'
import { LayoutDashboard, BookOpen, CheckSquare, MessageSquare, Calendar, BarChart3, Settings, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'

const DashboardLayout = ({ children, navigate, activeView, session }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('landing')
  }

  const email = session?.user?.email || ''
  const username = email.split('@')[0] || 'User'
  const initials = username.slice(0, 2).toUpperCase()

  const navItems = [
    { name: 'Dashboard',    id: 'dashboard',     icon: <LayoutDashboard size={20} /> },
    { name: 'Question Bank',id: 'question-bank',  icon: <BookOpen size={20} /> },
    { name: 'MCQ Quiz',     id: 'mcq-quiz',       icon: <CheckSquare size={20} /> },
    { name: 'Mock Interview',id: 'mock-interview', icon: <MessageSquare size={20} /> },
    { name: 'Study Plan',   id: 'study-plan',     icon: <Calendar size={20} /> },
    { name: 'Progress',     id: 'progress',       icon: <BarChart3 size={20} /> },
    { name: 'Settings',     id: 'settings',       icon: <Settings size={20} /> },
  ]

  return (
    <div className="dashboard-layout" style={{ display: 'flex', height: '100vh', background: 'var(--warm-white)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'var(--navy)', color: 'white', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>

        {/* Logo */}
        <div style={{ padding: '28px 24px 20px', fontSize: '20px', fontWeight: 700, color: 'white', borderBottom: '1px solid rgba(255,255,255,0.07)', letterSpacing: '-0.3px' }}>
          Interview Forge
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '16px 12px', overflowY: 'auto' }}>
          {navItems.map(item => {
            const active = activeView === item.id
            return (
              <div key={item.id}
                onClick={() => navigate(item.id)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  marginBottom: '2px',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  background: active ? 'rgba(24,184,154,0.18)' : 'transparent',
                  border: active ? '1px solid rgba(24,184,154,0.3)' : '1px solid transparent',
                  color: active ? 'var(--teal)' : 'rgba(255,255,255,0.55)',
                  transition: 'all 0.2s ease'
                }}
              >
                <span style={{ display: 'flex', flexShrink: 0 }}>{item.icon}</span>
                <span style={{ fontSize: '14px', fontWeight: active ? 600 : 400 }}>{item.name}</span>
              </div>
            )
          })}
        </nav>

        {/* User Profile Strip */}
        <div style={{ padding: '16px', borderTop: '1px solid rgba(255,255,255,0.07)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {/* Avatar */}
          <div style={{
            width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
            background: 'linear-gradient(135deg, var(--teal), var(--accent-purple))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontWeight: 700, fontSize: '14px', letterSpacing: '0.5px'
          }}>
            {initials}
          </div>
          <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '14px', fontWeight: 600, color: 'white', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{username}</div>
            <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{email}</div>
          </div>
          <button onClick={handleSignOut} title="Sign Out" style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', padding: '4px', borderRadius: '8px', display: 'flex' }}>
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
