import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import JobsPage from './pages/JobsPage'
import ApplicantsPage from './pages/ApplicantsPage'
import ApplicationsPage from './pages/ApplicationsPage'
import InterviewsPage from './pages/InterviewsPage'
import './App.css'

export default function App() {
  const { isAuthenticated, isLoading } = useAuth0()

  if (isLoading) return <div className="loading">Loading...</div>

  if (!isAuthenticated) return <LoginPage />

  return (
    <BrowserRouter>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/jobs" element={<JobsPage />} />
          <Route path="/applicants" element={<ApplicantsPage />} />
          <Route path="/applications" element={<ApplicationsPage />} />
          <Route path="/interviews" element={<InterviewsPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}
