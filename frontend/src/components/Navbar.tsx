import { useAuth0 } from '@auth0/auth0-react'
import { Link } from 'react-router-dom'

export default function Navbar() {
  const { user, logout } = useAuth0()

  return (
    <nav className="navbar">
      <div className="navbar-brand">Job Tracker</div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/applicants">Applicants</Link>
        <Link to="/applications">Applications</Link>
        <Link to="/interviews">Interviews</Link>
      </div>
      <div className="navbar-user">
        <span>{user?.name}</span>
        <button onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}>
          Logout
        </button>
      </div>
    </nav>
  )
}
