import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await authService.login({ email, password });
      setUser({
        id: response.user_id,
        name: response.username,
        email: response.email,
      });
      navigate("/dashboard");
    } catch (error) {
      setError(error.error || "Login failed. Please try again.");
    }
  };

  return (
    <div className="auth-page-center">
      <div className="auth-container">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
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
          <button type="submit">Login</button>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
