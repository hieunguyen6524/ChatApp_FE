import { apiClient } from "./apiClient";
import type { ApiResponse } from "../types/common.types";

export interface ProfileData {
  accountId: number;
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  status: string;
  roles: string[];
  isVerified: boolean;
}

export const profileService = {
  // GET /api/me
  getMe: async (): Promise<ApiResponse<ProfileData>> => {
    return apiClient.get<ApiResponse<ProfileData>>("/me");
  },

  // PATCH /api/me
  updateProfile: async (data: {
    displayName?: string;
    bio?: string;
  }): Promise<ApiResponse<ProfileData>> => {
    return apiClient.patch<ApiResponse<ProfileData>>("/me", data);
  },

  // PATCH /api/me/avatar (multipart/form-data)
  updateAvatar: async (
    file: File
  ): Promise<ApiResponse<{ avatarUrl: string }>> => {
    const formData = new FormData();
    formData.append("file", file);

    return apiClient.patch<ApiResponse<{ avatarUrl: string }>>(
      "/me/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  // PATCH /api/me/status
  updateStatus: async (status: string): Promise<ApiResponse<ProfileData>> => {
    return apiClient.patch<ApiResponse<ProfileData>>("/me/status", { status });
  },

  // PATCH /api/me/password
  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }): Promise<ApiResponse<void>> => {
    return apiClient.patch<ApiResponse<void>>("/me/password", data);
  },

  // DELETE /api/me
  deactivateAccount: async (): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>("/me");
  },
};
