import React, { useState, useRef } from "react";
import {
  Camera,
  Mail,
  User,
  Edit2,
  Save,
  X,
  Check,
  // Clock,
  Shield,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import {
  useMe,
  useUpdateProfile,
  useUpdateAvatar,
  useUpdateStatus,
  useChangePassword,
  useDeactivateAccount,
} from "@/hooks/profile/useProfile";

type UserStatus = "ONLINE" | "OFFLINE" | "AWAY" | "DND";

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // React Query hooks
  const { data: profile, isLoading: loadingProfile } = useMe();
  const updateProfileMutation = useUpdateProfile();
  const updateAvatarMutation = useUpdateAvatar();
  const updateStatusMutation = useUpdateStatus();
  const changePasswordMutation = useChangePassword();
  const deactivateAccountMutation = useDeactivateAccount();

  const [editData, setEditData] = useState({
    displayName: "",
    bio: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  React.useEffect(() => {
    if (profile) {
      setEditData({
        displayName: profile.displayName,
        bio: profile.bio || "",
      });
    }
  }, [profile]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditData({
      ...editData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = () => {
    updateProfileMutation.mutate(editData, {
      onSuccess: () => {
        setIsEditing(false);
      },
    });
  };

  const handleCancel = () => {
    if (profile) {
      setEditData({
        displayName: profile.displayName,
        bio: profile.bio || "",
      });
    }
    setIsEditing(false);
  };

  const handleStatusChange = (status: UserStatus) => {
    updateStatusMutation.mutate(status);
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File quá lớn! Vui lòng chọn file nhỏ hơn 5MB");
        return;
      }

      // Check file type
      if (!file.type.startsWith("image/")) {
        alert("Vui lòng chọn file ảnh!");
        return;
      }

      updateAvatarMutation.mutate(file);
    }
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert("Mật khẩu xác nhận không khớp!");
      return;
    }

    if (passwordData.newPassword.length < 6) {
      alert("Mật khẩu mới phải có ít nhất 6 ký tự!");
      return;
    }

    changePasswordMutation.mutate(
      {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      },
      {
        onSuccess: () => {
          setIsChangingPassword(false);
          setPasswordData({
            currentPassword: "",
            newPassword: "",
            confirmPassword: "",
          });
        },
      }
    );
  };

  const handleDeactivate = () => {
    const confirmed = window.confirm(
      "Bạn có chắc chắn muốn vô hiệu hóa tài khoản? Hành động này không thể hoàn tác!"
    );
    if (confirmed) {
      deactivateAccountMutation.mutate();
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case "ONLINE":
        return "bg-green-500";
      case "AWAY":
        return "bg-yellow-500";
      case "DND":
        return "bg-red-500";
      default:
        return "bg-gray-400";
    }
  };

  const getStatusLabel = (status: string): string => {
    switch (status) {
      case "ONLINE":
        return "Trực tuyến";
      case "AWAY":
        return "Vắng mặt";
      case "DND":
        return "Không làm phiền";
      default:
        return "Ngoại tuyến";
    }
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // const formatDate = (timestamp: number): string => {
  //   return new Date(timestamp).toLocaleDateString("vi-VN", {
  //     year: "numeric",
  //     month: "long",
  //     day: "numeric",
  //   });
  // };

  if (loadingProfile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <p className="text-red-600">Không thể tải hồ sơ. Vui lòng thử lại!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Hồ sơ cá nhân
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Quản lý thông tin và cài đặt tài khoản của bạn
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Avatar & Status */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="pt-6">
                {/* Avatar */}
                <div className="flex flex-col items-center">
                  <div className="relative group">
                    <Avatar className="w-32 h-32 border-4 border-white dark:border-gray-700 shadow-lg">
                      <AvatarImage src={profile.avatarUrl || ""} />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-3xl">
                        {getInitials(profile.displayName)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`z-50 absolute bottom-2 right-2 w-6 h-6 ${getStatusColor(
                        profile.status
                      )} border-4 border-white dark:border-gray-800 rounded-full`}
                    ></div>

                    {/* Upload button overlay */}
                    <button
                      onClick={handleAvatarClick}
                      disabled={updateAvatarMutation.isPending}
                      className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 rounded-full transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 cursor-pointer"
                    >
                      {updateAvatarMutation.isPending ? (
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                      ) : (
                        <Camera className="w-8 h-8 text-white" />
                      )}
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                    {profile.displayName}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400">
                    @{profile.username}
                  </p>

                  <Badge variant="secondary" className="mt-3">
                    {getStatusLabel(profile.status)}
                  </Badge>
                </div>

                <Separator className="my-6" />

                {/* Status Options */}
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                    Trạng thái
                  </p>
                  {(["ONLINE", "AWAY", "DND", "OFFLINE"] as UserStatus[]).map(
                    (status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(status)}
                        disabled={updateStatusMutation.isPending}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                          profile.status === status
                            ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                        }`}
                      >
                        <div
                          className={`w-3 h-3 ${getStatusColor(
                            status
                          )} rounded-full`}
                        ></div>
                        <span className="flex-1 text-left text-sm font-medium">
                          {getStatusLabel(status)}
                        </span>
                        {profile.status === status && (
                          <Check className="w-4 h-4" />
                        )}
                      </button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Profile Info */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Info Card */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Thông tin cá nhân</CardTitle>
                    <CardDescription>
                      Cập nhật thông tin hiển thị của bạn
                    </CardDescription>
                  </div>
                  {!isEditing ? (
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="gap-2"
                    >
                      <Edit2 className="w-4 h-4" />
                      Chỉnh sửa
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        onClick={handleCancel}
                        variant="outline"
                        size="sm"
                        className="gap-2"
                      >
                        <X className="w-4 h-4" />
                        Hủy
                      </Button>
                      <Button
                        onClick={handleSave}
                        size="sm"
                        className="gap-2"
                        disabled={updateProfileMutation.isPending}
                      >
                        <Save className="w-4 h-4" />
                        {updateProfileMutation.isPending
                          ? "Đang lưu..."
                          : "Lưu"}
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Username - Read only */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    @{profile.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Username không thể thay đổi
                  </p>
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Tên hiển thị
                  </label>
                  {isEditing ? (
                    <Input
                      name="displayName"
                      value={editData.displayName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="h-11"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white font-medium px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {profile.displayName}
                    </p>
                  )}
                </div>

                {/* Email - Read only */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <div className="flex items-center gap-2">
                    <p className="flex-1 text-gray-900 dark:text-white font-medium px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {profile.email}
                    </p>
                    {profile.isVerified && (
                      <Badge variant="default" className="bg-green-600">
                        <Check className="w-3 h-3 mr-1" />
                        Đã xác thực
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Bio */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Bio
                  </label>
                  {isEditing ? (
                    <textarea
                      name="bio"
                      value={editData.bio}
                      onChange={handleInputChange}
                      placeholder="Viết vài điều về bạn..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : (
                    <p className="text-gray-700 dark:text-gray-300 px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg whitespace-pre-wrap">
                      {profile.bio || "Chưa có bio"}
                    </p>
                  )}
                </div>

                {/* <Separator /> */}

                {/* Account Info */}
                {/* <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Thông tin tài khoản
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Tham gia: {formatDate(1761705970590)}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Shield className="w-4 h-4" />
                    <span>Phương thức: {"LOCAL"}</span>
                  </div>
                </div> */}
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card>
              <CardHeader>
                <CardTitle>Bảo mật</CardTitle>
                <CardDescription>
                  Quản lý mật khẩu và bảo mật tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {!isChangingPassword ? (
                  <Button
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => setIsChangingPassword(true)}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Đổi mật khẩu
                  </Button>
                ) : (
                  <div className="space-y-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                    <Input
                      type="password"
                      name="currentPassword"
                      placeholder="Mật khẩu hiện tại"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                    />
                    <Input
                      type="password"
                      name="newPassword"
                      placeholder="Mật khẩu mới"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                    />
                    <Input
                      type="password"
                      name="confirmPassword"
                      placeholder="Xác nhận mật khẩu mới"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={() => {
                          setIsChangingPassword(false);
                          setPasswordData({
                            currentPassword: "",
                            newPassword: "",
                            confirmPassword: "",
                          });
                        }}
                        variant="outline"
                        className="flex-1"
                      >
                        Hủy
                      </Button>
                      <Button
                        onClick={handleChangePassword}
                        disabled={changePasswordMutation.isPending}
                        className="flex-1"
                      >
                        {changePasswordMutation.isPending
                          ? "Đang xử lý..."
                          : "Cập nhật"}
                      </Button>
                    </div>
                  </div>
                )}

                <Separator />

                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20"
                  onClick={handleDeactivate}
                  disabled={deactivateAccountMutation.isPending}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  {deactivateAccountMutation.isPending
                    ? "Đang xử lý..."
                    : "Vô hiệu hóa tài khoản"}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
