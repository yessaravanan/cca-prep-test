import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { QUIZ_QUESTIONS, DOMAINS } from '../lib/data'
import { saveQuizResult } from '../lib/storage'
import ProgressRing from '../components/ProgressRing'
import { X, RotateCcw, Home } from 'lucide-react'

export default function QuizResults() {
  const navigate = useNavigate()
  const result = JSON.parse(sessionStorage.getItem('cca_quiz_result')||'null')

  if(!result) return (
    <div className="p-8 text-center">
      <div className="text-stone-500 mb-4">No result found</div>
      <button onClick={()=>navigate('/quiz')} className="text-orange-400 hover:text-orange-300 transition-colors">Back to Quiz</button>
    </div>
  )

  const grade = result.pct>=90?'Excellent':result.pct>=70?'Passing':'Needs Work'
  const gradeColor = result.pct>=90?'#22c55e':result.pct>=70?'#f59e0b':'#ef4444'
  const weak = Object.entries(result.domainScores||{}).filter(([,ds])=>Math.round(ds.correct/ds.total*100)<70)

  return (
    <div className="px-4 lg:px-8 pt-6 pb-6 max-w-2xl space-y-5">
      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 text-center">
        <div className="flex justify-center mb-3"><ProgressRing pct={result.pct} size={100} stroke={7} color={gradeColor}/></div>
        <div className="text-lg font-bold text-stone-100 mb-1">{grade}</div>
        <div className="text-sm text-stone-500">{result.score} / {result.total} correct</div>
        <div className="mt-3 inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-full"
          style={{background:`${gradeColor}15`,color:gradeColor,border:`1px solid ${gradeColor}30`}}>
          {result.type==='mock'?'Full Mock Exam':`${result.domain} Topic Quiz`}
        </div>
      </div>

      {Object.keys(result.domainScores||{}).length>0 && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
          <h3 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-3">Domain Breakdown</h3>
          <div className="space-y-3">
            {DOMAINS.filter(d=>result.domainScores?.[d.id]).map(d=>{
              const ds=result.domainScores[d.id]
              const dp=Math.round(ds.correct/ds.total*100)
              return (
                <div key={d.id}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-400">{d.label}</span>
                    <span className="font-mono text-stone-500">{ds.correct}/{ds.total} · {dp}%</span>
                  </div>
                  <div className="h-2 bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{width:`${dp}%`,background:dp>=70?'#22c55e':dp>=50?'#f59e0b':'#ef4444'}}/>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {weak.length>0 && (
        <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-4">
          <h3 className="text-xs font-mono text-red-400 uppercase tracking-widest mb-2">Areas to Review</h3>
          {weak.map(([domain])=>{
            const d=DOMAINS.find(x=>x.id===domain)
            return <div key={domain} className="text-sm text-stone-300 mb-1">→ {d?.label}: Re-read domain page + redo build exercise</div>
          })}
        </div>
      )}

      <div>
        <h3 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-3">Question Review</h3>
        <div className="space-y-2">
          {result.answers.map((a,i)=>(
            <div key={i} className={`rounded-xl border p-3.5 ${a.correct?'bg-green-950/15 border-green-900/40':'bg-red-950/15 border-red-900/40'}`}>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-xs">{a.correct?'✓':'✗'}</span>
                <span className="text-xs font-mono text-stone-500">{a.domain} · Q{i+1}</span>
              </div>
              <div className="text-xs text-stone-400 leading-relaxed">{a.explanation}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={()=>{sessionStorage.removeItem('cca_quiz_result');navigate('/quiz')}}
          className="flex items-center justify-center gap-2 bg-stone-900 border border-stone-800 hover:border-stone-700 text-stone-300 font-bold py-3 rounded-xl text-sm transition-colors">
          <RotateCcw size={14}/> Retake
        </button>
        <button onClick={()=>{sessionStorage.removeItem('cca_quiz_result');navigate('/')}}
          className="flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl text-sm transition-colors">
          <Home size={14}/> Home
        </button>
      </div>
    </div>
  )
}
