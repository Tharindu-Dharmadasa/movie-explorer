import { createContext, useContext, useState } from "react";
import { getStorage, setStorage, removeStorage } from "../utils/storage";

const AuthContext = createContext(null);

// Mock authentication: there is no backend. Documented in the README.
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStorage("me_user"));

  const login = (username, password) => {
    if (!username.trim()) return { ok: false, error: "Username is required." };
    if (password.length < 6)
      return { ok: false, error: "Password must be at least 6 characters." };
    const newUser = { username: username.trim() };
    setUser(newUser);
    setStorage("me_user", newUser);
    return { ok: true };
  };

  const logout = () => {
    setUser(null);
    removeStorage("me_user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
