import React, { useState, useEffect } from 'react'
import { BarChart3, TrendingUp, Award, Target, Loader2, BookOpen, CheckSquare, MessageSquare } from 'lucide-react'
import { supabase } from '../lib/supabase'

const Progress = ({ session }) => {
  const [stats, setStats] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) fetchProgress()
  }, [session])

  const fetchProgress = async () => {
    try {
      const uid = session.user.id

      // All sessions
      const { data: sessions } = await supabase
        .from('sessions').select('*').eq('user_id', uid).order('created_at', { ascending: false })

      // MCQ attempts
      const { data: mcq } = await supabase
        .from('mcq_attempts').select('*').eq('user_id', uid).order('created_at', { ascending: false })

      const totalQ = sessions?.reduce((s, x) => s + (x.questions_practiced || 0), 0) || 0
      const avgMcq = mcq?.length ? Math.round(mcq.reduce((s, x) => s + x.score_percentage, 0) / mcq.length) : 0
      const mockCount = sessions?.filter(s => s.session_type === 'mock_interview').length || 0

      setStats({ totalQ, avgMcq, mockCount, totalSessions: sessions?.length || 0, mcqAttempts: mcq?.length || 0 })
      setHistory(sessions || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <div style={{ height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={48} style={{ color: 'var(--teal)', animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )

  const typeIcon = { question_bank: <BookOpen size={16} />, mcq: <CheckSquare size={16} />, mock_interview: <MessageSquare size={16} /> }
  const typeLabel = { question_bank: 'Question Bank', mcq: 'MCQ Quiz', mock_interview: 'Mock Interview' }

  return (
    <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
      <header style={{ marginBottom: '48px' }}>
        <h1 className="instrument-serif italic" style={{ fontSize: '48px', marginBottom: '12px' }}>Your Progress</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Track your interview preparation journey over time.</p>
      </header>

      {/* Stat cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '48px' }}>
        {[
          { label: 'Questions Practiced', value: stats?.totalQ, icon: <BookOpen size={24} />, color: 'var(--teal)' },
          { label: 'Avg MCQ Score', value: `${stats?.avgMcq}%`, icon: <Target size={24} />, color: 'var(--accent-purple)' },
          { label: 'Mock Sessions', value: stats?.mockCount, icon: <MessageSquare size={24} />, color: 'var(--accent-amber)' },
          { label: 'Total Sessions', value: stats?.totalSessions, icon: <TrendingUp size={24} />, color: 'var(--accent-coral)' },
        ].map((s, i) => (
          <div key={i} className="card" style={{ textAlign: 'center', padding: '28px 20px' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '16px', background: s.color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', color: s.color }}>{s.icon}</div>
            <div style={{ fontSize: '36px', fontWeight: 700, color: 'var(--navy)', marginBottom: '4px' }}>{s.value ?? 0}</div>
            <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Activity history */}
      <div className="card" style={{ padding: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
          <h3>Session History</h3>
          <span className="badge badge-navy">{history.length} sessions</span>
        </div>

        {history.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 0', color: 'var(--text-muted)' }}>
            <BarChart3 size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <p>No sessions yet. Complete a quiz or question bank session to see your progress here.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {history.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '16px 20px', borderRadius: '14px', background: 'var(--warm-white)', border: '1px solid var(--border-light)' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '12px', background: 'var(--teal-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--teal)' }}>
                  {typeIcon[item.session_type] || <BookOpen size={16} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 600 }}>{item.role}</div>
                  <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{typeLabel[item.session_type] || item.session_type}</div>
                </div>
                {item.score !== null && item.total && (
                  <div style={{ textAlign: 'right', marginRight: '16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--teal)' }}>{Math.round((item.score / item.total) * 100)}%</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{item.score}/{item.total}</div>
                  </div>
                )}
                {item.questions_practiced > 0 && !item.score && (
                  <div style={{ textAlign: 'right', marginRight: '16px' }}>
                    <div style={{ fontWeight: 700, color: 'var(--navy)' }}>{item.questions_practiced}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>questions</div>
                  </div>
                )}
                <div style={{ fontSize: '12px', color: 'var(--text-hint)' }}>
                  {new Date(item.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default Progress
