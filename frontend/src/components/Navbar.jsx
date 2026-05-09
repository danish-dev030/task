import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';

export default function Navbar() {
  const { user, token, logout } = useAuthStore();
  const navigate = useNavigate();

  const initials = user?.name
    ? user.name
        .split(' ')
        .slice(0, 2)
        .map((p) => p[0])
        .join('')
        .toUpperCase()
    : 'PX';

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <Link to="/" className="logo">
          Pixora
        </Link>
        {!token ? (
          <nav className="nav-right">
            <Link to="/login">Login</Link>
            <Link to="/signup" className="btn btn-sm">
              Sign Up
            </Link>
          </nav>
        ) : (
          <nav className="nav-right">
            {user?.role === 'creator' ? (
              <>
                <Link to="/creator">Dashboard</Link>
                <Link to="/creator/upload">Upload Photo</Link>
              </>
            ) : (
              <Link to="/feed">Feed</Link>
            )}
            <div className="avatar">{initials}</div>
            <span>{user?.name}</span>
            <button
              className="ghost-btn"
              onClick={() => {
                logout();
                navigate('/login');
              }}
            >
              Logout
            </button>
          </nav>
        )}
      </div>
    </header>
  );
}
