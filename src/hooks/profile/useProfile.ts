/* eslint-disable @typescript-eslint/no-explicit-any */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useAuthStore } from "@/stores/authStore";
import { profileService } from "@/services/profileService";

export const PROFILE_KEYS = {
  me: ["profile", "me"] as const,
};

// GET /api/me
export const useMe = () => {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: PROFILE_KEYS.me,
    queryFn: () => profileService.getMe(),
    enabled: isAuthenticated,
    select: (data) => data.data,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

// PATCH /api/me
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateProfile: updateStore } = useAuthStore();

  return useMutation({
    mutationFn: (data: { displayName?: string; bio?: string }) =>
      profileService.updateProfile(data),
    onSuccess: (response: any) => {
      const profile = response.data;

      // Update Zustand store
      updateStore(profile.profile);

      // Invalidate queries
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.me });

      toast.success("Cập nhật hồ sơ thành công!");
    },
  });
};

// PATCH /api/me/avatar
export const useUpdateAvatar = () => {
  const queryClient = useQueryClient();
  const { updateProfile } = useAuthStore();

  return useMutation({
    mutationFn: (file: File) => profileService.updateAvatar(file),
    onSuccess: (response: any) => {
      const { avatarUrl } = response.data;

      updateProfile({ avatarUrl });
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.me });

      toast.success("Cập nhật ảnh đại diện thành công!");
    },
  });
};

// PATCH /api/me/status
export const useUpdateStatus = () => {
  const queryClient = useQueryClient();
  const { updateStatus: updateStore } = useAuthStore();

  return useMutation({
    mutationFn: (status: "ONLINE" | "OFFLINE" | "AWAY" | "DND") =>
      profileService.updateStatus(status),
    onSuccess: (response, variables) => {
      updateStore(variables);
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.me });
      toast.success("Cập nhật trạng thái thành công!");
    },
  });
};

// PATCH /api/me/password
export const useChangePassword = () => {
  return useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      profileService.changePassword(data),
    onSuccess: () => {
      toast.success("Đổi mật khẩu thành công!");
    },
  });
};

// DELETE /api/me
export const useDeactivateAccount = () => {
  const { logout } = useAuthStore();

  return useMutation({
    mutationFn: () => profileService.deactivateAccount(),
    onSuccess: () => {
      logout();
      toast.success("Tài khoản đã bị vô hiệu hóa");
      window.location.href = "/";
    },
  });
};
