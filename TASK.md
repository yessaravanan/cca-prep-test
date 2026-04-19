TECHNICAL CONTRACT · UI ONLY EDITION
CCA Prep
Complete Technical Specification — Pure Frontend, No Backend
Document 3 of 3  ·  Version 2.0  ·  April 2026  ·  localStorage Only

This document is the authoritative source of truth for building CCA Prep v2.0. It covers every file, every component, every prop, every localStorage key, and every formula. No backend, no Supabase, no auth. Pass this document directly to Claude Code, Cursor, or any AI coding agent to build the complete app.
1. Critical Constraints — Read First
These are non-negotiable. Any code that violates these constraints is incorrect.
•	NO Supabase. NO Firebase. NO fetch() calls to any backend. Zero network requests after the initial page load.
•	NO authentication. NO login page. NO session management. The app opens directly to Onboarding (first launch) or Home (returning user).
•	NO admin dashboard. NO team features. NO multi-user support. Single user per browser.
•	ALL state in localStorage (persistent) or sessionStorage (quiz flow only). See Section 5 for exact keys.
•	Responsive layout: sidebar nav on lg+ (≥1024px), top bar + bottom nav on <1024px. Both must look production-quality.
•	Tailwind CSS only for styling. No custom CSS classes except in index.css for scrollbars and base resets.
•	All page components use default exports. No named exports from page files.
2. File Structure — Complete
Every file listed must be created. No additional files should be invented.
cca-prep/
├── index.html                     # PWA entry + apple-mobile-web-app meta tags
├── vite.config.js                 # Vite + VitePWA + @tailwindcss/vite
├── package.json
├── public/
│   ├── pwa-192x192.png
│   └── pwa-512x512.png
└── src/
    ├── main.jsx                   # ReactDOM.createRoot entry
    ├── index.css                  # @import 'tailwindcss' + scrollbar styles
    ├── App.jsx                    # BrowserRouter + Routes + Guard component
    ├── lib/
    │   ├── storage.js             # All localStorage read/write helpers
    │   ├── data.js                # WEEKS[], QUIZ_QUESTIONS[], DOMAINS[]
    │   └── useProgress.js         # useProgress() hook
    ├── components/
    │   ├── Layout.jsx             # Sidebar (lg+) + TopBar + BottomNav (<lg)
    │   └── ProgressRing.jsx       # Reusable SVG ring component
    └── pages/
        ├── Onboarding.jsx         # /onboarding — 3-step first-launch flow
        ├── Home.jsx               # / (index)
        ├── StudyPlan.jsx          # /plan
        ├── WeekDetail.jsx         # /plan/week/:weekId
        ├── Quiz.jsx               # /quiz
        ├── QuizActive.jsx         # /quiz/active
        ├── QuizResults.jsx        # /quiz/results
        ├── Progress.jsx           # /progress
        └── Settings.jsx           # /settings
3. Routing
// App.jsx — exact route structure
// Guard: if !isSetupComplete() → Navigate to /onboarding
// No auth guards, no role checks, no protected routes beyond onboarding

<BrowserRouter>
  <Routes>
    <Route path='/onboarding' element={<Onboarding />} />
    <Route path='/' element={<Guard><Layout /></Guard>}>
      <Route index element={<Home />} />
      <Route path='plan' element={<StudyPlan />} />
      <Route path='plan/week/:weekId' element={<WeekDetail />} />
      <Route path='quiz' element={<Quiz />} />
      <Route path='quiz/active' element={<QuizActive />} />
      <Route path='quiz/results' element={<QuizResults />} />
      <Route path='progress' element={<Progress />} />
      <Route path='settings' element={<Settings />} />
    </Route>
    <Route path='*' element={<Navigate to='/' replace />} />
  </Routes>
</BrowserRouter>

Guard component logic:
function Guard({ children }) {
  if (!isSetupComplete()) return <Navigate to='/onboarding' replace />
  return children
}

