import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import "./CreatePost.css";

export default function CreatePost() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState("SQL");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !content) {
      alert("Title and content are required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("category", category);

      if (image) formData.append("image", image);

      // Send post request
      await API.post("/posts", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      navigate("/");
    } catch (err) {
      console.error("🔥 Create post error:", err);
      alert("Failed to create post");
    }
  };

return (
  <div className="create-container">
    <div className="create-card">
      <h2>Create New Post</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <div className="form-group">
          <label>Image (optional)</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />
        </div>

        <div className="form-group">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Programming">Programming</option>
            <option value="AI">AI</option>
            <option value="Tutorials">Tutorials</option>
            <option value="Career">Career</option>
            <option value="Personal">Personal</option>
          </select>
        </div>
        
        <div className="form-group">
          <label>Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <button type="submit" className="submit-btn">
          Create Post
        </button>
      </form>

      {image && (
        <div className="image-preview">
          <p>Preview:</p>
          <img
            src={URL.createObjectURL(image)}
            alt="preview"
          />
        </div>
      )}
    </div>
  </div>
);
}
