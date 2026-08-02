import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isLoggedIn = Boolean(user);

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate("/login");
  }

  function navLinkClass({ isActive }) {
    return isActive
      ? "navbar-link active-link"
      : "navbar-link";
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link
          to="/"
          className="navbar-logo"
          onClick={closeMenu}
        >
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
            className={navLinkClass}
            onClick={closeMenu}
          >
            Home
          </NavLink>

          {isLoggedIn ? (
            <>
              <NavLink
                to="/create"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Create Post
              </NavLink>

              <button
                type="button"
                className="navbar-link logout-button"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Login
              </NavLink>

              <NavLink
                to="/register"
                className={navLinkClass}
                onClick={closeMenu}
              >
                Register
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}