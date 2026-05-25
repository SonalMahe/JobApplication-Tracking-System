import { useEffect, useState } from 'react'
import { useAuth0 } from '@auth0/auth0-react'
import API, { setAuthToken } from '../api/client'

type Applicant = { id: number; firstName: string; lastName: string; email: string; phoneNumber?: string }

export default function ApplicantsPage() {
  const { getAccessTokenSilently } = useAuth0()
  const [applicants, setApplicants] = useState<Applicant[]>([])
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phoneNumber: '' })
  const [loading, setLoading] = useState(true)

  const fetchApplicants = async () => {
    const token = await getAccessTokenSilently()
    setAuthToken(token)
    const res = await API.get('/api/applicants')
    setApplicants(res.data)
    setLoading(false)
  }

  useEffect(() => { fetchApplicants() }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await API.post('/api/applicants', form)
    setForm({ firstName: '', lastName: '', email: '', phoneNumber: '' })
    fetchApplicants()
  }

  const handleDelete = async (id: number) => {
    await API.delete(`/api/applicants/${id}`)
    fetchApplicants()
  }

  return (
    <div className="page">
      <h2>Applicants</h2>

      <form className="form-card" onSubmit={handleSubmit}>
        <h3>Add New Applicant</h3>
        <input placeholder="First Name" value={form.firstName} onChange={e => setForm({ ...form, firstName: e.target.value })} required />
        <input placeholder="Last Name" value={form.lastName} onChange={e => setForm({ ...form, lastName: e.target.value })} required />
        <input placeholder="Email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
        <input placeholder="Phone Number" value={form.phoneNumber} onChange={e => setForm({ ...form, phoneNumber: e.target.value })} />
        <button className="btn-primary" type="submit">Add Applicant</button>
      </form>

      {loading ? <p>Loading...</p> : (
        <table className="data-table">
          <thead>
            <tr><th>Name</th><th>Email</th><th>Phone</th><th>Action</th></tr>
          </thead>
          <tbody>
            {applicants.map(a => (
              <tr key={a.id}>
                <td>{a.firstName} {a.lastName}</td>
                <td>{a.email}</td>
                <td>{a.phoneNumber || '-'}</td>
                <td><button className="btn-danger" onClick={() => handleDelete(a.id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
