import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Usuario } from '../types/auth';

interface AuthState {
  token: string | null;
  usuario: Usuario | null;

  iniciarSesion: (token: string, usuario: Usuario) => void;
  cerrarSesion: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      usuario: null,

      iniciarSesion: (token, usuario) => set({ token, usuario }),

      cerrarSesion: () =>
        set({
          token: null,
          usuario: null,
        }),
    }),
    {
      name: 'helpdesk-auth',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);
