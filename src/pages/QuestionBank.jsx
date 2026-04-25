import { Search, Filter, Bookmark, ChevronRight, MessageSquare, Sparkles } from 'lucide-react'
import { generateInterviewContent } from '../lib/gemini'

const QuestionBank = ({ navigate }) => {
  const [activeCategory, setActiveCategory] = useState('All')
  const [aiLoading, setAiLoading] = useState(false)

  const handleAiGenerate = async () => {
    setAiLoading(true)
    const prompt = `Generate 5 professional interview questions for a ${activeCategory} role. Return as a clean list.`
    const result = await generateInterviewContent(prompt)
    alert(result || "AI generation failed. Check console.")
    setAiLoading(false)
  }

  const categories = ['All', 'Technical', 'Behavioral', 'System Design', 'HR', 'Product']
  
  const questions = [
    { id: 1, title: 'How do you handle conflict in a team?', category: 'Behavioral', difficulty: 'Easy', time: '5m' },
    { id: 2, title: 'Explain the difference between process and thread.', category: 'Technical', difficulty: 'Medium', time: '8m' },
    { id: 3, title: 'Design a URL shortening service like Bitly.', category: 'System Design', difficulty: 'Hard', time: '15m' },
    { id: 4, title: 'Tell me about a time you failed.', category: 'Behavioral', difficulty: 'Medium', time: '10m' },
    { id: 5, title: 'What is your favorite product and how would you improve it?', category: 'Product', difficulty: 'Medium', time: '12m' },
    { id: 6, title: 'How does Garbage Collection work in Java/Python?', category: 'Technical', difficulty: 'Hard', time: '10m' },
  ]

  const filteredQuestions = activeCategory === 'All' 
    ? questions 
    : questions.filter(q => q.category === activeCategory)

  return (
    <div className="page-container" style={{ padding: '48px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
        <div>
          <h1 className="instrument-serif italic" style={{ fontSize: '48px', marginBottom: '12px' }}>Question Bank</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Master 2,000+ hand-picked interview questions from top companies.</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button 
            className="btn-primary" 
            onClick={handleAiGenerate} 
            disabled={aiLoading}
            style={{ padding: '12px 20px', gap: '8px', background: 'linear-gradient(135deg, var(--teal), var(--accent-purple))' }}
          >
            <Sparkles size={18} /> {aiLoading ? 'Generating...' : 'AI Generate'}
          </button>
          <div className="search-bar" style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input 
              type="text" 
              placeholder="Search questions..." 
              style={{ 
                padding: '12px 16px 12px 48px', 
                borderRadius: '12px', 
                border: '1.5px solid var(--border-light)',
                width: '300px',
                fontSize: '14px'
              }}
            />
          </div>
          <button className="btn-ghost" style={{ padding: '12px 16px' }}><Filter size={18} /></button>
        </div>
      </header>

      <div className="category-tabs" style={{ display: 'flex', gap: '12px', marginBottom: '32px', overflowX: 'auto', paddingBottom: '8px' }}>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{ 
              padding: '8px 20px', 
              borderRadius: '100px', 
              border: activeCategory === cat ? '1px solid var(--teal)' : '1px solid var(--border-light)',
              background: activeCategory === cat ? 'var(--teal-light)' : 'white',
              color: activeCategory === cat ? 'var(--teal)' : 'var(--text-secondary)',
              fontSize: '14px',
              fontWeight: 500,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="questions-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '24px' }}>
        {filteredQuestions.map(q => (
          <div key={q.id} className="card" style={{ padding: '24px', cursor: 'pointer' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span className={`badge ${
                q.difficulty === 'Easy' ? 'badge-teal' : q.difficulty === 'Medium' ? 'badge-amber' : 'badge-purple'
              }`}>
                {q.difficulty}
              </span>
              <Bookmark size={18} style={{ color: 'var(--text-hint)', cursor: 'pointer' }} />
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', lineHeight: 1.4 }}>{q.title}</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '20px', borderTop: '1px solid var(--border-light)' }}>
              <div style={{ display: 'flex', gap: '12px', color: 'var(--text-muted)', fontSize: '13px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><MessageSquare size={14} /> {q.category}</span>
                <span>•</span>
                <span>{q.time} prep</span>
              </div>
              <ChevronRight size={18} style={{ color: 'var(--text-hint)' }} />
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '64px', textAlign: 'center' }}>
        <button className="btn-primary" style={{ padding: '16px 32px' }}>Load More Questions</button>
      </div>
    </div>
  )
}

export default QuestionBank
