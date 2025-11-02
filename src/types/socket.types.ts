import type { UserStatus } from "./user.types";

export type SocketEventType =
  | "message:new"
  | "message:update"
  | "message:delete"
  | "message:reaction"
  | "conversation:update"
  | "user:status"
  | "user:typing"
  | "user:stop_typing";

export interface SocketEvent<T = unknown> {
  type: SocketEventType;
  payload: T;
  timestamp: number;
}

export interface TypingEvent {
  conversation_id: number;
  user_id: number;
  username: string;
}

export interface UserStatusEvent {
  user_id: number;
  status: UserStatus;
  last_active_at: number;
}
