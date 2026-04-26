import React, { useState, useEffect, useRef } from 'react'
import { Sparkles, CheckCircle, Globe, Play, ArrowRight, Star, Target, Users, DollarSign, Activity, Zap, ShieldCheck, Menu, X } from 'lucide-react'
import logo from '../assets/logo.png'
import FloatingBackground from '../components/FloatingBackground'

const Landing = ({ navigate, session }) => {
  const revealRefs = useRef([])
  revealRefs.current = []

  const addToRefs = (el) => {
    if (el && !revealRefs.current.includes(el)) {
      revealRefs.current.push(el)
    }
  }

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768)
    window.addEventListener('resize', handleResize)
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active')
        }
      })
    }, { threshold: 0.1 })

    revealRefs.current.forEach(el => observer.observe(el))
    return () => {
      window.removeEventListener('resize', handleResize)
      observer.disconnect()
    }
  }, [])

  const handleGetStarted = () => {
    navigate('dashboard')
  }

  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  return (
    <div style={{ background: 'var(--warm-white)', overflowX: 'hidden', position: 'relative' }}>
      <FloatingBackground />
      {/* Navigation */}
      <nav style={{ 
        height: '80px', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        padding: '0 5vw',
        background: 'rgba(255, 255, 255, 0.8)',
        backdropFilter: 'blur(12px)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        borderBottom: '1px solid var(--border-light)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }} onClick={() => navigate('landing')}>
          <img src={logo} alt="Logo" style={{ width: '36px', height: '36px', borderRadius: '10px' }} />
          <span style={{ fontSize: '20px', fontWeight: 800, color: 'var(--navy)', letterSpacing: '-0.02em' }}>Interview Forge</span>
        </div>
        
        <div style={{ display: 'flex', gap: isMobile ? '12px' : '32px', alignItems: 'center' }}>
          {!isMobile && (
            <div style={{ display: 'flex', gap: '24px' }} className="nav-links">
              {['Features', 'Testimonials', 'Pricing'].map(link => (
                <span 
                  key={link} 
                  onClick={() => scrollToSection(link.toLowerCase())}
                  style={{ fontSize: '14px', fontWeight: 600, color: 'var(--text-secondary)', cursor: 'pointer', transition: 'color 0.2s' }}
                  onMouseEnter={e => e.target.style.color = 'var(--teal)'}
                  onMouseLeave={e => e.target.style.color = 'var(--text-secondary)'}
                >
                  {link}
                </span>
              ))}
            </div>
          )}
          {!isMobile && <div style={{ width: '1px', height: '24px', background: 'var(--border-light)' }}></div>}
          {!session ? (
            !isMobile && <button onClick={() => navigate('signin')} style={{ background: 'none', border: 'none', fontSize: '14px', fontWeight: 600, color: 'var(--text-primary)', cursor: 'pointer' }}>Sign In</button>
          ) : (
            <div onClick={() => navigate('dashboard')} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--teal), #0891b2)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>
                {session.user.email?.[0].toUpperCase()}
              </div>
            </div>
          )}
          <button className="btn-primary" onClick={handleGetStarted} style={{ padding: isMobile ? '8px 16px' : '10px 24px', fontSize: isMobile ? '12px' : '14px' }}>
            {session ? (isMobile ? 'Dashboard' : 'Go to Dashboard') : (isMobile ? 'Start' : 'Get Started Free')}
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section style={{ padding: isMobile ? '80px 5vw' : '120px 5vw', display: 'flex', alignItems: 'center', minHeight: '85vh', background: 'radial-gradient(circle at 100% 0%, rgba(6, 182, 212, 0.05) 0%, transparent 40%)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1.2fr 1fr', gap: isMobile ? '40px' : '80px', alignItems: 'center' }}>
          <div className="animate-fade-up">
            <div className="badge badge-teal" style={{ marginBottom: '24px', background: 'rgba(6, 182, 212, 0.1)', color: 'var(--teal)' }}>
              <Sparkles size={14} /> AI-POWERED PERFORMANCE
            </div>
            <h1 style={{ marginBottom: '24px', fontSize: isMobile ? '42px' : '72px', letterSpacing: '-0.04em', lineHeight: 1.1 }}>
              Master your <span style={{ color: 'var(--teal)' }}>interviews</span> with precision.
            </h1>
            <p style={{ fontSize: isMobile ? '18px' : '20px', color: 'var(--text-secondary)', marginBottom: '40px', lineHeight: 1.6, maxWidth: '600px' }}>
              The elite preparation platform for engineers. AI biometrics, real-time stress tracking, and industry-grade question banks.
            </p>
            <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '48px' }}>
              <button className="btn-primary" onClick={handleGetStarted} style={{ padding: '18px 40px', fontSize: '16px', gap: '12px' }}>
                Start Practice <ArrowRight size={20} />
              </button>
              <button className="btn-ghost" style={{ padding: '18px 40px', fontSize: '16px', gap: '12px', background: 'white' }}>
                <Play size={18} /> Watch Demo
              </button>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: isMobile ? '20px' : '40px', opacity: 0.8 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>50k+</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Candidates</div>
              </div>
              <div style={{ width: '1px', height: '40px', background: 'var(--border-light)' }}></div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <div style={{ fontSize: '24px', fontWeight: 800 }}>98%</div>
                <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase' }}>Success Rate</div>
              </div>
            </div>
          </div>

          {!isMobile && (
            <div className="animate-fade-up" style={{ position: 'relative', animationDelay: '0.2s' }}>
              <div style={{ background: 'var(--navy)', borderRadius: '32px', padding: '40px', boxShadow: 'var(--shadow-2xl)', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
                  {[1,2,3].map(i => <div key={i} style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }}></div>)}
                </div>
                <div style={{ color: 'var(--teal)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px' }}>AI Biometric Scan</div>
                <div style={{ height: '200px', display: 'flex', alignItems: 'flex-end', gap: '8px', marginBottom: '24px' }}>
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div key={i} className="waveform-bar" style={{ flex: 1, background: 'var(--teal)', height: `${30 + Math.random() * 70}%`, opacity: 0.3 + (i/15)*0.7, borderRadius: '4px' }}></div>
                  ))}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'white', fontSize: '14px' }}>
                  <span>Stress Markers: <span style={{ color: 'var(--teal)' }}>Low</span></span>
                  <span>Confidence: <span style={{ color: 'var(--teal)' }}>94%</span></span>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Unique Features Section */}
      <section id="features" style={{ padding: '100px 5vw', background: 'white' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div ref={addToRefs} className="reveal" style={{ textAlign: 'center', marginBottom: '80px' }}>
            <div className="badge badge-purple" style={{ marginBottom: '16px' }}>THE FORGE ADVANTAGE</div>
            <h2 style={{ fontSize: '48px', marginBottom: '20px' }}>Engineered for the <span style={{ color: 'var(--accent-purple)' }}>modern candidate</span>.</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto', fontSize: '18px' }}>
              Traditional mock interviews are static. We've built dynamic AI tools that adapt to your growth.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { icon: <Target />, title: 'Job DNA', desc: 'Sync your interview precisely to any job description URL or text.', color: '#06b6d4' },
              { icon: <DollarSign />, title: 'Salary Dojo', desc: 'Practice high-stakes negotiation with AI that pushes back.', color: '#10b981' },
              { icon: <Users />, title: 'Panel Pressure', desc: 'Face three AI panelists simultaneously, each with a different persona.', color: '#f59e0b' },
              { icon: <Activity />, title: 'Pattern X-Ray', desc: 'Identify recurring weaknesses across weeks of practice sessions.', color: '#8b5cf6' },
              { icon: <Zap />, title: 'Chaos Mode', desc: 'Train for the unexpected with interruptions and curveball questions.', color: '#ef4444' },
              { icon: <Sparkles />, title: 'Answer Evolution', desc: 'Iteratively refine your stories with AI-guided rewrite challenges.', color: '#ec4899' },
            ].map((feature, i) => (
              <div key={i} ref={addToRefs} className="card reveal" style={{ transitionDelay: `${i * 0.1}s` }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: `${feature.color}15`, color: feature.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '24px' }}>
                  {React.cloneElement(feature.icon, { size: 24 })}
                </div>
                <h3 style={{ fontSize: '20px', marginBottom: '12px' }}>{feature.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '15px', lineHeight: 1.6 }}>{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section 2: Stats Bar & Ticker */}
      <section className="stats-bar" style={{ background: 'var(--navy)', padding: '0' }}>
        <div className="ticker-container" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
          <div className="ticker-content" style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
            {[
              "FAANG RECRUITERS TRUST US • ",
              "AI-POWERED FEEDBACK • ",
              "OVER 50,000 CANDIDATES HIRED • ",
              "98% SUCCESS RATE • ",
              "REAL-TIME CONFIDENCE ANALYSIS • ",
              "THE FUTURE OF INTERVIEWING • ",
              "FAANG RECRUITERS TRUST US • ",
              "AI-POWERED FEEDBACK • ",
              "OVER 50,000 CANDIDATES HIRED • ",
              "98% SUCCESS RATE • ",
              "REAL-TIME CONFIDENCE ANALYSIS • ",
              "THE FUTURE OF INTERVIEWING • "
            ].join("")}
          </div>
        </div>
        <div className="container" style={{ padding: '64px 0' }}>
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

      {/* Testimonials Section */}
      <section id="testimonials" style={{ padding: '100px 5vw', background: 'white', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div ref={addToRefs} className="reveal" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '42px', marginBottom: '16px' }}>Wall of <span style={{ color: 'var(--teal)' }}>Love</span></h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>From candidates who cracked FAANG and top-tier startups.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px' }}>
            {[
              { name: 'Sarah J.', role: 'L5 @ Google', quote: 'The Salary Dojo was the differentiator. I negotiated a 20% higher sign-on bonus using the AI tactics.', avatar: 'SJ' },
              { name: 'Michael R.', role: 'Senior Dev @ Meta', quote: 'Chaos Mode prepared me for the actual technical pressure. The AI doesn\'t hold back.', avatar: 'MR' },
              { name: 'Anita K.', role: 'Lead PM @ Stripe', quote: 'The Answer Evolution tool helped me refine my STAR stories until they were flawless.', avatar: 'AK' }
            ].map((t, i) => (
              <div key={i} className="card" style={{ padding: '32px', position: 'relative' }}>
                <div style={{ display: 'flex', gap: '4px', marginBottom: '16px', color: '#fbbf24' }}>
                  {[1,2,3,4,5].map(s => <Star key={s} size={14} fill="currentColor" />)}
                </div>
                <p style={{ fontSize: '15px', color: 'var(--text-primary)', lineHeight: 1.6, marginBottom: '24px', fontStyle: 'italic' }}>"{t.quote}"</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: '12px', color: 'var(--teal)' }}>{t.avatar}</div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 700 }}>{t.name}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" style={{ padding: '100px 5vw', background: 'var(--surface-alt)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div ref={addToRefs} className="reveal" style={{ textAlign: 'center', marginBottom: '64px' }}>
            <h2 style={{ fontSize: '42px', marginBottom: '16px' }}>Ready to <span style={{ color: 'var(--accent-purple)' }}>Level Up</span>?</h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Simple, transparent pricing for career-changing results.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px', maxWidth: '900px', margin: '0 auto' }}>
            <div className="card" style={{ padding: '48px', borderTop: '4px solid var(--border-light)' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--text-muted)', marginBottom: '8px', textTransform: 'uppercase' }}>Basic</div>
              <div style={{ fontSize: '48px', fontWeight: 800, marginBottom: '24px' }}>Free<span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 400 }}>/forever</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <li>✓ 5 AI Mock Interviews / mo</li>
                <li>✓ Basic AI Feedback</li>
                <li>✓ Community Support</li>
              </ul>
              <button className="btn-ghost" onClick={handleGetStarted} style={{ width: '100%' }}>Choose Basic</button>
            </div>
            <div className="card" style={{ padding: '48px', borderTop: '4px solid var(--teal)', boxShadow: '0 20px 40px rgba(6,182,212,0.1)' }}>
              <div style={{ fontSize: '14px', fontWeight: 800, color: 'var(--teal)', marginBottom: '8px', textTransform: 'uppercase' }}>Pro</div>
              <div style={{ fontSize: '48px', fontWeight: 800, marginBottom: '24px' }}>$29<span style={{ fontSize: '16px', color: 'var(--text-muted)', fontWeight: 400 }}>/mo</span></div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 32px', display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px' }}>
                <li>✓ Unlimited Mock Interviews</li>
                <li>✓ Advanced Biometric Analysis</li>
                <li>✓ Chaos Mode & Salary Dojo</li>
                <li>✓ Priority AI Support</li>
              </ul>
              <button className="btn-primary" onClick={handleGetStarted} style={{ width: '100%' }}>Choose Pro</button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section style={{ padding: '100px 5vw', background: 'var(--surface-alt)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '100px', alignItems: 'center' }}>
          <div ref={addToRefs} className="reveal">
            <h2 style={{ marginBottom: '32px' }}>Your data is <span style={{ color: 'var(--success)' }}>safe</span> with us.</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              {[
                { icon: <ShieldCheck />, title: 'End-to-End Encryption', desc: 'Your interview recordings and notes are for your eyes only.' },
                { icon: <Activity />, title: 'Persistent Progress', desc: 'Cloud-synced profiles ensure your history is never lost.' },
                { icon: <CheckCircle />, title: 'GDPR Compliant', desc: 'We follow global standards for data privacy and security.' }
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{ color: 'var(--success)', flexShrink: 0 }}>{item.icon}</div>
                  <div>
                    <div style={{ fontWeight: 700, marginBottom: '4px' }}>{item.title}</div>
                    <div style={{ color: 'var(--text-secondary)', fontSize: '14px' }}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div ref={addToRefs} className="reveal animate-float">
            <div className="glass-card" style={{ padding: '40px', background: 'white' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}><CheckCircle size={20} /></div>
                <div style={{ fontWeight: 700 }}>Data Persisted Successfully</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div style={{ height: '8px', background: 'var(--surface-alt)', borderRadius: '100px', width: '100%' }}></div>
                <div style={{ height: '8px', background: 'var(--surface-alt)', borderRadius: '100px', width: '80%' }}></div>
                <div style={{ height: '8px', background: 'var(--surface-alt)', borderRadius: '100px', width: '90%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section style={{ padding: '120px 5vw', background: 'var(--navy)', color: 'white', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'radial-gradient(circle at 50% 50%, rgba(6, 182, 212, 0.1) 0%, transparent 70%)', zIndex: 0 }}></div>
        <div style={{ position: 'relative', zIndex: 1 }} ref={addToRefs} className="reveal">
          <h2 style={{ color: 'white', fontSize: '56px', marginBottom: '32px' }}>Ready to get hired?</h2>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '20px', marginBottom: '48px', maxWidth: '600px', margin: '0 auto 48px' }}>
            Join 50,000+ professionals who have transformed their careers with Interview Forge.
          </p>
          <button className="btn-primary" onClick={handleGetStarted} style={{ padding: '20px 48px', fontSize: '18px' }}>
            Get Started For Free <ArrowRight size={24} />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ padding: '80px 5vw', background: 'white', borderTop: '1px solid var(--border-light)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: '60px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '24px' }}>
              <img src={logo} alt="Logo" style={{ width: '28px', height: '28px', borderRadius: '8px' }} />
              <span style={{ fontSize: '18px', fontWeight: 800 }}>Interview Forge</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '14px', lineHeight: 1.6 }}>
              The world's most advanced AI interview preparation platform. Engineering careers, one simulation at a time.
            </p>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '20px', textTransform: 'uppercase' }}>Platform</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <span>Job DNA</span>
              <span>Salary Dojo</span>
              <span>Mock Interviews</span>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '20px', textTransform: 'uppercase' }}>Company</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', fontSize: '14px', color: 'var(--text-secondary)' }}>
              <span>About Us</span>
              <span>Careers</span>
              <span>Contact</span>
            </div>
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '14px', marginBottom: '20px', textTransform: 'uppercase' }}>Social</div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>𝕏</div>
              <div style={{ width: '32px', height: '32px', borderRadius: '8px', background: 'var(--surface-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>in</div>
            </div>
          </div>
        </div>
        <div style={{ maxWidth: '1200px', margin: '64px auto 0', paddingTop: '32px', borderTop: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', color: 'var(--text-muted)' }}>
          <span>© 2026 Interview Forge. All rights reserved.</span>
          <span style={{ fontWeight: 600, color: 'var(--navy)' }}>Designed By Malik Majid</span>
        </div>
      </footer>
    </div>
  )
}

export default Landing
