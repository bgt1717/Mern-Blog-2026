import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../api/axios";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", content: "" });

  useEffect(() => {
    const fetchPost = async () => {
      const res = await API.get(`/posts/${id}`);
      setFormData({
        title: res.data.title,
        content: res.data.content,
      });
    };
    fetchPost();
  }, [id]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await API.put(`/posts/${id}`, formData);
    navigate("/");
  };

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto" }}>
      <h2>Edit Post</h2>

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
        />
        <br /><br />
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows={6}
          required
        />
        <br /><br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
}
