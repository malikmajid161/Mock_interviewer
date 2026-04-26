import React from 'react'
import { Server, Cpu, Database, Shield, Zap, Globe, Share2, Activity, Layers, Code, GitBranch } from 'lucide-react'
import FloatingBackground from '../../components/FloatingBackground'

const SystemDesign = () => {
  const components = [
    {
      title: "The Brain (LLM Core)",
      desc: "Custom-tuned transformer models specialized in technical pedagogy and recruiter psychology.",
      tech: "GPT-4o / Claude 3.5 / Llama 3",
      icon: <Cpu size={24} />,
      color: "#6366f1"
    },
    {
      title: "Biometric HUD",
      desc: "Real-time analysis of vocal patterns, eye contact, and stress markers via WebRTC streams.",
      tech: "TensorFlow.js / MediaPipe",
      icon: <Activity size={24} />,
      color: "var(--teal)"
    },
    {
      title: "Knowledge Graph",
      desc: "A massive multi-dimensional database of 50,000+ industry-standard technical questions.",
      tech: "PostgreSQL / Vector DB",
      icon: <Database size={24} />,
      color: "var(--accent-purple)"
    },
    {
      title: "Security Shield",
      desc: "Enterprise-grade encryption for all audio/video sessions and user data persistence.",
      tech: "Supabase Auth / AES-256",
      icon: <Shield size={24} />,
      color: "var(--accent-coral)"
    }
  ]

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: 'var(--navy)', color: 'white', padding: '60px 5vw', overflow: 'hidden' }}>
      <FloatingBackground />
      
      <header style={{ textAlign: 'center', marginBottom: '80px', position: 'relative', zIndex: 1 }}>
        <div className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'var(--teal)', border: '1px solid rgba(255,255,255,0.2)', marginBottom: '20px' }}>ENGINEERING DOCS V2.0</div>
        <h1 style={{ fontSize: '56px', fontWeight: 900, marginBottom: '16px', letterSpacing: '-0.03em' }}>System <span style={{ color: 'var(--teal)' }}>Architecture</span></h1>
        <p style={{ fontSize: '20px', color: 'rgba(255,255,255,0.6)', maxWidth: '700px', margin: '0 auto' }}>
          Deep dive into the neural pathways and infrastructure that power the Interview Forge AI ecosystem.
        </p>
      </header>

      <div style={{ position: 'relative', maxWidth: '1200px', margin: '0 auto', zIndex: 1 }}>
        {/* Animated Connecting Lines (Visual Decor) */}
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '100%', height: '100%', opacity: 0.1, pointerEvents: 'none' }}>
           <svg width="100%" height="100%" viewBox="0 0 1000 600">
             <path d="M200 150 Q 500 300 800 150" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10 10">
                <animate attributeName="stroke-dashoffset" from="0" to="100" dur="5s" repeatCount="indefinite" />
             </path>
             <path d="M200 450 Q 500 300 800 450" fill="none" stroke="white" strokeWidth="2" strokeDasharray="10 10">
                <animate attributeName="stroke-dashoffset" from="100" to="0" dur="5s" repeatCount="indefinite" />
             </path>
           </svg>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '40px' }}>
          {components.map((comp, i) => (
            <div 
              key={i} 
              className="card animate-fade-up" 
              style={{ 
                animationDelay: `${i * 0.1}s`,
                background: 'rgba(255,255,255,0.03)', 
                border: '1px solid rgba(255,255,255,0.1)', 
                backdropFilter: 'blur(10px)',
                padding: '40px',
                borderRadius: '32px',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div style={{ 
                width: '64px', 
                height: '64px', 
                borderRadius: '16px', 
                background: comp.color, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center', 
                marginBottom: '24px',
                boxShadow: `0 8px 24px ${comp.color}40`
              }}>
                {comp.icon}
              </div>
              <h3 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '12px', color: 'white' }}>{comp.title}</h3>
              <p style={{ fontSize: '16px', color: 'rgba(255,255,255,0.6)', lineHeight: 1.6, marginBottom: '32px' }}>{comp.desc}</p>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Code size={14} color="var(--teal)" />
                <span style={{ fontSize: '12px', fontWeight: 800, color: 'var(--teal)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tech Stack: {comp.tech}</span>
              </div>

              {/* Decorative Corner Icon */}
              <div style={{ position: 'absolute', top: '-10px', right: '-10px', opacity: 0.05 }}>
                 <Layers size={120} />
              </div>
            </div>
          ))}
        </div>

        <div className="card animate-fade-up" style={{ marginTop: '40px', padding: '40px', background: 'linear-gradient(135deg, rgba(24,184,154,0.1), rgba(99,102,241,0.1))', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '32px', textAlign: 'center' }}>
          <h4 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px' }}>Distributed Infrastructure</h4>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', opacity: 0.6 }}>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Globe size={18} /> Edge Compute</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Zap size={18} /> {'<'} 50ms Latency</div>
             <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><GitBranch size={18} /> CI/CD Pipeline</div>
          </div>
        </div>
      </div>

      <footer style={{ marginTop: '100px', textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '12px' }}>
        SYSTEM_ID: FORGE_ALPHA_01 | SECURITY_LEVEL: ENCRYPTED | DEVELOPER: MALIK MAJID
      </footer>
    </div>
  )
}

export default SystemDesign

