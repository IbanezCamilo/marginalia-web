import { createContext, useState, useEffect, useCallback } from "react";
import { userService } from "@/features/profile/services/userService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    userService
      .getProfile()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => setUser(null);
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const profile = await userService.getProfile();
      setUser(profile);
      return profile;
    } catch {
      setUser(null);
      return null;
    }
  }, []);

  const logout = useCallback(async () => {
    await userService.logout();
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
        actions: { logout, refreshUser },
        meta: { isAdmin, isModerator, isAuthor, isAuthenticated: !!user },
      }}
    >
      {children}
    </AuthContext>
  );
}
