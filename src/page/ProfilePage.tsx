import React, { useEffect, useState } from "react";
import { Camera, Mail, User, Edit2, Save, X, Check, Clock } from "lucide-react";
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
  useMyProfile,
  useUpdateProfile,
  useUpdateStatus,
} from "../hooks/profile/useProfile";
import type { UserStatus } from "../types/user.types";

// type UserStatus = "ONLINE" | "OFFLINE" | "AWAY" | "DND";

// interface ProfileData {
//   username: string;
//   displayName: string;
//   email: string;
//   bio: string;
//   avatarUrl: string;
//   status: UserStatus;
// }

const ProfilePage: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);

  const { data: profile, isLoading } = useMyProfile();
  const updateProfileMutation = useUpdateProfile();
  const updateStatusMutation = useUpdateStatus();

  const [editData, setEditData] = useState({
    username: "",
    display_name: "",
    bio: "",
  });

  useEffect(() => {
    if (profile) {
      setEditData({
        username: profile.username,
        display_name: profile.display_name,
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
        username: profile.username,
        display_name: profile.display_name,
        bio: profile.bio || "",
      });
    }
    setIsEditing(false);
  };

  const handleStatusChange = (status: UserStatus) => {
    updateStatusMutation.mutate(status);
  };

  const getStatusColor = (status: UserStatus): string => {
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

  const getStatusLabel = (status: UserStatus): string => {
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!profile) return null;

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
                      <AvatarImage
                        src={profile.avatar_url || "/default-avatar.png"}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-indigo-600 text-white text-3xl">
                        {getInitials(profile.display_name)}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute bottom-2 right-2 w-6 h-6 ${getStatusColor(
                        profile.status
                      )} border-4 border-white dark:border-gray-800 rounded-full`}
                    ></div>

                    {/* Upload button overlay */}
                    <button className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 rounded-full transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                      <Camera className="w-8 h-8 text-white" />
                    </button>
                  </div>

                  <h2 className="text-xl font-bold text-gray-900 dark:text-white mt-4">
                    {profile.display_name}
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
          <div className="lg:col-span-2">
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
                      <Button onClick={handleSave} size="sm" className="gap-2">
                        <Save className="w-4 h-4" />
                        Lưu
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-6">
                {/* Username */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Username
                  </label>
                  {isEditing ? (
                    <Input
                      name="username"
                      value={editData.username}
                      onChange={handleInputChange}
                      placeholder="johndoe"
                      className="h-11"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white font-medium px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      @{profile.username}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Username dùng để đăng nhập và được mention trong chat
                  </p>
                </div>

                {/* Display Name */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Tên hiển thị
                  </label>
                  {isEditing ? (
                    <Input
                      name="displayName"
                      value={editData.display_name}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      className="h-11"
                    />
                  ) : (
                    <p className="text-gray-900 dark:text-white font-medium px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      {profile.display_name}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    Email
                  </label>
                  <p className="text-gray-900 dark:text-white font-medium px-4 py-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    {/* {profile.email} */}
                    "Email dang ở phân account chua chuyển qua"
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Email không thể thay đổi. Liên hệ admin nếu cần hỗ trợ.
                  </p>
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
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    Tối đa 200 ký tự
                  </p>
                </div>

                <Separator />

                {/* Account Info */}
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Thông tin tài khoản
                  </h3>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Clock className="w-4 h-4" />
                    <span>Tham gia: Tháng 11, 2025</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-400">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>Email đã xác thực</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security Card */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Bảo mật</CardTitle>
                <CardDescription>
                  Quản lý mật khẩu và bảo mật tài khoản
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Button variant="outline" className="w-full justify-start">
                  Đổi mật khẩu
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Xác thực 2 yếu tố (2FA)
                </Button>
                <Button
                  variant="outline"
                  className="w-full justify-start text-red-600 hover:text-red-700"
                >
                  Xóa tài khoản
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