Navigation rules:
•	Bottom nav uses NavLink with end prop on / (home) to prevent / matching all child routes
•	WeekDetail uses useParams() → WEEKS.find(w => w.id === parseInt(weekId))
•	QuizActive navigates to /quiz/results after final answer — no back navigation possible
•	QuizResults clears sessionStorage.cca_quiz_result on navigate away (Retake or Home buttons)
•	Settings accessible from sidebar (desktop) AND 5th bottom nav icon (mobile)
4. Responsive Layout — Exact Implementation
4.1 Layout.jsx Structure
// Layout.jsx — single component handles both breakpoints
return (
  <div className='flex min-h-screen bg-stone-950 text-stone-100'>

    {/* SIDEBAR — desktop only */}
    <aside className='hidden lg:flex flex-col w-60 fixed inset-y-0 left-0
      bg-stone-900 border-r border-stone-800 z-30'>
      {/* Logo, nav links, user info footer */}
    </aside>

    {/* MAIN — offset by sidebar on desktop */}
    <div className='flex-1 flex flex-col lg:ml-60'>

      {/* TOP BAR — mobile only */}
      <header className='lg:hidden sticky top-0 z-20 ...'>
        {/* App name + streak + days left */}
      </header>

      {/* PAGE CONTENT */}
      <main className='flex-1 overflow-y-auto pb-20 lg:pb-8'>
        <div className='max-w-4xl mx-auto'>
          <Outlet />
        </div>
      </main>

      {/* BOTTOM NAV — mobile only */}
      <nav className='lg:hidden fixed bottom-0 left-0 right-0 z-20 ...'>
        {/* 5 NavLinks: Home, Plan, Quiz, Progress, Settings */}
      </nav>

    </div>
  </div>
)
4.2 Responsive Grid Classes
Element	Mobile	Tablet (md)	Desktop (lg)
Stat cards	grid-cols-3	grid-cols-3	grid-cols-3
Home main area	grid-cols-1	grid-cols-1	grid-cols-2
Week list	grid-cols-1	grid-cols-2	grid-cols-3
Concept compare	grid-cols-1	grid-cols-2 (sm)	grid-cols-2
Page horizontal pad	px-4	px-4	px-8 (lg:px-8)
Page bottom pad	pb-20 (nav space)	pb-20	pb-8
Content max width	max-w-4xl	max-w-4xl	max-w-4xl (all same)
Study Plan list	max-w-full	max-w-2xl	max-w-2xl
5. localStorage Contract — Complete
These are the ONLY localStorage keys the app reads or writes. Never invent additional keys.
Key	Type	Shape	Written By	Read By
cca_setup_complete	string	'1'	Onboarding finish	App.jsx Guard
cca_user	JSON	{name:string, examDate:string}	Onboarding + Settings	Layout, Home, Settings
cca_completions_v2	JSON	string[] (task IDs)	useProgress toggle	useProgress init
cca_streak_v2	JSON	{count:number, lastDate:string}	storage.updateStreak()	storage.computeStreak()
cca_quiz_history_v2	JSON	QuizResult[] max 20	storage.saveQuizResult()	Quiz, Progress

sessionStorage (cleared on tab/browser close):
Key	Written By	Read By	Cleared By
cca_quiz_config	Quiz.jsx onStart	QuizActive.jsx onMount	Never — overwritten
cca_quiz_result	QuizActive.jsx onSubmit	QuizResults.jsx onMount	QuizResults on navigate
6. storage.js — All Helper Functions
All localStorage access goes through these helpers. Pages never call localStorage directly.
// lib/storage.js

// User
getUser()           → {name, examDate} | null
saveUser(user)      → void
isSetupComplete()   → boolean
markSetupComplete() → void

// Completions
getCompletions()        → Set<string>
saveCompletions(set)    → void

// Streak
updateStreak()   → number  // call when task is checked (not unchecked)
computeStreak()  → number  // read current streak count

// Quiz
getQuizHistory()      → QuizResult[]
saveQuizResult(result) → void  // prepends, keeps max 20

