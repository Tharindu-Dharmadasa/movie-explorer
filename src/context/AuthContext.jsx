import { createContext, useContext, useState } from "react";
import { getStorage, setStorage, removeStorage } from "../utils/storage";

const AuthContext = createContext(null);

const USERS_KEY = "me_users"; // all registered accounts (mock database)
const SESSION_KEY = "me_user"; // the currently logged-in user

const DEMO = {
  name: "Demo User",
  email: "demo@movieexplorer.com",
  password: "demo123",
};

// Never store plain-text passwords. Hash email + password with SHA-256.
async function hashPassword(email, password) {
  const data = new TextEncoder().encode(`${email}:${password}`);
  const buffer = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStorage(SESSION_KEY));

  const startSession = (sessionUser) => {
    setUser(sessionUser);
    setStorage(SESSION_KEY, sessionUser);
    return { ok: true };
  };

  // Create a new account, then log in.
  const register = async ({ name, email, password }) => {
    const cleanEmail = email.trim().toLowerCase();
    const users = getStorage(USERS_KEY, []);

    if (users.some((u) => u.email === cleanEmail)) {
      return {
        ok: false,
        error: "An account with this email already exists. Try signing in.",
      };
    }

    const passwordHash = await hashPassword(cleanEmail, password);
    setStorage(USERS_KEY, [
      ...users,
      { name: name.trim(), email: cleanEmail, passwordHash },
    ]);
    return startSession({ username: name.trim(), email: cleanEmail });
  };

  // Log in with email + password.
  const login = async (email, password) => {
    const cleanEmail = email.trim().toLowerCase();
    const found = getStorage(USERS_KEY, []).find((u) => u.email === cleanEmail);
    const passwordHash = await hashPassword(cleanEmail, password);

    // Same message for both failures so we don't reveal which emails exist.
    if (!found || found.passwordHash !== passwordHash) {
      return { ok: false, error: "Invalid email or password." };
    }
    return startSession({ username: found.name, email: found.email });
  };

  // One-click demo account for reviewers.
  const loginDemo = async () => {
    const created = await register(DEMO);
    return created.ok ? created : login(DEMO.email, DEMO.password);
  };

  const logout = () => {
    setUser(null);
    removeStorage(SESSION_KEY);
  };

  return (
    <AuthContext.Provider value={{ user, register, login, loginDemo, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
