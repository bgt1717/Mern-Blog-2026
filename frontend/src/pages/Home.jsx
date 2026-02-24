import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

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

  if (loading)
    return <p style={{ textAlign: "center" }}>Loading posts...</p>;
  if (error)
    return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h1>Latest Posts</h1>

      {posts.length === 0 && <p>No posts yet.</p>}

      {posts.map((post) => (
        <div
          key={post._id}
          style={{
            border: "1px solid #ddd",
            padding: "1rem",
            marginBottom: "1rem",
            borderRadius: "8px",
          }}
        >
          <h3>{post.title}</h3>

          {/* Display image if it exists */}
          {post.image && (
            <img
              src={post.image}
              alt={post.title}
              style={{ maxWidth: "100%", marginBottom: "10px" }}
            />
          )}

          <p>{post.content}</p>
          <small>By {post.user?.username}</small>

          {/* Edit/Delete buttons only for post owner */}
          {user &&
            String(post.user?._id || post.user) === String(user._id) && (
              <div style={{ marginTop: "10px" }}>
                <Link to={`/edit/${post._id}`}>
                  <button
                    style={{
                      marginRight: "10px",
                      background: "#444",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      cursor: "pointer",
                      borderRadius: "4px",
                    }}
                  >
                    Edit
                  </button>
                </Link>

                <button
                  onClick={() => handleDelete(post._id)}
                  style={{
                    background: "red",
                    color: "white",
                    border: "none",
                    padding: "6px 12px",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
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
