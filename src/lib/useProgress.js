import { useState, useCallback, useMemo } from 'react'
import { getCompletions, saveCompletions, updateStreak, computeStreak } from './storage'
import { WEEKS, DOMAINS } from './data'

const ALL_TASKS = WEEKS.flatMap(w => w.tasks)
const TOTAL = ALL_TASKS.length

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

  const stats = useMemo(() => {
    const done = ALL_TASKS.filter(t => completions.has(t.id)).length
    const pct = TOTAL ? Math.round((done / TOTAL) * 100) : 0

    const weekProgress = WEEKS.map(w => {
      const wDone = w.tasks.filter(t => completions.has(t.id)).length
      return { weekId: w.id, done: wDone, total: w.tasks.length, pct: Math.round((wDone / w.tasks.length) * 100) }
    })

    const domainProgress = Object.fromEntries(
      DOMAINS.map(d => {
        const dTasks = ALL_TASKS.filter(t => t.domain === d.id)
        const dDone = dTasks.filter(t => completions.has(t.id)).length
        return [d.id, { done: dDone, total: dTasks.length, pct: dTasks.length ? Math.round((dDone / dTasks.length) * 100) : 0 }]
      })
    )

    const weeksComplete = weekProgress.filter(w => w.pct === 100).length
    const streak = computeStreak()

    return { done, total: TOTAL, pct, weekProgress, domainProgress, weeksComplete, streak }
  }, [completions])

  return { completions, toggle, ...stats }
}
