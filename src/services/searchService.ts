import { apiClient } from "./apiClient";
import type { SearchParams, ApiResponse } from "../types/common.types";
import type { Message } from "../types/message.types";

export const searchService = {
  // Search messages
  searchMessages: async (
    params: SearchParams
  ): Promise<ApiResponse<Message[]>> => {
    return apiClient.get<ApiResponse<Message[]>>("/search/messages", {
      params,
    });
  },

  // Search users
  searchUsers: async (query: string, workspaceId?: number) => {
    return apiClient.get("/search/users", {
      params: { query, workspace_id: workspaceId },
    });
  },

  // Search files
  searchFiles: async (params: Omit<SearchParams, "sender_id">) => {
    return apiClient.get("/search/files", { params });
  },
};
