import API from '../api/client'
import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

type Card = {
  key: 'jobs' | 'applicants' | 'applications' | 'interviews'
  label: string
  color: string
  link: string
}

const cards: Card[] = [
  {
    key: 'jobs',
    label: 'Total Jobs',
    color: '#3b82f6',
    link: '/jobs',
  },
  {
    key: 'applicants',
    label: 'Applicants',
    color: '#10b981',
    link: '/applicants',
  },
  {
    key: 'applications',
    label: 'Applications',
    color: '#8b5cf6',
    link: '/applications',
  },
  {
    key: 'interviews',
    label: 'Interviews',
    color: '#f59e0b',
    link: '/interviews',
  },
]

export default function Dashboard() {
  const { user } = useAuth0()
  const [counts, setCounts] = useState({ jobs: 0, applicants: 0, applications: 0, interviews: 0 })

  useEffect(() => {
    const fetchData = async () => {
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
      <h2>Welcome ,{user?.name || 'User'} to your Job Application Tracker Dashboard</h2>

      <div className="stats-grid">
        {cards.map(card => (
          <Link to={card.link} key={card.key} className="stat-card" style={{ borderTopColor: card.color }}>
            <h3 style={{ color: card.color }}>{counts[card.key]}</h3>
            <p>{card.label}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
