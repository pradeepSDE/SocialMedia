import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (password !== password2) {
      setError("Passwords do not match");
      return;
    }

    try {
      const response = await authService.register({
        username,
        email,
        password,
        password2,
      });
      setUser({
        id: response.user_id,
        name: response.username,
        email: response.email,
      });
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="auth-page-center">
      <div className="auth-container">
        <h2>Sign Up</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
          />
          <button type="submit">Sign Up</button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
