import API from '../api/client'
import { useEffect, useState } from 'react'


type Application = {
  id: number
  applicantId: number
  jobId: number
  status: string
  applicant?: { firstName: string; lastName: string }
  job?: { title: string }
}

type Applicant = { id: number; firstName: string; lastName: string }
type Job = { id: number; title: string }

const STATUSES = ['APPLIED', 'INTERVIEW', 'OFFERED', 'REJECTED']

const statusClass: Record<string, string> = {
  APPLIED: 'badge-applied',
  INTERVIEW: 'badge-interview',
  OFFERED: 'badge-offered',
  REJECTED: 'badge-rejected',
}

export default function ApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([])
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [form, setForm] = useState({ applicantId: '', jobId: '', status: 'APPLIED' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const setup = async () => {
    try {
      const [appsRes, applicantsRes, jobsRes] = await Promise.all([
        API.get('/api/applications'),
        API.get('/api/applicants'),
        API.get('/api/jobs'),
      ])
      setApplications(appsRes.data)
      setApplicants(applicantsRes.data)
      setJobs(jobsRes.data)
      setError('')
    } catch {
      setError('Failed to load data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { setup() }, [])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await API.post('/api/applications', {
        applicantId: Number(form.applicantId),
        jobId: Number(form.jobId),
        status: form.status,
      })
      setForm({ applicantId: '', jobId: '', status: 'APPLIED' })
      setError('')
      setup()
    } catch {
      setError('Failed to add application. Please try again.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/api/applications/${id}`)
      setup()
    } catch {
      setError('Failed to delete application. Please try again.')
    }
  }

  return (
    <div className="page">
      <h2>Applications</h2>

      {error && <p className="error-msg">{error}</p>}
      {loading && <p className="loading-msg">Loading...</p>}

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Add New Application</h3>
        <select value={form.applicantId} onChange={e => setForm({ ...form, applicantId: e.target.value })} required>
          <option value="">Select Applicant</option>
          {applicants.map(a => <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>)}
        </select>
        <select value={form.jobId} onChange={e => setForm({ ...form, jobId: e.target.value })} required>
          <option value="">Select Job</option>
          {jobs.map(j => <option key={j.id} value={j.id}>{j.title}</option>)}
        </select>
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn-primary" type="submit">Add Application</button>
      </form>

      {!loading && applications.length === 0 && <p className="empty-state">No applications found. Add one above.</p>}

      {!loading && applications.length > 0 && (
        <table className="data-table">
          <thead>
            <tr><th>Applicant</th><th>Job</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td>{app.applicant?.firstName} {app.applicant?.lastName}</td>
                <td>{app.job?.title}</td>
                <td><span className={`badge ${statusClass[app.status] || ''}`}>{app.status}</span></td>
                <td><button className="btn-danger" onClick={() => handleDelete(app.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
