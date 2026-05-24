const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export const API_URL = `${API_BASE_URL}/api`;
export const BASE_URL = import.meta.env.VITE_BASE_URL ?? API_BASE_URL;