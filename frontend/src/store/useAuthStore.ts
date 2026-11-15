import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface User {
  id: number;
  name: string;
  email: string;
  points: number;
  club?: string;
  roleId?: number;
  role?: {
    id: number;
    name: string;
  };
  createdAt?: string;
}

interface AuthState {
  user: User | null;
  hasHydrated: boolean;
  isAuthenticated: boolean;

  setUser: (user: User) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      isAuthenticated: false,

      setUser: (user) =>
        set({
          user,
          isAuthenticated: true,
        }),

      updateUser: (userData) =>
        set((state) => {
          if (!state.user) return state;

          return {
            user: {
              ...state.user,
              ...userData,
            },
          };
        }),

      logout: () =>
        set({
          user: null,
          isAuthenticated: false,
        }),

      setHasHydrated: (value) =>
        set({
          hasHydrated: value,
        }),
    }),
    {
      name: "bloodline-auth",

      // Only persist the profile, not authentication status.
      partialize: (state) => ({
        user: state.user,
      }),

      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
