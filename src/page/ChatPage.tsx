import React, { useState, useRef, useEffect } from "react";
import {
  Send,
  Smile,
  Paperclip,
  MoreVertical,
  Hash,
  Lock,
  Search,
  Plus,
  Pin,
  Users,
  Phone,
  Video,
  Settings,
  UserPlus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useChatStore } from "../stores/chatStore";
import type { Conversation } from "@/types/message.types";
import {
  useConversations,
  useCreateConversation,
} from "@/hooks/conversation/useConversation";
import {
  // useWorkspaceMembers,
  useWorkspaces,
} from "@/hooks/workspace/useWorkspace";

interface ConversationItemProps {
  conversation: Conversation;
  isSelected: boolean;
  onClick: () => void;
}

const ConversationItem: React.FC<ConversationItemProps> = ({
  conversation,
  isSelected,
  onClick,
}) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isChannel = conversation.type === "CHANNEL";

  if (!conversation) return null;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
        isSelected
          ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
          : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
      }`}
    >
      {isChannel ? (
        conversation.isPrivate ? (
          <Lock className="w-4 h-4 flex-shrink-0" />
        ) : (
          <Hash className="w-4 h-4 flex-shrink-0" />
        )
      ) : (
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-xs">
            {getInitials(conversation.name || "DM")}
          </AvatarFallback>
        </Avatar>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium truncate">
            {conversation.name || "Direct Message"}
          </span>
          {(conversation.unreadCount || 0) > 0 && (
            <Badge className="bg-blue-600 text-white text-xs px-2 ml-2">
              {conversation.unreadCount}
            </Badge>
          )}
        </div>
        {conversation.lastMessage && (
          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
            {conversation.lastMessage.content}
          </p>
        )}
      </div>
    </button>
  );
};

const ChatPage: React.FC = () => {
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  // const [showCreateDialog, setShowCreateDialog] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Zustand store
  const {
    currentWorkspace,
    setCurrentWorkspace,
    currentConversation,
    setCurrentConversation,
  } = useChatStore();

  // React Query hooks
  const { data: workspaces, isLoading: loadingWorkspaces } = useWorkspaces(); // -> Workspace[]

  // const { data: members, isLoading: loadingWorkspaces } = useWorkspaceMembers(
  //   currentWorkspace?.workspaceId || 0
  // );
  const { data: conversations, isLoading: loadingConversations } =
    useConversations(currentWorkspace?.workspaceId || 0);
  const createConversationMutation = useCreateConversation();

  // Set default workspace
  useEffect(() => {
    if (workspaces && workspaces.length > 0 && !currentWorkspace) {
      setCurrentWorkspace(workspaces[0]);
    }
  }, [workspaces, currentWorkspace, setCurrentWorkspace]);

  const handleSendMessage = () => {
    if (!messageInput.trim() || !currentConversation) return;

    // TODO: Implement send message with API
    console.log("Send message:", messageInput);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleCreateChannel = () => {
    if (!currentWorkspace) return;

    const name = prompt("Tên channel:");
    if (!name) return;

    const isPrivate = confirm("Channel riêng tư?");

    createConversationMutation.mutate({
      workspaceId: currentWorkspace.workspaceId,
      name,
      type: "CHANNEL",
      isPrivate,
    });
  };

  const handleCreateDM = () => {
    if (!currentWorkspace) return;

    // TODO: Show user selection dialog
    const accountIdStr = prompt("Nhập ID người dùng:");
    if (!accountIdStr) return;

    const accountId = parseInt(accountIdStr);
    if (isNaN(accountId)) {
      alert("ID không hợp lệ!");
      return;
    }

    createConversationMutation.mutate({
      workspaceId: currentWorkspace.workspaceId,
      type: "DM_PAIR",
      isPrivate: false,
      memberIds: [accountId],
    });
  };

  const filteredConversations = conversations?.filter((conv) =>
    conv.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const channels =
    filteredConversations?.filter((c) => c.type === "CHANNEL") || [];
  const directMessages =
    filteredConversations?.filter(
      (c) => c.type === "DM_PAIR" || c.type === "DM_GROUP"
    ) || [];

  if (loadingWorkspaces) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">
            Đang tải workspace...
          </p>
        </div>
      </div>
    );
  }

  if (!workspaces || workspaces.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <Hash className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Chưa có workspace
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            Tạo workspace đầu tiên để bắt đầu chat
          </p>
          <Button onClick={() => alert("Tạo workspace")}>
            <Plus className="w-4 h-4 mr-2" />
            Tạo Workspace
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Workspace Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full text-left hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg transition-colors">
                <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                  {currentWorkspace?.name || "Select Workspace"}
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {workspaces.length} workspace
                  {workspaces.length > 1 ? "s" : ""}
                </p>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-72">
              {workspaces.map((ws) => (
                <DropdownMenuItem
                  key={ws.workspaceId}
                  onClick={() => setCurrentWorkspace(ws)}
                  className={
                    currentWorkspace?.workspaceId === ws.workspaceId
                      ? "bg-blue-50 dark:bg-blue-900"
                      : ""
                  }
                >
                  <div className="flex-1">
                    <p className="font-medium">{ws.name}</p>
                    {ws.description && (
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {ws.description}
                      </p>
                    )}
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 rounded-full bg-gray-100 dark:bg-gray-700 border-0"
            />
          </div>
        </div>

        {/* Conversations */}
        <ScrollArea className="flex-1">
          {loadingConversations ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <>
              {/* Channels */}
              <div className="px-3 py-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Channels
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleCreateChannel}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {channels.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                      Chưa có channel
                    </p>
                  ) : (
                    channels.map((conv) => (
                      <ConversationItem
                        key={conv.conversationId}
                        conversation={conv}
                        isSelected={
                          currentConversation?.conversationId ===
                          conv.conversationId
                        }
                        onClick={() => setCurrentConversation(conv)}
                      />
                    ))
                  )}
                </div>
              </div>

              <Separator className="my-2" />

              {/* Direct Messages */}
              <div className="px-3 py-2">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
                    Direct Messages
                  </h3>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={handleCreateDM}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-1">
                  {directMessages.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                      Chưa có tin nhắn
                    </p>
                  ) : (
                    directMessages.map((conv) => (
                      <ConversationItem
                        key={conv.conversationId}
                        conversation={conv}
                        isSelected={
                          currentConversation?.conversationId ===
                          conv.conversationId
                        }
                        onClick={() => setCurrentConversation(conv)}
                      />
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                {currentConversation.type === "CHANNEL" ? (
                  currentConversation.isPrivate ? (
                    <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Hash className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )
                ) : (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-sm">
                      DM
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {currentConversation.name || "Direct Message"}
                  </h2>
                  {currentConversation.description && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {currentConversation.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Phone className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Video className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Users className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Pin className="w-5 h-5" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="rounded-full"
                    >
                      <MoreVertical className="w-5 h-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <UserPlus className="w-4 h-4 mr-2" />
                      Thêm thành viên
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Settings className="w-4 h-4 mr-2" />
                      Cài đặt
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-red-600">
                      Rời cuộc trò chuyện
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
              <div className="max-w-4xl mx-auto space-y-4">
                {/* Empty state */}
                <div className="text-center py-12">
                  <Hash className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                    Chào mừng đến với{" "}
                    {currentConversation.name || "cuộc trò chuyện"}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    Đây là đầu cuộc trò chuyện. Gửi tin nhắn đầu tiên!
                  </p>
                </div>
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
              <div className="max-w-4xl mx-auto">
                <div className="flex items-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full flex-shrink-0"
                  >
                    <Paperclip className="w-5 h-5" />
                  </Button>
                  <div className="flex-1 relative">
                    <Input
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder={`Nhắn tin tới ${
                        currentConversation.name || "cuộc trò chuyện"
                      }...`}
                      className="pr-12 py-6 rounded-3xl bg-gray-100 dark:bg-gray-700 border-0"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full"
                    >
                      <Smile className="w-5 h-5" />
                    </Button>
                  </div>
                  <Button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    size="icon"
                    className="rounded-full w-12 h-12 flex-shrink-0"
                  >
                    <Send className="w-5 h-5" />
                  </Button>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
                  Nhấn Enter để gửi, Shift + Enter để xuống dòng
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-gray-50 dark:bg-gray-900">
            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                <Hash className="w-10 h-10 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Chọn một cuộc trò chuyện
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Chọn channel hoặc người dùng để bắt đầu nhắn tin
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
