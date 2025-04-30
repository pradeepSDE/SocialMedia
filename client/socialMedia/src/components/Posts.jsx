import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import axios from "axios";

export default function Posts() {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);
  const [audience, setAudience] = useState("public");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const res = await axios.get("http://localhost:8000/api/posts/", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
      },
    });
    setPosts(res.data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append("text", text);
    if (image) formData.append("image", image);
    formData.append("audience", audience);
    await axios.post("http://localhost:8000/api/posts/", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    setText("");
    setImage(null);
    setAudience("public");
    setLoading(false);
    fetchPosts();
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 500, margin: "40px auto" }}>
        <h2>Create Post</h2>
        <form onSubmit={handleSubmit} style={{ marginBottom: 32 }}>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="What's on your mind?"
            required
            style={{ width: "100%", minHeight: 60, marginBottom: 8 }}
            disabled={loading}
          />
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
            disabled={loading}
          />
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            disabled={loading}
            style={{ marginLeft: 8 }}
          >
            <option value="public">Public</option>
            <option value="connections">Connections</option>
            <option value="private">Private</option>
          </select>
          <button type="submit" disabled={loading} style={{ marginLeft: 8 }}>
            {loading ? "Posting..." : "Post"}
          </button>
        </form>
        <h2>Posts Feed</h2>
        {posts.map((post) => (
          <div
            key={post.id}
            style={{
              border: "1px solid #ccc",
              margin: 8,
              padding: 8,
              borderRadius: 6,
            }}
          >
            <div>
              <b>{post.user}</b> ({post.audience})
            </div>
            <div>{post.text}</div>
            {post.image && (
              <img
                src={post.image}
                alt="post"
                style={{ maxWidth: 200, marginTop: 8 }}
              />
            )}
            <div style={{ fontSize: 12, color: "#888" }}>
              {new Date(post.created).toLocaleString()}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
