import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import '../styles/Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">SkillTracker</Link>
        
        <div className="navbar-links">
          {user ? (
            <>
              <Link to="/dashboard" className="nav-link">
                Dashboard
              </Link>
              <Link to="/skills" className="nav-link">
                Skills
              </Link>
              <div className="user-section">
                <span className="username">
                  Hello, {user.name || user.email}
                </span>
                <button 
                  onClick={handleLogout}
                  className="btn btn-primary"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                Login
              </Link>
              <Link 
                to="/register"
                className="btn btn-primary"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}