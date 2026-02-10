import { useEffect, useState } from "react";
import API from "../api/axios";

export default function Home() {
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

  if (loading) return <p style={{ textAlign: "center" }}>Loading posts...</p>;
  if (error) return <p style={{ color: "red", textAlign: "center" }}>{error}</p>;

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
          }}
        >
          <h2>{post.title}</h2>

          <p style={{ color: "#555", fontSize: "0.9rem" }}>
            By {post.user?.username || "Unknown"} ·{" "}
            {new Date(post.createdAt).toLocaleDateString()}
          </p>

          <p>{post.content}</p>
        </div>
      ))}
    </div>
  );
}
