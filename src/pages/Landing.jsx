import React from 'react'
import { Sparkles, CheckCircle, Globe, Play, ArrowRight, Star } from 'lucide-react'

const Landing = ({ navigate }) => {
  return (
    <div className="landing-page">
      {/* Section 1: Hero */}
      <section className="hero" style={{ 
        minHeight: '92vh', 
        background: 'radial-gradient(circle at 2px 2px, rgba(14, 27, 46, 0.08) 1px, transparent 0)',
        backgroundSize: '40px 40px',
        display: 'flex',
        alignItems: 'center',
        padding: '96px 0'
      }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center' }}>
          <div className="hero-left" style={{ flex: '0 0 55%', animation: 'fadeUp 0.6s cubic-bezier(0.22,1,0.36,1) both' }}>
            <div className="badge badge-teal" style={{ marginBottom: '24px' }}>AI-POWERED INTERVIEW PREP</div>
            <h1 style={{ marginBottom: '24px' }}>
              Land your <span className="instrument-serif italic">dream job</span> with confidence.
            </h1>
            <p style={{ fontSize: '18px', fontWeight: 300, color: 'var(--text-secondary)', marginBottom: '40px', maxWidth: '540px' }}>
              Interview Forge prepares you for every question, every format, and every round — with AI that thinks like a real recruiter.
            </p>
            
            <div className="social-proof" style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '40px' }}>
              <div className="avatar-group" style={{ display: 'flex' }}>
                {[
                  { color: '#6c63ff', role: 'SWE' },
                  { color: '#18b89a', role: 'PM' },
                  { color: '#ff6b6b', role: 'ML' }
                ].map((badge, i) => (
                  <div key={i} style={{ 
                    width: '36px', 
                    height: '36px', 
                    borderRadius: '10px', 
                    background: badge.color,
                    border: '2px solid white',
                    marginLeft: i === 0 ? '0' : '-12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px',
                    fontWeight: 700,
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}>
                    {badge.role}
                  </div>
                ))}
              </div>
              <span style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                Joined by <strong style={{ color: 'var(--navy)' }}>50,000+ candidates</strong> worldwide
              </span>
            </div>

            <div className="hero-ctas" style={{ display: 'flex', gap: '16px', marginBottom: '32px' }}>
              <button className="btn-primary" onClick={() => navigate('signup')}>
                Start Practicing Free <ArrowRight size={18} style={{ marginLeft: '8px' }} />
              </button>
              <button className="btn-ghost">
                Watch 2-min demo <Play size={16} style={{ marginLeft: '8px', fill: 'currentColor' }} />
              </button>
            </div>

            <div className="trust-signals" style={{ display: 'flex', gap: '24px' }}>
              {['No credit card', 'AI-powered feedback', '10,000+ questions'].map(text => (
                <div key={text} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', color: 'var(--text-muted)' }}>
                  <CheckCircle size={14} style={{ color: 'var(--teal)' }} /> {text}
                </div>
              ))}
            </div>
          </div>

          <div className="hero-right" style={{ flex: '0 0 45%', position: 'relative' }}>
            <div style={{ 
              position: 'absolute', 
              width: '120%', 
              height: '120%', 
              top: '-10%', 
              left: '-10%',
              background: '#e8f9f6',
              borderRadius: '40% 60% 70% 30%',
              zIndex: -1
            }} />
            <div className="card" style={{ 
              transform: 'rotate(-2deg)', 
              animation: 'float 3s ease-in-out infinite alternate',
              maxWidth: '400px',
              margin: '0 auto'
            }}>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <div className="badge badge-purple">MOCK INTERVIEW</div>
                <div className="badge badge-teal">ACTIVE</div>
              </div>
              <h3 className="instrument-serif italic" style={{ marginBottom: '16px' }}>"Tell me about a time you had to handle a difficult stakeholder..."</h3>
              <div style={{ height: '40px', background: 'var(--surface-alt)', borderRadius: '8px', marginBottom: '8px' }} />
              <div style={{ height: '40px', background: 'var(--surface-alt)', borderRadius: '8px', width: '80%' }} />
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '24px' }}>
                <button className="btn-primary" style={{ padding: '8px 16px', fontSize: '13px' }}>Get Feedback</button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Stats Bar */}
      <section className="stats-bar" style={{ background: 'var(--navy)', padding: '64px 0' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '48px', textAlign: 'center' }}>
            {[
              { label: 'Candidates prepared', value: '50,000+' },
              { label: 'Questions answered', value: '200,000+' },
              { label: 'Report more confidence', value: '94%' },
              { label: 'Average rating', value: '4.9 ★' }
            ].map(stat => (
              <div key={stat.label}>
                <div className="mono" style={{ fontSize: '52px', color: 'white', marginBottom: '8px' }}>{stat.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 3: Features Grid */}
      <section className="features" style={{ padding: '96px 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '64px' }}>
            <div className="badge badge-teal" style={{ marginBottom: '16px' }}>FEATURES</div>
            <h2>Everything you need to <span className="instrument-serif italic">crush your interview</span>.</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
            {[
              { title: 'Question Bank', desc: 'Over 10,000 role-specific questions updated daily.', icon: <Globe size={24} /> },
              { title: 'MCQ Quiz', desc: 'Test your technical knowledge with instant scoring.', icon: <CheckCircle size={24} /> },
              { title: 'Mock Interview', desc: 'Practice real-time with our recuiter-trained AI.', icon: <Sparkles size={24} /> },
              { title: 'AI Answer Coach', desc: 'Get instant feedback on your tone and content.', icon: <Sparkles size={24} /> },
              { title: 'Study Plan', desc: 'A personalized roadmap to get you ready in 5 days.', icon: <Sparkles size={24} /> },
              { title: 'Progress Tracker', desc: 'Visualize your improvement across categories.', icon: <Star size={24} /> }
            ].map((f, i) => (
              <div key={i} className="card">
                <div style={{ color: 'var(--teal)', marginBottom: '20px' }}>{f.icon}</div>
                <h3 style={{ marginBottom: '12px' }}>{f.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer Simplified for now */}
      <footer style={{ background: 'var(--navy)', color: 'white', padding: '64px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ color: 'white', marginBottom: '24px' }}>Ready to get started?</h2>
          <button className="btn-primary" onClick={() => navigate('signup')} style={{ marginBottom: '40px' }}>Create Your Free Account</button>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', overflow: 'hidden', padding: '10px 0', opacity: 0.8 }}>
             {[
               { name: 'A', role: 'SWE', color: '#6c63ff' },
               { name: 'S', role: 'PM', color: '#18b89a' },
               { name: 'K', role: 'ML', color: '#ff6b6b' },
               { name: 'E', role: 'UX', color: '#f59e0b' },
               { name: 'O', role: 'DS', color: '#6c63ff' }
             ].map((c, i) => (
               <div key={i} style={{ 
                 width: '60px', 
                 height: '70px', 
                 background: 'rgba(255,255,255,0.1)', 
                 borderRadius: '12px',
                 display: 'flex',
                 flexDirection: 'column',
                 alignItems: 'center',
                 justifyContent: 'center',
                 gap: '8px',
                 border: '1px solid rgba(255,255,255,0.1)'
               }}>
                 <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: c.color, fontSize: '12px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{c.name}</div>
                 <div style={{ fontSize: '9px', fontWeight: 600, color: 'rgba(255,255,255,0.5)' }}>{c.role}</div>
               </div>
             ))}
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Landing
