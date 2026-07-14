const API_BASE = import.meta.env.VITE_API_URL ?? 'http://localhost:8080';

export const API_URL = `${API_BASE}/api`;
export const BASE_URL = API_BASE;
export const QUOTES_URL = import.meta.env.VITE_QUOTES_URL ?? 'https://edge.readmarginalia.net';