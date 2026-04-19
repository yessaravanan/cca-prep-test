import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { isSetupComplete } from './lib/storage'
import Layout from './components/Layout'
import Onboarding from './pages/Onboarding'
import Home from './pages/Home'
import StudyPlan from './pages/StudyPlan'
import WeekDetail from './pages/WeekDetail'
import Quiz from './pages/Quiz'
import QuizActive from './pages/QuizActive'
import QuizResults from './pages/QuizResults'
import Progress from './pages/Progress'
import Settings from './pages/Settings'

function Guard({ children }) {
  if (!isSetupComplete()) return <Navigate to="/onboarding" replace />
  return children
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/" element={<Guard><Layout /></Guard>}>
          <Route index element={<Home />} />
          <Route path="plan" element={<StudyPlan />} />
          <Route path="plan/week/:weekId" element={<WeekDetail />} />
          <Route path="quiz" element={<Quiz />} />
          <Route path="quiz/active" element={<QuizActive />} />
          <Route path="quiz/results" element={<QuizResults />} />
          <Route path="progress" element={<Progress />} />
          <Route path="settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
