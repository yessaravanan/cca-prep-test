import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { QUIZ_QUESTIONS, DOMAINS } from '../lib/data'
import { saveQuizResult } from '../lib/storage'
import { X } from 'lucide-react'

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length-1; i > 0; i--) { const j = Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]] }
  return a
}

export default function QuizActive() {
  const navigate = useNavigate()
  const config = JSON.parse(sessionStorage.getItem('cca_quiz_config')||'{}')
  const allQ = config.domain ? QUIZ_QUESTIONS.filter(q=>q.domain===config.domain) : QUIZ_QUESTIONS
  const [questions] = useState(()=>shuffle(allQ))
  const timeLimit = config.type==='mock' ? 6000 : Math.min(questions.length*120, 1200)
  const [timeLeft, setTimeLeft] = useState(timeLimit)
  const [current, setCurrent] = useState(0)
  const [selected, setSelected] = useState(null)
  const [answered, setAnswered] = useState(false)
  const [answers, setAnswers] = useState([])
  const answersRef = useRef([])   // always-current ref for timer callback
  const timerRef = useRef(null)

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => { if(t<=1){clearInterval(timerRef.current);doSubmit(answersRef.current);return 0} return t-1 })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [])

  const doSubmit = (ans) => {
    clearInterval(timerRef.current)
    const score = ans.filter(a=>a.correct).length
    const domainScores = {}
    ans.forEach(a => {
      if(!domainScores[a.domain]) domainScores[a.domain]={correct:0,total:0}
      domainScores[a.domain].total++
      if(a.correct) domainScores[a.domain].correct++
    })
    const result = { type:config.type, domain:config.domain, score, total:ans.length,
      pct:ans.length?Math.round(score/ans.length*100):0, domainScores, answers:ans, takenAt:Date.now() }
    saveQuizResult(result)
    sessionStorage.setItem('cca_quiz_result', JSON.stringify(result))
    navigate('/quiz/results')
  }

  const handleSelect = (idx) => { if(answered) return; setSelected(idx); setAnswered(true) }

  const handleNext = () => {
    const q = questions[current]
    const newAns = [...answers, {questionId:q.id,domain:q.domain,selected,correct:selected===q.correct,explanation:q.explanation}]
    answersRef.current = newAns   // keep ref current before any state update
    setAnswers(newAns)
    if(current+1>=questions.length) doSubmit(newAns)
    else { setCurrent(c=>c+1); setSelected(null); setAnswered(false) }
  }

  if(!questions.length) return <div className="p-8 text-stone-500">No questions found for this selection.</div>

  const q = questions[current]
  const mins = Math.floor(timeLeft/60)
  const secs = timeLeft%60
  const timePct = timeLeft/timeLimit*100
  const timeColor = timePct>50?'text-green-400':timePct>20?'text-amber-400':'text-red-400'

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col max-w-2xl mx-auto">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-stone-950/95 backdrop-blur border-b border-stone-800 px-4 lg:px-8 py-3">
        <div className="flex items-center justify-between mb-2">
          <button onClick={()=>navigate('/quiz')} className="text-stone-500 hover:text-stone-300 transition-colors"><X size={20}/></button>
          <span className="text-xs font-mono text-stone-500">{current+1} / {questions.length}</span>
          <span className={`text-sm font-mono font-bold ${timeColor}`}>⏱ {mins}:{secs.toString().padStart(2,'0')}</span>
        </div>
        <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
          <div className="h-full bg-orange-600 rounded-full transition-all" style={{ width:`${(current/questions.length)*100}%` }}/>
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 overflow-y-auto px-4 lg:px-8 py-6">
        <div className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-mono mb-4"
          style={{ background:`${DOMAINS.find(d=>d.id===q.domain)?.color||'#C8421A'}20`, color:DOMAINS.find(d=>d.id===q.domain)?.color||'#C8421A', border:`1px solid ${DOMAINS.find(d=>d.id===q.domain)?.color||'#C8421A'}30` }}>
          {q.domain} — {DOMAINS.find(d=>d.id===q.domain)?.label}
        </div>
        <h2 className="text-base lg:text-lg font-bold text-stone-100 leading-relaxed mb-6">{q.question}</h2>

        <div className="space-y-3">
          {q.options.map((opt,idx) => {
            let cls = 'bg-stone-900 border-stone-800 text-stone-200'
            if(answered) {
              if(idx===q.correct) cls='bg-green-950/40 border-green-700 text-green-300'
              else if(idx===selected&&selected!==q.correct) cls='bg-red-950/40 border-red-700 text-red-300'
              else cls='bg-stone-900/50 border-stone-800 text-stone-600'
            } else if(selected===idx) cls='bg-orange-950/30 border-orange-700 text-orange-200'
            return (
              <button key={idx} onClick={()=>handleSelect(idx)}
                className={`w-full text-left flex gap-3 p-4 rounded-xl border transition-all ${cls} ${!answered?'hover:border-stone-600 cursor-pointer':'cursor-default'}`}>
                <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-xs flex-shrink-0 mt-0.5 font-mono">{String.fromCharCode(65+idx)}</span>
                <span className="text-sm leading-relaxed">{opt}</span>
              </button>
            )
          })}
        </div>

        {answered && (
          <div className="mt-4 bg-stone-900 border border-stone-700 rounded-xl p-4">
            <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-1.5">Explanation</div>
            <div className="text-sm text-stone-300 leading-relaxed">{q.explanation}</div>
          </div>
        )}
      </div>

      {answered && (
        <div className="px-4 lg:px-8 pb-6 pt-2 border-t border-stone-800">
          <button onClick={handleNext} className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl text-sm transition-colors">
            {current+1>=questions.length ? 'See Results' : 'Next Question →'}
          </button>
        </div>
      )}
    </div>
  )
}
