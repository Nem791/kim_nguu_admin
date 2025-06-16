import type { AuthProvider } from "@refinedev/core";

export const authProvider: AuthProvider = {
  login: async ({ email, password }) => {
    const response = await fetch("http://localhost:3000/admin/login", {
      method: "POST",
      credentials: "include", // <- must include to store cookie
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username: email, password }),
    });

    if (response.ok) {
      return {
        success: true,
        redirectTo: "/",
      };
    } else {
      const error = await response.json();
      return {
        success: false,
        error: {
          name: "Login Error",
          message: error.message || "Invalid credentials",
        },
      };
    }
  },

  logout: async () => {
    await fetch("http://localhost:3000/admin/logout", {
      method: "POST",
      credentials: "include",
    });

    return {
      success: true,
      redirectTo: "/login",
    };
  },

  check: async () => {
    const response = await fetch("http://localhost:3000/admin/me", {
      method: "GET",
      credentials: "include", // <- must include so cookie is sent
    });

    if (response.ok) {
      return {
        authenticated: true,
      };
    }

    return {
      authenticated: false,
      logout: true,
      redirectTo: "/login",
      error: {
        name: "Unauthorized",
        message: "Session expired or not logged in",
      },
    };
  },

  getIdentity: async () => {
    const response = await fetch("http://localhost:3000/admin/me", {
      method: "GET",
      credentials: "include",
    });

    if (!response.ok) return null;

    const user = await response.json();
    return {
      id: user._id,
      name: user.username,
      avatar: "https://i.pravatar.cc/150", // optional
    };
  },

  getPermissions: async () => null,

  onError: async (error) => {
    if (error.status === 401) {
      return {
        logout: true,
        redirectTo: "/login",
        error: {
          name: "Unauthorized",
          message: "Session expired",
        },
      };
    }
    return { error };
  },

  register: async () => ({
    success: false,
    error: {
      name: "Not implemented",
      message: "Registration is not supported",
    },
  }),

  updatePassword: async () => ({ success: true }),
  forgotPassword: async () => ({ success: true }),
};
