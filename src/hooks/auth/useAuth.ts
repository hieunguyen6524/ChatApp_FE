/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { authService } from "../../services/authService";
import { useAuthStore } from "../../stores/authStore";
import type {
  LoginRequest,
  RegisterRequest,
  GoogleAuthRequest,
} from "../../types/auth.types";

export const useLogin = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (response) => {
      const { access_token, refresh_token, user } = response.data;
      setAuth(user, access_token, refresh_token);

      // Invalidate all queries to refetch with new auth
      queryClient.invalidateQueries();

      toast.success("Đăng nhập thành công!");
      navigate("/chat");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Đăng nhập thất bại";
      toast.error(message);
    },
  });
};

export const useRegister = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (response) => {
      const { access_token, refresh_token, user } = response.data;
      setAuth(user, access_token, refresh_token);

      toast.success("Đăng ký thành công!");
      navigate("/chat");
    },
    onError: (error: any) => {
      const message = error.response?.data?.message || "Đăng ký thất bại";
      toast.error(message);
    },
  });
};

export const useGoogleAuth = () => {
  const navigate = useNavigate();
  const { setAuth } = useAuthStore();

  return useMutation({
    mutationFn: (data: GoogleAuthRequest) => authService.googleAuth(data),
    onSuccess: (response) => {
      const { access_token, refresh_token, user } = response.data;
      setAuth(user, access_token, refresh_token);

      toast.success("Đăng nhập Google thành công!");
      navigate("/chat");
    },
  });
};

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      queryClient.clear(); // Clear all cache
      toast.success("Đăng xuất thành công");
      navigate("/auth");
    },
  });
};
