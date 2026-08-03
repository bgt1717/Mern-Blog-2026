import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

import "./PostDetails.css";

export default function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchPost() {
      try {
        setLoading(true);
        setError("");

        const response = await API.get(`/posts/${id}`);

        setPost(response.data);
      } catch (err) {
        console.error("Fetch post error:", err);

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

  function getOwnerId() {
    if (!post) {
      return null;
    }

    if (typeof post.author === "object") {
      return post.author?._id;
    }

    return post.author || post.user || post.createdBy;
  }

  function getCurrentUserId() {
    return user?._id || user?.id || user?.userId;
  }

  const isOwner =
    Boolean(getOwnerId()) &&
    Boolean(getCurrentUserId()) &&
    String(getOwnerId()) === String(getCurrentUserId());

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      await API.delete(`/posts/${id}`);

      navigate("/");
    } catch (err) {
      console.error("Delete post error:", err);

      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Unable to delete the post.",
      );
    } finally {
      setDeleting(false);
    }
  }

  function formatDate(dateValue) {
    if (!dateValue) {
      return "";
    }

    return new Date(dateValue).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

  function getAuthorName() {
    if (!post?.author) {
      return "";
    }

    if (typeof post.author === "string") {
      return "";
    }

    return (
      post.author.username ||
      post.author.name ||
      post.author.email ||
      ""
    );
  }

  function getImageUrl() {
    return (
      post?.imageUrl ||
      post?.image ||
      post?.coverImage ||
      post?.featuredImage ||
      ""
    );
  }

  if (loading) {
    return (
      <main className="post-details-page">
        <div className="post-details-message">Loading post...</div>
      </main>
    );
  }

  if (error && !post) {
    return (
      <main className="post-details-page">
        <div className="post-details-message">
          <p>{error}</p>

          <Link to="/" className="back-home-link">
            Return home
          </Link>
        </div>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="post-details-page">
        <div className="post-details-message">
          <p>Post not found.</p>

          <Link to="/" className="back-home-link">
            Return home
          </Link>
        </div>
      </main>
    );
  }

  const imageUrl = getImageUrl();
  const authorName = getAuthorName();

  return (
    <main className="post-details-page">
      <article className="post-details-container">
        <Link to="/" className="back-link">
          ← Back to posts
        </Link>

        {error && (
          <div className="post-details-error" role="alert">
            {error}
          </div>
        )}

        {imageUrl && (
          <img
            className="post-details-image"
            src={imageUrl}
            alt={post.title}
          />
        )}

        <header className="post-details-header">
          {post.category && (
            <span className="post-details-category">
              {post.category}
            </span>
          )}

          <h1>{post.title}</h1>

          <div className="post-details-meta">
            {authorName && <span>By {authorName}</span>}

            {post.createdAt && (
              <span>{formatDate(post.createdAt)}</span>
            )}
          </div>
        </header>

        <div
          className="post-content rich-text-content"
          dangerouslySetInnerHTML={{
            __html: post.content || "",
          }}
        />

        {isOwner && (
          <div className="post-owner-actions">
            <Link
              className="edit-post-button"
              to={`/posts/${post._id}/edit`}
            >
              Edit Post
            </Link>

            <button
              className="delete-post-button"
              type="button"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Post"}
            </button>
          </div>
        )}
      </article>
    </main>
  );
}