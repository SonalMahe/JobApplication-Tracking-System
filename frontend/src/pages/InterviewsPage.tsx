import API from '../api/client'
import { useEffect, useState } from 'react'


type Interview = {
  id: number
  applicationId: number
  interviewDate: string
  interviewerName: string
  interviewNotes?: string
  application?: {
    applicant?: { firstName: string; lastName: string }
    job?: { title: string }
  }
}

type Application = {
  id: number
  applicant?: { firstName: string; lastName: string }
  job?: { title: string }
}

type Manager = {
  id: number
  firstName: string
  lastName: string
}

export default function InterviewsPage() {
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [managers, setManagers] = useState<Manager[]>([])
  const [form, setForm] = useState({ applicationId: '', interviewDate: '', interviewerName: '', interviewNotes: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const setup = async () => {
    try {
      const [intRes, appRes, mgrRes] = await Promise.all([
        API.get('/api/interviews'),
        API.get('/api/applications'),
        API.get('/api/hiring-managers'),
      ])
      setInterviews(intRes.data)
      setApplications(appRes.data)
      setManagers(mgrRes.data)
      setError('')
    } catch {
      setError('Failed to load interviews. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { setup() }, [])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await API.post('/api/interviews', {
        applicationId: Number(form.applicationId),
        interviewDate: form.interviewDate ? new Date(form.interviewDate).toISOString() : undefined,
        interviewerName: form.interviewerName || undefined,
        interviewNotes: form.interviewNotes || undefined,
      })
      setForm({ applicationId: '', interviewDate: '', interviewerName: '', interviewNotes: '' })
      setError('')
      setup()
    } catch {
      setError('Failed to schedule interview. Please try again.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/api/interviews/${id}`)
      setup()
    } catch {
      setError('Failed to delete interview. Please try again.')
    }
  }

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })

  const appLabel = (app: Application) =>
    app.applicant && app.job
      ? `${app.applicant.firstName} ${app.applicant.lastName} – ${app.job.title}`
      : `Application #${app.id}`

  return (
    <div className="page">
      <h2>Interviews</h2>

      {error && <p className="error-msg">{error}</p>}

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Schedule Interview</h3>
        <select value={form.applicationId} onChange={e => setForm({ ...form, applicationId: e.target.value })} required>
          <option value="">Select Application</option>
          {applications.map(a => (
            <option key={a.id} value={a.id}>{appLabel(a)}</option>
          ))}
        </select>
        <input type="datetime-local" value={form.interviewDate} onChange={e => setForm({ ...form, interviewDate: e.target.value })} required />
        <select value={form.interviewerName} onChange={e => setForm({ ...form, interviewerName: e.target.value })}>
          <option value="">Select Manager</option>
          {managers.map(m => (
            <option key={m.id} value={`${m.firstName} ${m.lastName}`}>{m.firstName} {m.lastName}</option>
          ))}
        </select>
        <input placeholder="Notes (optional)" value={form.interviewNotes} onChange={e => setForm({ ...form, interviewNotes: e.target.value })} />
        <button className="btn-primary" type="submit">Schedule</button>
      </form>

      {loading && <p className="loading-msg">Loading...</p>}
      {!loading && !error && (
        <table className="data-table">
          <thead>
            <tr><th>Applicant</th><th>Job</th><th>Scheduled</th><th>Interviewer</th><th>Notes</th><th>Action</th></tr>
          </thead>
          <tbody>
            {interviews.length === 0
              ? <tr><td colSpan={6} className="empty-state">No interviews scheduled yet.</td></tr>
              : interviews.map(i => (
                <tr key={i.id}>
                  <td>{i.application?.applicant ? `${i.application.applicant.firstName} ${i.application.applicant.lastName}` : `Application #${i.applicationId}`}</td>
                  <td>{i.application?.job?.title || '-'}</td>
                  <td>{formatDate(i.interviewDate)}</td>
                  <td>{i.interviewerName}</td>
                  <td>{i.interviewNotes || '-'}</td>
                  <td><button className="btn-danger" onClick={() => handleDelete(i.id)}>Delete</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      )}
    </div>
  )
}
