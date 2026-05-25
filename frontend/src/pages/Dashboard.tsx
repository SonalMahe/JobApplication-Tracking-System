import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'
import API, { setAuthToken } from '../api/client'

const cards = [
  { key: 'jobs' as const,         label: 'Total Jobs',      color: '#3b82f6', link: '/jobs' },
  { key: 'applicants' as const,   label: 'Applicants',      color: '#10b981', link: '/applicants' },
  { key: 'applications' as const, label: 'Applications',    color: '#8b5cf6', link: '/applications' },
  { key: 'interviews' as const,   label: 'Interviews',      color: '#f59e0b', link: '/interviews' },
]

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
      <div className="overview-header">
        <h2>Overview</h2>
        <p className="overview-sub">Welcome, <strong>{user?.name}</strong></p>
      </div>

      <div className="stats-grid">
        {cards.map(card => (
          <Link to={card.link} key={card.key} className="stat-card" style={{ borderTopColor: card.color } as React.CSSProperties}>
            <h3 style={{ color: card.color }}>{counts[card.key]}</h3>
            <p>{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
