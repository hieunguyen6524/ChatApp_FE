import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import toast from "react-hot-toast";
import { messageService } from "../../services/messageService";
import { useChatStore } from "../../stores/chatStore";
import { useEffect } from "react";

export const MESSAGE_KEYS = {
  all: ["messages"] as const,
  byConversation: (conversationId: number) =>
    [...MESSAGE_KEYS.all, conversationId] as const,
};

export const useMessages = (conversationId: number, limit = 50) => {
  const { setMessages, prependMessages } = useChatStore();

  const query = useInfiniteQuery({
    queryKey: MESSAGE_KEYS.byConversation(conversationId),
    queryFn: ({ pageParam }) =>
      messageService.getMessages(conversationId, {
        limit,
        before_id: pageParam,
      }),
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      const messages = lastPage.data.data;
      if (messages.length < limit) return undefined;
      return messages[0]?.message_id; // Oldest message ID
    },
    enabled: !!conversationId,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      messages: data.pages.flatMap((page) => page.data.data).reverse(),
    }),
  });

  useEffect(() => {
    if (!query.data) return;

    const { data } = query;

    if (data.pages.length === 1) {
      setMessages(conversationId, data.messages);
    } else {
      const newMessages = data.pages[data.pages.length - 1].data.data;
      prependMessages(conversationId, newMessages.reverse());
    }
  }, [query.data]);

  return query;
};

export const useSendMessage = () => {
  const queryClient = useQueryClient();
  const { addMessage } = useChatStore();

  return useMutation({
    mutationFn: ({
      conversationId,
      content,
      contentType,
      parentId,
    }: {
      conversationId: number;
      content: string;
      contentType?: "TEXT" | "MARKDOWN" | "CODE";
      parentId?: number;
    }) =>
      messageService.sendMessage(conversationId, {
        content,
        content_type: contentType,
        parent_id: parentId,
      }),
    onSuccess: (response, variables) => {
      const message = response.data;

      // Optimistically add to store (will be confirmed by WebSocket)
      addMessage(message);

      // Invalidate to refetch with server data
      queryClient.invalidateQueries({
        queryKey: MESSAGE_KEYS.byConversation(variables.conversationId),
      });
    },
  });
};

export const useUpdateMessage = () => {
  //   const queryClient = useQueryClient();
  const { updateMessage } = useChatStore();

  return useMutation({
    mutationFn: ({
      messageId,
      content,
    }: {
      messageId: number;
      content: string;
    }) => messageService.updateMessage(messageId, { content }),
    onSuccess: (response) => {
      const message = response.data;

      updateMessage(message.message_id, message);

      toast.success("Cập nhật tin nhắn thành công!");
    },
  });
};

export const useDeleteMessage = () => {
  //   const queryClient = useQueryClient();
  const { deleteMessage } = useChatStore();

  return useMutation({
    mutationFn: ({
      conversationId,
      messageId,
    }: {
      conversationId: number;
      messageId: number;
    }) =>
      messageService
        .deleteMessage(messageId)
        .then(() => ({ conversationId, messageId })),
    onSuccess: ({ conversationId, messageId }) => {
      deleteMessage(conversationId, messageId);

      toast.success("Xóa tin nhắn thành công!");
    },
  });
};

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

export const useRemoveReaction = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ messageId, emoji }: { messageId: number; emoji: string }) =>
      messageService.removeReaction(messageId, emoji),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: MESSAGE_KEYS.all });
    },
  });
};
