TECHNICAL CONTRACT · UI ONLY EDITION
CCA Prep
Complete Technical Specification — Pure Frontend, No Backend
Document 3 of 3  ·  Version 2.1  ·  April 2026  ·  localStorage Only

This document is the authoritative source of truth for building CCA Prep v2.1. It covers every file, every component, every prop, every localStorage key, and every formula. No backend, no Supabase, no auth. Pass this document directly to Claude Code, Cursor, or any AI coding agent to build the complete app.
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
cca-prep/                          # 9-week plan: 3 prerequisite + 6 CCA core weeks
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
    │   ├── data.js                # WEEKS[9], QUIZ_QUESTIONS[22], DOMAINS[7] (D0,DA,D1–D5)
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
2b. Data Shapes — data.js
// DOMAINS array (7 entries)
{ id: 'D0'|'DA'|'D1'|'D2'|'D3'|'D4'|'D5', label: string, weight: number, color: string }
// D0 and DA have weight: 0 (prerequisite stages, not exam-weighted)

// WEEKS array (9 entries)
{
  id: number,          // 1–9
  phase: number,       // 0 = prerequisite, 1+ = CCA core
  phaseLabel: string,  // e.g. 'Prerequisites', 'Core'
  title: string,
  dates: string,       // e.g. 'Week 1'
  domain: string,      // display label for the stage
  color: string,       // hex
  build: string,       // what you build this week
  tasks: Task[],
  materials: Material[],
  concepts: Concept[]
}

// Task shape
{ id: string, day: number, date: string, label: string, type: 'read'|'build'|'test'|'review'|'rest', domain: string, text: string }
// type drives icon display in WeekDetail: read=📄 build=⚒️ test=🧪 review=🔁 rest=😴

// Material shape
{ type: string, icon: string, title: string, url: string, desc: string, paid?: true }
// paid: true marks optional Udemy/paid courses — shown with a badge in WeekDetail

// Paid (Udemy) courses by week — all optional supplements:
// Week 1 — AI Fluency & How Claude Works
//   • Claude AI: The AI Assistant You'll Actually Use
//     https://www.udemy.com/course/claude-ai-the-ai-assistant-youll-actually-use/
//     ⭐4.5 · 2,602 ratings · 8hrs. Practical Claude usage for real-world tasks.
//   • Claude for Beginners: AI in Business & Automation
//     https://www.udemy.com/course/claude-pro-mastery-ai-for-business-marketing-automation/
//     ⭐4.3 · 191 ratings · 16hrs. Business and marketing use cases.
// Week 2 — Claude as a Power User
//   • Claude - Master Claude Cowork, Claude Code, Skills & Plugins
//     https://www.udemy.com/course/claude-code-cowork-course/
//     ⭐4.7 · 160 ratings · 15.5hrs. Deep dive on Cowork and Claude Code UI.
//   • Mastering Claude Cowork & AI Agents in 5 hours
//     https://www.udemy.com/course/mastering-claude-cowork-ai-agents/
//     ⭐4.7 · 176 ratings · 5hrs. Zero coding required.
// Week 3 — API Basics, RAG & MCP Intro
//   • Claude Code - The Practical Guide (Academind)
//     https://www.udemy.com/course/claude-code-the-practical-guide/
//     ⭐4.6 · 5,935 ratings · 3hrs. Best-rated practical Claude Code course.
//   • The Complete Claude Code & Claude Cowork Masterclass
//     https://www.udemy.com/course/claude-aiagents-cowork-masterclass/
//     ⭐4.6 · 865 ratings · 15hrs. Comprehensive developer + agent content.
// Week 9 — 3 Full Mock Exams → Exam Day
//   • Anthropic CCA - 3 Full Practice Exams (Frank Kane)
//     https://www.udemy.com/course/anthropic-claude-certified-architect-3-full-practice-exams/
//     ⭐4.3 · 180 scenario-based questions with detailed explanations.
//   • Claude Certified Architect Exams - 6 Practice Tests
//     https://www.udemy.com/course/claude-certified-architect-practice-tests/
//     ⭐4.6 Bestseller · 360 questions. Best-rated CCA practice test pack.
//   • NEW CCAF Exams 2026 — 300 Questions
//     https://www.udemy.com/course/new-claude-certified-architect-foundations-cca-f-exams/
//     ⭐4.2 · 300 questions. Updated 2026 content.

// Concept shape (3 types with different structures)
// type 'rule':    { type:'rule',    title: string, body: string }
// type 'tip':     { type:'tip',     title: string, body: string }
// type 'compare': { type:'compare', title: string, bad: {label:string, text:string}, good: {label:string, text:string} }

// QuizResult shape (stored in cca_quiz_history_v2 and sessionStorage)
{
  type: 'mock'|'topic',
  domain: string|null,       // null for mock, e.g. 'D1' for topic
  score: number,
  total: number,
  pct: number,
  domainScores: { [domainId]: { correct: number, total: number } },
  answers: { questionId: string, selected: number, correct: boolean }[],
  takenAt: number            // Date.now()
}

// QUIZ_QUESTIONS array (22 entries)
{ id: string, domain: 'D1'|'D2'|'D3'|'D4'|'D5', question: string, options: string[], answer: number, explanation: string }
// Note: quiz questions only cover exam domains D1–D5 (not D0/DA prerequisite stages)
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
    total,         // always 84 (sum of all tasks across 9 weeks)
    pct,           // Math.round(done/total*100)
    weekProgress,  // [{weekId, done, total, pct}] — one per week
    domainProgress, // {D0,DA,D1..D5: {done, total, pct}} — all 7 domains
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
Overall pct	Math.round(done/84*100)	84 = total task count (constant, 9 weeks)
Week pct	Math.round(wDone/w.tasks.length*100)	Per week
Domain pct	Math.round(dDone/dTotal*100)	Per domain D0, DA, D1–D5 (7 domains total)
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
•	9 weeks total: Weeks 1–3 are prerequisite stages (AI Fluency, Power User, API/RAG); Weeks 4–9 are CCA core exam domains
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

15. Deployment
•	GitHub repo: https://github.com/yessaravanan/cca-prep-test
•	Vercel project: cca-prep (already linked — push to main auto-deploys)
•	Vercel projectId: prj_0iDNMaOyN0bQhYsQR0PjJgBqv0wA
•	Build command: vite build (auto-detected by Vercel)
•	Output directory: dist
•	No environment variables required — zero backend

CCA Prep · Technical Contract v2.1 · UI Only Edition · April 2026

Changelog v2.1:
•	9 weeks total (was implied 6) — Weeks 1–3 are prerequisite stages
•	Total tasks updated to 84 (was 42)
•	Domains expanded to 7: D0 (AI Fluency), DA (API & RAG Basics), D1–D5
•	WEEKS[] shape includes phase (number) and phaseLabel (string) fields
•	Materials array items may include paid: true flag for optional paid courses
•	QUIZ_QUESTIONS array contains 22 questions
•	Concept shape documented (3 types: rule, tip, compare)
•	QuizResult shape documented
•	Task type enum documented (read, build, test, review, rest)
•	Deployment section added (GitHub + Vercel)
