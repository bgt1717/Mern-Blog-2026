import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav
      style={{
        padding: "1rem",
        borderBottom: "1px solid #ddd",
        display: "flex",
        gap: "1rem",
        alignItems: "center",
      }}
    >
      <Link to="/">Home</Link>

      {!user ? (
        <>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
        </>
      ) : (
        <>
          <Link to="/create">Create Post</Link>
          <button
            onClick={logout}
            style={{
              cursor: "pointer",
              background: "none",
              border: "1px solid #ccc",
              padding: "0.25rem 0.5rem",
            }}
          >
            Logout
          </button>
        </>
      )}
    </nav>
  );
}
