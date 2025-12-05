import { createContext, useState } from "react";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const saved = localStorage.getItem("sf_user");
  const [user, setUser] = useState(saved ? JSON.parse(saved) : null);

  const login = (userData, token) => {
    localStorage.setItem("sf_user", JSON.stringify(userData));
    localStorage.setItem("sf_token", token || "");
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("sf_user");
    localStorage.removeItem("sf_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
