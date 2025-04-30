import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Connections() {
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/connections/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      })
      .then((res) => setConnections(res.data));
  }, []);

  return (
    <div>
      <h3>Your Connections</h3>
      <ul>
        {connections.map((conn) => (
          <li key={conn.id}>{conn.to_user}</li>
        ))}
      </ul>
    </div>
  );
}
