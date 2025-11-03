import { conversationService } from "@/services/conversationService";
import { useChatStore } from "@/stores/chatStore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import toast from "react-hot-toast";

export const CONVERSATION_KEYS = {
  all: ["conversations"] as const,
  byWorkspace: (workspaceId: number) =>
    [...CONVERSATION_KEYS.all, "workspace", workspaceId] as const,
  detail: (id: number) => [...CONVERSATION_KEYS.all, id] as const,
  members: (id: number) => [...CONVERSATION_KEYS.all, id, "members"] as const,
};

// GET /api/conversations/workspace/:workspaceId
export const useConversations = (workspaceId: number) => {
  const { setConversations } = useChatStore();

  const query = useQuery({
    queryKey: CONVERSATION_KEYS.byWorkspace(workspaceId),
    queryFn: () => conversationService.getConversationsByWorkspace(workspaceId),
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

// GET /api/conversations/:id
export const useConversation = (conversationId: number) => {
  return useQuery({
    queryKey: CONVERSATION_KEYS.detail(conversationId),
    queryFn: () => conversationService.getConversation(conversationId),
    enabled: !!conversationId,
    select: (data) => data.data,
  });
};

// POST /api/conversations
export const useCreateConversation = () => {
  const queryClient = useQueryClient();
  const { addConversation } = useChatStore();

  return useMutation({
    mutationFn: (data: {
      workspaceId: number;
      name?: string;
      description?: string;
      type: "CHANNEL" | "DM_PAIR" | "DM_GROUP";
      isPrivate: boolean;
      memberIds?: number[];
    }) => conversationService.createConversation(data),
    onSuccess: (response, variables) => {
      const conversation = response.data;

      addConversation(conversation);
      queryClient.invalidateQueries({
        queryKey: CONVERSATION_KEYS.byWorkspace(variables.workspaceId),
      });

      toast.success(
        variables.type === "CHANNEL"
          ? "Tạo channel thành công!"
          : "Tạo cuộc trò chuyện thành công!"
      );
    },
  });
};

// PATCH /api/conversations/:id
export const useUpdateConversation = () => {
  const queryClient = useQueryClient();
  const { updateConversation } = useChatStore();

  return useMutation({
    mutationFn: ({
      conversationId,
      data,
    }: {
      conversationId: number;
      data: { name?: string; description?: string; isPrivate?: boolean };
    }) => conversationService.updateConversation(conversationId, data),
    onSuccess: (response, variables) => {
      const conversation = response.data;

      updateConversation(variables.conversationId, conversation);
      queryClient.invalidateQueries({
        queryKey: CONVERSATION_KEYS.detail(variables.conversationId),
      });

      toast.success("Cập nhật cuộc trò chuyện thành công!");
    },
  });
};

// GET /api/conversations/:id/members
export const useConversationMembers = (conversationId: number) => {
  const { setConversationMembers } = useChatStore();

  const query = useQuery({
    queryKey: CONVERSATION_KEYS.members(conversationId),
    queryFn: () => conversationService.getMembers(conversationId),
    enabled: !!conversationId,
    select: (data) => data.data,
    // onSuccess: (members) => {
    //   setConversationMembers(conversationId, members);
    // },
  });

  useEffect(() => {
    if (query.data) {
      setConversationMembers(conversationId, query.data);
    }
  }, [query.data, setConversationMembers, conversationId]);

  return query;
};

// POST /api/conversations/:id/members
export const useAddConversationMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      accountId,
    }: {
      conversationId: number;
      accountId: number;
    }) => conversationService.addMember(conversationId, accountId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CONVERSATION_KEYS.members(variables.conversationId),
      });
      toast.success("Thêm thành viên thành công!");
    },
  });
};

// DELETE /api/conversations/:id/members/:accountId
export const useRemoveConversationMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      conversationId,
      accountId,
    }: {
      conversationId: number;
      accountId: number;
    }) => conversationService.removeMember(conversationId, accountId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: CONVERSATION_KEYS.members(variables.conversationId),
      });
      toast.success("Xóa thành viên thành công!");
    },
  });
};

// DELETE /api/conversations/:id/leave
export const useLeaveConversation = () => {
  const queryClient = useQueryClient();
  const { removeConversation, setCurrentConversation } = useChatStore();

  return useMutation({
    mutationFn: (conversationId: number) =>
      conversationService.leaveConversation(conversationId),
    onSuccess: (_, conversationId) => {
      removeConversation(conversationId);
      setCurrentConversation(null);
      queryClient.invalidateQueries({ queryKey: CONVERSATION_KEYS.all });
      toast.success("Rời cuộc trò chuyện thành công!");
    },
  });
};
