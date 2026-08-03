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

  function decodeHtml(html = "") {
    const textarea = document.createElement("textarea");

    textarea.innerHTML = html;

    return textarea.value;
  }

  function getOwner() {
    if (!post) {
      return null;
    }

    return post.user || post.author || post.createdBy || null;
  }

  function getOwnerId() {
    const owner = getOwner();

    if (!owner) {
      return null;
    }

    if (typeof owner === "object") {
      return owner._id || owner.id || owner.userId || null;
    }

    return owner;
  }

  function getCurrentUserId() {
    return user?._id || user?.id || user?.userId || null;
  }

  function getAuthorName() {
    const owner = getOwner();

    if (!owner || typeof owner === "string") {
      return "";
    }

    return owner.username || owner.name || owner.email || "";
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

  function formatDate(dateValue) {
    if (!dateValue) {
      return "";
    }

    const date = new Date(dateValue);

    if (Number.isNaN(date.getTime())) {
      return "";
    }

    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }

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

  if (loading) {
    return (
      <main className="post-details-page">
        <div className="post-details-message">
          Loading post...
        </div>
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

  const ownerId = getOwnerId();
  const currentUserId = getCurrentUserId();

  const isOwner =
    Boolean(ownerId) &&
    Boolean(currentUserId) &&
    String(ownerId) === String(currentUserId);

  const imageUrl = getImageUrl();
  const authorName = getAuthorName();

  const renderedContent = decodeHtml(post.content || "");

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
            alt={post.title || "Blog post"}
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
            __html: renderedContent,
          }}
        />

        {isOwner && (
          <div className="post-owner-actions">
            <Link
              className="edit-post-button"
              to={`/edit/${post._id}`}
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