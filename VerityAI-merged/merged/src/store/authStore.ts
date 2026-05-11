import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  fullName?: string;
  avatar?: string;
  walletBalance: number;
  verificationCount: number;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  setUser: (user: AuthUser | null) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
    }),
    {
      name: 'verity-auth',
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);
