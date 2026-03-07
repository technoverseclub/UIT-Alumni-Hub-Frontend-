import React, { useMemo } from "react";

const formatTime = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
  });
};

const ConversationItem = ({ conversation, isActive, onClick }) => {
  const baseUser =
    conversation?.otherUser ||
    conversation?.otherParticipant?.user ||
    conversation?.otherParticipant ||
    null;

  const name = baseUser?.name || baseUser?.email || "Unknown";
  const avatar = baseUser?.imageUrl || baseUser?.avatarUrl || null;

  const lastMessage = conversation?.lastMessage || null;
  const lastMessageText =
    lastMessage?.content || lastMessage?.text || "No messages yet";

  const time = useMemo(
    () => formatTime(conversation?.lastMessageAt || lastMessage?.createdAt),
    [conversation?.lastMessageAt, lastMessage?.createdAt]
  );

  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full text-left rounded-xl px-2 py-2 flex items-center gap-3 transition ${
        isActive
          ? "bg-blue-100"
          : "hover:bg-slate-100"
      }`}
    >
      <div className="shrink-0">
        {avatar ? (
          <img
            src={avatar}
            alt={name}
            className="w-9 h-9 rounded-full object-cover"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-900 text-white flex items-center justify-center text-xs font-semibold">
            {name
              .split(" ")
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase()}
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="text-sm font-semibold text-slate-900 truncate">
            {name}
          </div>
          {time && (
            <div className="text-[11px] text-slate-500 whitespace-nowrap">
              {time}
            </div>
          )}
        </div>
        <div className="text-xs text-slate-600 truncate mt-0.5">
          {lastMessageText}
        </div>
      </div>
    </button>
  );
};

export default ConversationItem;
