import { Routes, Route, Navigate } from "react-router";
import { useAuthStore } from "./store/authStore";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Connections from "./components/Connections";
import UserSearch from "./components/UserSearch";
import Profile from "./components/Profile";
import Posts from "./components/Posts";
import { useEffect } from "react";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const setUser = useAuthStore((state) => state.setUser);
  const clearUser = useAuthStore((state) => state.clearUser);

  useEffect(() => {
    const user = localStorage.getItem("user");

    if (user) {
      try {
    
        setUser({
          id: user.user_id,
          name: user.username,
          email: user.email,
          mobile: user.mobile,
        });
      } catch (err) {
        console.error("Token decode failed", err);
        clearUser();
      }
    } else {
      clearUser();
    }
  }, []);
  return (
    <div className="app">
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
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
