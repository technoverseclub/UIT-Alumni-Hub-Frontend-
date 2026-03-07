import React, { useState } from "react";

const MessageInput = ({ onSend, disabled, sending }) => {
  const [value, setValue] = useState("");

  const submit = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend?.(trimmed);
    setValue("");
  };

  return (
    <div className="p-3 border-t border-slate-200 bg-white flex items-center gap-3">
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submit();
          }
        }}
        disabled={disabled}
        placeholder={disabled ? "Select a conversation…" : "Type your message…"}
        className="flex-1 px-4 py-2 rounded-full border border-slate-300 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="button"
        onClick={submit}
        disabled={disabled || !value.trim() || sending}
        className="px-5 py-2 rounded-full bg-blue-600 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
      >
    {sending ? "Sending…" : "Send"}
  </button>
    </div>
  );
};

export default MessageInput;
