import { Routes, Route, Navigate } from "react-router";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Connections from "./components/Connections";
import UserSearch from "./components/UserSearch";
import Profile from "./components/Profile";
import Posts from "./components/Posts";
import UserProfile from "./components/UserProfile";
import axios from "axios";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { useEffect } from "react";
import { authService } from "./services/authService.js";

axios.defaults.baseURL = "https://socialmedia-kgvn.onrender.com/api/";
// axios.defaults.baseURL = "http://localhost:8000/api/";

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    authService.initialize();
    authService.refreshToken().catch(() => {}); // Optional: force refresh on first load
  }, []);
  

  return (
    <Routes>
      <Route
        path="/login"
        element={!isAuthenticated ? <Login /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/signup"
        element={!isAuthenticated ? <Signup /> : <Navigate to="/dashboard" />}
      />
      <Route
        path="/dashboard"
        element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
      />
      <Route
        path="/connections"
        element={isAuthenticated ? <Connections /> : <Navigate to="/login" />}
      />
      <Route
        path="/user-search"
        element={isAuthenticated ? <UserSearch /> : <Navigate to="/login" />}
      />
      <Route
        path="/profile"
        element={isAuthenticated ? <Profile /> : <Navigate to="/login" />}
      />
      <Route
        path="/posts"
        element={isAuthenticated ? <Posts /> : <Navigate to="/login" />}
      />
      <Route
        path="/user/:userId"
        element={isAuthenticated ? <UserProfile /> : <Navigate to="/login" />}
      />
      <Route
        path="/"
        element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
      />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <div className="app">
        <AppRoutes />
      </div>
    </AuthProvider>
  );
}

export default App;
