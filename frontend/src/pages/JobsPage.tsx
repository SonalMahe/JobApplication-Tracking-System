import API from '../api/client'
import { useEffect, useState } from 'react'


type Job = { id: number; title: string; department: string; location: string }

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([])
  const [form, setForm] = useState({ title: '', department: '', location: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchJobs = async () => {
    try {
      const res = await API.get('/api/jobs')
      setJobs(res.data)
      setError('')
    } catch {
      setError('Failed to load jobs. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchJobs() }, [])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await API.post('/api/jobs', form)
      setForm({ title: '', department: '', location: '' })
      setError('')
      fetchJobs()
    } catch {
      setError('Failed to add job. Please try again.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/api/jobs/${id}`)
      fetchJobs()
    } catch {
      setError('Failed to delete job. Please try again.')
    }
  }

  return (
    <div className="page">
      <h2>Jobs</h2>

      {error && <p className="error-msg">{error}</p>}

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Add New Job</h3>
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required />
        <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
        <button className="btn-primary" type="submit">Add Job</button>
      </form>

      {loading && <p className="loading-msg">Loading...</p>}
      {!loading && (
        <table className="data-table">
          <thead>
            <tr><th>Title</th><th>Department</th><th>Location</th><th>Action</th></tr>
          </thead>
          <tbody>
            {jobs.length === 0
              ? <tr><td colSpan={4} className="empty-state">No jobs found. Add one above.</td></tr>
              : jobs.map(job => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.department}</td>
                  <td>{job.location}</td>
                  <td><button className="btn-danger" onClick={() => handleDelete(job.id)}>Delete</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      )}
    </div>
  )
}
