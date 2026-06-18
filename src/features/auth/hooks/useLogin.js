import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/features/profile/services/userService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { getErrorMessage } from "@/lib/apiError";

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { actions: { refreshUser } } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      await userService.login({ email, password });
      await refreshUser();
      navigate("/user/dashboard");
    } catch (err) {
      setError(getErrorMessage(err, "Error de conexión con el servidor."));
    } finally {
      setLoading(false);
    }
  };

  return {
    email,
    setEmail,
    password,
    setPassword,
    showPassword,
    toggleShowPassword: () => setShowPassword((v) => !v),
    loading,
    error,
    handleSubmit,
  };
}
