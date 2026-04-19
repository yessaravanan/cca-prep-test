// All app state lives here. No backend, no network calls.

const KEYS = {
  SETUP: 'cca_setup_complete',
  USER: 'cca_user',
  COMPLETIONS: 'cca_completions_v2',
  STREAK: 'cca_streak_v2',
  QUIZ_HISTORY: 'cca_quiz_history_v2',
}

// --- User ---
export const getUser = () => {
  try { return JSON.parse(localStorage.getItem(KEYS.USER)) }
  catch { return null }
}
export const saveUser = (user) => localStorage.setItem(KEYS.USER, JSON.stringify(user))
export const isSetupComplete = () => !!localStorage.getItem(KEYS.SETUP)
export const markSetupComplete = () => localStorage.setItem(KEYS.SETUP, '1')

// --- Task Completions ---
export const getCompletions = () => {
  try { return new Set(JSON.parse(localStorage.getItem(KEYS.COMPLETIONS)) || []) }
  catch { return new Set() }
}
export const saveCompletions = (set) =>
  localStorage.setItem(KEYS.COMPLETIONS, JSON.stringify([...set]))

// --- Streak ---
export const getStreak = () => {
  try { return JSON.parse(localStorage.getItem(KEYS.STREAK)) || { count: 0, lastDate: null } }
  catch { return { count: 0, lastDate: null } }
}
export const updateStreak = () => {
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  const s = getStreak()
  if (s.lastDate === today) return s.count
  const count = s.lastDate === yesterday ? s.count + 1 : 1
  localStorage.setItem(KEYS.STREAK, JSON.stringify({ count, lastDate: today }))
  return count
}
export const computeStreak = () => {
  const s = getStreak()
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()
  if (s.lastDate === today || s.lastDate === yesterday) return s.count
  return 0
}

// --- Quiz History ---
export const getQuizHistory = () => {
  try { return JSON.parse(localStorage.getItem(KEYS.QUIZ_HISTORY)) || [] }
  catch { return [] }
}
export const saveQuizResult = (result) => {
  const history = getQuizHistory()
  localStorage.setItem(KEYS.QUIZ_HISTORY, JSON.stringify([result, ...history].slice(0, 20)))
}

// --- Reset ---
export const resetProgress = () => {
  localStorage.removeItem(KEYS.COMPLETIONS)
  localStorage.removeItem(KEYS.STREAK)
  localStorage.removeItem(KEYS.QUIZ_HISTORY)
}

// --- Export ---
export const exportData = () => {
  const data = {
    exportedAt: new Date().toISOString(),
    user: getUser(),
    completions: [...getCompletions()],
    streak: getStreak(),
    quizHistory: getQuizHistory(),
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `cca-prep-export-${new Date().toISOString().slice(0,10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
