export type UserStatus = "ONLINE" | "OFFLINE" | "AWAY" | "DND";

export type AuthProvider = "LOCAL" | "GOOGLE" | "SSO";

export interface Account {
  account_id: number;
  email: string;
  provider: AuthProvider;
  is_verified: boolean;
  is_active: boolean;
  created_at: number;
  updated_at: number;
}

export interface Profile {
  account_id: number;
  username: string;
  display_name: string;
  avatar_url: string | null;
  bio: string | null;
  status: UserStatus;
  last_active_at: number | null;
  updated_at: number | null;
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
