import axios from "axios";

// Add request interceptor to include token
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Helper: Decode JWT and get expiry time
function getTokenExpiry(token) {
  if (!token) return null;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp ? payload.exp * 1000 : null; // Convert to ms
  } catch (e) {
    return null;
  }
}

// Token refresh timer
let refreshTimeoutId;

// Schedule token refresh 1 min before expiry
function scheduleTokenRefresh(token) {
  const expiryTime = getTokenExpiry(token);
  if (!expiryTime) return;

  const now = Date.now();
  const delay = expiryTime - now - 60 * 1000; // refresh 1 min before expiry

  if (delay > 0) {
    refreshTimeoutId = setTimeout(async () => {
      try {
        const newToken = await authService.refreshToken();
        scheduleTokenRefresh(newToken); // Reschedule with new token
      } catch (err) {
        console.error("Auto-refresh failed:", err);
      }
    }, delay);
  }
}

export const authService = {
  async register(userData) {
    try {
      const response = await axios.post("/register/", userData);
      const { access, refresh } = response.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      scheduleTokenRefresh(access);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post("/login/", credentials);
      const { access, refresh } = response.data;
      localStorage.setItem("access_token", access);
      localStorage.setItem("refresh_token", refresh);
      scheduleTokenRefresh(access);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  },

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    clearTimeout(refreshTimeoutId);
  },

  getCurrentUser() {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1];
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      return null;
    }
  },

  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await axios.post("/token/refresh/", {
        refresh: refreshToken,
      });

      const newAccess = response.data.access;
      localStorage.setItem("access_token", newAccess);
      scheduleTokenRefresh(newAccess); // Reschedule refresh
      return newAccess;
    } catch (error) {
      this.logout();
      throw error.response?.data || error;
    }
  },

  initialize() {
    const token = localStorage.getItem("access_token");
    if (token) {
      scheduleTokenRefresh(token);
    }
  },
};
