import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { profileService } from "../../services/profileService";
import { useAuthStore } from "../../stores/authStore";
import type { UserStatus } from "../../types/user.types";

export const PROFILE_KEYS = {
  all: ["profiles"] as const,
  my: () => [...PROFILE_KEYS.all, "my"] as const,
  detail: (accountId: number) => [...PROFILE_KEYS.all, accountId] as const,
};

export const useMyProfile = () => {
  const { user } = useAuthStore();

  return useQuery({
    queryKey: PROFILE_KEYS.my(),
    queryFn: () => profileService.getMyProfile(),
    enabled: !!user,
    select: (data) => data.data,
  });
};

export const useProfile = (accountId: number) => {
  return useQuery({
    queryKey: PROFILE_KEYS.detail(accountId),
    queryFn: () => profileService.getProfile(accountId),
    enabled: !!accountId,
    select: (data) => data.data,
  });
};

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const { updateProfile: updateProfileStore } = useAuthStore();

  return useMutation({
    mutationFn: (
      data: Partial<{
        username: string;
        display_name: string;
        bio: string;
        avatar_url: string;
      }>
    ) => profileService.updateProfile(data),
    onSuccess: (response) => {
      const profile = response.data;

      // Update auth store
      updateProfileStore(profile);

      // Invalidate profile queries
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.my() });

      toast.success("Cập nhật hồ sơ thành công!");
    },
  });
};

export const useUpdateStatus = () => {
  const queryClient = useQueryClient();
  const { updateStatus: updateStatusStore } = useAuthStore();

  return useMutation({
    mutationFn: (status: UserStatus) => profileService.updateStatus(status),
    onSuccess: (response, variables) => {
      updateStatusStore(variables);
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.my() });
      toast.success("Cập nhật trạng thái thành công!");
    },
  });
};

export const useUploadAvatar = () => {
  const queryClient = useQueryClient();
  const { updateProfile } = useAuthStore();

  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: (response) => {
      const { avatar_url } = response.data;

      updateProfile({ avatar_url });
      queryClient.invalidateQueries({ queryKey: PROFILE_KEYS.my() });

      toast.success("Cập nhật ảnh đại diện thành công!");
    },
  });
};
