export type UserStatus = "ONLINE" | "OFFLINE" | "AWAY" | "DND";

export type AuthProvider = "LOCAL" | "GOOGLE" | "SSO";

export interface Account {
  accountId: number;
  email: string;
  provider: string;
  isVerified: boolean;
  isActive: boolean;
  createdAt: number;
  updatedAt: number;
}

export interface Profile {
  accountId: number;
  username: string;
  displayName: string;
  avatarUrl: string | null;
  bio: string | null;
  status: string;
  lastActiveAt: number | null;
  updatedAt: number | null;
}

export interface User {
  account: Account;
  profile: Profile;
}

export interface Role {
  role_id: number;
  role_name: string;
}

export interface WorkspaceRole {
  ws_role_id: number;
  role_name: string;
  description: string | null;
}
