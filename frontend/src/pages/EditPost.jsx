import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";
import "./EditPost.css";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [currentImage, setCurrentImage] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [category, setCategory] = useState("SQL");

  // Fetch post
  useEffect(() => {
    const fetchPost = async () => {
      const res = await API.get(`/posts`);
      const post = res.data.find((p) => p._id === id);

      if (post) {
        setTitle(post.title);
        setContent(post.content);
        setCurrentImage(post.image);
        setCategory(post.category);
      }
    };

    fetchPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("category", category);

    if (newImage) {
      formData.append("image", newImage);
    }

    await API.put(`/posts/${id}`, formData);

    navigate("/");
  };

  return (
    <div className="edit-container">
      <h2>Edit Post</h2>
      
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
        />

        {/* Category Dropdown */}
        <div className="form-group">
          <label>Category</label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="Web Development">Programming</option>
            <option value="SQL">SQL</option>
            <option value="AI">AI</option>
            <option value="Projects">Career</option>
            <option value="Personal">Personal</option>
          </select>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Content"
        />


        {/* Show existing image */}
        {currentImage && !newImage && (
          <div>
            <p>Current Image:</p>
            <img
              src={currentImage}
              alt="Current"
              style={{ width: "200px", marginBottom: "10px" }}
            />
          </div>
        )}

        {/* Show preview of new image */}
        {newImage && (
          <div>
            <p>New Image Preview:</p>
            <img
              src={URL.createObjectURL(newImage)}
              alt="Preview"
              style={{ width: "200px", marginBottom: "10px" }}
            />
          </div>
        )}

        <input
          type="file"
          onChange={(e) => setNewImage(e.target.files[0])}
          
        />
        
        <button type="submit">Update Post</button>
      </form>
    </div>
  );
}