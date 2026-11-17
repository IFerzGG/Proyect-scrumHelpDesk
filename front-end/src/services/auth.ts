import axios from 'axios';
import { api } from './api';

import type { LoginFormValues } from '../schemas/loginSchema';
import type { Usuario } from '../types/auth';

export interface LoginResponse {
  access_token: string;
  usuario: Usuario;
}

export async function login(
  credentials: LoginFormValues,
): Promise<LoginResponse> {
  const { data } = await api.post<LoginResponse>('/auth/login', credentials);

  return data;
}

export function getLoginError(error: unknown): string {
  if (
    axios.isAxiosError<{
      message?: string | string[];
    }>(error)
  ) {
    const message = error.response?.data?.message;

    if (Array.isArray(message)) {
      return message.join(' ');
    }

    if (message) {
      return message;
    }

    if (error.code === 'ERR_NETWORK') {
      return 'No se pudo conectar con el servidor. Verifica que la API esté activa.';
    }
  }

  return 'Ocurrió un error al iniciar sesión. Inténtalo de nuevo.';
}
