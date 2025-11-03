import { apiClient } from "./apiClient";
import type { ApiResponse } from "../types/common.types";
import type { WorkspaceMember } from "@/types/workspace.types";

export interface WorkspaceData {
  workspaceId: number;
  name: string;
  description: string | null;
  createdBy: number;
  isArchived: boolean;
  createdAt: number;
  updatedAt: number;
  role?: string;
}

export interface WorkspaceMemberData {
  id: number;
  workspaceId: number;
  accountId: number;
  role: string;
  joinedAt: number;
  isActive: boolean;
  profile: {
    accountId: number;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    status: string;
  };
}

export const workspaceService = {
  // POST /api/workspaces
  createWorkspace: async (data: {
    name: string;
    description?: string;
  }): Promise<ApiResponse<WorkspaceData>> => {
    return apiClient.post<ApiResponse<WorkspaceData>>("/workspaces", data);
  },

  // GET /api/workspaces
  getMyWorkspaces: async (): Promise<ApiResponse<WorkspaceData[]>> => {
    return apiClient.get<ApiResponse<WorkspaceData[]>>("/workspaces");
  },

  // GET /api/workspaces/:id
  getWorkspace: async (
    workspaceId: number
  ): Promise<ApiResponse<WorkspaceData>> => {
    return apiClient.get<ApiResponse<WorkspaceData>>(
      `/workspaces/${workspaceId}`
    );
  },

  // PATCH /api/workspaces/:id
  updateWorkspace: async (
    workspaceId: number,
    data: { name?: string; description?: string }
  ): Promise<ApiResponse<WorkspaceData>> => {
    return apiClient.patch<ApiResponse<WorkspaceData>>(
      `/workspaces/${workspaceId}`,
      data
    );
  },

  // POST /api/workspaces/:id (Add user)
  addMember: async (
    workspaceId: number,
    accountId: number
  ): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(`/workspaces/${workspaceId}`, {
      accountId,
    });
  },

  // GET /api/workspaces/:id/members
  getMembers: async (
    workspaceId: number
  ): Promise<ApiResponse<WorkspaceMemberData[]>> => {
    return apiClient.get<ApiResponse<WorkspaceMemberData[]>>(
      `/workspaces/${workspaceId}/members`
    );
  },

  // DELETE /api/workspaces/:id/members/:accountId
  removeMember: async (
    workspaceId: number,
    accountId: number
  ): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(
      `/workspaces/${workspaceId}/members/${accountId}`
    );
  },

  // DELETE /api/workspaces/:id/leave
  leaveWorkspace: async (workspaceId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(
      `/workspaces/${workspaceId}/leave`
    );
  },

  getWorkspaceMembers: async (
    workspaceId: number
  ): Promise<ApiResponse<WorkspaceMember[]>> => {
    return apiClient.get<ApiResponse<WorkspaceMember[]>>(
      `/workspaces/${workspaceId}/members`
    );
  },
};
