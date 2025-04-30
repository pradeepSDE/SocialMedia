import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const toastId = toast.loading("Signing up...");

    if (password !== password2) {
      setError("Passwords do not match");
      toast.error("Passwords do not match", { id: toastId });
      setLoading(false);
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
      toast.success("Registration successful!", { id: toastId });
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.error || "Registration failed. Please try again.");
      toast.error(error.error || "Registration failed. Please try again.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
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
            disabled={loading}
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={password2}
            onChange={(e) => setPassword2(e.target.value)}
            required
            disabled={loading}
          />
          <button type="submit" disabled={loading}>
            {loading ? "Signing up..." : "Sign Up"}
          </button>
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Signup;
