import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import API from "../api/axios";
import "./Post.css";

export default function Post() {
  const { id } = useParams();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        setError("");

        const response = await API.get("/posts");

        const foundPost = response.data.find(
          (currentPost) => String(currentPost._id) === String(id),
        );

        if (!foundPost) {
          setError("Post not found.");
          return;
        }

        setPost(foundPost);
      } catch (err) {
        console.error("Failed to load post:", err);

        setError(
          err.response?.data?.message ||
            err.response?.data?.error ||
            "Unable to load this post.",
        );
      } finally {
        setLoading(false);
      }
    }

    fetchPost();
  }, [id]);

  if (loading) {
    return <h2 className="loading">Loading...</h2>;
  }

  if (error) {
    return <h2 className="loading">{error}</h2>;
  }

  if (!post) {
    return <h2 className="loading">Post not found.</h2>;
  }

  return (
    <main className="post-page">
      {post.category && (
        <span className="post-category">
          {post.category}
        </span>
      )}

      <h1>{post.title}</h1>

      {post.user?.username && (
        <p className="post-author">
          By {post.user.username}
        </p>
      )}

      {post.image && (
        <img
          src={post.image}
          alt={post.title}
          className="post-hero-image"
        />
      )}

      <div
        className="post-content-page"
        dangerouslySetInnerHTML={{
          __html: post.content || "",
        }}
      />
    </main>
  );
}