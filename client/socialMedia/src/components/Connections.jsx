import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./Navbar";

export default function Connections() {
  const [connections, setConnections] = useState([]);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/connections/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => setConnections(res.data));
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    const res = await axios.get(
      `http://localhost:8000/api/user-search/?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    setResults(res.data);
    setLoading(false);
  };

  const handleConnect = async (to_user) => {
    await axios.post(
      "http://localhost:8000/api/connections/",
      { to_user },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    alert("Connected!");
  };

  return (
    <div>
      <Navbar />
      <div style={{ maxWidth: 600, margin: "40px auto" }}>
        <h2>Your Connections</h2>
        <ul>
          {connections.map((conn) => (
            <li key={conn.id}>{conn.to_user}</li>
          ))}
        </ul>
        <h2>Find Users</h2>
        <form onSubmit={handleSearch} style={{ marginBottom: 16 }}>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search users by name, email, or mobile..."
            style={{ width: 300, marginRight: 8 }}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Searching..." : "Search"}
          </button>
        </form>
        <ul>
          {results.map((user) => (
            <li key={user.id}>
              {user.username} ({user.email}, {user.mobile})
              <button
                style={{ marginLeft: 8 }}
                onClick={() => handleConnect(user.id)}
              >
                Connect
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
