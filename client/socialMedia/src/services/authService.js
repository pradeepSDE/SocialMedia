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

export const authService = {
  async register(userData) {
    try {
      const response = await axios.post("/register/", userData);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  async login(credentials) {
    try {
      const response = await axios.post("/login/", credentials);
      // Store tokens in localStorage
      localStorage.setItem("access_token", response.data.access);
      localStorage.setItem("refresh_token", response.data.refresh);
      return response.data;
    } catch (error) {
      throw error.response.data;
    }
  },

  logout() {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },

  getCurrentUser() {
    const token = localStorage.getItem("access_token");
    if (!token) return null;

    // Decode token to get user info
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  },

  // Add method to refresh token
  async refreshToken() {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) throw new Error("No refresh token available");

      const response = await axios.post("/token/refresh/", {
        refresh: refreshToken,
      });

      localStorage.setItem("access_token", response.data.access);
      return response.data.access;
    } catch (error) {
      this.logout();
      throw error;
    }
  },
};
