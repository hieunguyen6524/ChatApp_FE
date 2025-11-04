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
  messageId: number; // Đổi từ message_id
  conversationId: number; // Đổi từ conversation_id
  sender: Profile; // Object phức tạp hơn
  content: string;
  contentType: ContentType;
  isDeleted: boolean; // Đổi từ is_deleted
  isPinned: boolean; // Đổi từ is_pinned
  parentId: number | null; // Đổi từ parent_id
  replyCount: number; // Mới thêm
  reactions: MessageReaction[] | null;
  mentions: number[] | null; // Mới thêm
  attachments: MessageAttachment[] | null; // Mới thêm
  createdAt: number; // Đổi từ created_at
  updatedAt: number; // Đổi từ updated_at
}

export interface MessageReaction {
  messageId: number;
  accountId: number;
  emoji: string;
  reactedAt: number;
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
  fileId: number;
  fileName: string;
  fileUrl: string;
  fileSize: number;
  fileType: string;
}
