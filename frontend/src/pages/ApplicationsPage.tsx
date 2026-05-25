import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import API, { setAuthToken } from '../api/client'

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
  const { getAccessTokenSilently } = useAuth0()
  const [applications, setApplications] = useState<Application[]>([])
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [jobs, setJobs] = useState<Job[]>([])
  const [form, setForm] = useState({ applicantId: '', jobId: '', status: 'APPLIED' })
  const [loading, setLoading] = useState(true)

  const setup = async () => {
    const token = await getAccessTokenSilently()
    setAuthToken(token)
    const [appsRes, applicantsRes, jobsRes] = await Promise.all([
      API.get('/api/applications'),
      API.get('/api/applicants'),
      API.get('/api/jobs'),
    ])
    setApplications(appsRes.data)
    setApplicants(applicantsRes.data)
    setJobs(jobsRes.data)
    setLoading(false)
  }

  useEffect(() => { setup() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await API.post('/api/applications', {
      applicantId: Number(form.applicantId),
      jobId: Number(form.jobId),
      status: form.status,
    })
    setForm({ applicantId: '', jobId: '', status: 'APPLIED' })
    setup()
  }

  const handleDelete = async (id: number) => {
    await API.delete(`/api/applications/${id}`)
    setup()
  }

  return (
    <div className="page">
      <h2>Applications</h2>

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Add New Application</h3>
        <select value={form.applicantId} onChange={e => setForm({ ...form, applicantId: e.target.value })} required>
          <option value="">Select Applicant</option>
          {applicants.map(a => (
            <option key={a.id} value={a.id}>{a.firstName} {a.lastName}</option>
          ))}
        </select>
        <select value={form.jobId} onChange={e => setForm({ ...form, jobId: e.target.value })} required>
          <option value="">Select Job</option>
          {jobs.map(j => (
            <option key={j.id} value={j.id}>{j.title}</option>
          ))}
        </select>
        <select value={form.status} onChange={e => setForm({ ...form, status: e.target.value })}>
          {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <button className="btn-primary" type="submit">Add Application</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <table className="data-table">
          <thead>
            <tr><th>Applicant</th><th>Job</th><th>Status</th><th>Action</th></tr>
          </thead>
          <tbody>
            {applications.map(app => (
              <tr key={app.id}>
                <td>
                  {app.applicant
                    ? `${app.applicant.firstName} ${app.applicant.lastName}`
                    : `Applicant #${app.applicantId}`}
                </td>
                <td>{app.job ? app.job.title : `Job #${app.jobId}`}</td>
                <td>
                  <span className={`badge ${statusClass[app.status] || ''}`}>{app.status}</span>
                </td>
                <td><button className="btn-danger" onClick={() => handleDelete(app.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
