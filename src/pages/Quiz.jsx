// Quiz.jsx
import { useNavigate } from 'react-router-dom'
import { DOMAINS, QUIZ_QUESTIONS } from '../lib/data'
import { getQuizHistory } from '../lib/storage'
import { Brain, Clock, Target } from 'lucide-react'

export default function Quiz() {
  const navigate = useNavigate()
  const history = getQuizHistory()

  const start = (type, domain = null) => {
    sessionStorage.setItem('cca_quiz_config', JSON.stringify({ type, domain, startedAt: Date.now() }))
    navigate('/quiz/active')
  }

  return (
    <div className="px-4 lg:px-8 pt-6 pb-4 max-w-2xl">
      <div className="mb-6">
        <p className="text-xs font-mono text-stone-500 tracking-widest uppercase mb-1">Test Yourself</p>
        <h1 className="text-2xl font-bold text-stone-100">Quiz Engine</h1>
        <p className="text-sm text-stone-500 mt-1">{QUIZ_QUESTIONS.length} CCA-specific questions across all 5 domains</p>
      </div>

      {/* Mock exam */}
      <div className="bg-orange-950/15 border border-orange-900/30 rounded-2xl p-5 mb-5">
        <div className="flex items-center gap-2 mb-1">
          <Target size={15} className="text-orange-400"/>
          <span className="text-xs font-mono text-orange-400 uppercase tracking-wider">Full Mock Exam</span>
        </div>
        <h3 className="font-bold text-stone-100 mb-1">All Domains</h3>
        <div className="flex gap-4 text-xs text-stone-500 mb-4">
          <span className="flex items-center gap-1"><Clock size={11}/> 100 min</span>
          <span>{QUIZ_QUESTIONS.length} questions</span>
          <span>All 5 domains</span>
        </div>
        <button onClick={() => start('mock')}
          className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-sm transition-colors">
          Start Mock Exam
        </button>
      </div>

      {/* Topic quizzes */}
      <h2 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-3">Topic Quizzes</h2>
      <div className="space-y-2 mb-6">
        {DOMAINS.map(d => {
          const count = QUIZ_QUESTIONS.filter(q => q.domain === d.id).length
          if (!count) return null
          return (
            <button key={d.id} onClick={() => start('topic', d.id)}
              className="w-full flex items-center gap-3 bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-xl p-3.5 text-left transition-colors">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                style={{ background:`${d.color}20`, color:d.color, border:`1px solid ${d.color}30` }}>{d.id}</div>
              <div className="flex-1">
                <div className="text-sm font-medium text-stone-200">{d.label}</div>
                <div className="text-xs text-stone-600">{count} questions · ~{count*2} min · {d.weight}% of exam</div>
              </div>
              <Brain size={14} className="text-stone-600"/>
            </button>
          )
        })}
      </div>

      {/* History */}
      {history.length > 0 && (
        <>
          <h2 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-3">Recent Attempts</h2>
          <div className="space-y-2">
            {history.slice(0,5).map((a,i) => (
              <div key={i} className="flex items-center justify-between bg-stone-900 border border-stone-800 rounded-xl px-4 py-3">
                <div>
                  <div className="text-sm text-stone-200">{a.type==='mock'?'Full Mock':`${a.domain} Topic Quiz`}</div>
                  <div className="text-xs text-stone-600">{new Date(a.takenAt).toLocaleDateString()}</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold font-mono" style={{ color:a.pct>=70?'#22c55e':'#C8421A' }}>{a.pct}%</div>
                  <div className="text-xs text-stone-600">{a.score}/{a.total}</div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
