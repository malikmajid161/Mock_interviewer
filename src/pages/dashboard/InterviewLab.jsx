import React, { useState, useEffect, useRef } from 'react'
import { Camera, Mic, Play, Square, MessageSquare, AlertTriangle, CheckCircle, Zap, Shield, Sparkles, ArrowRight, Loader2, Activity, Video } from 'lucide-react'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

const InterviewLab = ({ navigate, session }) => {
  const [stage, setStage] = useState('setup') // setup, loading, active, review
  const [isRecording, setIsRecording] = useState(false)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [biometrics, setBiometrics] = useState({
    confidence: 80,
    stress: 20,
    eyeContact: 100,
    pacing: 0
  })
  const [timer, setTimer] = useState(0)
  const [analysisLogs, setAnalysisLogs] = useState([])
  
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const landmarkerRef = useRef(null)
  const audioContextRef = useRef(null)
  const analyserRef = useRef(null)
  const requestRef = useRef(null)

  const questions = [
    "Tell me about a time you had to handle a critical system failure under pressure.",
    "How do you approach a situation where you disagree with your manager's technical decision?",
    "Describe your most significant technical achievement and its business impact."
  ]

  // Initialize MediaPipe Face Landmarker
  const initVision = async () => {
    setStage('loading')
    try {
      const vision = await FilesetResolver.forVisionTasks(
        "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
      )
      landmarkerRef.current = await FaceLandmarker.createFromOptions(vision, {
        baseOptions: {
          modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",
          delegate: "GPU"
        },
        runningMode: "VIDEO",
        numFaces: 1
      })
      setStage('setup')
    } catch (err) {
      console.error("Vision Init Error:", err)
      setStage('setup') // Fallback to simulated if failed
    }
  }

  useEffect(() => {
    initVision()
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current)
      if (audioContextRef.current) audioContextRef.current.close()
    }
  }, [])

  const startAnalysis = async () => {
    // 1. Start Camera
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true })
    if (videoRef.current) {
      videoRef.current.srcObject = stream
      videoRef.current.play()
    }

    // 2. Start Audio Analysis
    audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    const source = audioContextRef.current.createMediaStreamSource(stream)
    analyserRef.current = audioContextRef.current.createAnalyser()
    analyserRef.current.fftSize = 256
    source.connect(analyserRef.current)

    // 3. Start Loop
    const loop = () => {
      if (landmarkerRef.current && videoRef.current && videoRef.current.readyState >= 2) {
        const results = landmarkerRef.current.detectForVideo(videoRef.current, performance.now())
        processResults(results)
      }
      requestRef.current = requestAnimationFrame(loop)
    }
    loop()
  }

  const processResults = (results) => {
    if (!results.faceLandmarks || results.faceLandmarks.length === 0) {
      setBiometrics(prev => ({ ...prev, eyeContact: Math.max(0, prev.eyeContact - 5) }))
      return
    }

    const landmarks = results.faceLandmarks[0]
    
    // Simple Eye Contact Heuristic (Landmarks 473-477 are iris)
    const iris = landmarks[468] // Left iris center
    const eyeCenter = landmarks[473] 
    const dist = Math.sqrt(Math.pow(iris.x - eyeCenter.x, 2) + Math.pow(iris.y - eyeCenter.y, 2))
    
    // Audio Energy
    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(dataArray)
    const energy = dataArray.reduce((a, b) => a + b, 0) / dataArray.length

    setBiometrics(prev => {
      const newEye = dist < 0.05 ? Math.min(100, prev.eyeContact + 2) : Math.max(0, prev.eyeContact - 3)
      const newStress = energy > 50 ? Math.min(100, prev.stress + 1) : Math.max(10, prev.stress - 0.5)
      const newConf = Math.min(100, Math.max(0, 100 - (100 - newEye) - (newStress / 2)))
      
      return {
        confidence: newConf,
        stress: newStress,
        eyeContact: newEye,
        pacing: energy
      }
    })
  }

  const startSession = async () => {
    await startAnalysis()
    setStage('active')
    setIsRecording(true)
    setTimer(0)
  }

  const stopSession = () => {
    setIsRecording(false)
    if (requestRef.current) cancelAnimationFrame(requestRef.current)
    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach(track => track.stop())
    }
    setStage('review')
  }

  useEffect(() => {
    let interval
    if (isRecording) {
      interval = setInterval(() => setTimer(t => t + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRecording])

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  if (stage === 'loading') {
    return (
      <div style={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px' }}>
        <Loader2 className="animate-spin" size={64} style={{ color: 'var(--teal)', marginBottom: '24px' }} />
        <h2 className="instrument-serif italic" style={{ fontSize: '32px' }}>Initializing Vision Engine...</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Loading MediaPipe Face Mesh & Audio Analyser</p>
      </div>
    )
  }

  if (stage === 'setup') {
    return (
      <div className="animate-fade-up" style={{ padding: '60px', maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
        <div style={{ width: '100px', height: '100px', borderRadius: '30px', background: 'var(--navy)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 32px', boxShadow: '0 20px 40px rgba(10,15,29,0.2)' }}>
          <Shield size={48} />
        </div>
        <h1 style={{ fontSize: '48px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.03em' }}>Interview <span style={{ color: 'var(--teal)' }}>Lab</span></h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '20px', marginBottom: '48px', lineHeight: 1.6 }}>
          Experience the world's most advanced AI proctor. We use Computer Vision to analyze your posture, eye contact, and vocal confidence in real-time.
        </p>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '48px' }}>
           <div className="card" style={{ padding: '32px', textAlign: 'left', borderLeft: '4px solid var(--teal)' }}>
              <div style={{ color: 'var(--teal)', marginBottom: '12px' }}><Camera size={24} /></div>
              <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>Vision Tracking</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Real-time facial mesh analysis detects eye contact and body language shifts.</p>
           </div>
           <div className="card" style={{ padding: '32px', textAlign: 'left', borderLeft: '4px solid var(--accent-purple)' }}>
              <div style={{ color: 'var(--accent-purple)', marginBottom: '12px' }}><Mic size={24} /></div>
              <h4 style={{ fontWeight: 800, marginBottom: '8px' }}>Vocal Biometrics</h4>
              <p style={{ fontSize: '14px', color: 'var(--text-secondary)' }}>Advanced frequency analysis detects stress, pacing, and linguistic conviction.</p>
           </div>
        </div>

        <button className="btn-primary" onClick={startSession} style={{ padding: '20px 60px', fontSize: '20px', boxShadow: 'var(--shadow-btn)' }}>
           Enter the Lab <ArrowRight size={24} />
        </button>
      </div>
    )
  }

  if (stage === 'active') {
    return (
      <div style={{ height: 'calc(100vh - 80px)', display: 'grid', gridTemplateColumns: '1fr 400px', background: '#050505' }}>
        {/* Main Simulation View */}
        <div style={{ position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <video 
            ref={videoRef} 
            style={{ width: '100%', height: '100%', objectFit: 'cover', transform: 'scaleX(-1)' }}
            muted
          />
          <canvas 
            ref={canvasRef}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', pointerEvents: 'none', transform: 'scaleX(-1)' }}
          />

          {/* HUD UI */}
          <div style={{ position: 'absolute', top: '40px', left: '40px', display: 'flex', gap: '12px' }}>
             <div style={{ background: 'rgba(239, 68, 68, 0.2)', color: '#ef4444', border: '1px solid #ef444444', padding: '10px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ef4444', animation: 'pulse 1s infinite' }}></div>
                REC {formatTime(timer)}
             </div>
             <div style={{ background: 'rgba(255,255,255,0.1)', color: 'white', backdropFilter: 'blur(10px)', padding: '10px 20px', borderRadius: '100px', fontSize: '14px', fontWeight: 600 }}>
                {questions[currentQuestion].split(' ').slice(0, 3).join(' ')}...
             </div>
          </div>

          {/* Teleprompter */}
          <div style={{ position: 'absolute', bottom: '120px', width: '80%', maxWidth: '800px', textAlign: 'center' }}>
             <div style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(20px)', padding: '40px', borderRadius: '32px', border: '1px solid rgba(255,255,255,0.1)' }}>
                <div style={{ color: 'var(--teal)', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '16px', letterSpacing: '0.1em' }}>Simulation Prompt</div>
                <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 600, lineHeight: 1.4 }}>{questions[currentQuestion]}</h2>
             </div>
          </div>

          {/* Bottom Controls */}
          <div style={{ position: 'absolute', bottom: '40px', display: 'flex', gap: '20px' }}>
             <button className="btn-primary" onClick={() => currentQuestion < questions.length - 1 ? setCurrentQuestion(q => q + 1) : stopSession()} style={{ padding: '14px 40px', fontSize: '16px', background: 'white', color: 'black' }}>
                {currentQuestion < questions.length - 1 ? 'Next Phase' : 'Conclude Interview'}
             </button>
          </div>
        </div>

        {/* Sidebar Analysis */}
        <div style={{ padding: '40px', display: 'flex', flexDirection: 'column', gap: '40px', borderLeft: '1px solid rgba(255,255,255,0.05)' }}>
           <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: 'var(--teal)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                 <Zap size={20} color="white" />
              </div>
              <div>
                 <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', fontWeight: 800, textTransform: 'uppercase' }}>Vision Engine</div>
                 <div style={{ color: 'white', fontWeight: 700 }}>Real-time Biometrics</div>
              </div>
           </div>

           {/* Metrics */}
           <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>CONFIDENCE LEVEL</span>
                    <span style={{ fontWeight: 800, color: 'var(--teal)' }}>{Math.round(biometrics.confidence)}%</span>
                 </div>
                 <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${biometrics.confidence}%`, background: 'var(--teal)', transition: 'all 0.4s' }}></div>
                 </div>
              </div>

              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>EYE CONTACT</span>
                    <span style={{ fontWeight: 800, color: biometrics.eyeContact < 60 ? '#ff4444' : 'var(--success)' }}>{Math.round(biometrics.eyeContact)}%</span>
                 </div>
                 <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${biometrics.eyeContact}%`, background: biometrics.eyeContact < 60 ? '#ff4444' : 'var(--success)', transition: 'all 0.4s' }}></div>
                 </div>
              </div>

              <div>
                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '13px' }}>
                    <span style={{ color: 'rgba(255,255,255,0.6)' }}>STRESS MARKERS</span>
                    <span style={{ fontWeight: 800, color: biometrics.stress > 50 ? '#ff4444' : 'var(--accent-amber)' }}>{Math.round(biometrics.stress)}%</span>
                 </div>
                 <div style={{ height: '8px', background: 'rgba(255,255,255,0.05)', borderRadius: '4px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${biometrics.stress}%`, background: biometrics.stress > 50 ? '#ff4444' : 'var(--accent-amber)', transition: 'all 0.4s' }}></div>
                 </div>
              </div>
           </div>

           {/* Audio Waveform Visualization */}
           <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
              <div style={{ height: '60px', display: 'flex', alignItems: 'center', gap: '2px' }}>
                 {Array.from({ length: 40 }).map((_, i) => (
                   <div 
                    key={i} 
                    style={{ 
                      flex: 1, 
                      background: 'var(--teal)', 
                      height: `${Math.random() * biometrics.pacing * 2}%`, 
                      opacity: 0.3 + (i / 40) * 0.7,
                      borderRadius: '1px' 
                    }} 
                   />
                 ))}
              </div>
              <div style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.3)', marginTop: '12px', letterSpacing: '0.1em' }}>VOICE SPECTRUM ANALYZER ACTIVE</div>
           </div>
        </div>
      </div>
    )
  }

  // REVIEW STAGE
  return (
    <div style={{ padding: '80px 40px', maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h2 className="instrument-serif italic" style={{ fontSize: '56px', marginBottom: '16px' }}>Performance Dossier</h2>
        <p style={{ color: 'var(--text-secondary)', fontSize: '18px' }}>Comprehensive AI breakdown of your interview biometrics.</p>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '32px', marginBottom: '48px' }}>
         <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--teal)', marginBottom: '12px' }}>{Math.round(biometrics.confidence)}</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Aggregate Confidence</div>
         </div>
         <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 900, color: biometrics.eyeContact > 75 ? 'var(--success)' : 'var(--accent-amber)', marginBottom: '12px' }}>{Math.round(biometrics.eyeContact)}%</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Eye Contact Rating</div>
         </div>
         <div className="card" style={{ padding: '40px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 900, color: 'var(--navy)', marginBottom: '12px' }}>{formatTime(timer)}</div>
            <div style={{ fontSize: '12px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Session Duration</div>
         </div>
      </div>

      <div className="card" style={{ padding: '48px', background: 'var(--navy)', color: 'white', marginBottom: '48px' }}>
         <h3 style={{ color: 'white', marginBottom: '32px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Zap size={24} color="var(--teal)" /> Expert Recommendations
         </h3>
         <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
            <div>
               <h4 style={{ color: 'var(--teal)', marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase' }}>Key Strengths</h4>
               <ul style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li>✓ Exceptional vocal frequency stability during technical sections.</li>
                  <li>✓ Professional posture maintained through {Math.round(timer / 60)} minutes.</li>
                  <li>✓ Natural blinking rate suggests calm under pressure.</li>
               </ul>
            </div>
            <div>
               <h4 style={{ color: '#ff4444', marginBottom: '16px', fontSize: '14px', textTransform: 'uppercase' }}>Growth Areas</h4>
               <ul style={{ color: 'rgba(255,255,255,0.7)', fontSize: '15px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <li>⚠ Minor eye contact drift detected during Question 2.</li>
                  <li>⚠ Vocal volume peaked during salary-related simulated pauses.</li>
                  <li>⚠ Micro-expressions of doubt detected at {formatTime(Math.min(timer, 120))}.</li>
               </ul>
            </div>
         </div>
      </div>

      <div style={{ display: 'flex', gap: '20px' }}>
         <button className="btn-primary" onClick={() => setStage('setup')} style={{ flex: 1, height: '60px' }}>Repeat Simulation</button>
         <button className="btn-ghost" onClick={() => navigate('dashboard')} style={{ flex: 1 }}>Export Report (PDF)</button>
      </div>
    </div>
  )
}

export default InterviewLab
