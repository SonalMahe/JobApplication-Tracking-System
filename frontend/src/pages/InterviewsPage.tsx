import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import API, { setAuthToken } from '../api/client'

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

export default function InterviewsPage() {
  const { getAccessTokenSilently } = useAuth0()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [applications, setApplications] = useState<Application[]>([])
  const [form, setForm] = useState({ applicationId: '', interviewDate: '', interviewerName: '', interviewNotes: '' })
  const [loading, setLoading] = useState(true)

  const setup = async () => {
    const token = await getAccessTokenSilently()
    setAuthToken(token)
    const [intRes, appRes] = await Promise.all([
      API.get('/api/interviews'),
      API.get('/api/applications'),
    ])
    setInterviews(intRes.data)
    setApplications(appRes.data)
    setLoading(false)
  }

  useEffect(() => { setup() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await API.post('/api/interviews', {
      applicationId: Number(form.applicationId),
      interviewDate: form.interviewDate ? new Date(form.interviewDate).toISOString() : undefined,
      interviewerName: form.interviewerName || undefined,
      interviewNotes: form.interviewNotes || undefined,
    })
    setForm({ applicationId: '', interviewDate: '', interviewerName: '', interviewNotes: '' })
    setup()
  }

  const handleDelete = async (id: number) => {
    await API.delete(`/api/interviews/${id}`)
    setup()
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

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Schedule Interview</h3>
        <select value={form.applicationId} onChange={e => setForm({ ...form, applicationId: e.target.value })} required>
          <option value="">Select Application</option>
          {applications.map(a => (
            <option key={a.id} value={a.id}>{appLabel(a)}</option>
          ))}
        </select>
        <input
          type="datetime-local"
          value={form.interviewDate}
          onChange={e => setForm({ ...form, interviewDate: e.target.value })}
          required
        />
        <input
          placeholder="Interviewer Name"
          value={form.interviewerName}
          onChange={e => setForm({ ...form, interviewerName: e.target.value })}
        />
        <input
          placeholder="Notes (optional)"
          value={form.interviewNotes}
          onChange={e => setForm({ ...form, interviewNotes: e.target.value })}
        />
        <button className="btn-primary" type="submit">Schedule</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <table className="data-table">
          <thead>
            <tr><th>Applicant</th><th>Job</th><th>Scheduled</th><th>Interviewer</th><th>Notes</th><th>Action</th></tr>
          </thead>
          <tbody>
            {interviews.map(i => (
              <tr key={i.id}>
                <td>
                  {i.application?.applicant
                    ? `${i.application.applicant.firstName} ${i.application.applicant.lastName}`
                    : `Application #${i.applicationId}`}
                </td>
                <td>{i.application?.job?.title || '-'}</td>
                <td>{formatDate(i.interviewDate)}</td>
                <td>{i.interviewerName}</td>
                <td>{i.interviewNotes || '-'}</td>
                <td><button className="btn-danger" onClick={() => handleDelete(i.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
