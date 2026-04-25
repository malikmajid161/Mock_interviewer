import React from 'react'
import { LayoutDashboard, BookOpen, CheckSquare, MessageSquare, Calendar, BarChart3, Settings, LogOut } from 'lucide-react'
import { supabase } from '../lib/supabase'

const DashboardLayout = ({ children, navigate, activeView }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut()
    navigate('landing')
  }

  const navItems = [
    { name: 'Dashboard', id: 'dashboard', icon: <LayoutDashboard size={20} /> },
    { name: 'Question Bank', id: 'question-bank', icon: <BookOpen size={20} /> },
    { name: 'MCQ Quiz', id: 'mcq-quiz', icon: <CheckSquare size={20} /> },
    { name: 'Mock Interview', id: 'mock-interview', icon: <MessageSquare size={20} /> },
    { name: 'Study Plan', id: 'study-plan', icon: <Calendar size={20} /> },
    { name: 'Progress', id: 'progress', icon: <BarChart3 size={20} /> },
    { name: 'Settings', id: 'settings', icon: <Settings size={20} /> },
  ]

  return (
    <div className="dashboard-layout" style={{ display: 'flex', height: '100vh', background: 'var(--warm-white)' }}>
      {/* Sidebar */}
      <aside style={{ width: '260px', background: 'var(--navy)', color: 'white', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div style={{ padding: '32px', fontSize: '22px', fontWeight: 600, color: 'white' }}>Interview Forge</div>
        
        <nav style={{ flex: 1, padding: '0 16px' }}>
          {navItems.map(item => (
            <div key={item.id} 
              onClick={() => navigate(item.id)}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '12px', 
                padding: '12px 16px', 
                marginBottom: '4px',
                borderRadius: '12px',
                cursor: 'pointer',
                background: activeView === item.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                borderLeft: activeView === item.id ? '3px solid var(--teal)' : '3px solid transparent',
                color: activeView === item.id ? 'white' : 'rgba(255,255,255,0.6)',
                transition: 'all 0.2s ease'
              }}
            >
              {item.icon}
              <span style={{ fontSize: '14px', fontWeight: activeView === item.id ? 600 : 400 }}>{item.name}</span>
            </div>
          ))}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <button onClick={handleSignOut} style={{ 
            width: '100%', 
            padding: '12px', 
            background: 'transparent', 
            border: 'none', 
            color: 'rgba(255,255,255,0.6)', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            cursor: 'pointer',
            fontSize: '14px'
          }}>
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, overflowY: 'auto', position: 'relative' }}>
        {children}
      </main>
    </div>
  )
}

export default DashboardLayout
