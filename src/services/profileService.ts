import { apiClient } from "./apiClient";
import type { Profile, UserStatus } from "../types/user.types";
import type { ApiResponse } from "@/types/common.types";

export const profileService = {
  // Get current user profile
  getMyProfile: async (): Promise<ApiResponse<Profile>> => {
    return apiClient.get<ApiResponse<Profile>>("/profile");
  },

  // Get profile by account ID
  getProfile: async (accountId: number): Promise<ApiResponse<Profile>> => {
    return apiClient.get<ApiResponse<Profile>>(`/profile/${accountId}`);
  },

  // Update profile
  updateProfile: async (
    data: Partial<{
      username: string;
      display_name: string;
      bio: string;
      avatar_url: string;
    }>
  ): Promise<ApiResponse<Profile>> => {
    return apiClient.put<ApiResponse<Profile>>("/profile", data);
  },

  // Update status
  updateStatus: async (status: UserStatus): Promise<ApiResponse<Profile>> => {
    return apiClient.patch<ApiResponse<Profile>>("/profile/status", { status });
  },

  // Upload avatar
  uploadAvatar: async (
    file: File
  ): Promise<ApiResponse<{ avatar_url: string }>> => {
    const formData = new FormData();
    formData.append("avatar", file);

    return apiClient.post<ApiResponse<{ avatar_url: string }>>(
      "/profile/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },
};
