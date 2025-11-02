import { useEffect } from "react";

import { useSearchParams, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useGoogleAuth } from "@/hooks/auth/useAuth";

const GoogleCallbackPage = () => {
  const [searchParams] = useSearchParams();
  const code = searchParams.get("code");
  // const state = searchParams.get("state");
  const navigate = useNavigate();
  const googleAuthMutation = useGoogleAuth();

  useEffect(() => {
    if (code) {
      googleAuthMutation.mutate(
        { code },
        {
          onSuccess: () => navigate("/chat"),
          onError: () => toast.error("Đăng nhập Google thất bại!"),
        }
      );
    } else {
      toast.error("Thiếu mã xác thực từ Google");
      navigate("/login");
    }
  }, [code]);

  return <p>Đang xác thực Google...</p>;
};

export default GoogleCallbackPage;
