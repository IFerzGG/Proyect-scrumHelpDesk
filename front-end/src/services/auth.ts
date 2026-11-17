import axios from 'axios';
import type { LoginFormValues } from '../schemas/loginSchema';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  headers: { 'Content-Type': 'application/json' },
});

type LoginResponse = {
  access_token: string;
};

export async function login(credentials: LoginFormValues) {
  const { data } = await api.post<LoginResponse>('/auth/login', credentials);
  return data;
}

export function getLoginError(error: unknown) {
  if (axios.isAxiosError<{ message?: string | string[] }>(error)) {
    const message = error.response?.data?.message;
    if (Array.isArray(message)) return message.join(' ');
    if (message) return message;
    if (error.code === 'ERR_NETWORK') {
      return 'No se pudo conectar con el servidor. Verifica que la API esté activa.';
    }
  }

  return 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo.';
}
