import { useNavigate } from 'react-router-dom'
import { useProgress } from '../lib/useProgress'
import { WEEKS } from '../lib/data'
import { ChevronRight, CheckCircle2 } from 'lucide-react'
const PHASE_LABELS = { 0:'Prerequisites', 1:'Phase 1 · Foundations', 2:'Phase 2 · Applied Knowledge', 3:'Phase 3 · Exam Prep' }
export default function StudyPlan() {
  const { weekProgress } = useProgress()
  const navigate = useNavigate()
  let lastPhase = null
  return (
    <div className="px-4 lg:px-8 pt-6 pb-4">
      <div className="mb-6"><p className="text-xs font-mono text-stone-500 tracking-widest uppercase mb-1">9-Week Program</p><h1 className="text-2xl font-bold text-stone-100">Study Plan</h1><p className="text-sm text-stone-500 mt-1">Apr 19 – May 30 · Exam: May 30, 2026</p></div>
      <div className="space-y-3 max-w-2xl">
        {WEEKS.map(w => {
          const wp = weekProgress.find(p=>p.weekId===w.id)||{done:0,total:w.tasks.length,pct:0}
          const isDone=wp.pct===100
          const showPhase=w.phase!==lastPhase; lastPhase=w.phase
          return (<div key={w.id}>
            {showPhase&&(<div className="flex items-center gap-3 mt-5 mb-2 first:mt-0"><div className="h-px flex-1 bg-stone-800"/><span className="text-xs font-mono text-stone-600 uppercase tracking-widest whitespace-nowrap">{PHASE_LABELS[w.phase]}</span><div className="h-px flex-1 bg-stone-800"/></div>)}
            <button onClick={()=>navigate(`/plan/week/${w.id}`)} className={`w-full text-left rounded-2xl border p-4 transition-all ${isDone?'bg-green-950/15 border-green-900/40':'bg-stone-900 border-stone-800 hover:border-stone-700'}`}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0" style={{background:`${w.color}15`,color:w.color,border:`1px solid ${w.color}30`}}>{isDone?<CheckCircle2 size={18} className="text-green-400"/>:`W${w.id}`}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2"><div><div className="font-bold text-stone-100 text-sm leading-tight">{w.title}</div><div className="text-xs text-stone-500 mt-0.5">{w.dates} · {w.domain}</div></div><ChevronRight size={15} className="text-stone-600 flex-shrink-0 mt-0.5"/></div>
                  <div className="flex items-center gap-2 mt-3"><div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden"><div className="h-full rounded-full transition-all duration-500" style={{width:`${wp.pct}%`,background:isDone?'#22c55e':w.color}}/></div><span className="text-xs font-mono text-stone-500">{wp.done}/{wp.total}</span></div>
                </div>
              </div>
            </button>
          </div>)
        })}
      </div>
    </div>
  )
}
