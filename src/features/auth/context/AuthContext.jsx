import { createContext, useState, useEffect, useCallback } from "react";
import { userService } from "@/features/profile/services/userService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userService.isAuthenticated()) {
      setLoading(false);
      return;
    }
    userService
      .getProfile()
      .then(setUser)
      .catch((err) => {
        if (import.meta.env.DEV) console.error("[AuthContext] profile fetch failed:", err);
        setUser(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const logout = useCallback(() => {
    userService.logout();
    setUser(null);
  }, []);

  // Derived booleans — consumers subscribe to stable booleans, not the raw role string
  const isAdmin = user?.role === "ADMIN";
  const isModerator = user?.role === "MODERATOR";
  const isAuthor = user?.role === "AUTHOR";

  return (
    <AuthContext
      value={{
        state: { user, loading },
        actions: { logout },
        meta: { isAdmin, isModerator, isAuthor, isAuthenticated: !!user },
      }}
    >
      {children}
    </AuthContext>
  );
}
