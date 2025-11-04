import React, { useState, useRef, type KeyboardEvent } from "react";
import { Send, Smile, Paperclip, X } from "lucide-react";
import { Button } from "@/components/ui/button";

import type { Message } from "../../types/message.types";
import { useSendMessage } from "@/hooks/message/useMessage";

interface MessageInputProps {
  conversationId: number;
  replyTo?: Message | null;
  onCancelReply?: () => void;
}

const MessageInput: React.FC<MessageInputProps> = ({
  conversationId,
  replyTo,
  onCancelReply,
}) => {
  const [message, setMessage] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const sendMessageMutation = useSendMessage();

  const handleSend = () => {
    if (!message.trim()) return;

    sendMessageMutation.mutate(
      {
        conversationId,
        content: message.trim(),
        contentType: "TEXT",
      },
      {
        onSuccess: () => {
          setMessage("");
          if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
          }
        },
      }
    );
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);

    // Auto-resize textarea
    e.target.style.height = "auto";
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Reply preview */}
        {replyTo && (
          <div className="mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-start justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                Trả lời {replyTo.sender?.displayName}
              </p>
              <p className="text-sm text-gray-900 dark:text-white truncate">
                {replyTo.content}
              </p>
            </div>
            {onCancelReply && (
              <button
                onClick={onCancelReply}
                className="p-1 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        )}

        {/* Input area */}
        <div className="flex items-end gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full flex-shrink-0"
            disabled
          >
            <Paperclip className="w-5 h-5" />
          </Button>

          <div className="flex-1 relative bg-gray-100 dark:bg-gray-700 rounded-3xl">
            <textarea
              ref={textareaRef}
              value={message}
              onChange={handleInput}
              onKeyPress={handleKeyPress}
              placeholder="Nhập tin nhắn..."
              rows={1}
              className="w-full px-4 py-3 pr-12 bg-transparent border-0 resize-none focus:outline-none text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
              style={{ maxHeight: "200px", minHeight: "48px" }}
            />
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 bottom-2 rounded-full"
              disabled
            >
              <Smile className="w-5 h-5" />
            </Button>
          </div>

          <Button
            onClick={handleSend}
            disabled={!message.trim() || sendMessageMutation.isPending}
            size="icon"
            className="rounded-full w-12 h-12 flex-shrink-0"
          >
            {sendMessageMutation.isPending ? (
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </div>

        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
          Nhấn{" "}
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
            Enter
          </kbd>{" "}
          để gửi,{" "}
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
            Shift
          </kbd>{" "}
          +{" "}
          <kbd className="px-1 py-0.5 bg-gray-200 dark:bg-gray-700 rounded">
            Enter
          </kbd>{" "}
          để xuống dòng
        </p>
      </div>
    </div>
  );
};

export default MessageInput;
