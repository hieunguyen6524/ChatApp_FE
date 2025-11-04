import { apiClient } from "./apiClient";
import type { ApiResponse } from "../types/common.types";
import type { Message } from "../types/message.types";

export interface MessageListResponse {
  data: Message[];
  currentPage: number;
  totalPages: number;
  totalElements: number;
  size: number;
}

export const messageService = {
  // GET /api/conversations/:id/messages
  getMessages: async (
    conversationId: number,
    params?: {
      page?: number;
      size?: number;
      beforeMessageId?: number;
    }
  ): Promise<ApiResponse<MessageListResponse>> => {
    return apiClient.get<ApiResponse<MessageListResponse>>(
      `/messages/conversation/${conversationId}`,
      { params }
    );
  },

  // POST /api/conversations/:id/messages
  sendMessage: async (
    // conversationId: number,
    data: {
      content: string;
      contentType?: "TEXT" | "MARKDOWN" | "CODE";
      parentId?: number;
    }
  ): Promise<ApiResponse<Message>> => {
    return apiClient.post<ApiResponse<Message>>(`/messages`, data);
  },

  // PUT /api/messages/:id
  updateMessage: async (
    messageId: number,
    content: string
  ): Promise<ApiResponse<Message>> => {
    return apiClient.put<ApiResponse<Message>>(`/messages/${messageId}`, {
      content,
    });
  },

  // DELETE /api/messages/:id
  deleteMessage: async (messageId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/messages/${messageId}`);
  },

  // POST /api/messages/:id/reactions
  addReaction: async (
    messageId: number,
    emoji: string
  ): Promise<ApiResponse<void>> => {
    return apiClient.post<ApiResponse<void>>(
      `/messages/${messageId}/reactions`,
      {
        emoji,
      }
    );
  },

  // DELETE /api/messages/:id/reactions/:emoji
  removeReaction: async (
    messageId: number,
    emoji: string
  ): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(
      `/messages/${messageId}/reactions/${encodeURIComponent(emoji)}`
    );
  },
};
