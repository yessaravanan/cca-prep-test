import { useNavigate } from 'react-router-dom'
import { useProgress } from '../lib/useProgress'
import { getUser } from '../lib/storage'
import { WEEKS, DOMAINS } from '../lib/data'
import ProgressRing from '../components/ProgressRing'
import { ChevronRight, BookOpen, Brain } from 'lucide-react'

export default function Home() {
  const { pct, done, total, weekProgress, domainProgress, weeksComplete, streak } = useProgress()
  const user = getUser()
  const navigate = useNavigate()

  const examDate = user?.examDate ? new Date(user.examDate) : new Date('2026-05-30')
  const daysLeft = Math.max(0, Math.ceil((examDate - new Date()) / 86400000))
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  const currentWeek = WEEKS.find(w => {
    const wp = weekProgress.find(p => p.weekId === w.id)
    return wp && wp.pct < 100
  }) || WEEKS[5]
  const cwp = weekProgress.find(p => p.weekId === currentWeek.id)

  return (
    <div className="px-4 lg:px-8 pt-6 pb-4 space-y-6">
      {/* Greeting */}
      <div>
        <p className="text-xs font-mono text-stone-500 tracking-widest uppercase mb-1">{greeting}</p>
        <h1 className="text-2xl font-bold text-stone-100">{user?.name || 'Learner'} 👋</h1>
      </div>

      {/* Stats grid — 3 cols on md+, 1 row on mobile */}
      <div className="grid grid-cols-3 gap-3 lg:gap-4">
        {[
          { label:'Overall', value:`${pct}%`, sub:`${done}/${total} tasks`, color:'text-orange-400' },
          { label:'Streak', value:`${streak}🔥`, sub:'day streak', color:'text-amber-400' },
          { label:'Exam in', value:daysLeft, sub:'days', color: daysLeft < 7 ? 'text-red-400' : 'text-stone-100' },
        ].map(s => (
          <div key={s.label} className="bg-stone-900 border border-stone-800 rounded-2xl p-4">
            <div className={`text-2xl font-bold font-mono ${s.color}`}>{s.value}</div>
            <div className="text-xs text-stone-500 mt-1">{s.label}</div>
            <div className="text-xs text-stone-600">{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Main content — 2 cols on lg */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Progress ring + domain bars */}
        <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5">
          <div className="flex items-center gap-5 mb-5">
            <ProgressRing pct={pct} size={88} stroke={7} color="#C8421A" />
            <div>
              <div className="text-sm font-bold text-stone-100 mb-0.5">9-Week Plan</div>
              <div className="text-xs text-stone-500">Apr 19 – May 30, 2026</div>
              <div className="text-xs text-stone-600 mt-1">{weeksComplete}/{WEEKS.length} weeks complete</div>
            </div>
          </div>
          <div className="space-y-2.5">
            {DOMAINS.map(d => {
              const dp = domainProgress[d.id] || { pct:0 }
              return (
                <div key={d.id} className="flex items-center gap-3">
                  <div className="text-xs font-mono text-stone-600 w-6 flex-shrink-0">{d.id}</div>
                  <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-500" style={{ width:`${dp.pct}%`, background:d.color }} />
                  </div>
                  <div className="text-xs font-mono text-stone-500 w-8 text-right">{dp.pct}%</div>
                  <div className="text-xs text-stone-700 w-7">{d.weight}%</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Current week + quick actions */}
        <div className="space-y-4">
          {/* Current week */}
          <button onClick={() => navigate(`/plan/week/${currentWeek.id}`)}
            className="w-full text-left bg-stone-900 border border-stone-800 hover:border-orange-700/40 rounded-2xl p-5 transition-colors group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color: currentWeek.color }}>Current Week</div>
                <div className="font-bold text-stone-100 leading-tight">{currentWeek.title}</div>
                <div className="text-xs text-stone-500 mt-1">{currentWeek.dates}</div>
              </div>
              <ChevronRight size={16} className="text-stone-600 group-hover:text-orange-500 transition-colors mt-1 flex-shrink-0" />
            </div>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-stone-800 rounded-full overflow-hidden">
                <div className="h-full rounded-full transition-all" style={{ width:`${cwp?.pct||0}%`, background:currentWeek.color }} />
              </div>
              <span className="text-xs font-mono text-stone-500">{cwp?.done}/{cwp?.total}</span>
            </div>
          </button>

          {/* Quick actions */}
          <div className="grid grid-cols-2 gap-3">
            <button onClick={() => navigate('/plan')}
              className="bg-orange-600/10 border border-orange-600/20 hover:border-orange-600/40 rounded-2xl p-4 text-left transition-colors">
              <BookOpen size={20} className="text-orange-400 mb-2" />
              <div className="text-sm font-bold text-stone-100">Study Plan</div>
              <div className="text-xs text-stone-500">All {WEEKS.length} weeks</div>
            </button>
            <button onClick={() => navigate('/quiz')}
              className="bg-blue-600/10 border border-blue-600/20 hover:border-blue-600/40 rounded-2xl p-4 text-left transition-colors">
              <Brain size={20} className="text-blue-400 mb-2" />
              <div className="text-sm font-bold text-stone-100">Take Quiz</div>
              <div className="text-xs text-stone-500">Test yourself</div>
            </button>
          </div>
        </div>
      </div>

      {/* Week overview list */}
      <div>
        <h2 className="text-xs font-mono text-stone-500 tracking-widest uppercase mb-3">All Weeks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {WEEKS.map(w => {
            const wp = weekProgress.find(p => p.weekId === w.id)
            const isDone = wp?.pct === 100
            return (
              <button key={w.id} onClick={() => navigate(`/plan/week/${w.id}`)}
                className={`text-left rounded-xl border p-3.5 transition-colors ${isDone ? 'bg-green-950/20 border-green-900/40' : 'bg-stone-900 border-stone-800 hover:border-stone-700'}`}>
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                    style={{ background:`${w.color}20`, color:w.color, border:`1px solid ${w.color}30` }}>
                    {isDone ? '✓' : w.id}
                  </div>
                  <div className="text-sm font-medium text-stone-200 truncate">{w.title}</div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-stone-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width:`${wp?.pct||0}%`, background:isDone?'#22c55e':w.color }} />
                  </div>
                  <span className="text-xs font-mono text-stone-600">{wp?.done}/{wp?.total}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
