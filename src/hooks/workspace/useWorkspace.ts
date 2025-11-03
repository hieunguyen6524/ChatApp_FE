import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { workspaceService } from "../../services/workspaceService";
import { useChatStore } from "../../stores/chatStore";
import { useEffect } from "react";

export const WORKSPACE_KEYS = {
  all: ["workspaces"] as const,
  lists: () => [...WORKSPACE_KEYS.all, "list"] as const,
  detail: (id: number) => [...WORKSPACE_KEYS.all, id] as const,
  members: (id: number) => [...WORKSPACE_KEYS.all, id, "members"] as const,
};

export const useWorkspaces = () => {
  const { setWorkspaces } = useChatStore();

  const query = useQuery({
    queryKey: WORKSPACE_KEYS.lists(),
    queryFn: () => workspaceService.getMyWorkspaces(),
    select: (data) => data.data,
  });

  useEffect(() => {
    if (query.data) {
      setWorkspaces(query.data);
    }
  }, [query.data, setWorkspaces]);

  return query;
};

export const useWorkspace = (workspaceId: number) => {
  return useQuery({
    queryKey: WORKSPACE_KEYS.detail(workspaceId),
    queryFn: () => workspaceService.getWorkspace(workspaceId),
    enabled: !!workspaceId,
    select: (data) => data.data,
  });
};

export const useCreateWorkspace = () => {
  const queryClient = useQueryClient();
  const { addWorkspace } = useChatStore();

  return useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      workspaceService.createWorkspace(data),
    onSuccess: (response) => {
      const workspace = response.data;

      addWorkspace(workspace);
      queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.lists() });

      toast.success("Tạo workspace thành công!");
    },
  });
};

export const useUpdateWorkspace = () => {
  const queryClient = useQueryClient();
  const { updateWorkspace } = useChatStore();

  return useMutation({
    mutationFn: ({
      workspaceId,
      data,
    }: {
      workspaceId: number;
      data: Partial<{ name: string; description: string }>;
    }) => workspaceService.updateWorkspace(workspaceId, data),
    onSuccess: (response, variables) => {
      const workspace = response.data;

      updateWorkspace(variables.workspaceId, workspace);
      queryClient.invalidateQueries({
        queryKey: WORKSPACE_KEYS.detail(variables.workspaceId),
      });

      toast.success("Cập nhật workspace thành công!");
    },
  });
};

// export const useDeleteWorkspace = () => {
//   const queryClient = useQueryClient();
//   const { removeWorkspace } = useChatStore();

//   return useMutation({
//     mutationFn: (workspaceId: number) =>
//       workspaceService.deleteWorkspace(workspaceId),
//     onSuccess: (_, workspaceId) => {
//       removeWorkspace(workspaceId);
//       queryClient.invalidateQueries({ queryKey: WORKSPACE_KEYS.lists() });

//       toast.success("Xóa workspace thành công!");
//     },
//   });
// };

export const useWorkspaceMembers = (workspaceId: number) => {
  return useQuery({
    queryKey: WORKSPACE_KEYS.members(workspaceId),
    queryFn: () => workspaceService.getWorkspaceMembers(workspaceId),
    enabled: !!workspaceId,
    select: (data) => data.data,
  });
};
