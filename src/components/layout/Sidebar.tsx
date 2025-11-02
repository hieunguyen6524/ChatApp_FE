import React from "react";
import { Hash, Lock, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useChatStore } from "@/stores/chatStore";
import type { Conversation } from "@/types/message.types";

interface SidebarProps {
  onConversationClick: (conversation: Conversation) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onConversationClick }) => {
  const { currentWorkspace, conversations, currentConversation } =
    useChatStore();

  const channels = conversations.filter((c) => c.type === "CHANNEL");
  const directMessages = conversations.filter(
    (c) => c.type === "DM_PAIR" || c.type === "DM_GROUP"
  );

  const getConversationName = (conv: Conversation): string => {
    if (conv.name) return conv.name;
    if (conv.type === "DM_PAIR") return "Direct Message";
    if (conv.type === "DM_GROUP") return "Group Chat";
    return "Unknown";
  };

  return (
    <div className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
      {/* Workspace header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
          {currentWorkspace?.name || "Select Workspace"}
        </h2>
      </div>

      {/* Search */}
      <div className="p-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search..."
            className="pl-9 rounded-full"
          />
        </div>
      </div>

      {/* Conversations list */}
      <ScrollArea className="flex-1">
        {/* Channels */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Channels
            </h3>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {channels.map((channel) => (
              <button
                key={channel.conversation_id}
                onClick={() => onConversationClick(channel)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentConversation?.conversation_id ===
                  channel.conversation_id
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                {channel.is_private ? (
                  <Lock className="w-4 h-4 flex-shrink-0" />
                ) : (
                  <Hash className="w-4 h-4 flex-shrink-0" />
                )}
                <span className="flex-1 truncate text-sm font-medium">
                  {getConversationName(channel)}
                </span>
                {(channel.unread_count ?? 0) > 0 && (
                  <Badge
                    variant="default"
                    className="bg-blue-600 text-white text-xs"
                  >
                    {channel.unread_count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        <Separator className="my-2" />

        {/* Direct Messages */}
        <div className="px-3 py-2">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase">
              Direct Messages
            </h3>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          <div className="space-y-1">
            {directMessages.map((dm) => (
              <button
                key={dm.conversation_id}
                onClick={() => onConversationClick(dm)}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                  currentConversation?.conversation_id === dm.conversation_id
                    ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                }`}
              >
                <div className="w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-600 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-medium">DM</span>
                </div>
                <span className="flex-1 truncate text-sm font-medium">
                  {getConversationName(dm)}
                </span>
                {(dm.unread_count ?? 0) > 0 && (
                  <Badge
                    variant="default"
                    className="bg-blue-600 text-white text-xs"
                  >
                    {dm.unread_count}
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default Sidebar;
