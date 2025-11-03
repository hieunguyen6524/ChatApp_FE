import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User, Profile, UserStatus } from "../types/user.types";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null; // ⚠️ Giữ lại cho compatibility nhưng không dùng
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: User, accessToken: string, refreshToken?: string) => void;
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

      setAuth: (user, accessToken, refreshToken = "") =>
        set({
          user,
          accessToken,
          refreshToken, // Lưu empty string vì token thật ở cookie
          isAuthenticated: true,
        }),

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
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
