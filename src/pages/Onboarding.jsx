import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { saveUser, markSetupComplete } from '../lib/storage'
import { Target, ChevronRight, ChevronLeft } from 'lucide-react'

export default function Onboarding() {
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [examDate, setExamDate] = useState('2026-05-30')
  const navigate = useNavigate()

  const finish = () => {
    saveUser({ name: name.trim() || 'Learner', examDate })
    markSetupComplete()
    navigate('/', { replace: true })
  }

  return (
    <div className="min-h-screen bg-stone-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Step indicators */}
        <div className="flex items-center justify-center gap-2 mb-10">
          {[0,1,2].map(i => (
            <div key={i} className={`h-1.5 rounded-full transition-all duration-300 ${i === step ? 'w-8 bg-orange-600' : i < step ? 'w-4 bg-orange-600/40' : 'w-4 bg-stone-800'}`} />
          ))}
        </div>

        {/* Step 0 — Welcome */}
        {step === 0 && (
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-600/15 border border-orange-600/30 mb-6">
              <Target size={28} className="text-orange-500" />
            </div>
            <h1 className="text-3xl font-bold text-stone-100 mb-3">CCA Prep</h1>
            <p className="text-stone-400 mb-2">6-week structured study tracker for the</p>
            <p className="text-orange-400 font-medium mb-8">Claude Certified Architect Foundations exam</p>
            <div className="grid grid-cols-3 gap-3 mb-10 text-center">
              {[['42','Daily Tasks'],['5','Domains'],['13+','Quiz Questions']].map(([val,lbl])=>(
                <div key={lbl} className="bg-stone-900 border border-stone-800 rounded-xl p-3">
                  <div className="text-xl font-bold text-orange-400 font-mono">{val}</div>
                  <div className="text-xs text-stone-500 mt-0.5">{lbl}</div>
                </div>
              ))}
            </div>
            <button onClick={() => setStep(1)}
              className="w-full bg-orange-600 hover:bg-orange-500 text-white font-bold py-4 rounded-xl transition-colors flex items-center justify-center gap-2">
              Get Started <ChevronRight size={18} />
            </button>
          </div>
        )}

        {/* Step 1 — Name */}
        {step === 1 && (
          <div>
            <h2 className="text-2xl font-bold text-stone-100 mb-2">What's your name?</h2>
            <p className="text-stone-400 mb-8">Used in your dashboard greeting. You can change this later in Settings.</p>
            <input
              type="text" value={name} onChange={e => setName(e.target.value)}
              placeholder="Your name"
              autoFocus
              onKeyDown={e => e.key === 'Enter' && name.trim().length >= 2 && setStep(2)}
              className="w-full bg-stone-900 border border-stone-800 focus:border-orange-600 rounded-xl px-4 py-3.5 text-stone-100 text-base outline-none transition-colors placeholder:text-stone-600 mb-6"
            />
            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="flex items-center gap-1.5 px-5 py-3 bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-xl text-stone-400 transition-colors">
                <ChevronLeft size={16}/> Back
              </button>
              <button onClick={() => setStep(2)} disabled={name.trim().length < 2}
                className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center gap-2">
                Continue <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Exam date */}
        {step === 2 && (
          <div>
            <h2 className="text-2xl font-bold text-stone-100 mb-2">When's your exam?</h2>
            <p className="text-stone-400 mb-8">The app tracks a countdown to your exam date across all screens.</p>
            <div className="mb-2">
              <label className="block text-xs font-mono text-stone-500 uppercase tracking-widest mb-2">Target Exam Date</label>
              <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)}
                min="2026-04-20"
                className="w-full bg-stone-900 border border-stone-800 focus:border-orange-600 rounded-xl px-4 py-3.5 text-stone-100 text-base outline-none transition-colors mb-1"
              />
              <p className="text-xs text-stone-600 mb-6">CCA Foundations launched March 12, 2026. Default is May 30, 2026.</p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="flex items-center gap-1.5 px-5 py-3 bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-xl text-stone-400 transition-colors">
                <ChevronLeft size={16}/> Back
              </button>
              <button onClick={finish}
                className="flex-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-3 rounded-xl transition-colors">
                Start Studying →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
