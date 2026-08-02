import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="nav-left">
        <Link to="/" className="logo">
          Bryce's Blog
        </Link>
      </div>

      <div className="nav-right">
        <Link to="/" className="home-link">Home</Link>

        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="primary-link">
              Register
            </Link>
          </>
        ) : (
          <>
            <Link to="/create">Create Post</Link>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}