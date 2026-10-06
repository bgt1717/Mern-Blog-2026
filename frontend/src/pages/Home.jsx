import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

import "./Home.css";

export default function Home() {
  //Destructuring the user object from the AuthContext to get the current authenticated user.
  const { user } = useAuth();

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  /* 
   useEffect Hook allows us to perform side effects in functional components, such as fetching data when the component mounts.
   The empty dependency array [] ensures that the effect runs only once when the component mounts.
   This effect will run once when the component mounts and will not re-run on subsequent renders.
   This ensures that the component fetches the latest posts only once when it is mounted.
   /

  /*
  Component renders
       ↓
    useEffect runs
          ↓
    Fetch blog posts
          ↓
    Store posts in state
          ↓
    React renders the posts
  */
  useEffect(() => {
    async function fetchPosts() {
      try {
        //The reason we set loading to true and clear any previous error is to indicate that we are in the process of fetching data.
        //If a user tries to refresh the page or navigate away and back, the loading state will be reset.
        setLoading(true);
        setError("");
        const res = await API.get("/posts");
        //Log the fetched posts to the console for debugging purposes.
        //console.log(res.data);
        //Log the first post to the console for debugging purposes.
        //console.log(res.data[1]);
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

  async function handleDelete(postId) {
    const confirmDelete = window.confirm("Delete this post?");

    if (!confirmDelete) {
      return;
    }

    try {
      await API.delete(`/posts/${postId}`);

      setPosts((currentPosts) =>
        currentPosts.filter((post) => post._id !== postId),
      );
    } catch (err) {
      console.error("Delete failed:", err);
      window.alert("Delete failed");
    }
  }

  function isPostOwner(post) {
    if (!user) {
      return false;
    }

    const postUserId = post.user?._id || post.user;
    const currentUserId = user._id || user.id || user.userId;

    return String(postUserId) === String(currentUserId);
  }

  if (loading) {
    return <p className="loading">Loading posts...</p>;
  }

  if (error) {
    return <p className="error">{error}</p>;
  }

  return (
    <main className="home-container">
      <h1 className="home-title">Latest Posts</h1>
      <p className="home-description">
        Welcome to the blog! Here you can find the latest posts from various authors.
      </p>

      {posts.length === 0 && (
        <p className="no-posts">No posts yet.</p>
      )}

      {posts.map((post) => (
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
            <br/>  Author: {post.user.username}
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
      ))}
    </main>
  );
}