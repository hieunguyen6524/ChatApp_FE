/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

import toast from "react-hot-toast";
import type { Message } from "@/types/message.types";
// import { useChatStore } from "@/stores/chatStore";
import { messageService } from "@/services/messageService";
import { useWebSocket } from "../useWebSocket";

export const MESSAGE_KEYS = {
  all: ["messages"] as const,
  byConversation: (conversationId: number) =>
    [...MESSAGE_KEYS.all, conversationId] as const,
};

// GET messages với infinite scroll
export const useMessages = (conversationId: number) => {
  return useInfiniteQuery({
    queryKey: MESSAGE_KEYS.byConversation(conversationId),
    queryFn: ({ pageParam = 0 }) =>
      messageService.getMessages(conversationId, { page: pageParam, size: 20 }),
    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      const pageData = lastPage.data;
      if (pageData.last) return undefined;
      return pageData.pageNumber + 1;
    },

    enabled: !!conversationId,
    select: (data) => {
      const allMessages = data.pages.flatMap((page) => page.data.content);
      return {
        ...data,
        messages: allMessages,
      };
    },
    staleTime: 0,
  });
};

// Send message via WebSocket
export const useSendMessage = () => {
  const { sendMessage } = useWebSocket();

  return useMutation({
    mutationFn: async ({
      conversationId,
      content,
      contentType = "TEXT",
      parentId,
    }: {
      conversationId: number;
      content: string;
      contentType?: "TEXT" | "MARKDOWN" | "CODE";
      parentId?: number;
    }) => {
      // Send via WebSocket
      await sendMessage(conversationId, content, contentType, parentId);
    },
    onError: (error: any) => {
      console.error("Failed to send message:", error);
      toast.error("Không thể gửi tin nhắn. Thử lại!");
    },
  });
};

// Update message
export const useUpdateMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: number;
      content: string;
    }) => messageService.updateMessage(messageId, content),
    onSuccess: (response) => {
      const message = response.data;

      // Update in cache
      queryClient.setQueryData(
        MESSAGE_KEYS.byConversation(message.conversationId),
        (old: any) => {
          if (!old) return old;

          return {
            ...old,
            pages: old.pages.map((page: any) => ({
              ...page,
              data: {
                ...page.data,
                data: page.data.data.map((m: Message) =>
                  m.messageId === message.messageId ? message : m
                ),
              },
            })),
          };
        }
      );

      toast.success("Cập nhật tin nhắn thành công!");
    },
  });
};

// Delete message
export const useDeleteMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: number) => messageService.deleteMessage(messageId),
    onSuccess: (_, messageId) => {
      // Mark as deleted in cache
      queryClient.setQueriesData({ queryKey: MESSAGE_KEYS.all }, (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            data: {
              ...page.data,
              data: page.data.data.map((m: Message) =>
                m.messageId === messageId ? { ...m, isDeleted: true } : m
              ),
            },
          })),
        };
      });

      toast.success("Xóa tin nhắn thành công!");
    },
  });
};

// Add reaction
export const useAddReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, emoji }: { messageId: number; emoji: string }) =>
      messageService.addReaction(messageId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.all });
    },
  });
};
