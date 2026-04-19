import { useProgress } from '../lib/useProgress'
import { getUser, getQuizHistory } from '../lib/storage'
import { WEEKS, DOMAINS } from '../lib/data'
import ProgressRing from '../components/ProgressRing'

export default function Progress() {
  const { pct, done, total, weekProgress, domainProgress, weeksComplete, streak } = useProgress()
  const user = getUser()
  const history = getQuizHistory()
  const examDate = user?.examDate ? new Date(user.examDate) : new Date('2026-05-30')
  const daysLeft = Math.max(0, Math.ceil((examDate - new Date()) / 86400000))

  return (
    <div className="px-4 lg:px-8 pt-6 pb-4 max-w-2xl space-y-5">
      <div>
        <p className="text-xs font-mono text-stone-500 tracking-widest uppercase mb-1">Your Progress</p>
        <h1 className="text-2xl font-bold text-stone-100">Dashboard</h1>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
        <div className="flex items-center gap-5">
          <ProgressRing pct={pct} size={90} stroke={7} color="#C8421A"/>
          <div className="grid grid-cols-2 gap-x-8 gap-y-3 flex-1">
            {[
              {label:'Tasks Done',value:`${done}/${total}`},
              {label:'Weeks Done',value:`${weeksComplete}/6`},
              {label:'Day Streak',value:`${streak}🔥`,color:'text-orange-400'},
              {label:'Exam In',value:`${daysLeft}d`,color:daysLeft<7?'text-red-400':'text-stone-100'},
            ].map(s=>(
              <div key={s.label}>
                <div className={`text-xl font-bold font-mono ${s.color||'text-stone-100'}`}>{s.value}</div>
                <div className="text-xs text-stone-600">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
        <h2 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-4">Domain Coverage</h2>
        <div className="space-y-4">
          {DOMAINS.map(d=>{
            const dp=domainProgress[d.id]||{pct:0,done:0,total:0}
            return (
              <div key={d.id}>
                <div className="flex justify-between items-baseline mb-1.5">
                  <div>
                    <span className="text-sm font-medium text-stone-200">{d.label}</span>
                    <span className="text-xs text-stone-600 ml-2">{d.weight}% of exam</span>
                  </div>
                  <span className="text-sm font-mono" style={{color:d.color}}>{dp.pct}%</span>
                </div>
                <div className="h-2.5 bg-stone-800 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all duration-700" style={{width:`${dp.pct}%`,background:d.color}}/>
                </div>
                <div className="text-xs text-stone-600 mt-1">{dp.done}/{dp.total} tasks</div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
        <h2 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-3">Week Progress</h2>
        <div className="space-y-3">
          {WEEKS.map(w=>{
            const wp=weekProgress.find(p=>p.weekId===w.id)||{done:0,total:w.tasks.length,pct:0}
            return (
              <div key={w.id} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded flex-shrink-0 flex items-center justify-center text-xs font-bold"
                  style={{background:`${w.color}20`,color:w.color}}>
                  {wp.pct===100?'✓':w.id}
                </div>
                <div className="flex-1">
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-stone-400 truncate pr-2">{w.title}</span>
                    <span className="font-mono text-stone-600 flex-shrink-0">{wp.done}/{wp.total}</span>
                  </div>
                  <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{width:`${wp.pct}%`,background:wp.pct===100?'#22c55e':w.color}}/>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {history.length>0 && (
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
          <h2 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-3">Quiz History</h2>
          <div className="space-y-2">
            {history.slice(0,8).map((a,i)=>(
              <div key={i} className="flex items-center justify-between py-2 border-b border-stone-800 last:border-0">
                <div>
                  <div className="text-sm text-stone-300">{a.type==='mock'?'Full Mock':`${a.domain} Quiz`}</div>
                  <div className="text-xs text-stone-600">{new Date(a.takenAt).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</div>
                </div>
                <div className="text-right">
                  <div className="text-base font-bold font-mono" style={{color:a.pct>=70?'#22c55e':'#C8421A'}}>{a.pct}%</div>
                  <div className="text-xs text-stone-600">{a.score}/{a.total}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
