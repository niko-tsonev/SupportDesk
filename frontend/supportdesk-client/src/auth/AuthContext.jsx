import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    const role = localStorage.getItem("role");
    const userName = localStorage.getItem("userName");
    const userId = localStorage.getItem("userId");
    const expiresAt = localStorage.getItem("expiresAt");

    if (token && role) {
      // Check if token is expired
      if (expiresAt && new Date(expiresAt) <= new Date()) {
        // Token expired, clear everything
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        localStorage.removeItem("expiresAt");
        setUser(null);
      } else {
        setUser({ token, role, userName, userId });
      }
    }

    setLoading(false);
  }, []);

  const login = (token, role, userName, userId, expiresAt) => {
    localStorage.setItem("accessToken", token);
    localStorage.setItem("role", role);
    localStorage.setItem("userName", userName);
    localStorage.setItem("userId", userId);
    localStorage.setItem("expiresAt", expiresAt);
    setUser({ token, role, userName, userId });
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("userName");
    localStorage.removeItem("userId");
    localStorage.removeItem("expiresAt");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
