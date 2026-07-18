import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/features/profile/services/userService";
import { PENDING_VERIFICATION_EMAIL_KEY } from "@/features/auth/hooks/useVerificationStatusPoll";
import { getErrorMessage } from "@/lib/apiError";

export function useRegister() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const errors = {};
    if (!name.trim()) errors.name = "Ingresa tu nombre.";
    if (!email.trim()) errors.email = "Ingresa tu correo electrónico.";
    if (!password.trim()) errors.password = "Ingresa una contraseña.";
    setFieldErrors(errors);
    if (Object.keys(errors).length > 0) return;

    setLoading(true);
    // Emails are stored lowercase server-side; submit the normalized value and
    // reuse it for the check-email flow so verification polling matches.
    const normalizedEmail = email.trim().toLowerCase();
    try {
      // Registration no longer opens a session: the account stays blocked
      // until the emailed verification link is clicked.
      await userService.register({ name: name.trim(), email: normalizedEmail, password });
      // Survives a refresh of the check-email page, which otherwise loses the
      // email (and with it the verification polling) with the router state.
      sessionStorage.setItem(PENDING_VERIFICATION_EMAIL_KEY, normalizedEmail);
      navigate("/auth/check-email", { state: { email: normalizedEmail } });
    } catch (err) {
      setError(getErrorMessage(err, "Error de conexión con el servidor."));
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
    fieldErrors,
    handleSubmit,
  };
}
