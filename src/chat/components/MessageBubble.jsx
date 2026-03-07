import React from "react";

const MessageBubble = ({ message, isMine }) => {
  const content = message?.content ?? "";
  const senderName = message?.sender?.name || (isMine ? "You" : "User");

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-4 py-2 text-sm shadow-sm ${
          isMine
            ? "bg-blue-600 text-white rounded-3xl rounded-br-sm"
            : "bg-slate-100 text-slate-900 rounded-3xl rounded-bl-sm"
        }`}
      >
        {!isMine && (
          <div className="text-[11px] opacity-70 mb-1">{senderName}</div>
        )}
        <div className="whitespace-pre-wrap wrap-break-word">{content}</div>
      </div>
    </div>
  );
};

export default MessageBubble;
