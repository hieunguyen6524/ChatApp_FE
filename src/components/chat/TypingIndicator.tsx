import React from "react";

interface TypingIndicatorProps {
  usernames: string[];
}

const TypingIndicator: React.FC<TypingIndicatorProps> = ({ usernames }) => {
  if (usernames.length === 0) return null;

  const text =
    usernames.length === 1
      ? `${usernames[0]} đang gõ...`
      : usernames.length === 2
      ? `${usernames[0]} và ${usernames[1]} đang gõ...`
      : `${usernames[0]} và ${usernames.length - 1} người khác đang gõ...`;

  return (
    <div className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 flex items-center gap-2">
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
      <span>{text}</span>
    </div>
  );
};

export default TypingIndicator;
