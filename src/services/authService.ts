import { apiClient } from "./apiClient";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  GoogleAuthRequest,
} from "../types/auth.types";
import type { ApiResponse } from "@/types/common.types";

export const authService = {
  // Login with email & password
  login: async (data: LoginRequest): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<ApiResponse<AuthResponse>>("/auth/login", data);
  },

  // Register new account
  register: async (
    data: RegisterRequest
  ): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<ApiResponse<AuthResponse>>("/auth/register", data);
  },

  // Google OAuth login
  googleAuth: async (
    data: GoogleAuthRequest
  ): Promise<ApiResponse<AuthResponse>> => {
    return apiClient.post<ApiResponse<AuthResponse>>("/auth/google", data);
  },

  // Logout (clears cookies on server)
  logout: async (): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>("/auth/logout");
  },

  // Refresh access token (using cookie)
  refreshToken: async (): Promise<ApiResponse<{ access_token: string }>> => {
    return apiClient.post<ApiResponse<{ access_token: string }>>(
      "/auth/refresh"
    );
  },

  // Verify email
  verifyEmail: async (token: string): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>("/auth/verify-email", { token });
  },

  // Request password reset
  forgotPassword: async (email: string): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>("/auth/forgot-password", {
      email,
    });
  },

  // Reset password
  resetPassword: async (
    token: string,
    newPassword: string
  ): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>("/auth/reset-password", {
      token,
      new_password: newPassword,
    });
  },
};
