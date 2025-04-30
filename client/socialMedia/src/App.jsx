import { Routes, Route, Navigate } from "react-router";
import { useAuthStore } from "./store/authStore";
import Login from "./components/auth/Login.jsx";
import Signup from "./components/auth/Signup.jsx";
import Dashboard from "./components/Dashboard.jsx";
import Connections from "./components/Connections";
import UserSearch from "./components/UserSearch";

function App() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

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
          path="/"
          element={<Navigate to={isAuthenticated ? "/dashboard" : "/login"} />}
        />
      </Routes>
    </div>
  );
}

export default App;
