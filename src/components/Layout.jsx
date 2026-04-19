import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, BookOpen, Brain, TrendingUp, Settings, Target, Flame } from 'lucide-react'
import { getUser } from '../lib/storage'
import { computeStreak } from '../lib/storage'

const NAV = [
  { to:'/', icon:LayoutDashboard, label:'Home', end:true },
  { to:'/plan', icon:BookOpen, label:'Study Plan' },
  { to:'/quiz', icon:Brain, label:'Quiz' },
  { to:'/progress', icon:TrendingUp, label:'Progress' },
  { to:'/settings', icon:Settings, label:'Settings' },
]

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${
    isActive ? 'bg-orange-600/15 text-orange-500' : 'text-stone-400 hover:text-stone-200 hover:bg-stone-800/60'
  }`

const bottomClass = ({ isActive }) =>
  `flex flex-col items-center gap-1 py-2 flex-1 text-xs transition-colors ${
    isActive ? 'text-orange-500' : 'text-stone-500'
  }`

export default function Layout() {
  const user = getUser()
  const streak = computeStreak()
  const examDate = user?.examDate ? new Date(user.examDate) : new Date('2026-05-30')
  const daysLeft = Math.max(0, Math.ceil((examDate - new Date()) / 86400000))

  return (
    <div className="flex min-h-screen bg-stone-950 text-stone-100">
      {/* ── SIDEBAR (desktop lg+) ── */}
      <aside className="hidden lg:flex flex-col w-60 flex-shrink-0 fixed inset-y-0 left-0 bg-stone-900 border-r border-stone-800 z-30">
        {/* Logo */}
        <div className="px-5 py-5 border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-orange-600/20 border border-orange-600/30 flex items-center justify-center">
              <Target size={16} className="text-orange-500" />
            </div>
            <div>
              <div className="text-sm font-bold text-stone-100 leading-tight">CCA Prep</div>
              <div className="text-xs text-stone-500 leading-tight">Study Tracker</div>
            </div>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} className={linkClass}>
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* User info */}
        <div className="px-4 py-4 border-t border-stone-800 space-y-2">
          <div className="text-sm font-medium text-stone-200 truncate">{user?.name || 'Learner'}</div>
          <div className="flex items-center gap-3 text-xs text-stone-500">
            {streak > 0 && <span className="flex items-center gap-1"><Flame size={12} className="text-orange-500"/>{streak}d streak</span>}
            <span>{daysLeft}d to exam</span>
          </div>
        </div>
      </aside>

      {/* ── MAIN AREA ── */}
      <div className="flex-1 flex flex-col lg:ml-60">
        {/* Mobile top bar */}
        <header className="lg:hidden sticky top-0 z-20 bg-stone-950/95 backdrop-blur border-b border-stone-800 flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-600/20 border border-orange-600/30 flex items-center justify-center">
              <Target size={14} className="text-orange-500" />
            </div>
            <span className="font-bold text-sm text-stone-100">CCA Prep</span>
          </div>
          <div className="flex items-center gap-3 text-xs text-stone-500">
            {streak > 0 && <span className="flex items-center gap-1"><Flame size={11} className="text-orange-500"/>{streak}🔥</span>}
            <span className="text-stone-600">{daysLeft}d left</span>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto pb-20 lg:pb-8">
          <div className="max-w-4xl mx-auto">
            <Outlet />
          </div>
        </main>

        {/* Mobile bottom nav */}
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-20 bg-stone-900/95 backdrop-blur border-t border-stone-800 flex">
          {NAV.map(({ to, icon: Icon, label, end }) => (
            <NavLink key={to} to={to} end={end} className={bottomClass}>
              <Icon size={20} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </div>
  )
}
