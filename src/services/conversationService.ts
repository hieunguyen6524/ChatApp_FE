import { apiClient } from "./apiClient";
import type { ApiResponse } from "../types/common.types";

export interface ConversationData {
  conversationId: number;
  workspaceId: number;
  name: string | null;
  description: string | null;
  type: "CHANNEL" | "DM_PAIR" | "DM_GROUP";
  isPrivate: boolean;
  isArchived: boolean;
  createdBy: number;
  createdAt: number;
  updatedAt: number;
  unreadCount?: number;
  lastMessage?: {
    messageId: number;
    content: string;
    createdAt: number;
  };
}

export interface ConversationMemberData {
  id: number;
  conversationId: number;
  accountId: number;
  isChannelAdmin: boolean;
  joinedAt: number;
  lastReadMessageId: number | null;
  lastReadAt: number | null;
  isNotifEnabled: boolean;
  isActive: boolean;
  profile: {
    accountId: number;
    username: string;
    displayName: string;
    avatarUrl: string | null;
    status: string;
  };
}

export const conversationService = {
  // POST /api/conversations
  createConversation: async (data: {
    workspaceId: number;
    name?: string;
    description?: string;
    type: "CHANNEL" | "DM_PAIR" | "DM_GROUP";
    isPrivate: boolean;
    memberIds?: number[];
  }): Promise<ApiResponse<ConversationData>> => {
    return apiClient.post<ApiResponse<ConversationData>>(
      "/conversations",
      data
    );
  },

  // GET /api/conversations/workspace/:workspaceId
  getConversationsByWorkspace: async (
    workspaceId: number
  ): Promise<ApiResponse<ConversationData[]>> => {
    return apiClient.get<ApiResponse<ConversationData[]>>(
      `/conversations/workspace/${workspaceId}`
    );
  },

  // GET /api/conversations/:id
  getConversation: async (
    conversationId: number
  ): Promise<ApiResponse<ConversationData>> => {
    return apiClient.get<ApiResponse<ConversationData>>(
      `/conversations/${conversationId}`
    );
  },

  // PATCH /api/conversations/:id
  updateConversation: async (
    conversationId: number,
    data: {
      name?: string;
      description?: string;
      isPrivate?: boolean;
    }
  ): Promise<ApiResponse<ConversationData>> => {
    return apiClient.patch<ApiResponse<ConversationData>>(
      `/conversations/${conversationId}`,
      data
    );
  },

  // POST /api/conversations/:id/members
  addMember: async (
    conversationId: number,
    accountId: number
  ): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(
      `/conversations/${conversationId}/members`,
      {
        accountId,
      }
    );
  },

  // GET /api/conversations/:id/members
  getMembers: async (
    conversationId: number
  ): Promise<ApiResponse<ConversationMemberData[]>> => {
    return apiClient.get<ApiResponse<ConversationMemberData[]>>(
      `/conversations/${conversationId}/members`
    );
  },

  // DELETE /api/conversations/:id/members/:accountId
  removeMember: async (
    conversationId: number,
    accountId: number
  ): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(
      `/conversations/${conversationId}/members/${accountId}`
    );
  },

  // DELETE /api/conversations/:id/leave
  leaveConversation: async (
    conversationId: number
  ): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(
      `/conversations/${conversationId}/leave`
    );
  },
};
