import React, { useState, useEffect } from 'react'
import { MapPin, Search, Globe, externalLink, Briefcase, Navigation, Loader2, Star, Zap, ArrowUpRight } from 'lucide-react'
import { generateInterviewContent, parseJsonFromAI } from '../../lib/ai'

const JobRadar = () => {
  const [location, setLocation] = useState(null)
  const [city, setCity] = useState('')
  const [role, setRole] = useState('')
  const [jobs, setJobs] = useState([])
  const [loading, setLoading] = useState(false)
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState(null)

  const getGeolocation = () => {
    setLocating(true)
    setError(null)
    if (!navigator.geolocation) {
      setError("Geolocation is not supported by your browser.")
      setLocating(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lng: longitude })
        
        try {
          // Reverse geocode using a free public API
          const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`)
          const data = await response.json()
          const detectedCity = data.address.city || data.address.town || data.address.village || "Current Location"
          setCity(detectedCity)
        } catch (err) {
          setCity("Detected Location")
        } finally {
          setLocating(false)
        }
      },
      (err) => {
        setError("Could not access location. Please enter your city manually.")
        setLocating(false)
      }
    )
  }

  const searchJobs = async () => {
    if (!role.trim() || !city.trim()) {
      alert("Please enter both a role and a location.")
      return
    }
    setLoading(true)
    setError(null)
    
    try {
      const prompt = `You are a high-performance job market scanner. Find real, high-probability active job and internship titles for a "${role}" in "${city}". 
      Since you are an AI, provide the 6 most relevant and high-paying roles currently trending in this region.
      
      For EACH job, you MUST provide:
      1. A realistic company name (Top tech or local leaders)
      2. The specific Job Title
      3. A salary estimate range
      4. Key required skill
      5. A direct search URL for this specific job on LinkedIn, Indeed, or Glassdoor.
      
      Return ONLY a valid JSON array:
      [
        {
          "company": "...",
          "title": "...",
          "salary": "$120k - $150k",
          "skill": "React, TypeScript",
          "platform": "LinkedIn",
          "link": "https://www.linkedin.com/jobs/search/?keywords=Software%20Engineer%20at%20Google&location=San%20Francisco"
        }
      ]`
      
      const text = await generateInterviewContent(prompt)
      const parsed = parseJsonFromAI(text)
      setJobs(parsed)
    } catch (err) {
      console.error(err)
      setError("Failed to fetch live opportunities. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '48px', textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', background: 'var(--teal-light)', color: 'var(--teal)', borderRadius: '100px', fontSize: '12px', fontWeight: 800, marginBottom: '20px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          <Navigation size={14} /> LIVE LOCATION RADAR
        </div>
        <h1 className="instrument-serif italic" style={{ fontSize: '56px', marginBottom: '16px' }}>Opportunity Radar</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px', maxWidth: '600px', margin: '0 auto' }}>
          Scan your immediate surroundings for high-impact roles and internships.
        </p>
      </header>

      <div className="card" style={{ padding: '32px', marginBottom: '48px', display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: '20px', alignItems: 'flex-end', background: 'white', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-xl)' }}>
        <div>
          <label className="input-label">Target Role</label>
          <div style={{ position: 'relative' }}>
            <Briefcase size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              value={role} 
              onChange={e => setRole(e.target.value)}
              placeholder="e.g. Frontend Developer, HR Intern" 
              className="input-field" 
              style={{ paddingLeft: '48px' }} 
            />
          </div>
        </div>
        <div>
          <label className="input-label">Location</label>
          <div style={{ position: 'relative' }}>
            <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              value={city} 
              onChange={e => setCity(e.target.value)}
              placeholder="City, State" 
              className="input-field" 
              style={{ paddingLeft: '48px', paddingRight: '120px' }} 
            />
            <button 
              onClick={getGeolocation}
              disabled={locating}
              style={{ position: 'absolute', right: '8px', top: '50%', transform: 'translateY(-50%)', background: 'var(--warm-white)', border: '1px solid var(--border-light)', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', color: 'var(--teal)' }}
            >
              {locating ? <Loader2 size={12} className="animate-spin" /> : <Navigation size={12} />}
              {locating ? 'Locating...' : 'Auto-detect'}
            </button>
          </div>
        </div>
        <button 
          className="btn-primary" 
          onClick={searchJobs} 
          disabled={loading}
          style={{ height: '48px', width: '100%', gap: '8px' }}
        >
          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
          {loading ? 'Scanning...' : 'Scan Radar'}
        </button>
      </div>

      {error && (
        <div style={{ padding: '16px', background: '#fef2f2', border: '1px solid var(--error)', borderRadius: '12px', color: 'var(--error)', marginBottom: '32px', textAlign: 'center', fontSize: '14px' }}>
          ⚠️ {error}
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
        {jobs.length > 0 ? jobs.map((job, i) => (
          <div key={i} className="card animate-fade-up" style={{ animationDelay: `${i * 0.1}s`, padding: '32px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: 0, right: 0, padding: '8px 16px', background: 'var(--teal-light)', color: 'var(--teal)', fontSize: '10px', fontWeight: 800, borderRadius: '0 0 0 12px' }}>
              {job.platform}
            </div>
            <div style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px', textTransform: 'uppercase' }}>{job.company}</div>
            <h3 style={{ fontSize: '20px', fontWeight: 800, marginBottom: '16px', lineHeight: 1.3 }}>{job.title}</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Globe size={14} style={{ color: 'var(--teal)' }} />
                <span>{job.salary}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: 'var(--text-secondary)' }}>
                <Star size={14} style={{ color: 'var(--accent-amber)' }} />
                <span>Top Skill: <strong>{job.skill}</strong></span>
              </div>
            </div>

            <a 
              href={job.link} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--navy)', textDecoration: 'none', color: 'white' }}
            >
              Apply Now <ArrowUpRight size={16} />
            </a>
          </div>
        )) : !loading && (
          <div style={{ gridColumn: 'span 3', textAlign: 'center', padding: '80px 0', opacity: 0.5 }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>📡</div>
            <h3>Radar is offline</h3>
            <p>Enter a role and location to scan for real-time opportunities near you.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default JobRadar
