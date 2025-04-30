import React, { useState } from "react";
import "./auth.css";
import { Link, useNavigate } from "react-router";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../store/authStore";
import { toast } from "react-hot-toast";

const Login = () => {
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const setUser = useAuthStore((state) => state.setUser);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const toastId = toast.loading("Logging in...");
    try {
      const response = await authService.login({ mobile, password });
      setUser({
        id: response.user_id,
        name: response.username,
        email: response.email,
        mobile: response.mobile,
      });
      toast.success("Login successful!", { id: toastId });
      navigate("/dashboard");
    } catch (error) {
      setError(error.error || "Login failed. Please try again.");
      toast.error(error.error || "Login failed. Please try again.", {
        id: toastId,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-center">
      <div className="auth-container">
        <h2>Login</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Mobile Number"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
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
          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
          <p>
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
