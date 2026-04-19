import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getUser, saveUser, resetProgress, exportData } from '../lib/storage'

export default function Settings() {
  const user = getUser()
  const [name, setName] = useState(user?.name||'')
  const [examDate, setExamDate] = useState(user?.examDate||'2026-05-30')
  const [resetInput, setResetInput] = useState('')
  const [saved, setSaved] = useState(false)
  const navigate = useNavigate()

  const save = () => {
    saveUser({name:name.trim()||'Learner',examDate})
    setSaved(true); setTimeout(()=>setSaved(false),2000)
  }

  const doReset = () => {
    if(resetInput!=='RESET') return
    resetProgress()
    navigate('/',{replace:true})
  }

  return (
    <div className="px-4 lg:px-8 pt-6 pb-4 max-w-xl space-y-6">
      <div>
        <p className="text-xs font-mono text-stone-500 tracking-widest uppercase mb-1">Preferences</p>
        <h1 className="text-2xl font-bold text-stone-100">Settings</h1>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-4">
        <h2 className="text-sm font-bold text-stone-200">Profile</h2>
        <div>
          <label className="block text-xs font-mono text-stone-500 uppercase tracking-widest mb-1.5">Display Name</label>
          <input type="text" value={name} onChange={e=>setName(e.target.value)}
            onKeyDown={e=>e.key==='Enter'&&save()}
            className="w-full bg-stone-800 border border-stone-700 focus:border-orange-600 rounded-xl px-4 py-3 text-stone-100 text-sm outline-none transition-colors"/>
        </div>
        <div>
          <label className="block text-xs font-mono text-stone-500 uppercase tracking-widest mb-1.5">Exam Target Date</label>
          <input type="date" value={examDate} onChange={e=>setExamDate(e.target.value)} min="2026-04-20"
            className="w-full bg-stone-800 border border-stone-700 focus:border-orange-600 rounded-xl px-4 py-3 text-stone-100 text-sm outline-none transition-colors"/>
        </div>
        <button onClick={save}
          className={`w-full font-bold py-3 rounded-xl text-sm transition-colors ${saved?'bg-green-600 text-white':'bg-orange-600 hover:bg-orange-500 text-white'}`}>
          {saved?'✓ Saved':'Save Changes'}
        </button>
      </div>

      <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-stone-200">Data</h2>
        <p className="text-xs text-stone-500">All progress is stored locally in your browser. Export a backup anytime.</p>
        <button onClick={exportData}
          className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold py-3 rounded-xl text-sm transition-colors">
          Export Progress as JSON
        </button>
      </div>

      <div className="bg-red-950/20 border border-red-900/40 rounded-2xl p-5 space-y-3">
        <h2 className="text-sm font-bold text-red-400">Reset Progress</h2>
        <p className="text-xs text-stone-400">Clears all task completions, quiz history, and streak data. Your name and exam date are kept. Cannot be undone.</p>
        <div>
          <label className="block text-xs font-mono text-stone-500 uppercase tracking-widest mb-1.5">Type RESET to confirm</label>
          <input type="text" value={resetInput} onChange={e=>setResetInput(e.target.value)} placeholder="RESET"
            className="w-full bg-stone-900 border border-red-900/40 focus:border-red-500 rounded-xl px-4 py-3 text-stone-100 text-sm outline-none transition-colors placeholder:text-stone-700 mb-3"/>
        </div>
        <button onClick={doReset} disabled={resetInput!=='RESET'}
          className="w-full bg-red-700 hover:bg-red-600 disabled:opacity-30 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl text-sm transition-colors">
          Reset All Progress
        </button>
      </div>

      <div className="text-center text-xs text-stone-700 font-mono">
        CCA Prep v2.0 · UI Only · All data stored locally
      </div>
    </div>
  )
}