// Actions
resetProgress()  → void  // clears completions + streak + quiz history only
exportData()     → void  // triggers JSON file download
7. useProgress Hook
// lib/useProgress.js
// Returns all derived state computed from localStorage completions Set
// No async, no loading state — always instant

export function useProgress() {
  const [completions, setCompletions] = useState(() => getCompletions())

  const toggle = useCallback((taskId) => {
    setCompletions(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) next.delete(taskId)
      else { next.add(taskId); updateStreak() }
      saveCompletions(next)
      return next
    })
  }, [])

  const stats = useMemo(() => ({
    done,          // number of completed tasks across all weeks
    total,         // always 42 (sum of all tasks)
    pct,           // Math.round(done/total*100)
    weekProgress,  // [{weekId, done, total, pct}] — one per week
    domainProgress, // {D1..D5: {done, total, pct}}
    weeksComplete, // count of weeks where pct === 100
    streak,        // computeStreak() result
  }), [completions])

  return { completions, toggle, ...stats }
}
8. Component Prop Interfaces
Component	File	Props	Notes
ProgressRing	components/ProgressRing.jsx	pct: number size?: number (80) stroke?: number (6) color?: string (#C8421A) label?: string	SVG ring with animated stroke-dashoffset
Layout	components/Layout.jsx	none	Reads getUser() and computeStreak() directly
Guard	App.jsx (inline)	children	Redirects to /onboarding if !isSetupComplete()
Onboarding	pages/Onboarding.jsx	none	Local state: step(0-2), name, examDate
WeekDetail	pages/WeekDetail.jsx	none	Reads weekId from useParams()
QuizActive	pages/QuizActive.jsx	none	Reads config from sessionStorage on mount
QuizResults	pages/QuizResults.jsx	none	Reads result from sessionStorage on mount
9. Progress Calculation Formulas
Metric	Formula	Notes
Overall pct	Math.round(done/42*100)	42 = total task count (constant)
Week pct	Math.round(wDone/w.tasks.length*100)	Per week
Domain pct	Math.round(dDone/dTotal*100)	Per domain D1–D5
Ring circumference	2 * Math.PI * radius	Where radius = (size - stroke*2) / 2
Ring offset	circumference - (pct/100) * circumference	strokeDashoffset value
Days to exam	Math.max(0, Math.ceil((new Date(examDate) - new Date()) / 86400000))	0 floor — no negative
Streak	count from cca_streak_v2 if lastDate = today OR yesterday	Otherwise 0
Quiz pct	Math.round(score/total*100)	Stored in QuizResult
10. Quiz Engine Logic
10.1 Question Filtering
// Quiz.jsx — on start button click
const start = (type, domain = null) => {
  sessionStorage.setItem('cca_quiz_config',
    JSON.stringify({ type, domain, startedAt: Date.now() }))
  navigate('/quiz/active')
}

// QuizActive.jsx — on mount
const config = JSON.parse(sessionStorage.getItem('cca_quiz_config') || '{}')
const allQ = config.domain
  ? QUIZ_QUESTIONS.filter(q => q.domain === config.domain)
  : QUIZ_QUESTIONS
const [questions] = useState(() => shuffle([...allQ]))
10.2 Timer
const timeLimit = config.type === 'mock'
  ? 100 * 60                                    // 6000s for mock
  : Math.min(questions.length * 2 * 60, 1200)   // 2min/q, max 20min

// Timer color thresholds
timePct > 50  → text-green-400
timePct 20-50 → text-amber-400
timePct < 20  → text-red-400
10.3 Submit & Save
const doSubmit = (answers) => {
  const score = answers.filter(a => a.correct).length
  const domainScores = {} // {D1:{correct,total}, ...}
  const result = { type, domain, score, total: answers.length,
    pct: Math.round(score/answers.length*100),
    domainScores, answers, takenAt: Date.now() }
  saveQuizResult(result)                    // localStorage
  sessionStorage.setItem('cca_quiz_result', JSON.stringify(result))
  navigate('/quiz/results')
}
11. Onboarding Flow
// 3 steps, state managed locally in Onboarding.jsx
// Step 0: Welcome screen (no input required)
// Step 1: Name input — min 2 chars, Continue disabled otherwise
// Step 2: Exam date picker — default '2026-05-30', min '2026-04-20'

// On finish (Step 2 Submit):
saveUser({ name: name.trim() || 'Learner', examDate })
markSetupComplete()
navigate('/', { replace: true })

Important: Onboarding does NOT re-trigger after a settings reset. Only cca_setup_complete missing triggers onboarding. resetProgress() does NOT clear cca_setup_complete.
12. Settings Behaviour
Action	Implementation	Side Effects
Save name/date	saveUser({name,examDate}); setSaved(true); setTimeout reset 2s	Layout re-reads getUser() on next render
Export JSON	exportData() → Blob download	No state changes
Reset progress	resetProgress(); navigate('/',{replace:true})	Clears completions/streak/quiz only. Name, date, setup flag preserved.
Reset button	Disabled until resetInput === 'RESET' exactly (case-sensitive)	Button: disabled:opacity-30 disabled:cursor-not-allowed
13. Tailwind Color Conventions
Purpose	Tailwind Token	Hex	Notes
Page background	bg-stone-950	#0c0c0f	All page backgrounds
Card background	bg-stone-900	#1a1a1f	Standard card
Border	border-stone-800	#27272a	Default borders
Primary accent	bg-orange-600	#C8421A approx	Buttons, active nav, rings
Primary hover	hover:bg-orange-500	lighter	All primary button hovers
Success	text-green-400 / #22c55e	#22c55e	Completed tasks, passing scores
Error/At-risk	text-red-400	#f87171	Needs Work, reset zone
Warning	text-amber-400	#fbbf24	50-70% quiz score
Muted text	text-stone-500	#6b7280	Labels, sub-text
Very muted	text-stone-600	#4b5563	Week dates, sub-sub-text
14. Build Verification Checklist
14.1 Build
•	npm run build exits code 0, no errors, no TypeScript errors
•	dist/ contains: index.html, sw.js, workbox-*.js, manifest.webmanifest, assets/
14.2 Onboarding
•	Fresh browser (no localStorage) → /onboarding loads
•	Step 2 Continue disabled with empty name
•	Step 2 Continue enabled with 2+ char name
•	Complete flow → lands on Home → greeting shows entered name
•	Reload → stays on Home (no re-onboarding)
14.3 Study Plan
•	Check task → checkbox fills green, text strikethrough, progress bar updates instantly
•	Uncheck → reverts immediately
•	All tasks in week → green completion banner appears
•	Reload → all checked tasks still checked
•	Progress ring on Home updates to match
14.4 Quiz
•	Start D1 topic quiz → only D1 questions appear
•	Start mock → questions from multiple domains
•	Timer counts down in real time
•	Select answer → correct green, wrong red, explanation revealed
•	Final answer → auto-navigates to /quiz/results
•	Timer = 0 → auto-submits remaining, navigates to results
•	Retake → back to /quiz, sessionStorage cleared
•	Quiz appears in history on /quiz and /progress
14.5 Settings
•	Change name → Save → shows '✓ Saved' 2s → reverts to 'Save Changes'
•	Change exam date → Save → countdown updates on Home
•	Export → .json file downloads with correct structure
•	Type 'RESET' → button enables → confirm → progress clears → Home
•	After reset → name/date/setup preserved, onboarding NOT shown
14.6 Responsive
•	375px: all text readable, no overflow, bottom nav visible (5 icons)
•	768px: layout correct, still bottom nav
•	1024px: sidebar appears, bottom nav hidden, content shifts right
•	1440px: sidebar + centered max-w-4xl content
•	1920px: no full-width stretching
14.7 PWA
•	Lighthouse PWA audit passes on production URL
•	iOS Safari: Add to Home Screen → opens standalone
•	Android Chrome: install prompt → installs → standalone
•	Offline: disconnect network → all screens load and function

CCA Prep · Technical Contract v2.0 · UI Only Edition · April 2026
