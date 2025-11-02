export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface SearchParams {
  query: string;
  workspace_id?: number;
  conversation_id?: number;
  sender_id?: number;
  from_date?: number;
  to_date?: number;
  file_type?: string;
}
