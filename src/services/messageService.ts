import { apiClient } from "./apiClient";
import type { Message } from "../types/message.types";
import type { ApiResponse, PaginatedResponse } from "@/types/common.types";

export const messageService = {
  // Get messages with pagination
  getMessages: async (
    conversationId: number,
    params: { page?: number; limit?: number; before_id?: number }
  ): Promise<ApiResponse<PaginatedResponse<Message>>> => {
    return apiClient.get<ApiResponse<PaginatedResponse<Message>>>(
      `/conversations/${conversationId}/messages`,
      { params }
    );
  },

  // Send message
  sendMessage: async (
    conversationId: number,
    data: {
      content: string;
      content_type?: "TEXT" | "MARKDOWN" | "CODE";
      parent_id?: number;
    }
  ): Promise<ApiResponse<Message>> => {
    return apiClient.post<ApiResponse<Message>>(
      `/conversations/${conversationId}/messages`,
      data
    );
  },

  // Update message
  updateMessage: async (
    messageId: number,
    data: { content: string }
  ): Promise<ApiResponse<Message>> => {
    return apiClient.put<ApiResponse<Message>>(`/messages/${messageId}`, data);
  },

  // Delete message
  deleteMessage: async (messageId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/messages/${messageId}`);
  },

  // Add reaction
  addReaction: async (
    messageId: number,
    emoji: string
  ): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(
      `/messages/${messageId}/reactions`,
      { emoji }
    );
  },

  // Remove reaction
  removeReaction: async (
    messageId: number,
    emoji: string
  ): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(
      `/messages/${messageId}/reactions/${emoji}`
    );
  },

  // Pin message
  pinMessage: async (messageId: number): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(`/messages/${messageId}/pin`);
  },

  // Unpin message
  unpinMessage: async (messageId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/messages/${messageId}/pin`);
  },

  // Mark as read
  markAsRead: async (
    conversationId: number,
    messageId: number
  ): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(
      `/conversations/${conversationId}/read`,
      { message_id: messageId }
    );
  },
};
