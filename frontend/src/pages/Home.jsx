
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

import "./Home.css";

export default function Home() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Career is the default category visitors see.
  const [activeCategory, setActiveCategory] = useState("Career");

  // Fetch all blog posts.
  useEffect(() => {
    async function fetchPosts() {
      try {
        setLoading(true);
        setError("");

        const res = await API.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.error("Failed to load posts:", err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    }

    fetchPosts();
  }, []);

  // Delete a post.
  async function handleDelete(postId) {
    const confirmDelete = window.confirm("Delete this post?");

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`/posts/${postId}`);

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId)
      );
    } catch (err) {
      console.error("Delete failed:", err);
      window.alert("Delete failed");
    }
  }

  // Check whether the logged-in user owns the post.
  function isPostOwner(post) {
    if (!user) {
      return false;
    }

    const postUserId = post.user?._id || post.user;
    const currentUserId = user._id || user.id || user.userId;

    return String(postUserId) === String(currentUserId);
  }

  // Display only posts belonging to the selected category.
  const filteredPosts = posts.filter((post) => {
    return (
      post.category?.trim().toLowerCase() ===
      activeCategory.toLowerCase()
    );
  });

  if (loading) {
    return <p className="loading">Loading posts...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <main className="home-container">

      {/* Blog Header */}
      <h1 className="home-title">Bryce Townsend's Blog</h1>

      <p className="home-description">
        Career insights, professional experience, data analytics,
        and software development projects.
      </p>

      {/* Category Navigation */}
      <div className="category-navigation">
        <button
          type="button"
          className={`category-tab ${
            activeCategory === "Career" ? "active" : ""
          }`}
          onClick={() => setActiveCategory("Career")}
        >
          Career
        </button>

        <button
          type="button"
          className={`category-tab ${
            activeCategory === "Projects" ? "active" : ""
          }`}
          onClick={() => setActiveCategory("Projects")}
        >
          Projects
        </button>
      </div>

      {/* Section Heading */}
      <h2 className="category-heading">
        {activeCategory === "Career"
          ? "Career & Professional Development"
          : "Projects & Development"}
      </h2>

      {/* Posts */}
      {filteredPosts.length === 0 ? (
        <p className="no-posts">
          {activeCategory === "Career"
            ? "No career posts yet. Check back soon!"
            : "No project posts yet. Check back soon!"}
        </p>
      ) : (
        filteredPosts.map((post) => (
          <article className="post-card" key={post._id}>

            {post.category && (
              <span className="category-badge">
                {post.category}
              </span>
            )}

            <h2 className="post-title">
              <Link
                to={`/posts/${post._id}`}
                className="post-title-link"
              >
                {post.title}
              </Link>
            </h2>

            {post.image && (
              <Link to={`/posts/${post._id}`}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="post-image"
                />
              </Link>
            )}

            <Link
              to={`/posts/${post._id}`}
              className="read-more-btn"
            >
              Read Article →
            </Link>

            {post.user?.username && (
              <small className="post-author">
                <br />
                Author: {post.user.username}
              </small>
            )}

            {isPostOwner(post) && (
              <div className="post-actions">
                <Link
                  to={`/edit/${post._id}`}
                  className="edit-btn"
                >
                  Edit
                </Link>

                <button
                  type="button"
                  className="delete-btn"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              </div>
            )}
          </article>
        ))
      )}
    </main>
  );
}
