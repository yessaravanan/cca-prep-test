import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useProgress } from '../lib/useProgress'
import { WEEKS } from '../lib/data'
import { ArrowLeft, ExternalLink } from 'lucide-react'

const BADGE = {
  read:'bg-blue-950/50 text-blue-400 border border-blue-900/40',
  build:'bg-yellow-950/50 text-yellow-500 border border-yellow-900/40',
  test:'bg-red-950/50 text-red-400 border border-red-900/40',
  review:'bg-green-950/50 text-green-400 border border-green-900/40',
  rest:'bg-stone-800 text-stone-500 border border-stone-700',
}

export default function WeekDetail() {
  const { weekId } = useParams()
  const week = WEEKS.find(w => w.id === parseInt(weekId))
  const { completions, toggle } = useProgress()
  const navigate = useNavigate()
  const [tab, setTab] = useState('tasks')
  const [burst, setBurst] = useState(null)

  if (!week) return <div className="p-8 text-stone-500">Week not found</div>

  const done = week.tasks.filter(t => completions.has(t.id)).length
  const pct = Math.round((done / week.tasks.length) * 100)

  const byDay = week.tasks.reduce((acc, t) => {
    const key = `Day ${t.day} · ${t.date} — ${t.label}`
    if (!acc[key]) acc[key] = []
    acc[key].push(t)
    return acc
  }, {})

  const handleToggle = (id) => {
    toggle(id)
    if (!completions.has(id)) { setBurst(id); setTimeout(() => setBurst(null), 400) }
  }

  const matGroups = week.materials.reduce((acc, m) => {
    const g = {read:'Primary Reading',course:'Courses',practice:'Practice',supplementary:'Supplementary'}[m.type]||'Primary Reading'
    if (!acc[g]) acc[g] = []
    acc[g].push(m)
    return acc
  }, {})

  return (
    <div className="flex flex-col">
      {/* Sticky header */}
      <div className="sticky top-0 lg:top-0 z-10 bg-stone-950/95 backdrop-blur border-b border-stone-800">
        <div className="px-4 lg:px-8 pt-4 pb-0">
          <button onClick={() => navigate('/plan')} className="flex items-center gap-1.5 text-stone-500 hover:text-stone-300 text-sm mb-3 transition-colors">
            <ArrowLeft size={14}/> Back to Plan
          </button>
          <div className="flex items-start justify-between gap-4 mb-3">
            <div>
              <p className="text-xs font-mono tracking-widest uppercase mb-1" style={{ color:week.color }}>Week {week.id} · {week.phaseLabel}</p>
              <h2 className="text-xl font-bold text-stone-100 leading-tight">{week.title}</h2>
              <p className="text-xs text-stone-500 mt-1">{week.dates} · {week.domain}</p>
            </div>
            <div className="text-right flex-shrink-0">
              <div className="text-3xl font-bold font-mono leading-none" style={{ color:week.color }}>{pct}%</div>
              <div className="text-xs text-stone-600 mt-0.5">{done}/{week.tasks.length}</div>
            </div>
          </div>
          <div className="h-1.5 bg-stone-800 rounded-full overflow-hidden mb-0">
            <div className="h-full rounded-full transition-all duration-500" style={{ width:`${pct}%`, background:week.color }} />
          </div>
          {/* Tabs */}
          <div className="flex mt-0 -mb-px">
            {['tasks','materials','concepts'].map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-4 py-3 text-xs font-mono uppercase tracking-wider border-b-2 transition-colors capitalize ${tab===t ? 'border-orange-500 text-orange-400' : 'border-transparent text-stone-500 hover:text-stone-300'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-4 lg:px-8 py-5 max-w-2xl">
        {/* TASKS */}
        {tab === 'tasks' && (
          <div className="space-y-5">
            {pct === 100 && (
              <div className="bg-green-950/30 border border-green-900/40 rounded-xl px-4 py-3 text-sm text-green-400">✓ Week {week.id} complete — well done</div>
            )}
            {Object.entries(byDay).map(([dayLabel, tasks]) => (
              <div key={dayLabel}>
                <div className="text-xs font-mono text-stone-600 uppercase tracking-widest mb-2 pb-1.5 border-b border-stone-800">{dayLabel}</div>
                <div className="space-y-1">
                  {tasks.map(task => {
                    const isDone = completions.has(task.id)
                    return (
                      <button key={task.id} onClick={() => handleToggle(task.id)}
                        className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all ${burst===task.id?'scale-98':'scale-100'} ${isDone?'bg-stone-900/40':'bg-stone-900 hover:bg-stone-800/60'}`}>
                        <div className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 flex items-center justify-center transition-all border ${isDone?'bg-green-500 border-green-500':'border-stone-600'}`}>
                          {isDone && <span className="text-white text-xs font-bold">✓</span>}
                        </div>
                        <div className={`flex-1 text-sm leading-relaxed ${isDone?'text-stone-600 line-through decoration-stone-700':'text-stone-200'}`}>{task.text}</div>
                        <span className={`text-xs px-2 py-0.5 rounded font-mono flex-shrink-0 ${BADGE[task.type]}`}>{task.type}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* MATERIALS */}
        {tab === 'materials' && (
          <div className="space-y-6">
            {Object.entries(matGroups).map(([group, items]) => (
              <div key={group}>
                <h3 className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-3">{group}</h3>
                <div className="space-y-2">
                  {items.map((m,i) => (
                    <a key={i} href={m.url} target="_blank" rel="noreferrer"
                      className="flex gap-3 bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-xl p-3.5 group transition-colors">
                      <span className="text-lg flex-shrink-0">{m.icon}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <div className="text-sm font-medium text-stone-200 group-hover:text-orange-400 transition-colors leading-tight">{m.title}</div>
                          {m.paid && <span className="text-xs px-1.5 py-0.5 rounded font-mono bg-amber-950/50 text-amber-500 border border-amber-900/40 flex-shrink-0">Paid</span>}
                        </div>
                        <div className="text-xs text-stone-500 mt-0.5">{m.desc}</div>
                      </div>
                      <ExternalLink size={13} className="text-stone-600 flex-shrink-0 mt-0.5 group-hover:text-orange-400 transition-colors"/>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* CONCEPTS */}
        {tab === 'concepts' && (
          <div className="space-y-4">
            {week.concepts.map((c,i) => {
              if (c.type === 'compare') return (
                <div key={i} className="bg-stone-900 border border-stone-800 rounded-xl overflow-hidden">
                  <div className="text-xs font-mono text-stone-500 uppercase tracking-widest px-4 pt-3 pb-2">{c.title}</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 divide-y sm:divide-y-0 sm:divide-x divide-stone-800">
                    <div className="p-4 bg-red-950/15"><div className="text-xs font-mono text-red-400 mb-1.5">{c.bad.label}</div><div className="text-xs text-stone-400 leading-relaxed">{c.bad.text}</div></div>
                    <div className="p-4 bg-green-950/15"><div className="text-xs font-mono text-green-400 mb-1.5">{c.good.label}</div><div className="text-xs text-stone-400 leading-relaxed">{c.good.text}</div></div>
                  </div>
                </div>
              )
              if (c.type === 'tip') return (
                <div key={i} className="bg-yellow-950/20 border border-yellow-900/40 rounded-xl p-4">
                  <div className="text-xs font-mono text-yellow-500 uppercase tracking-widest mb-2">{c.title}</div>
                  <div className="text-sm text-stone-300 leading-relaxed">{c.body}</div>
                </div>
              )
              return (
                <div key={i} className="bg-stone-900 border border-stone-800 rounded-xl p-4">
                  <div className="text-xs font-mono text-stone-500 uppercase tracking-widest mb-2">{c.title}</div>
                  <pre className="text-xs text-stone-300 leading-relaxed font-mono bg-stone-950 rounded-lg p-3 whitespace-pre-wrap">{c.body}</pre>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
