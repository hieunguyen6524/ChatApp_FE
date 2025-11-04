import { create } from "zustand";
import type {
  Conversation,
  Message,
  ConversationMember,
} from "../types/message.types";
import type { Workspace } from "@/types/workspace.types";

interface TypingUser {
  user_id: number;
  username: string;
  timestamp: number;
}

interface ChatState {
  // Current selections
  currentWorkspace: Workspace | null;
  currentConversation: Conversation | null;

  // Data
  workspaces: Workspace[];
  conversations: Conversation[];
  messages: Record<number, Message[]>; // conversation_id -> messages[]
  conversationMembers: Record<number, ConversationMember[]>; // conversation_id -> members[]

  // UI State
  isLoadingMessages: boolean;
  isLoadingConversations: boolean;
  typingUsers: Record<number, TypingUser[]>; // conversation_id -> typing users

  // Actions - Workspace
  setWorkspaces: (workspaces: Workspace[]) => void;
  setCurrentWorkspace: (workspace: Workspace | null) => void;
  addWorkspace: (workspace: Workspace) => void;
  updateWorkspace: (workspaceId: number, updates: Partial<Workspace>) => void;
  removeWorkspace: (workspaceId: number) => void;

  // Actions - Conversations
  setConversations: (conversations: Conversation[]) => void;
  setCurrentConversation: (conversation: Conversation | null) => void;
  addConversation: (conversation: Conversation) => void;
  updateConversation: (
    conversationId: number,
    updates: Partial<Conversation>
  ) => void;
  removeConversation: (conversationId: number) => void;
  incrementUnreadCount: (conversationId: number) => void;
  resetUnreadCount: (conversationId: number) => void;

  // Actions - Messages
  setMessages: (conversationId: number, messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessage: (messageId: number, updates: Partial<Message>) => void;
  deleteMessage: (conversationId: number, messageId: number) => void;
  prependMessages: (conversationId: number, messages: Message[]) => void;

  // Actions - Members
  setConversationMembers: (
    conversationId: number,
    members: ConversationMember[]
  ) => void;

  // Actions - Typing
  addTypingUser: (conversationId: number, user: TypingUser) => void;
  removeTypingUser: (conversationId: number, userId: number) => void;

  // Actions - Loading
  setLoadingMessages: (loading: boolean) => void;
  setLoadingConversations: (loading: boolean) => void;

  // Actions - Reset
  reset: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  // Initial state
  currentWorkspace: null,
  currentConversation: null,
  workspaces: [],
  conversations: [],
  messages: {},
  conversationMembers: {},
  isLoadingMessages: false,
  isLoadingConversations: false,
  typingUsers: {},

  // Workspace actions
  setWorkspaces: (workspaces) => set({ workspaces }),

  setCurrentWorkspace: (workspace) =>
    set({
      currentWorkspace: workspace,
      currentConversation: null,
      conversations: [],
    }),

  addWorkspace: (workspace) =>
    set((state) => ({
      workspaces: [...state.workspaces, workspace],
    })),

  updateWorkspace: (workspaceId, updates) =>
    set((state) => ({
      workspaces: state.workspaces.map((w) =>
        w.workspaceId === workspaceId ? { ...w, ...updates } : w
      ),
      currentWorkspace:
        state.currentWorkspace?.workspaceId === workspaceId
          ? { ...state.currentWorkspace, ...updates }
          : state.currentWorkspace,
    })),

  removeWorkspace: (workspaceId) =>
    set((state) => ({
      workspaces: state.workspaces.filter((w) => w.workspaceId !== workspaceId),
      currentWorkspace:
        state.currentWorkspace?.workspaceId === workspaceId
          ? null
          : state.currentWorkspace,
    })),

  // Conversation actions
  setConversations: (conversations) => set({ conversations }),

  setCurrentConversation: (conversation) =>
    set({ currentConversation: conversation }),

  addConversation: (conversation) =>
    set((state) => ({
      conversations: [conversation, ...state.conversations],
    })),

  updateConversation: (conversationId, updates) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.conversationId === conversationId ? { ...c, ...updates } : c
      ),
      currentConversation:
        state.currentConversation?.conversationId === conversationId
          ? { ...state.currentConversation, ...updates }
          : state.currentConversation,
    })),

  removeConversation: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.filter(
        (c) => c.conversationId !== conversationId
      ),
      currentConversation:
        state.currentConversation?.conversationId === conversationId
          ? null
          : state.currentConversation,
    })),

  incrementUnreadCount: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.conversationId === conversationId
          ? { ...c, unread_count: (c.unreadCount || 0) + 1 }
          : c
      ),
    })),

  resetUnreadCount: (conversationId) =>
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.conversationId === conversationId ? { ...c, unread_count: 0 } : c
      ),
    })),

  // Message actions
  setMessages: (conversationId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: messages,
      },
    })),

  addMessage: (message: Message) =>
    set((state) => {
      const conversationId = message.conversationId;
      const existingMessages = state.messages[conversationId] || [];

      // Check if message already exists (prevent duplicates)
      const isDuplicate = existingMessages.some(
        (m) => m.messageId === message.messageId
      );

      if (isDuplicate) {
        console.log("Duplicate message, skipping:", message.messageId);
        return state;
      }

      return {
        messages: {
          ...state.messages,
          [conversationId]: [...existingMessages, message],
        },
        conversations: state.conversations.map((c) =>
          c.conversationId === conversationId
            ? {
                ...c,
                lastMessage: {
                  messageId: message.messageId,
                  content: message.content,
                  createdAt: message.createdAt,
                },
                updatedAt: message.createdAt,
              }
            : c
        ),
      };
    }),

  updateMessage: (messageId, updates) =>
    set((state) => {
      const newMessages = { ...state.messages };

      Object.keys(newMessages).forEach((convId) => {
        newMessages[Number(convId)] = newMessages[Number(convId)].map((m) =>
          m.messageId === messageId ? { ...m, ...updates } : m
        );
      });

      return { messages: newMessages };
    }),

  deleteMessage: (conversationId, messageId) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]:
          state.messages[conversationId]?.filter(
            (m) => m.messageId !== messageId
          ) || [],
      },
    })),

  prependMessages: (conversationId, messages) =>
    set((state) => ({
      messages: {
        ...state.messages,
        [conversationId]: [
          ...messages,
          ...(state.messages[conversationId] || []),
        ],
      },
    })),

  // Member actions
  setConversationMembers: (conversationId, members) =>
    set((state) => ({
      conversationMembers: {
        ...state.conversationMembers,
        [conversationId]: members,
      },
    })),

  // Typing actions
  addTypingUser: (conversationId, user) =>
    set((state) => {
      const existing = state.typingUsers[conversationId] || [];
      const filtered = existing.filter((u) => u.user_id !== user.user_id);

      return {
        typingUsers: {
          ...state.typingUsers,
          [conversationId]: [...filtered, user],
        },
      };
    }),

  removeTypingUser: (conversationId, userId) =>
    set((state) => ({
      typingUsers: {
        ...state.typingUsers,
        [conversationId]: (state.typingUsers[conversationId] || []).filter(
          (u) => u.user_id !== userId
        ),
      },
    })),

  // Loading actions
  setLoadingMessages: (loading) => set({ isLoadingMessages: loading }),
  setLoadingConversations: (loading) =>
    set({ isLoadingConversations: loading }),

  // Reset
  reset: () =>
    set({
      currentWorkspace: null,
      currentConversation: null,
      workspaces: [],
      conversations: [],
      messages: {},
      conversationMembers: {},
      typingUsers: {},
    }),
}));
