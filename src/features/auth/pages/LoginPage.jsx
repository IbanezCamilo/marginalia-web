import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { userService } from "@/features/profile/services/userService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await userService.login({ email, password });
      navigate("/user/dashboard");
    } catch (err) {
      setError("Error de conexión con el servidor");
    }
  };

  return (
    <div
      className="min-h-screen w-full flex justify-center items-center bg-gradient-to-r 
                        from-pink-400 via-rose-400 to-rose-600"
    >
      <form
        onSubmit={handleLogin}
        className="flex flex-col items-center w-96 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-3xl mb-4 font-bold">Iniciar sesion</h2>

        {error && <p className="text-red-500 mb-2">{error}</p>}

        <label className="block mb-1 font-semibold">Usuario</label>
        <input
          type="email"
          placeholder="Ingrese el email"
          value={email}
          onChange={(e) => setEmail(e.target.value)} // actualiza el estado
          className="w-5/6 bg-white border border-gray-300 rounded-md py-2 px-3 focus:ring-1 
                    focus:ring-gray-400 focus:outline-none mb-2 shadow-sm"
        />

        <label className="block mb-1 font-semibold">Contraseña</label>
        <input
          type="password"
          placeholder="Ingrese su contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)} // actualiza el estado
          className="w-5/6 bg-white border border-gray-300 rounded-md py-2 px-3 focus:ring-1 
                    focus:ring-gray-400 focus:outline-none mb-4 shadow-sm"
        />

        <button
          type="submit"
          className="w-2/3 bg-rose-600 font-semibold text-white border border-gray-300 rounded-xl
                py-2 px-1 cursor-pointer hover:bg-rose-700 shadow-md transition-transform hover:scale-105"
        >
          Iniciar Sesion
        </button>
      </form>
    </div>
  );
}
