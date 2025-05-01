import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";
import Navbar from "./Navbar";

export default function UserProfile() {
  const { userId } = useParams();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`/user-profile/${userId}/`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => {
        setProfile(res.data);
        setLoading(false);
      });
  }, [userId]);

  const handleConnect = async () => {
    await axios.post(
      "/connections/",
      { to_user: userId },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      }
    );
    setProfile({ ...profile, is_connected: true });
  };

  if (loading) return <div>Loading...</div>;
  if (!profile) return <div>User not found.</div>;

  return (
    <div>
      <Navbar />
      <div
        style={{
          maxWidth: 500,
          margin: "40px auto",
          background: "#fff",
          padding: 24,
          borderRadius: 8,
          boxShadow: "0 2px 8px #0001",
        }}
      >
        <h2>{profile.username}'s Profile</h2>
        <div>
          <b>Email:</b> {profile.email}
        </div>
        <div>
          <b>Mobile:</b> {profile.mobile}
        </div>
        {!profile.is_connected && (
          <button onClick={handleConnect} style={{ margin: "16px 0" }}>
            Connect
          </button>
        )}
        <h3>Mutual Connections</h3>
        <ul>
          {profile.mutual_connections.length === 0 && <li>None</li>}
          {profile.mutual_connections.map((u) => (
            <li key={u.id}>{u.username}</li>
          ))}
        </ul>
        <h3>Other Connections</h3>
        <ul>
          {profile.other_connections.length === 0 && <li>None</li>}
          {profile.other_connections.map((u) => (
            <li key={u.id}>{u.username}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
