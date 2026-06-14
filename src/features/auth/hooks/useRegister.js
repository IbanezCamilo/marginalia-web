import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/features/profile/services/userService";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function useRegister() {
  const [name, setName] = useState("");
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

    if (!name.trim() || !email.trim() || !password.trim()) {
      setError("Por favor, completa todos los campos.");
      return;
    }

    setLoading(true);
    try {
      await userService.register({ name, email, password });
      await refreshUser();
      navigate("/user/author-request");
    } catch (err) {
      let msg = "Error de conexión con el servidor.";
      try {
        const parsed = JSON.parse(err.message);
        msg = parsed.message || parsed.error || msg;
      } catch {
        if (err.message && !err.message.startsWith("Request failed")) {
          msg = err.message;
        }
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return {
    name,
    setName,
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
