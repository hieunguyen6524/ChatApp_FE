import { apiClient } from "./apiClient";
import type { FileMetadata } from "../types/message.types";
import type { ApiResponse } from "@/types/common.types";

export const fileService = {
  // Upload file
  uploadFile: async (
    file: File,
    workspaceId: number
  ): Promise<ApiResponse<FileMetadata>> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("workspace_id", workspaceId.toString());

    return apiClient.post<ApiResponse<FileMetadata>>(
      "/files/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
  },

  // Get file metadata
  getFile: async (fileId: number): Promise<ApiResponse<FileMetadata>> => {
    return apiClient.get<ApiResponse<FileMetadata>>(`/files/${fileId}`);
  },

  // Delete file
  deleteFile: async (fileId: number): Promise<ApiResponse<void>> => {
    return apiClient.delete<ApiResponse<void>>(`/files/${fileId}`);
  },

  // Get workspace files
  getWorkspaceFiles: async (
    workspaceId: number,
    params?: { file_type?: string; page?: number; limit?: number }
  ): Promise<ApiResponse<FileMetadata[]>> => {
    return apiClient.get<ApiResponse<FileMetadata[]>>(
      `/workspaces/${workspaceId}/files`,
      { params }
    );
  },
};
