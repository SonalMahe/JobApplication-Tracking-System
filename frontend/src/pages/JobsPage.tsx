import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import API, { setAuthToken } from '../api/client'

type Job = { id: number; title: string; department: string; location: string }

export default function JobsPage() {
  const { getAccessTokenSilently } = useAuth0()
  const [jobs, setJobs] = useState<Job[]>([])
  const [form, setForm] = useState({ title: '', department: '', location: '' })
  const [loading, setLoading] = useState(true)

  const fetchJobs = async () => {
    const token = await getAccessTokenSilently()
    setAuthToken(token)
    const res = await API.get('/api/jobs')
    setJobs(res.data)
    setLoading(false)
  }

  useEffect(() => { fetchJobs() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await API.post('/api/jobs', form)
    setForm({ title: '', department: '', location: '' })
    fetchJobs()
  }

  const handleDelete = async (id: number) => {
    await API.delete(`/api/jobs/${id}`)
    fetchJobs()
  }

  return (
    <div className="page">
      <h2>Jobs</h2>

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Add New Job</h3>
        <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
        <input placeholder="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} required />
        <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} required />
        <button className="btn-primary" type="submit">Add Job</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <table className="data-table">
          <thead>
            <tr><th>Title</th><th>Department</th><th>Location</th><th>Action</th></tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr key={job.id}>
                <td>{job.title}</td>
                <td>{job.department}</td>
                <td>{job.location}</td>
                <td><button className="btn-danger" onClick={() => handleDelete(job.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
