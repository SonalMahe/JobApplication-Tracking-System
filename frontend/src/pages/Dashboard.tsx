import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import API, { setAuthToken } from '../api/client'

export default function Dashboard() {
  const { getAccessTokenSilently, user } = useAuth0()
  const [counts, setCounts] = useState({ jobs: 0, applicants: 0, applications: 0, interviews: 0 })

  useEffect(() => {
    const fetchData = async () => {
      const token = await getAccessTokenSilently()
      setAuthToken(token)

      const [jobs, applicants, applications, interviews] = await Promise.all([
        API.get('/api/jobs'),
        API.get('/api/applicants'),
        API.get('/api/applications'),
        API.get('/api/interviews'),
      ])

      setCounts({
        jobs: jobs.data.length,
        applicants: applicants.data.length,
        applications: applications.data.length,
        interviews: interviews.data.length,
      })
    }

    fetchData()
  }, [])

  return (
    <div className="page">
      <h2>Overview</h2>
      <p style={{ color: '#888', marginBottom: '1.5rem' }}>Welcome back, {user?.name}</p>
      <div className="stats-grid">
        <div className="stat-card">
          <h3>{counts.jobs}</h3>
          <p>Jobs</p>
        </div>
        <div className="stat-card">
          <h3>{counts.applicants}</h3>
          <p>Applicants</p>
        </div>
        <div className="stat-card">
          <h3>{counts.applications}</h3>
          <p>Applications</p>
        </div>
        <div className="stat-card">
          <h3>{counts.interviews}</h3>
          <p>Interviews</p>
        </div>
      </div>
    </div>
  )
}
