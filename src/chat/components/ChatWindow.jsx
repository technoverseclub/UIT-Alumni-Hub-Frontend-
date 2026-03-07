import React from "react";
import { useAuthStore } from "../../auth/auth.store";
import useChat from "../hooks/useChat";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const ChatWindow = ({ conversation, currentUserId }) => {
  const userIdFromStore = useAuthStore((s) => s.user?.id);
  const resolvedUserId = currentUserId ?? userIdFromStore;

const { messages, loading, error, sending, send } = useChat(conversation);
  const otherUser =
    conversation?.otherUser ||
    conversation?.otherParticipant ||
    conversation?.otherParticipant?.user ||
    null;

  const title = otherUser?.name || otherUser?.email || "Chat";
  const avatar = otherUser?.imageUrl || otherUser?.avatarUrl || null;

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b border-slate-200 bg-white flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          {avatar ? (
<img
    src={avatar}
    alt={title}
    className="w-9 h-9 rounded-full object-cover"
    onError={(e) => {
      e.target.onerror = null;
      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(title)}&background=1e3a5f&color=fff&size=64`;
    }}
  />
          ) : (
            <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-semibold">
              {title
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <div className="text-sm font-semibold text-slate-900 truncate">
              {title}
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {loading && (
          <p className="text-slate-500 text-sm">Loading messages…</p>
        )}
        <div className="space-y-2">
          {messages.map((m, idx) => (
            <MessageBubble
              key={m.id ?? `${m.senderId ?? "u"}_${m.createdAt ?? idx}`}
              message={m}
              isMine={String(m.senderId) === String(resolvedUserId)}
            />
          ))}
        </div>
      </div>
<MessageInput disabled={!conversation} onSend={send} sending={sending} />    </div>
  );
};

export default ChatWindow;
