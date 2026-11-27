
import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Navbar.css";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function closeMenu() {
    setMenuOpen(false);
  }

  function handleCategoryNavigation(category) {
    closeMenu();

    if (window.location.pathname === "/") {
      window.dispatchEvent(
        new CustomEvent("select-blog-category", {
          detail: category,
        })
      );
    } else {
      navigate(`/?category=${category}`);
    }
  }

  function handleLogout() {
    logout();
    closeMenu();
    navigate("/");
  }

  function navLinkClass({ isActive }) {
    return isActive
      ? "navbar-link active-link"
      : "navbar-link";
  }

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo" onClick={closeMenu}>
          Bryce's Blog
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

          <button
            type="button"
            className="navbar-link"
            onClick={() => handleCategoryNavigation("Career")}
          >
            Career
          </button>

          <button
            type="button"
            className="navbar-link"
            onClick={() => handleCategoryNavigation("Projects")}
          >
            Projects
          </button>

          {user && (
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
          )}
        </div>
      </div>
    </nav>
  );
}
