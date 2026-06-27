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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await API.get("/posts");
        setPosts(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load posts");
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("Delete this post?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/posts/${postId}`);
      setPosts(posts.filter((p) => p._id !== postId));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  if (loading) {
    return <p className="loading">Loading posts...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <div className="home-container">
      <h1 className="home-title">Latest Posts</h1>

      {posts.length === 0 && (
        <p className="no-posts">No posts yet.</p>
      )}

      {posts.map((post) => (
        <div className="post-card" key={post._id}>

          <span className="category-badge">{post.category}</span>

          <h3 className="post-title">{post.title}</h3>

          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              className="post-image"
            />
          )}
          {/* Shows the first 220 characters of the post content, followed by "..." if it's longer than that. */}
          <p className="post-content">
          {post.content.length > 220
            ? `${post.content.substring(0,220)}...`
            : post.content}
        </p>
            <Link
            to={`/posts/${post._id}`}
            className="read-more-btn"
          >
            Read More →
          </Link>

          <small className="post-author">
            By {post.user?.username}
          </small>

          {user &&
            String(post.user?._id || post.user) === String(user._id) && (
              <div className="post-actions">
                <Link to={`/edit/${post._id}`}>
                  <button className="edit-btn">
                    Edit
                  </button>
                </Link>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(post._id)}
                >
                  Delete
                </button>
              </div>
            )}
        </div>
      ))}
    </div>
  );
}
