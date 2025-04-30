import React, { useState } from "react";
import axios from "axios";

export default function UserSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await axios.get(
      `http://localhost:8000/api/user-search/?q=${encodeURIComponent(query)}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    setResults(res.data);
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
      <form onSubmit={handleSearch}>
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search users..."
        />
        <button type="submit">Search</button>
      </form>
      <ul>
        {results.map((user) => (
          <li key={user.id}>
            {user.username} ({user.email}, {user.mobile})
            <button onClick={() => handleConnect(user.id)}>Connect</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
