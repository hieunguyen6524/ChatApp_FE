import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Profile, UserStatus } from "../types/user.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setAuth: (user: User, accessToken: string, refreshToken: string) => void;
  setAccesstoken: (accessToken: string) => void;
  updateProfile: (profile: Partial<Profile>) => void;
  updateStatus: (status: UserStatus) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,

      setAuth: (user, accessToken, refreshToken) =>
        set({
          user,
          accessToken,
          refreshToken,
          isAuthenticated: true,
        }),

      setAccesstoken: (accessToken) => set({ accessToken }),

      updateProfile: (profileUpdate) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              profile: {
                ...state.user.profile,
                ...profileUpdate,
              },
            },
          };
        }),

      updateStatus: (status) =>
        set((state) => {
          if (!state.user) return state;
          return {
            user: {
              ...state.user,
              profile: {
                ...state.user.profile,
                status,
                last_active_at: Date.now(),
              },
            },
          };
        }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      setLoading: (loading) => set({ isLoading: loading }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
