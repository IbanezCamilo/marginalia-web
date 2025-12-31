[1mdiff --git a/src/data/userService.js b/src/data/userService.js[m
[1mindex 71b3d7a..448c1a8 100644[m
[1m--- a/src/data/userService.js[m
[1m+++ b/src/data/userService.js[m
[36m@@ -1,92 +1,222 @@[m
[31m-// src/services/userService.js[m
[31m-[m
 const API_URL = 'http://localhost:8080/api';[m
[31m-const USE_MOCK = true; // ← Cambia a false cuando quieras usar la API real[m
[32m+[m[32mconst USE_MOCK = false; // ← Cambia a false cuando quieras usar la API real[m
 [m
 const getToken = () => localStorage.getItem('token');[m
 [m
[31m-// ===== DATOS MOCK (falsos) =====[m
[32m+[m[32m// ===== DATOS MOCK (simulan respuesta del backend) =====[m
 const mockUser = {[m
[31m-  idUsuario: 1,[m
[31m-  nombre: "Camilo Ibáñez",[m
[32m+[m[32m  userId: 1,[m
[32m+[m[32m  name: "Camilo Ibáñez",[m
   email: "camilo@example.com",[m
[31m-  descripcion: "Apasionado por la escritura y la tecnología. Me gusta crear contenido que inspire y eduque.",[m
[31m-  fotoPerfil: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg",[m
[31m-  rol: "Autor"[m
[32m+[m[32m  description: "Apasionado por la escritura y la tecnología. Me gusta crear contenido que inspire y eduque.",[m
[32m+[m[32m  image: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg",[m
[32m+[m[32m  role: "Autor"[m
 };[m
 [m
 // ===== FUNCIONES MOCK =====[m
 const mockService = {[m
[32m+[m[32m    login: async (credentials) => {[m
[32m+[m[32m    await new Promise(resolve => setTimeout(resolve, 500));[m
[32m+[m[32m    console.log("[MOCK] Login simulado:", credentials.email);[m
[32m+[m[41m    [m
[32m+[m[32m    // Simula validación (en el mock siempre es exitosa)[m
[32m+[m[32m    if (!credentials.email || !credentials.password) {[m
[32m+[m[32m      throw new Error('Email y contraseña son requeridos');[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    // Genera un token falso[m
[32m+[m[32m    const fakeToken = `mock-token-${Date.now()}-${Math.random()}`;[m
[32m+[m[32m    console.log("[MOCK] Token generado:", fakeToken);[m
[32m+[m[41m    [m
[32m+[m[32m    // Guarda el token automáticamente[m
[32m+[m[32m    localStorage.setItem('token', fakeToken);[m
[32m+[m[41m    [m
[32m+[m[32m    return { token: fakeToken };[m
[32m+[m[32m  },[m
[32m+[m[41m  [m
   getProfile: async () => {[m
     // Simula delay de red[m
     await new Promise(resolve => setTimeout(resolve, 500));[m
[31m-    console.log("📦 [MOCK] Obteniendo perfil...");[m
[31m-    return mockUser;[m
[32m+[m[32m    console.log("[MOCK] Obteniendo perfil...");[m
[32m+[m[32m    console.log("[MOCK] Datos:", mockUser);[m
[32m+[m[32m    return mockUser; // ← Devuelve el objeto completo[m
   },[m
 [m
   updateProfile: async (userData) => {[m
     await new Promise(resolve => setTimeout(resolve, 800));[m
[31m-    console.log("📦 [MOCK] Actualizando perfil:", userData);[m
[32m+[m[32m    console.log("[MOCK] Actualizando perfil:", userData);[m
     [m
     // Actualiza el mock local[m
[31m-    mockUser.nombre = userData.nombre;[m
[31m-    mockUser.descripcion = userData.descripcion;[m
[32m+[m[32m    mockUser.name = userData.name;[m
[32m+[m[32m    mockUser.description = userData.description;[m
     [m
[32m+[m[32m    console.log("[MOCK] Usuario actualizado:", mockUser);[m
     return mockUser;[m
   },[m
 [m
   uploadProfileImage: async (imageFile) => {[m
     await new Promise(resolve => setTimeout(resolve, 1000));[m
[31m-    console.log("📦 [MOCK] Subiendo imagen:", imageFile.name);[m
[32m+[m[32m    console.log("[MOCK] Subiendo imagen:", imageFile.name);[m
     [m
     // Simula que devuelve una URL[m
     const fakeUrl = URL.createObjectURL(imageFile);[m
[31m-    mockUser.fotoPerfil = fakeUrl;[m
[32m+[m[32m    mockUser.image = fakeUrl; // ← IMPORTANTE: usar "image", no "profilePicture"[m
     [m
[32m+[m[32m    console.log("[MOCK] Nueva imagen:", mockUser.image);[m
     return mockUser;[m
   },[m
[32m+[m
[32m+[m[32m  isAuthenticated: () => {[m
[32m+[m[32m    const token = localStorage.getItem('token');[m
[32m+[m[32m    const isAuth = !!token;[m
[32m+[m[32m    console.log("[MOCK] ¿Autenticado?", isAuth, "| Token:", token?.substring(0, 20) + "...");[m
[32m+[m[32m    return isAuth;[m
[32m+[m[32m  },[m
[32m+[m
[32m+[m[32m  logout: () => {[m
[32m+[m[32m    console.log("[MOCK] Cerrando sesión...");[m
[32m+[m[32m    localStorage.removeItem('token');[m
[32m+[m[32m  },[m
[32m+[m[41m  [m
 };[m
 [m
 // ===== SERVICIO REAL =====[m
 const realService = {[m
[32m+[m
[32m+[m[32m  login: async (credentials) => {[m
[32m+[m[32m    const res = await fetch(`${API_URL}/auth/login`,{[m
[32m+[m[32m      method: "POST",[m
[32m+[m[32m      headers: {[m
[32m+[m[32m        "Content-Type": "application/json",[m
[32m+[m[32m      },[m
[32m+[m[32m      body: JSON.stringify({[m
[32m+[m[32m        email: credentials.email,[m
[32m+[m[32m        password: credentials.password,[m
[32m+[m[32m      }),[m
[32m+[m[32m    });[m
[32m+[m
[32m+[m[32m  if (!res.ok) {[m
[32m+[m[32m  setError("Credenciales incorrectas");[m
[32m+[m[32m  return;[m
[32m+[m[32m  }[m
[32m+[m
[32m+[m[32m  const data = await res.json();[m
[32m+[m[32m  localStorage.setItem("token", data.token);[m
[32m+[m[32m  return data;[m
[32m+[m[32m  },[m
[32m+[m
   getProfile: async () => {[m
[31m-    const response = await fetch(`${API_URL}/users/profile`, {[m
[32m+[m[32m    const token = getToken();[m
[32m+[m[32m    if (!token) {[m
[32m+[m[32m      throw new Error('No hay sesión activa. Por favor inicia sesión.');[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    const response = await fetch(`${API_URL}/user/profile`, {[m
       method: 'GET',[m
       headers: {[m
[31m-        'Authorization': `Bearer ${getToken()}`,[m
[32m+[m[32m        'Authorization': `Bearer ${token}`,[m
         'Content-Type': 'application/json',[m
       },[m
     });[m
[31m-    if (!response.ok) throw new Error('Error al obtener el perfil');[m
[31m-    return response.json();[m
[32m+[m
[32m+[m[32m    if (!response.ok) {[m
[32m+[m[32m      if (response.status === 401) {[m
[32m+[m[32m        throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');[m
[32m+[m[32m      }[m
[32m+[m[32m      throw new Error('Error al obtener el perfil');[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    const data = await response.json();[m
[32m+[m[41m    [m
[32m+[m[32m    // Mapear respuesta del backend a formato frontend[m
[32m+[m[32m    return {[m
[32m+[m[32m      userId: data.id,[m
[32m+[m[32m      name: data.name,[m
[32m+[m[32m      email: data.email,[m
[32m+[m[32m      description: data.description || "",[m
[32m+[m[32m      image: data.image || "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg",[m
[32m+[m[32m      role: data.role,[m
[32m+[m[32m    };[m
   },[m
 [m
   updateProfile: async (userData) => {[m
[31m-    const response = await fetch(`${API_URL}/users/profile`, {[m
[32m+[m[32m    const token = getToken();[m
[32m+[m[32m    if (!token) {[m
[32m+[m[32m      throw new Error('No hay sesión activa');[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    console.log("Datos que llegan desde el frontend: "+ "nombre"+ userData.name + " descripcion: "+ userData.description);[m
[32m+[m
[32m+[m[32m    const response = await fetch(`${API_URL}/user/profile`, {[m
       method: 'PUT',[m
       headers: {[m
[31m-        'Authorization': `Bearer ${getToken()}`,[m
[32m+[m[32m        'Authorization': `Bearer ${token}`,[m
         'Content-Type': 'application/json',[m
       },[m
       body: JSON.stringify({[m
[31m-        nombre: userData.nombre,[m
[31m-        descripcion: userData.descripcion || '',[m
[32m+[m[32m        name: userData.name,[m
[32m+[m[32m        description: userData.description || '',[m
       }),[m
     });[m
[31m-    if (!response.ok) throw new Error('Error al actualizar perfil');[m
[31m-    return response.json();[m
[32m+[m
[32m+[m[32m    if (!response.ok) {[m
[32m+[m[32m      if (response.status === 401) {[m
[32m+[m[32m        throw new Error('Sesión expirada');[m
[32m+[m[32m      }[m
[32m+[m[32m      throw new Error('Error al actualizar perfil');[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    const data = await response.json();[m
[32m+[m[41m    [m
[32m+[m[32m    // Mapear respuesta[m
[32m+[m[32m    return {[m
[32m+[m[32m      name: data.name,[m
[32m+[m[32m      description: data.description || "",[m
[32m+[m[32m    };[m
   },[m
 [m
   uploadProfileImage: async (imageFile) => {[m
[32m+[m[32m    const token = getToken();[m
[32m+[m[32m    if (!token) {[m
[32m+[m[32m      throw new Error('No hay sesión activa');[m
[32m+[m[32m    }[m
[32m+[m
     const formData = new FormData();[m
     formData.append('imagen', imageFile);[m
[31m-    const response = await fetch(`${API_URL}/users/profile/image`, {[m
[32m+[m
[32m+[m[32m    const response = await fetch(`${API_URL}/user/profile/image`, {[m
       method: 'POST',[m
[31m-      headers: { 'Authorization': `Bearer ${getToken()}` },[m
[32m+[m[32m      headers: {[m[41m [m
[32m+[m[32m        'Authorization': `Bearer ${token}`,[m
[32m+[m[32m        // NO incluir Content-Type con FormData[m
[32m+[m[32m      },[m
       body: formData,[m
     });[m
[31m-    if (!response.ok) throw new Error('Error al subir la imagen');[m
[31m-    return response.json();[m
[32m+[m
[32m+[m[32m    if (!response.ok) {[m
[32m+[m[32m      throw new Error('Error al subir la imagen');[m
[32m+[m[32m    }[m
[32m+[m
[32m+[m[32m    const data = await response.json();[m
[32m+[m[41m    [m
[32m+[m[32m    // Mapear respuesta[m
[32m+[m[32m    return {[m
[32m+[m[32m      userId: data.id || data.idUsuario,[m
[32m+[m[32m      name: data.name,[m
[32m+[m[32m      email: data.email,[m
[32m+[m[32m      description: data.description || "",[m
[32m+[m[32m      image: data.image,[m
[32m+[m[32m      role: data.rol,[m
[32m+[m[32m    };[m
[32m+[m[32m  },[m
[32m+[m
[32m+[m[32m  isAuthenticated: () => {[m
[32m+[m[32m    const token = localStorage.getItem('token');[m
[32m+[m[32m    return !!token;[m
[32m+[m[32m  },[m
[32m+[m
[32m+[m[32m  logout: () => {[m
[32m+[m[32m    localStorage.removeItem('token');[m
   },[m
 };[m
 [m
[1mdiff --git a/src/pages/LoginPage.jsx b/src/pages/LoginPage.jsx[m
[1mindex 7865b09..c90e73e 100644[m
[1m--- a/src/pages/LoginPage.jsx[m
[1m+++ b/src/pages/LoginPage.jsx[m
[36m@@ -1,72 +1,66 @@[m
[31m-import { useState } from 'react';[m
[31m-import { useNavigate } from 'react-router-dom';[m
[32m+[m[32mimport { useState } from "react";[m
[32m+[m[32mimport { useNavigate } from "react-router-dom";[m
[32m+[m[32mimport { userService } from "../data/userService";[m
 [m
 export default function LoginPage() {[m
[31m-    const [email, setEmail] = useState("");[m
[31m-    const [password, setPassword] = useState("");[m
[31m-    const [error, setError] = useState("");[m
[31m-    const navigate = useNavigate();[m
[32m+[m[32m  const [email, setEmail] = useState("");[m
[32m+[m[32m  const [password, setPassword] = useState("");[m
[32m+[m[32m  const [error, setError] = useState("");[m
[32m+[m[32m  const navigate = useNavigate();[m
 [m
[31m-    const handleLogin = async (e) => {[m
[31m-        e.preventDefault();[m
[31m-        setError("");[m
[32m+[m[32m  const handleLogin = async (e) => {[m
[32m+[m[32m    e.preventDefault();[m
[32m+[m[32m    setError("");[m
 [m
[31m-        try {[m
[31m-            const res = await fetch("http://localhost:8080/api/auth/login",[m
[31m-                {[m
[31m-                    method: "POST",[m
[31m-                    headers: { "Content-type": "application/json" },[m
[31m-                    body: JSON.stringify({ email, password })[m
[31m-                });[m
[31m-[m
[31m-            if (!res.ok) {[m
[31m-                setError("Credenciales incorrectas");[m
[31m-                return;[m
[31m-            }[m
[31m-            const data = await res.json();[m
[31m-            localStorage.setItem("token", data.token); //guarda el token en localStorage[m
[31m-            navigate("/user/dashboard") //Redirige[m
[31m-[m
[31m-        } catch (err) {[m
[31m-            setError("Error de conexión con el servidor");[m
[31m-        }[m
[32m+[m[32m    try {[m
[32m+[m[32m      await userService.login({ email, password });[m
[32m+[m[32m      navigate("/user/dashboard");[m
[32m+[m[32m    } catch (err) {[m
[32m+[m[32m      setError("Error de conexión con el servidor");[m
     }[m
[32m+[m[32m  };[m
 [m
[31m-    return ([m
[31m-        <div className="min-h-screen w-full flex justify-center items-center bg-gradient-to-r [m
[31m-                        from-pink-400 via-rose-400 to-rose-600">[m
[31m-            <form onSubmit={handleLogin}[m
[31m-                className="flex flex-col items-center w-96 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8">[m
[31m-[m
[31m-                <h2 className="text-3xl mb-4 font-bold">Iniciar sesion</h2>[m
[32m+[m[32m  return ([m
[32m+[m[32m    <div[m
[32m+[m[32m      className="min-h-screen w-full flex justify-center items-center bg-gradient-to-r[m[41m [m
[32m+[m[32m                        from-pink-400 via-rose-400 to-rose-600"[m
[32m+[m[32m    >[m
[32m+[m[32m      <form[m
[32m+[m[32m        onSubmit={handleLogin}[m
[32m+[m[32m        className="flex flex-col items-center w-96 bg-white/90 backdrop-blur-md rounded-2xl shadow-2xl p-8"[m
[32m+[m[32m      >[m
[32m+[m[32m        <h2 className="text-3xl mb-4 font-bold">Iniciar sesion</h2>[m
 [m
[31m-                {error && <p className="text-red-500 mb-2">{error}</p>}[m
[32m+[m[32m        {error && <p className="text-red-500 mb-2">{error}</p>}[m
 [m
[31m-                <label className="block mb-1 font-semibold">Usuario</label>[m
[31m-                <input[m
[31m-                    type="email"[m
[31m-                    placeholder="Ingrese el email"[m
[31m-                    value={email}[m
[31m-                    onChange={(e) => setEmail(e.target.value)} // actualiza el estado[m
[31m-                    className="w-5/6 bg-white border border-gray-300 rounded-md py-2 px-3 focus:ring-1 [m
[32m+[m[32m        <label className="block mb-1 font-semibold">Usuario</label>[m
[32m+[m[32m        <input[m
[32m+[m[32m          type="email"[m
[32m+[m[32m          placeholder="Ingrese el email"[m
[32m+[m[32m          value={email}[m
[32m+[m[32m          onChange={(e) => setEmail(e.target.value)} // actualiza el estado[m
[32m+[m[32m          className="w-5/6 bg-white border border-gray-300 rounded-md py-2 px-3 focus:ring-1[m[41m [m
                     focus:ring-gray-400 focus:outline-none mb-2 shadow-sm"[m
[31m-                />[m
[32m+[m[32m        />[m
 [m
[31m-                <label className="block mb-1 font-semibold">Contraseña</label>[m
[31m-                <input[m
[31m-                    type="password"[m
[31m-                    placeholder="Ingrese su contraseña"[m
[31m-                    value={password}[m
[31m-                    onChange={(e) => setPassword(e.target.value)} // actualiza el estado[m
[31m-                    className="w-5/6 bg-white border border-gray-300 rounded-md py-2 px-3 focus:ring-1 [m
[32m+[m[32m        <label className="block mb-1 font-semibold">Contraseña</label>[m
[32m+[m[32m        <input[m
[32m+[m[32m          type="password"[m
[32m+[m[32m          placeholder="Ingrese su contraseña"[m
[32m+[m[32m          value={password}[m
[32m+[m[32m          onChange={(e) => setPassword(e.target.value)} // actualiza el estado[m
[32m+[m[32m          className="w-5/6 bg-white border border-gray-300 rounded-md py-2 px-3 focus:ring-1[m[41m [m
                     focus:ring-gray-400 focus:outline-none mb-4 shadow-sm"[m
[31m-                />[m
[32m+[m[32m        />[m
 [m
[31m-                <button type="submit" className="w-2/3 bg-rose-600 font-semibold text-white border border-gray-300 rounded-xl[m
[31m-                py-2 px-1 cursor-pointer hover:bg-rose-700 shadow-md transition-transform hover:scale-105">[m
[31m-                    Iniciar Sesion[m
[31m-                </button>[m
[31m-            </form>[m
[31m-        </div>[m
[31m-    )[m
[31m-}[m
\ No newline at end of file[m
[32m+[m[32m        <button[m
[32m+[m[32m          type="submit"[m
[32m+[m[32m          className="w-2/3 bg-rose-600 font-semibold text-white border border-gray-300 rounded-xl[m
[32m+[m[32m                py-2 px-1 cursor-pointer hover:bg-rose-700 shadow-md transition-transform hover:scale-105"[m
[32m+[m[32m        >[m
[32m+[m[32m          Iniciar Sesion[m
[32m+[m[32m        </button>[m
[32m+[m[32m      </form>[m
[32m+[m[32m    </div>[m
[32m+[m[32m  );[m
[32m+[m[32m}[m
[1mdiff --git a/src/panel-components/layout/TopBar.jsx b/src/panel-components/layout/TopBar.jsx[m
[1mindex 345a92e..7846173 100644[m
[1m--- a/src/panel-components/layout/TopBar.jsx[m
[1m+++ b/src/panel-components/layout/TopBar.jsx[m
[36m@@ -1,19 +1,83 @@[m
 import { CiSettings } from "react-icons/ci";[m
 import { CgProfile } from "react-icons/cg";[m
 import { CiLogout } from "react-icons/ci";[m
[31m-import { Link } from "react-router-dom";[m
[32m+[m[32mimport { Link, useNavigate } from "react-router-dom";[m
[32m+[m[32mimport { useState, useEffect } from "react";[m
[32m+[m[32mimport { Button } from "@/components/ui/button";[m
[32m+[m[32mimport { userService } from "../../data/userService";[m
 [m
 export default function TopBar() {[m
[32m+[m[32m  const [user, setUser] = useState(null);[m
[32m+[m[32m  const [loading, setLoading] = useState(true);[m
[32m+[m[32m  const [error, setError] = useState(null);[m
[32m+[m[32m  const navigate = useNavigate();[m
[32m+[m
[32m+[m[32m  const defaultAvatar =[m
[32m+[m[32m    "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg";[m
[32m+[m
[32m+[m[32m  useEffect(() => {[m
[32m+[m[32m    loadUserData();[m
[32m+[m[32m  }, []);[m
[32m+[m
[32m+[m[32m  const loadUserData = async () => {[m
[32m+[m[32m    try {[m
[32m+[m[32m      if (!userService.isAuthenticated()) {[m
[32m+[m[32m        navigate("/auth/login"); //Redirect to LOGIN[m
[32m+[m[32m        return;[m
[32m+[m[32m      }[m
[32m+[m[32m      const data = await userService.getProfile();[m
[32m+[m[32m      setUser({[m
[32m+[m[32m        name: data.name,[m
[32m+[m[32m        image: data.image || defaultAvatar,[m
[32m+[m[32m      });[m
[32m+[m[32m    } catch (err) {[m
[32m+[m[32m      setError("Error al cargar datos del usuario: " + err.message);[m
[32m+[m[32m      if (err.message.includes("sesion") || err.message.includes("401")) {[m
[32m+[m[32m        navigate("/auth/login");[m
[32m+[m[32m      }[m
[32m+[m[32m    } finally {[m
[32m+[m[32m      setLoading(false);[m
[32m+[m[32m    }[m
[32m+[m[32m  };[m
[32m+[m
[32m+[m[32m  const handleLogout = () => {[m
[32m+[m[32m    if (confirm("¿Seguro quieres cerrar sesion?")) {[m
[32m+[m[32m      userService.logout();[m
[32m+[m[32m      navigate("/auth/login");[m
[32m+[m[32m    }[m
[32m+[m[32m  };[m
[32m+[m
[32m+[m[32m  // Estados de carga[m
[32m+[m[32m  if (loading) {[m
[32m+[m[32m    return ([m
[32m+[m[32m      <div className="flex justify-end items-center bg-white shadow-sm">[m
[32m+[m[32m        <div className="animate-pulse">[m
[32m+[m[32m          <div className="flex items-center gap-3 hover:bg-gray-100 px-3 py-1 rounded-xl transition">[m
[32m+[m[32m            <div className="w-12 h-12 bg-gray-200 rounded-full mx-auto mb-2"></div>[m
[32m+[m[32m            <div className="flex-col p-2">[m
[32m+[m[32m              <div className="h-4 bg-gray-200 rounded w-32 mx-auto mb-1"></div>[m
[32m+[m[32m              <div className="h-4 bg-gray-200 rounded w-20 mx-auto"></div>[m
[32m+[m[32m            </div>[m
[32m+[m[32m          </div>[m
[32m+[m[32m        </div>[m
[32m+[m[32m      </div>[m
[32m+[m[32m    );[m
[32m+[m[32m  }[m
[32m+[m
   return ([m
     <nav className="flex justify-end items-center bg-white shadow-sm mb-2 p-2">[m
       <div className="relative group cursor-pointer">[m
[31m-        {/*Username y avatar*/}[m
[32m+[m[32m        {/*User y avatar*/}[m
         <div className="flex items-center gap-3 hover:bg-gray-100 px-3 py-1 rounded-xl transition">[m
           <img[m
[31m-            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg"[m
[32m+[m[32m            src={user?.image}[m
             className="w-12 h-12 object-cover rounded-full"[m
[32m+[m[32m            onError={(e) => {[m
[32m+[m[32m              e.target.src =[m
[32m+[m[32m                "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg";[m
[32m+[m[32m            }}[m
           ></img>[m
[31m-          <span className="font-medium">Juan Perez</span>[m
[32m+[m[32m          <span className="font-medium">{user?.name}</span>[m
         </div>[m
         {/* Menú desplegable */}[m
         <div[m
[36m@@ -34,9 +98,14 @@[m [mexport default function TopBar() {[m
               <CiSettings size={20} />[m
               <span>Configuración</span>[m
             </li>[m
[31m-            <li className="flex items-center w-full p-2 gap-2 rounded hover:bg-gray-200">[m
[31m-              <CiLogout size={20} />[m
[31m-              <span>Cerrar sesion</span>[m
[32m+[m[32m            <li className="border-t border-gray-200 mt-1 pt-1">[m
[32m+[m[32m              <Button[m
[32m+[m[32m                onClick={handleLogout}[m
[32m+[m[32m                className="flex items-center w-full p-2 gap-2 rounded hover:bg-red-100 text-red-600 text-left cursor-pointer"[m
[32m+[m[32m              >[m
[32m+[m[32m                <CiLogout size={20} />[m
[32m+[m[32m                <span>Cerrar sesión</span>[m
[32m+[m[32m              </Button>[m
             </li>[m
           </ul>[m
         </div>[m
[1mdiff --git a/src/panel-components/profile/ProfileEditDialog.jsx b/src/panel-components/profile/ProfileEditDialog.jsx[m
[1mindex 2423126..abfe8d5 100644[m
[1m--- a/src/panel-components/profile/ProfileEditDialog.jsx[m
[1m+++ b/src/panel-components/profile/ProfileEditDialog.jsx[m
[36m@@ -1,4 +1,4 @@[m
[31m-import { useState } from "react";[m
[32m+[m[32mimport { useState, useEffect } from "react";[m
 import { Button } from "@/components/ui/button";[m
 import {[m
   Dialog,[m
[36m@@ -13,10 +13,19 @@[m [mimport { Textarea } from "@/components/ui/textarea";[m
 export default function ProfileEditDialog({ user, onSave, isOpen, onClose }) {[m
   const [editedData, setEditedData] = useState({[m
     name: user.name,[m
[31m-    bio: user.bio,[m
[32m+[m[32m    description: user.description,[m
   });[m
   const [saving, setSaving] = useState(false);[m
 [m
[32m+[m[32m  useEffect(() => {[m
[32m+[m[32m    if (isOpen && user) {[m
[32m+[m[32m      setEditedData({[m
[32m+[m[32m        name: user.name || "",[m
[32m+[m[32m        description: user.description || "",[m
[32m+[m[32m      });[m
[32m+[m[32m    }[m
[32m+[m[32m  }, [isOpen, user]);[m
[32m+[m
   // Manejar cambios en inputs[m
   const handleChange = (e) => {[m
     const { name, value } = e.target;[m
[36m@@ -28,9 +37,17 @@[m [mexport default function ProfileEditDialog({ user, onSave, isOpen, onClose }) {[m
 [m
   // Guardar cambios[m
   const handleSave = async () => {[m
[32m+[m[32m    if (!editedData.name.trim()) {[m
[32m+[m[32m      alert("El nombre no puede estar vacío");[m
[32m+[m[32m      return;[m
[32m+[m[32m    }[m
[32m+[m
     try {[m
       setSaving(true);[m
[31m-      await onSave(editedData);[m
[32m+[m[32m      await onSave({[m
[32m+[m[32m        name: editedData.name.trim(),[m
[32m+[m[32m        description: editedData.description.trim(),[m
[32m+[m[32m      });[m
       onClose();[m
     } catch (err) {[m
       alert("Error al guardar: " + err.message);[m
[36m@@ -43,13 +60,13 @@[m [mexport default function ProfileEditDialog({ user, onSave, isOpen, onClose }) {[m
   const handleCancel = () => {[m
     setEditedData({[m
       name: user.name,[m
[31m-      bio: user.bio,[m
[32m+[m[32m      description: user.description,[m
     });[m
     onClose();[m
   };[m
 [m
   return ([m
[31m-    <Dialog open={isOpen} onOpenChange={handleCancel}>[m
[32m+[m[32m    <Dialog open={isOpen} onOpenChange={onClose}>[m
       <DialogContent className="max-w-md">[m
         <DialogHeader>[m
           <DialogTitle>Editar perfil</DialogTitle>[m
[36m@@ -85,18 +102,19 @@[m [mexport default function ProfileEditDialog({ user, onSave, isOpen, onClose }) {[m
 [m
           {/* Biografía */}[m
           <div className="space-y-2">[m
[31m-            <Label htmlFor="bio">Biografía</Label>[m
[32m+[m[32m            <Label htmlFor="description">Biografía</Label>[m
             <Textarea[m
[31m-              id="bio"[m
[31m-              name="bio"[m
[31m-              value={editedData.bio}[m
[32m+[m[32m              id="description"[m
[32m+[m[32m              name="description"[m
[32m+[m[32m              value={editedData.description}[m
               onChange={handleChange}[m
               placeholder="Cuéntanos sobre ti..."[m
               rows={4}[m
               disabled={saving}[m
[32m+[m[32m              maxLength={500}[m
             />[m
             <p className="text-xs text-gray-500">[m
[31m-              {editedData.bio.length}/500 caracteres[m
[32m+[m[32m              {editedData.description.length}/500 caracteres[m
             </p>[m
           </div>[m
 [m
[1mdiff --git a/src/panelpages/DashBoard.jsx b/src/panelpages/DashBoard.jsx[m
[1mindex 09b3252..0a50541 100644[m
[1m--- a/src/panelpages/DashBoard.jsx[m
[1m+++ b/src/panelpages/DashBoard.jsx[m
[36m@@ -1,6 +1,46 @@[m
 import { PanelCard } from "../panel-components/layout/PanelCard";[m
[32m+[m[32mimport { PanelCardSkeleton } from "../panel-components/layout/PanelCardSkeleton";[m
[32m+[m[32mimport { useState, useEffect } from "react";[m
[32m+[m[32mimport { userService } from "../data/userService";[m
 [m
 export default function DashBoard() {[m
[32m+[m[32m  const [user, setUser] = useState(null);[m
[32m+[m[32m  const [loading, setLoading] = useState(true);[m
[32m+[m[32m  const [error, setError] = useState(null);[m
[32m+[m
[32m+[m[32m  useEffect(() => {[m
[32m+[m[32m    loadProfile();[m
[32m+[m[32m  }, []);[m
[32m+[m
[32m+[m[32m  const loadProfile = async () => {[m
[32m+[m[32m    try {[m
[32m+[m[32m      setLoading(true);[m
[32m+[m[32m      setError(false);[m
[32m+[m
[32m+[m[32m      const data = await userService.getProfile();[m
[32m+[m
[32m+[m[32m      const mappedUser = {[m
[32m+[m[32m        name: data.name,[m
[32m+[m[32m      };[m
[32m+[m[32m      setUser(mappedUser);[m
[32m+[m[32m    } catch (err) {[m
[32m+[m[32m      setError("Error al cargar la información: " + err.message);[m
[32m+[m[32m    } finally {[m
[32m+[m[32m      setLoading(false);[m
[32m+[m[32m    }[m
[32m+[m[32m  };[m
[32m+[m[32m  if (loading) {[m
[32m+[m[32m    return ([m
[32m+[m[32m      <div className="max-w-6xl mx-auto p-6">[m
[32m+[m[32m        <div className="grid lg:grid-cols-2 gap-6">[m
[32m+[m[32m          <PanelCardSkeleton type="stats" />[m
[32m+[m[32m          <PanelCardSkeleton type="list" />[m
[32m+[m[32m          <PanelCardSkeleton type="actions" />[m
[32m+[m[32m        </div>[m
[32m+[m[32m      </div>[m
[32m+[m[32m    );[m
[32m+[m[32m  }[m
[32m+[m
   return ([m
     <div>[m
       {/*Contenedor principal*/}[m
[36m@@ -8,7 +48,7 @@[m [mexport default function DashBoard() {[m
         <div className="grid lg:grid-cols-2 gap-6">[m
           {/**Informacion Personal */}[m
           <PanelCard>[m
[31m-            <h1 className="text-4xl mb-4 font-bold">Bienvenido Juan Perez</h1>[m
[32m+[m[32m            <h1 className="text-4xl mb-4 font-bold">Bienvenido {user?.name}</h1>[m
             <h2 className="text-xl text-center font-semibold">[m
               Total Publicaciones[m
             </h2>[m
[1mdiff --git a/src/panelpages/ProfilePage.jsx b/src/panelpages/ProfilePage.jsx[m
[1mindex fa1d0b3..b8b8cec 100644[m
[1m--- a/src/panelpages/ProfilePage.jsx[m
[1m+++ b/src/panelpages/ProfilePage.jsx[m
[36m@@ -32,13 +32,13 @@[m [mexport default function ProfilePage() {[m
 [m
       // Mapear respuesta del backend a nuestro formato[m
       const mappedUser = {[m
[31m-        id: data.idUsuario,[m
[31m-        name: data.nombre,[m
[31m-        role: data.rol,[m
[32m+[m[32m        id: data.userId,[m
[32m+[m[32m        name: data.name,[m
[32m+[m[32m        role: data.role,[m
         email: data.email,[m
[31m-        bio: data.descripcion || "",[m
[32m+[m[32m        description: data.description || "",[m
         image:[m
[31m-          data.fotoPerfil ||[m
[32m+[m[32m          data.image ||[m
           "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Voltaire_Philosophy_of_Newton_frontispiece.jpg/250px-Voltaire_Philosophy_of_Newton_frontispiece.jpg",[m
       };[m
 [m
[36m@@ -54,28 +54,36 @@[m [mexport default function ProfilePage() {[m
   const handleImageUpdate = async (file) => {[m
     const response = await userService.uploadProfileImage(file);[m
 [m
[31m-    const imageUrl = response.fotoPerfil.startsWith("http")[m
[31m-      ? response.fotoPerfil[m
[31m-      : `http://localhost:8080${response.fotoPerfil}`;[m
[32m+[m[32m    const imageUrl = response.image.startsWith("http")[m
[32m+[m[32m      ? response.image[m
[32m+[m[32m      : `http://localhost:8080${response.image}`;[m
 [m
     setUser((prev) => ({ ...prev, image: imageUrl }));[m
     alert("Imagen actualizada correctamente ✓");[m
   };[m
 [m
   // Manejar actualización de datos[m
[31m-  const handleDataUpdate = async (editedData) => {[m
[31m-    const response = await userService.updateProfile({[m
[31m-      nombre: editedData.name,[m
[31m-      descripcion: editedData.bio,[m
[31m-    });[m
[31m-[m
[31m-    setUser((prev) => ({[m
[31m-      ...prev,[m
[31m-      name: response.nombre,[m
[31m-      bio: response.descripcion || "",[m
[31m-    }));[m
[31m-[m
[31m-    alert("Perfil actualizado correctamente ✓");[m
[32m+[m[32m  const handleDataUpdate = async (updatedData) => {[m
[32m+[m[32m    try {[m
[32m+[m[32m      console.log([m
[32m+[m[32m        "Datos recibidos en ProfilePage: " +[m
[32m+[m[32m          "nombre: " +[m
[32m+[m[32m          updatedData.name +[m
[32m+[m[32m          " descripcion: " +[m
[32m+[m[32m          updatedData.description[m
[32m+[m[32m      );[m
[32m+[m
[32m+[m[32m      const updatedUser = await userService.updateProfile(updatedData);[m
[32m+[m
[32m+[m[32m      setUser((prev) => ({[m
[32m+[m[32m        ...prev,[m
[32m+[m[32m        name: updatedUser.name,[m
[32m+[m[32m        description: updatedUser.description || "",[m
[32m+[m[32m      }));[m
[32m+[m[32m      alert("Perfil actualizado correctamente");[m
[32m+[m[32m    } catch (error) {[m
[32m+[m[32m      setError("Error al editar usuario");[m
[32m+[m[32m    }[m
   };[m
 [m
   // Estados de carga[m
[36m@@ -139,7 +147,7 @@[m [mexport default function ProfilePage() {[m
               <span>{user.email}</span>[m
             </div>[m
             <p className="text-gray-700 text-sm leading-relaxed italic">[m
[31m-              {user.bio || "Sin descripción"}[m
[32m+[m[32m              {user.description || "Sin descripción"}[m
             </p>[m
 [m
             <div className="flex justify-center md:justify-start mt-4">[m
