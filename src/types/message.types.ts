import type { Profile } from "./user.types";

export type ConversationType = "CHANNEL" | "DM_PAIR" | "DM_GROUP";

export type ContentType = "TEXT" | "MARKDOWN" | "CODE" | "SYSTEM";

export interface Conversation {
  conversation_id: number;
  workspace_id: number;
  name: string | null;
  description: string | null;
  type: ConversationType;
  is_private: boolean;
  is_archived: boolean;
  created_by: number | null;
  created_at: number;
  updated_at: number;
  unread_count?: number;
  last_message?: Message;
}

export interface ConversationMember {
  id: number;
  conversation_id: number;
  account_id: number;
  is_channel_admin: boolean;
  joined_at: number;
  last_read_message_id: number | null;
  last_read_at: number | null;
  is_notif_enabled: boolean;
  is_active: boolean;
  left_at: number | null;
  profile?: Profile;
}

export interface Message {
  message_id: number;
  conversation_id: number;
  sender_id: number | null;
  parent_id: number | null;
  content: string | null;
  content_type: ContentType;
  is_deleted: boolean;
  is_pinned: boolean;
  created_at: number;
  updated_at: number;
  sender?: Profile;
  reactions?: MessageReaction[];
  mentions?: number[];
  attachments?: FileMetadata[];
  reply_count?: number;
}

export interface MessageReaction {
  message_id: number;
  account_id: number;
  emoji: string;
  reacted_at: number;
  profile?: Profile;
}

export interface MessageMention {
  message_id: number;
  mentioned_account_id: number;
}

export interface FileMetadata {
  file_id: number;
  account_id: number;
  s3_key: string;
  original_file_name: string | null;
  content_type: string | null;
  file_size: number;
  file_type: string;
  url: string | null;
  is_deleted: boolean;
  created_at: number;
  updated_at: number;
  deleted_at: number | null;
}

export interface MessageAttachment {
  id: number;
  message_id: number;
  file_id: number;
  file?: FileMetadata;
}
