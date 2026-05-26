import API from '../api/client'
import { useEffect, useState } from 'react'


type Applicant = { id: number; firstName: string; lastName: string; email: string; phoneNumber?: string }

export default function ApplicantsPage() {
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '' })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchApplicants = async () => {
    try {
      const res = await API.get('/api/applicants')
      setApplicants(res.data)
      setError('')
    } catch {
      setError('Failed to load applicants. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchApplicants() }, [])

  const handleSubmit = async (e: React.SyntheticEvent) => {
    e.preventDefault()
    try {
      await API.post('/api/applicants', form)
      setForm({ firstName: '', lastName: '', email: '', phoneNumber: '' })
      setError('')
      fetchApplicants()
    } catch {
      setError('Failed to add applicant. Please try again.')
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/api/applicants/${id}`)
      fetchApplicants()
    } catch {
      setError('Failed to delete applicant. Please try again.')
    }
  }

  return (
    <div className="page">
      <h2>Applicants</h2>

      {error && <p className="error-msg">{error}</p>}

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Add New Applicant</h3>
        <input placeholder="First Name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
        <input placeholder="Last Name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Phone Number" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
        <button className="btn-primary" type="submit">Add Applicant</button>
      </form>

      {loading && <p className="loading-msg">Loading...</p>}
      {!loading && (
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Action</th></tr>
          </thead>
          <tbody>
            {applicants.length === 0
              ? <tr><td colSpan={4} className="empty-state">No applicants found. Add one above.</td></tr>
              : applicants.map(a => (
                <tr key={a.id}>
                  <td>{a.firstName} {a.lastName}</td>
                  <td>{a.email}</td>
                  <td>{a.phoneNumber || '-'}</td>
                  <td><button className="btn-danger" onClick={() => handleDelete(a.id)}>Delete</button></td>
                </tr>
              ))
            }
          </tbody>
        </table>
      )}
    </div>
  )
}
