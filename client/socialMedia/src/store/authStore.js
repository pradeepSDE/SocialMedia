import { create } from "zustand";

const getInitialAuthState = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return { user: null, isAuthenticated: false };

  try {
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

    const userData = JSON.parse(jsonPayload);
    return {
      user: {
        id: userData.user_id,
        name: userData.username,
        email: userData.email,
      },
      isAuthenticated: true,
    };
  } catch (error) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    return { user: null, isAuthenticated: false };
  }
};

export const useAuthStore = create((set) => ({
  ...getInitialAuthState(),
  setUser: (user) => set({ user, isAuthenticated: true }),
  clearUser: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    set({ user: null, isAuthenticated: false });
  },
}));
