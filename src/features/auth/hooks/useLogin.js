import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/features/profile/services/userService";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { ApiError, getErrorMessage } from "@/lib/apiError";

function isEmailNotVerified(err) {
  return (
    err instanceof ApiError &&
    err.status === 403 &&
    (err.body?.type ?? "").includes("email-not-verified")
  );
}

export function useLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [needsVerification, setNeedsVerification] = useState(false);
  const navigate = useNavigate();
  const { actions: { refreshUser } } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setNeedsVerification(false);

    const errors = {};
    if (!email.trim()) errors.email = "Ingresa tu correo electrónico.";
    if (!password.trim()) errors.password = "Ingresa tu contraseña.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    try {
      // Emails are stored lowercase server-side; normalize so casing never
      // causes a spurious credentials error. Password is sent untouched.
      await userService.login({ email: email.trim().toLowerCase(), password });
      await refreshUser();
      navigate("/user/dashboard");
    } catch (err) {
      if (isEmailNotVerified(err)) {
        setNeedsVerification(true);
        setError("Debes verificar tu correo electrónico antes de iniciar sesión.");
      } else {
        setError(getErrorMessage(err, "Error de conexión con el servidor."));
      }
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
    fieldErrors,
    needsVerification,
    handleSubmit,
  };
}
