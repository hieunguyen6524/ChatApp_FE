import { apiClient } from "./apiClient";
import type { Workspace, WorkspaceMember } from "../types/workspace.types";
import type { ApiResponse } from "@/types/common.types";

export const workspaceService = {
  // Get all workspaces for current user
  getMyWorkspaces: async (): Promise<ApiResponse<Workspace[]>> => {
    return apiClient.get<ApiResponse<Workspace[]>>("/workspaces");
  },

  // Get workspace by ID
  getWorkspace: async (
    workspaceId: number
  ): Promise<ApiResponse<Workspace>> => {
    return apiClient.get<ApiResponse<Workspace>>(`/workspaces/${workspaceId}`);
  },

  // Create workspace
  createWorkspace: async (data: {
    name: string;
    description?: string;
  }): Promise<ApiResponse<Workspace>> => {
    return apiClient.post<ApiResponse<Workspace>>("/workspaces", data);
  },

  // Update workspace
  updateWorkspace: async (
    workspaceId: number,
    data: Partial<{ name: string; description: string }>
  ): Promise<ApiResponse<Workspace>> => {
    return apiClient.put<ApiResponse<Workspace>>(
      `/workspaces/${workspaceId}`,
      data
    );
  },

  // Delete workspace
  deleteWorkspace: async (workspaceId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/workspaces/${workspaceId}`);
  },

  // Get workspace members
  getWorkspaceMembers: async (
    workspaceId: number
  ): Promise<ApiResponse<WorkspaceMember[]>> => {
    return apiClient.get<ApiResponse<WorkspaceMember[]>>(
      `/workspaces/${workspaceId}/members`
    );
  },

  // Invite member to workspace
  inviteMember: async (
    workspaceId: number,
    data: { email: string; role_id: number }
  ): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(
      `/workspaces/${workspaceId}/members/invite`,
      data
    );
  },

  // Remove member from workspace
  removeMember: async (
    workspaceId: number,
    accountId: number
  ): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(
      `/workspaces/${workspaceId}/members/${accountId}`
    );
  },
};
