import React, { useEffect, useState } from "react";
import ConversationList from "./ConversationList";
import ChatWindow from "./ChatWindow";
import EmptyState from "./EmptyState";

import { useAuthStore } from "../../auth/auth.store";
import { connectSocket, disconnectSocket } from "../../socket/socket";

const ChatLayout = ({ initialTargetUserId }) => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);

  const [activeConversation, setActiveConversation] = useState(null);
  const [showList, setShowList] = useState(true); // mobile toggle

  useEffect(() => {
    if (!accessToken) return undefined;
    connectSocket();
    return () => disconnectSocket();
  }, [accessToken]);

  const handleSelect = (conv) => {
    setActiveConversation(conv);
    setShowList(false);
  };

  return (
    // Outer wrapper — give this a fixed height from the parent page
    // e.g. in AlumniMessages.jsx: <div className="h-[calc(100vh-80px)]"><ChatLayout /></div>
    <div className="flex h-full rounded-xl overflow-hidden border border-slate-200 shadow-sm bg-white">

      {/* LEFT — conversation list, fixed width */}
      <div className={`
        w-72 shrink-0 h-full border-r border-slate-200
        ${showList ? "flex" : "hidden md:flex"} flex-col
      `}>
        <ConversationList
          activeConversationId={activeConversation?.id}
          currentUserId={user?.id}
          onSelect={handleSelect}
          initialTargetUserId={initialTargetUserId}
        />
      </div>

      {/* RIGHT — chat window, fills remaining space */}
      <div className={`
        flex-1 h-full flex flex-col
        ${!showList ? "flex" : "hidden md:flex"}
      `}>
        {/* Mobile back button */}
        {activeConversation && (
          <div className="md:hidden flex items-center px-4 py-2 border-b border-slate-100 bg-white">
            <button
              onClick={() => { setShowList(true); setActiveConversation(null); }}
              className="flex items-center gap-1 text-slate-500 text-sm hover:text-slate-800"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>
          </div>
        )}

        {activeConversation ? (
          <ChatWindow
            conversation={activeConversation}
            currentUserId={user?.id}
            currentUserRole={user?.role}
          />
        ) : (
          <EmptyState />
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
