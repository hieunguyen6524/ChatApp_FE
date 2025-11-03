import { apiClient } from "./apiClient";
import type { ApiResponse } from "../types/common.types";
import type { GoogleAuthRequest } from "@/types/auth.types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  displayName: string;
}

export interface AuthResponse {
  accessToken: string;
  user: {
    account: {
      accountId: number;
      email: string;
      provider: string;
      isVerified: boolean;
      isActive: boolean;
      createdAt: number;
      updatedAt: number;
    };
    profile: {
      accountId: number;
      username: string;
      displayName: string;
      avatarUrl: string | null;
      bio: string | null;
      status: string;
      lastActiveAt: number | null;
      updatedAt: number | null;
    };
  };
}

export const authService = {
  // POST /api/auth/register
  register: async (
    data: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<ApiResponse<AuthResponse>>("/auth/register", data);
  },

  // POST /api/auth/login
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<ApiResponse<AuthResponse>>("/auth/login", data);
  },

  // Google OAuth login
  googleAuth: async (
    data: GoogleAuthRequest
  ): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<ApiResponse<AuthResponse>>(
      "/auth/google/authenticate",
      data
    );
  },

  getGoogleAuthUrl: async (): Promise<ApiResponse<{ authUrl: string }>> => {
    return apiClient.get("/auth/google/url");
  },

  // POST /api/auth/logout
  logout: async (): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>("/auth/logout");
  },

  // POST /api/auth/refresh (cookie auto-sent)
  refreshToken: async (): Promise<ApiResponse<{ accessToken: string }>> => {
    return apiClient.post<ApiResponse<{ accessToken: string }>>(
      "/auth/refresh"
    );
  },

  // GET /api/auth/verify-email?token=xxx
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    return apiClient.get<ApiResponse<void>>(
      `/auth/verify-email?token=${token}`
    );
  },

  // POST /api/auth/forgot-password
  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>("/auth/forgot-password", {
      email,
    });
  },

  // POST /api/auth/reset-password?token=xxx
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(
      `/auth/reset-password?token=${token}`,
      {
        newPassword,
      }
    );
  },
};
