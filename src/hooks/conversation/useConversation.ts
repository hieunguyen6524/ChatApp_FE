import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { conversationService } from "../../services/conversationService";
import { useChatStore } from "../../stores/chatStore";
import { useEffect } from "react";

export const CONVERSATION_KEYS = {
  all: ["conversations"] as const,
  lists: () => [...CONVERSATION_KEYS.all, "list"] as const,
  byWorkspace: (workspaceId: number) =>
    [...CONVERSATION_KEYS.lists(), workspaceId] as const,
  detail: (id: number) => [...CONVERSATION_KEYS.all, id] as const,
  members: (id: number) => [...CONVERSATION_KEYS.all, id, "members"] as const,
};

export const useConversations = (workspaceId: number) => {
  const { setConversations } = useChatStore();

  const query = useQuery({
    queryKey: CONVERSATION_KEYS.byWorkspace(workspaceId),
    queryFn: () => conversationService.getConversations(workspaceId),
    enabled: !!workspaceId,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (query.data) {
      setConversations(query.data);
    }
  }, [query.data, setConversations]);

  return query;
};

export const useConversation = (conversationId: number) => {
  return useQuery({
    queryKey: CONVERSATION_KEYS.detail(conversationId),
    queryFn: () => conversationService.getConversation(conversationId),
    enabled: !!conversationId,
    select: (data) => data.data,
  });
};

export const useCreateChannel = () => {
  const queryClient = useQueryClient();
  const { addConversation } = useChatStore();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: number;
      data: { name: string; description?: string; is_private: boolean };
    }) => conversationService.createChannel(workspaceId, data),
    onSuccess: (response, variables) => {
      const conversation = response.data;

      addConversation(conversation);
      queryClient.invalidateQueries({
        queryKey: CONVERSATION_KEYS.byWorkspace(variables.workspaceId),
      });

      toast.success("Tạo channel thành công!");
    },
  });
};

export const useCreateDM = () => {
  const queryClient = useQueryClient();
  const { addConversation, setCurrentConversation } = useChatStore();

  return useMutation({
    mutationFn: ({
      workspaceId,
      accountIds,
    }: {
      workspaceId: number;
      accountIds: number[];
    }) =>
      conversationService.createDM(workspaceId, { account_ids: accountIds }),
    onSuccess: (response, variables) => {
      const conversation = response.data;

      addConversation(conversation);
      setCurrentConversation(conversation);
      queryClient.invalidateQueries({
        queryKey: CONVERSATION_KEYS.byWorkspace(variables.workspaceId),
      });

      toast.success("Tạo cuộc trò chuyện thành công!");
    },
  });
};

export const useConversationMembers = (conversationId: number) => {
  const { setConversationMembers } = useChatStore();

  const query = useQuery({
    queryKey: CONVERSATION_KEYS.members(conversationId),
    queryFn: () => conversationService.getMembers(conversationId),
    enabled: !!conversationId,
    select: (data) => data.data,
  });

  useEffect(() => {
    if (query.data) {
      setConversationMembers(conversationId, query.data);
    }
  }, [query.data, conversationId, setConversationMembers]);

  return query;
};
