import { useAuth0 } from '@auth0/auth0-react'

export default function LoginPage() {
  const { loginWithRedirect } = useAuth0()

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Job Application Tracker</h1>
        <p>Track jobs, applicants, and interviews in one place.</p>
        <button className="btn-primary" onClick={() => {
          console.log('button clicked, loginWithRedirect:', typeof loginWithRedirect)
          loginWithRedirect()
        }}>
          Login / Sign Up
        </button>
      </div>
    </div>
  )
}
