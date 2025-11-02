import { apiClient } from "./apiClient";
import type { Conversation, ConversationMember } from "../types/message.types";
import type { ApiResponse } from "@/types/common.types";

export const conversationService = {
  // Get all conversations in workspace
  getConversations: async (
    workspaceId: number
  ): Promise<ApiResponse<Conversation[]>> => {
    return apiClient.get<ApiResponse<Conversation[]>>(
      `/workspaces/${workspaceId}/conversations`
    );
  },

  // Get conversation by ID
  getConversation: async (
    conversationId: number
  ): Promise<ApiResponse<Conversation>> => {
    return apiClient.get<ApiResponse<Conversation>>(
      `/conversations/${conversationId}`
    );
  },

  // Create channel
  createChannel: async (
    workspaceId: number,
    data: {
      name: string;
      description?: string;
      is_private: boolean;
    }
  ): Promise<ApiResponse<Conversation>> => {
    return apiClient.post<ApiResponse<Conversation>>(
      `/workspaces/${workspaceId}/channels`,
      data
    );
  },

  // Create DM conversation
  createDM: async (
    workspaceId: number,
    data: { account_ids: number[] }
  ): Promise<ApiResponse<Conversation>> => {
    return apiClient.post<ApiResponse<Conversation>>(
      `/workspaces/${workspaceId}/dm`,
      data
    );
  },

  // Update conversation
  updateConversation: async (
    conversationId: number,
    data: Partial<{ name: string; description: string }>
  ): Promise<ApiResponse<Conversation>> => {
    return apiClient.put<ApiResponse<Conversation>>(
      `/conversations/${conversationId}`,
      data
    );
  },

  // Delete conversation
  deleteConversation: async (
    conversationId: number
  ): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(
      `/conversations/${conversationId}`
    );
  },

  // Get conversation members
  getMembers: async (
    conversationId: number
  ): Promise<ApiResponse<ConversationMember[]>> => {
    return apiClient.get<ApiResponse<ConversationMember[]>>(
      `/conversations/${conversationId}/members`
    );
  },

  // Add member to conversation
  addMember: async (
    conversationId: number,
    accountId: number
  ): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(
      `/conversations/${conversationId}/members`,
      { account_id: accountId }
    );
  },

  // Leave conversation
  leaveConversation: async (
    conversationId: number
  ): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(
      `/conversations/${conversationId}/leave`
    );
  },
};
