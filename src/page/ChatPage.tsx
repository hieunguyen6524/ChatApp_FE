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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface Message {
  id: number;
  content: string;
  sender: {
    id: number;
    name: string;
    avatar?: string;
  };
  timestamp: Date;
  isOwn: boolean;
}

interface Conversation {
  id: number;
  name: string;
  type: "channel" | "dm";
  isPrivate: boolean;
  lastMessage?: string;
  unreadCount: number;
  isOnline?: boolean;
}

const ChatPage: React.FC = () => {
  const [selectedConversation, setSelectedConversation] =
    useState<Conversation | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock data
  const workspaces = [
    { id: 1, name: "My Workspace" },
    { id: 2, name: "Team Project" },
  ];

  const [currentWorkspace] = useState(workspaces[0]);

  const conversations: Conversation[] = [
    {
      id: 1,
      name: "general",
      type: "channel",
      isPrivate: false,
      lastMessage: "Chào mọi người!",
      unreadCount: 3,
    },
    {
      id: 2,
      name: "random",
      type: "channel",
      isPrivate: false,
      lastMessage: "Haha 😄",
      unreadCount: 0,
    },
    {
      id: 3,
      name: "dev-team",
      type: "channel",
      isPrivate: true,
      lastMessage: "Review PR mới nha",
      unreadCount: 1,
    },
    {
      id: 4,
      name: "Alice Johnson",
      type: "dm",
      isPrivate: false,
      lastMessage: "Ok, cảm ơn!",
      unreadCount: 0,
      isOnline: true,
    },
    {
      id: 5,
      name: "Bob Smith",
      type: "dm",
      isPrivate: false,
      lastMessage: "Meeting lúc 3pm nhé",
      unreadCount: 2,
      isOnline: false,
    },
  ];

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      content: "Chào mọi người! 👋",
      sender: { id: 2, name: "Alice Johnson" },
      timestamp: new Date("2025-11-02T09:00:00"),
      isOwn: false,
    },
    {
      id: 2,
      content: "Hôm nay có gì mới không?",
      sender: { id: 2, name: "Alice Johnson" },
      timestamp: new Date("2025-11-02T09:01:00"),
      isOwn: false,
    },
    {
      id: 3,
      content: "Chào Alice! Có một số update về dự án mới đây",
      sender: { id: 1, name: "You" },
      timestamp: new Date("2025-11-02T09:05:00"),
      isOwn: true,
    },
    {
      id: 4,
      content: "Tuyệt vời! Cho mình xem được không?",
      sender: { id: 2, name: "Alice Johnson" },
      timestamp: new Date("2025-11-02T09:06:00"),
      isOwn: false,
    },
  ]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      const newMessage: Message = {
        id: messages.length + 1,
        content: messageInput,
        sender: { id: 1, name: "You" },
        timestamp: new Date(),
        isOwn: true,
      };
      setMessages([...messages, newMessage]);
      setMessageInput("");

      // Simulate typing indicator
      setTimeout(() => {
        setIsTyping(true);
        setTimeout(() => {
          setIsTyping(false);
          const replyMessage: Message = {
            id: messages.length + 2,
            content: "Cảm ơn bạn đã gửi tin nhắn! 😊",
            sender: { id: 2, name: "Alice Johnson" },
            timestamp: new Date(),
            isOwn: false,
          };
          setMessages((prev) => [...prev, replyMessage]);
        }, 2000);
      }, 500);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date): string => {
    return date.toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getInitials = (name: string): string => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  useEffect(() => {
    if (conversations.length > 0) {
      setSelectedConversation(conversations[0]);
    }
  }, []);

  return (
    <div className="h-screen bg-white dark:bg-gray-900 flex">
      {/* Sidebar - Conversations List */}
      <div className="w-80 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        {/* Workspace Header */}
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {currentWorkspace.name}
          </h2>
        </div>

        {/* Search */}
        <div className="p-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              type="text"
              placeholder="Tìm kiếm..."
              className="pl-9 rounded-full bg-gray-100 dark:bg-gray-700 border-0"
            />
          </div>
        </div>

        {/* Conversations */}
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
              {conversations
                .filter((c) => c.type === "channel")
                .map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedConversation?.id === conv.id
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    {conv.isPrivate ? (
                      <Lock className="w-4 h-4 flex-shrink-0" />
                    ) : (
                      <Hash className="w-4 h-4 flex-shrink-0" />
                    )}
                    <span className="flex-1 truncate text-sm font-medium">
                      {conv.name}
                    </span>
                    {conv.unreadCount > 0 && (
                      <Badge className="bg-blue-600 text-white text-xs px-2">
                        {conv.unreadCount}
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
              {conversations
                .filter((c) => c.type === "dm")
                .map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedConversation(conv)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      selectedConversation?.id === conv.id
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="relative">
                      <Avatar className="w-8 h-8">
                        <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-xs">
                          {getInitials(conv.name)}
                        </AvatarFallback>
                      </Avatar>
                      {conv.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white dark:border-gray-800 rounded-full"></div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium truncate">
                          {conv.name}
                        </span>
                        {conv.unreadCount > 0 && (
                          <Badge className="bg-blue-600 text-white text-xs px-2">
                            {conv.unreadCount}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                        {conv.lastMessage}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedConversation ? (
          <>
            {/* Chat Header */}
            <div className="h-16 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between px-6 bg-white dark:bg-gray-800">
              <div className="flex items-center gap-3">
                {selectedConversation.type === "channel" ? (
                  selectedConversation.isPrivate ? (
                    <Lock className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  ) : (
                    <Hash className="w-5 h-5 text-gray-600 dark:text-gray-400" />
                  )
                ) : (
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-gradient-to-br from-purple-500 to-pink-600 text-white text-sm">
                      {getInitials(selectedConversation.name)}
                    </AvatarFallback>
                  </Avatar>
                )}
                <div>
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {selectedConversation.name}
                  </h2>
                  {selectedConversation.type === "dm" && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {selectedConversation.isOnline
                        ? "Đang hoạt động"
                        : "Offline"}
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
                <Button variant="ghost" size="icon" className="rounded-full">
                  <MoreVertical className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Messages Area */}
            <ScrollArea className="flex-1 p-4 bg-gray-50 dark:bg-gray-900">
              <div className="max-w-4xl mx-auto space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      message.isOwn ? "flex-row-reverse" : ""
                    }`}
                  >
                    {!message.isOwn && (
                      <Avatar className="w-10 h-10 flex-shrink-0">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                          {getInitials(message.sender.name)}
                        </AvatarFallback>
                      </Avatar>
                    )}
                    <div
                      className={`flex flex-col ${
                        message.isOwn ? "items-end" : "items-start"
                      } max-w-lg`}
                    >
                      {!message.isOwn && (
                        <span className="text-xs font-semibold text-gray-900 dark:text-white mb-1">
                          {message.sender.name}
                        </span>
                      )}
                      <div
                        className={`px-4 py-2 rounded-2xl ${
                          message.isOwn
                            ? "bg-blue-600 text-white rounded-tr-sm"
                            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-tl-sm"
                        }`}
                      >
                        <p className="text-sm whitespace-pre-wrap break-words">
                          {message.content}
                        </p>
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                ))}

                {/* Typing indicator */}
                {isTyping && (
                  <div className="flex gap-3">
                    <Avatar className="w-10 h-10 flex-shrink-0">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white">
                        AJ
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl rounded-tl-sm px-4 py-3">
                      <div className="flex gap-1">
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "0ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "150ms" }}
                        ></div>
                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{ animationDelay: "300ms" }}
                        ></div>
                      </div>
                    </div>
                  </div>
                )}

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
                      placeholder="Nhập tin nhắn..."
                      className="pr-12 py-6 rounded-3xl bg-gray-100 dark:bg-gray-700 border-0 resize-none"
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
