import type { Profile } from "./user.types";

export type ConversationType = "CHANNEL" | "DM_PAIR" | "DM_GROUP";

export type ContentType = "TEXT" | "MARKDOWN" | "CODE" | "SYSTEM";

export interface Conversation {
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

export interface ConversationMember {
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
