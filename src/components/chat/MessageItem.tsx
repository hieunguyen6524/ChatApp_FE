import React, { useState } from "react";
import { MoreVertical, Reply, Smile, Edit2, Trash2, Pin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuthStore } from "../../stores/authStore";

import type { Message } from "../../types/message.types";
import { useAddReaction, useDeleteMessage } from "@/hooks/message/useMessage";

interface MessageItemProps {
  message: Message; // Dùng type Message mới
  onReply?: (message: Message) => void;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, onReply }) => {
  const [showActions, setShowActions] = useState(false);
  const { user } = useAuthStore();
  const deleteMessageMutation = useDeleteMessage();
  const addReactionMutation = useAddReaction();

  const isOwn = user?.account.accountId === message.sender.accountId;

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (timestamp: number): string => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 24) {
      return date.toLocaleTimeString("vi-VN", {
        hour: "2-digit",
        minute: "2-digit",
      });
    } else {
      return date.toLocaleDateString("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
  };

  const handleDelete = () => {
    if (window.confirm("Bạn có chắc muốn xóa tin nhắn này?")) {
      deleteMessageMutation.mutate(message.messageId);
    }
  };

  const handleReaction = (emoji: string) => {
    addReactionMutation.mutate({
      messageId: message.messageId,
      emoji,
    });
  };

  if (message.isDeleted) {
    return (
      <div className="flex gap-3 py-2 opacity-50">
        <Avatar className="w-8 h-8 flex-shrink-0">
          <AvatarFallback className="bg-gray-400 text-white text-xs">
            {getInitials(message.sender.displayName)}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <p className="text-sm italic text-gray-500 dark:text-gray-400">
            Tin nhắn đã bị xóa
          </p>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`flex gap-3 py-2 px-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors group ${
        isOwn ? "flex-row-reverse" : ""
      }`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      {/* Avatar */}
      {!isOwn && (
        <Avatar className="w-10 h-10 flex-shrink-0">
          <AvatarImage src={message.sender.avatarUrl || undefined} />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
            {getInitials(message.sender.displayName)}
          </AvatarFallback>
        </Avatar>
      )}

      {/* Message Content */}
      <div
        className={`flex flex-col ${
          isOwn ? "items-end" : "items-start"
        } flex-1 max-w-2xl`}
      >
        {/* Sender name & time */}
        {!isOwn && (
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {message.sender.displayName}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatTime(message.createdAt)}
            </span>
          </div>
        )}

        {/* Message bubble */}
        <div
          className={`relative px-4 py-2 rounded-2xl max-w-full ${
            isOwn
              ? "bg-blue-600 text-white rounded-tr-sm"
              : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-tl-sm"
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words">
            {message.content}
          </p>

          {/* Reactions */}
          {message.reactions && message.reactions.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(
                message.reactions.reduce((acc, reaction) => {
                  acc[reaction.emoji] = (acc[reaction.emoji] || 0) + 1;
                  return acc;
                }, {} as Record<string, number>)
              ).map(([emoji, count]) => (
                <button
                  key={emoji}
                  onClick={() => handleReaction(emoji)}
                  className="px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-xs flex items-center gap-1 transition-colors"
                >
                  <span>{emoji}</span>
                  <span className="text-gray-600 dark:text-gray-300">
                    {count}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Reply count */}
          {message.replyCount > 0 && (
            <button className="text-xs text-blue-400 hover:underline mt-1">
              {message.replyCount} câu trả lời
            </button>
          )}
        </div>

        {/* Time for own messages */}
        {isOwn && (
          <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {formatTime(message.createdAt)}
          </span>
        )}
      </div>

      {/* Actions */}
      <div
        className={`flex items-center gap-1 ${
          showActions ? "opacity-100" : "opacity-0"
        } transition-opacity`}
      >
        {/* Quick reactions */}
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-full"
          onClick={() => handleReaction("👍")}
        >
          <Smile className="w-4 h-4" />
        </Button>

        {/* Reply */}
        {onReply && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full"
            onClick={() => onReply(message)}
          >
            <Reply className="w-4 h-4" />
          </Button>
        )}

        {/* More actions */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
            >
              <MoreVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem>
              <Pin className="w-4 h-4 mr-2" />
              Ghim tin nhắn
            </DropdownMenuItem>
            {isOwn && (
              <>
                <DropdownMenuItem>
                  <Edit2 className="w-4 h-4 mr-2" />
                  Chỉnh sửa
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleDelete}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Xóa tin nhắn
                </DropdownMenuItem>
              </>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default MessageItem;
