import React from "react";
import Navbar from "./Navbar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router";

export default function Profile() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <div>Please log in to view your profile.</div>;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div>
      <Navbar />
      <div
        style={{
          maxWidth: 400,
          margin: "40px auto",
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px #0001",
        }}
      >
        <h2>Profile</h2>
        <div>
          <b>Username:</b> {user.name}
        </div>
        <div>
          <b>Email:</b> {user.email}
        </div>
        {user.mobile && (
          <div>
            <b>Mobile:</b> {user.mobile}
          </div>
        )}
        <button
          onClick={handleLogout}
          style={{
            marginTop: 24,
            background: "#dc2626",
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
