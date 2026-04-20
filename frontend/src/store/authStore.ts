import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { AuthUser } from "../types/auth";

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      login: (user, token) => set({ user, token, isAuthenticated: true }),

      logout: () => set({ user: null, token: null, isAuthenticated: false }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "issue-tracker-auth",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
);
