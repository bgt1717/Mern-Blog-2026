import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  function closeMenu() {
    setMenuOpen(false);
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Townsend Blog
        </Link>

        <button
          className={`hamburger ${menuOpen ? "open" : ""}`}
          type="button"
          aria-label="Toggle navigation menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((current) => !current)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className={`navbar-links ${menuOpen ? "active" : ""}`}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "navbar-link active-link" : "navbar-link"
            }
            onClick={closeMenu}
          >
            Home
          </NavLink>

          <NavLink
            to="/create"
            className={({ isActive }) =>
              isActive ? "navbar-link active-link" : "navbar-link"
            }
            onClick={closeMenu}
          >
            Create Post
          </NavLink>

          <NavLink
            to="/login"
            className={({ isActive }) =>
              isActive ? "navbar-link active-link" : "navbar-link"
            }
            onClick={closeMenu}
          >
            Login
          </NavLink>

          <NavLink
            to="/register"
            className={({ isActive }) =>
              isActive ? "navbar-link active-link" : "navbar-link"
            }
            onClick={closeMenu}
          >
            Register
          </NavLink>
        </div>
      </div>
    </nav>
  );
}