import type { Profile, WorkspaceRole } from "./user.types";

export interface Workspace {
  workspace_id: number;
  name: string;
  description: string | null;
  created_by: number | null;
  is_archived: boolean;
  created_at: number;
  updated_at: number;
}

export interface WorkspaceMember {
  id: number;
  workspace_id: number;
  account_id: number;
  ws_role_id: number;
  joined_at: number;
  is_active: boolean;
  profile?: Profile;
  role?: WorkspaceRole;
}

export interface WorkspaceFileQuota {
  workspace_id: number;
  max_storage_bytes: number;
  current_used_bytes: number;
  updated_at: number;
}
