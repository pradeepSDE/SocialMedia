import React from "react";
import { Link } from "react-router";

export default function Navbar() {
  return (
    <nav
      style={{
        display: "flex",
        gap: 20,
        padding: 16,
        background: "#222",
        color: "#fff",
      }}
    >
      <Link to="/dashboard" style={{ color: "#fff" }}>
        Home
      </Link>
      <Link to="/profile" style={{ color: "#fff" }}>
        Profile
      </Link>
      <Link to="/posts" style={{ color: "#fff" }}>
        Posts
      </Link>
      <Link to="/connections" style={{ color: "#fff" }}>
        Connections
      </Link>
    </nav>
  );
}
