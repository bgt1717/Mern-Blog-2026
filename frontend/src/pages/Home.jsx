
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeCategory, setActiveCategory] = useState("Career");

  const [searchParams, setSearchParams] = useSearchParams();

  // Fetch blog posts from the backend
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

  // Listen for Career and Projects navbar selections
  useEffect(() => {
    function handleCategoryChange(event) {
      setActiveCategory(event.detail);
    }

    window.addEventListener(
      "select-blog-category",
      handleCategoryChange
    );

    return () => {
      window.removeEventListener(
        "select-blog-category",
        handleCategoryChange
      );
    };
  }, []);

  // Handle category navigation from other pages
  useEffect(() => {
    const category = searchParams.get("category");

    if (category === "Career" || category === "Projects") {
      setActiveCategory(category);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  // Delete a blog post
  async function handleDelete(postId) {
    const confirmDelete = window.confirm("Delete this post?");

    if (!confirmDelete) return;

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

  // Check whether the logged-in user owns a post
  function isPostOwner(post) {
    if (!user) return false;

    const postUserId = post.user?._id || post.user;
    const currentUserId = user._id || user.id || user.userId;

    return String(postUserId) === String(currentUserId);
  }

  // Filter posts based on the selected category
  const filteredPosts = posts.filter(
    (post) =>
      post.category?.trim().toLowerCase() ===
      activeCategory.toLowerCase()
  );

  if (loading) {
    return <p className="loading">Loading posts...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <main className="home-container">
      <h1 className="home-title">Bryce Townsend's Blog</h1>

      <p className="home-description">
        Career insights, professional experience, data analytics,
        and software development projects.
      </p>

      {/* Category navigation */}
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

      {/* Selected category heading */}
      <h2 className="category-heading">
        {activeCategory === "Career"
          ? "Career & Professional Development"
          : "Projects & Development"}
      </h2>

      {/* Display posts */}
      {filteredPosts.length === 0 ? (
        <p className="no-posts">
          {activeCategory === "Career"
            ? "No career posts yet. Check back soon!"
            : "No project posts yet. Check back soon!"}
        </p>
      ) : (
        filteredPosts.map((post) => (
          <article className="post-card" key={post._id}>
            {/* Category badge */}
            {post.category && (
              <span className="category-badge">
                {post.category}
              </span>
            )}

            {/* Post title */}
            <h2 className="post-title">
              <Link
                to={`/posts/${post._id}`}
                className="post-title-link"
              >
                {post.title}
              </Link>
            </h2>

            {/* Post image */}
            {post.image && (
              <Link to={`/posts/${post._id}`}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="post-image"
                />
              </Link>
            )}

            {/* Read article link */}
            <Link
              to={`/posts/${post._id}`}
              className="read-more-btn"
            >
              Read Article →
            </Link>

            {/* Author */}
            {post.user?.username && (
              <small className="post-author">
                <br />
                Author: {post.user.username}
              </small>
            )}

            {/* Edit and delete controls */}
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
