import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axios";

export default function Blog() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await API.get("/posts");
      setPosts(res.data);
    };

    fetchPosts();
  }, []);

  return (
    <div style={{ maxWidth: "800px", margin: "2rem auto" }}>
      <h1>Public Blog</h1>

      {posts.map((post) => (
        <div key={post._id} style={{ marginBottom: "2rem" }}>
          <h2>{post.title}</h2>
          <p>{post.content.substring(0, 150)}...</p>

          <Link to={`/blog/${post._id}`}>
            <button>Read More</button>
          </Link>
        </div>
      ))}
    </div>
  );
}
