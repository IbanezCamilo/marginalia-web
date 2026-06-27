import { createContext, useState, useEffect, useCallback, useRef } from "react";
import { toast } from "sonner";
import { userService } from "@/features/profile/services/userService";

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const userRef = useRef(null);

  useEffect(() => {
    userRef.current = user;
  }, [user]);

  useEffect(() => {
    userService
      .getProfile()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const handleSessionExpired = () => {
      // The anonymous first-load profile check also 401s and goes through
      // this same event — only notify when there was a real logged-in session.
      if (userRef.current) {
        toast.error("Tu sesión ha expirado. Inicia sesión nuevamente.");
      }
      setUser(null);
    };
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
    try {
      await userService.logout();
    } finally {
      setUser(null);
    }
  }, []);

  // Derived booleans — consumers subscribe to stable booleans, not the raw role string
  const isAdmin = user?.role === "ADMIN";
  const isModerator = user?.role === "MODERATOR";
  const isAuthor = user?.role === "AUTHOR";
  const isOwner = user?.role === "OWNER";

  return (
    <AuthContext
      value={{
        state: { user, loading },
        actions: { logout, refreshUser },
        meta: { isAdmin, isModerator, isAuthor, isOwner, isAuthenticated: !!user },
      }}
    >
      {children}
    </AuthContext>
  );
}
