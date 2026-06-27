import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api/axios";
import "./Post.css";

export default function Post() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await API.get("/posts");
        const foundPost = res.data.find((p) => p._id === id);

        setPost(foundPost);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return <h2 className="loading">Loading...</h2>;
  }

  if (!post) {
    return <h2 className="loading">Post not found.</h2>;
  }

  return (
    <div className="post-page">
      <span className="post-category">
        {post.category}
      </span>

      <h1>{post.title}</h1>

      <p className="post-author">
        By {post.user?.username}
      </p>

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="post-hero-image"
        />
      )}

      <div className="post-content-page">
        {post.content}
      </div>
    </div>
  );
}