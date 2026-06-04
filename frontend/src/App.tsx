import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useAuth0 } from '@auth0/auth0-react'
import { useEffect, useRef } from 'react'
import Navbar from './components/Navbar'
import LoginPage from './pages/LoginPage'
import Dashboard from './pages/Dashboard'
import JobsPage from './pages/JobsPage'
import ApplicantsPage from './pages/ApplicantsPage'
import ApplicationsPage from './pages/ApplicationsPage'
import InterviewsPage from './pages/InterviewsPage'
import API from './api/client'
import './App.css'

export default function App() {
  const { isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0()
  const getTokenRef = useRef(getAccessTokenSilently)
  getTokenRef.current = getAccessTokenSilently

  useEffect(() => {
    const interceptor = API.interceptors.request.use(async (config) => {
      const token = await getTokenRef.current()
      config.headers.Authorization = `Bearer ${token}`
      return config
    })
    return () => API.interceptors.request.eject(interceptor)
  }, [])

  if (isLoading) return <div className="loading">Loading...</div>

  if (!isAuthenticated) return <LoginPage />

  // TEMP: log token for Insomnia testing — remove before committing
  getAccessTokenSilently().then(t => console.log('AUTH TOKEN:', t))

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
