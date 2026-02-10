import { useState } from "react";
import API from "../api/axios";
import { useNavigate } from "react-router-dom";

export default function CreatePost() {
  const [formData, setFormData] = useState({
    title: "",
    content: "",
  });

  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await API.post("/posts", formData);
      console.log("POST CREATED:", res.data);

      navigate("/");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to create post");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>Create Post</h2>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Post title"
          value={formData.title}
          onChange={handleChange}
          required
        />

        <br /><br />

        <textarea
          name="content"
          placeholder="Write your post..."
          value={formData.content}
          onChange={handleChange}
          rows={6}
          required
        />

        <br /><br />

        <button type="submit">Publish</button>
      </form>
    </div>
  );
}
