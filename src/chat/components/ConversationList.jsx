import React, { useEffect, useRef } from "react";
import useConversations from "../hooks/useConversations";
import ConversationItem from "./ConversationItem";
import { createConversation } from "../chat.api";

const ConversationList = ({
  activeConversationId,
  currentUserId,
  onSelect,
  initialTargetUserId,
}) => {
  const { conversations, loading, error, refresh } = useConversations();

  const handledInitialSelectRef = useRef(false);
  const createStartedRef = useRef(false);
  const lastTargetRef = useRef(null);

  // ─── deriveOtherUser ─────────────────────────────────────────────
  const deriveOtherUser = (conv) => {
    if (!conv) return null;

    // Best case — already correctly shaped from API
    if (conv.otherUser?.id) return conv.otherUser;

    // Freshly created conversation — derive from participants array
    if (Array.isArray(conv.participants) && currentUserId != null) {
      const participant = conv.participants.find(
        (p) => String(p.userId ?? p.user?.id) !== String(currentUserId)
      );

      const user = participant?.user ?? participant;
      if (!user) return null;

      const profile =
        user.role === "STUDENT"
          ? user.studentProfile
          : user.alumniProfile;

      return {
        id: user.id,
        name: user.name,
        role: user.role,
        branch: profile?.branch || null,
        batch: profile?.batch || profile?.year || null,
        imageUrl: profile?.imageUrl || null,
      };
    }

    return null;
  };

  // ─── Auto-open initial conversation ──────────────────────────────
  useEffect(() => {
    if (!initialTargetUserId) return;

    const targetIdStr = String(initialTargetUserId);

    if (lastTargetRef.current !== targetIdStr) {
      lastTargetRef.current = targetIdStr;
      handledInitialSelectRef.current = false;
      createStartedRef.current = false;
    }

    if (handledInitialSelectRef.current) return;

    const selectConv = (conv) => {
      if (!conv) return;
      const other = deriveOtherUser(conv); // ✅ uses currentUserId from closure
      handledInitialSelectRef.current = true;
      onSelect?.({ ...conv, otherUser: other });
    };

    const existing = conversations.find((conv) => {
      const otherId = conv.otherUser?.id ?? conv.targetUserId;
      return otherId != null && String(otherId) === targetIdStr;
    });

    if (existing) {
      selectConv(existing);
      return;
    }

    if (createStartedRef.current) return;
    createStartedRef.current = true;

    (async () => {
      try {
        const created = await createConversation(Number(initialTargetUserId));
        selectConv(created);
        await refresh();
      } catch (e) {
        createStartedRef.current = false;
        console.error("Failed to create conversation", e);
      }
    })();
  }, [initialTargetUserId, conversations, refresh, onSelect, currentUserId]);

  // ─── Filter visible conversations ────────────────────────────────
  const nonEmptyConversations = conversations.filter((conv) => {
    const text = conv.lastMessage?.content || conv.lastMessage?.text;
    return Boolean(text);
  });

  const activeConv =
    activeConversationId != null
      ? conversations.find((c) => String(c.id) === String(activeConversationId))
      : null;

  const visibleConversations =
    activeConv && !nonEmptyConversations.some((c) => c.id === activeConv.id)
      ? [activeConv, ...nonEmptyConversations]
      : nonEmptyConversations;

  // ─── Render ───────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-full p-2">
      <h3 className="text-sm font-semibold text-slate-800 px-2 py-2 border-b border-slate-200">
        Active Chats
      </h3>
      <div className="flex-1 overflow-y-auto py-2">
        <div className="px-2 space-y-2">

          <div className="flex items-center justify-between text-xs text-slate-500">
            <div>
              {loading
                ? "Loading…"
                : error
                ? (
                  <span className="text-red-500">
                    Failed to load{" "}
                    <button onClick={refresh} className="underline text-blue-600">
                      Retry
                    </button>
                  </span>
                )
                : `${visibleConversations.length} chats`}
            </div>
            <button
              type="button"
              onClick={refresh}
              className="text-xs text-blue-700 hover:underline"
            >
              Refresh
            </button>
          </div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-2">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex items-center gap-3 p-2 animate-pulse">
                  <div className="w-9 h-9 rounded-full bg-slate-200" />
                  <div className="flex-1 space-y-1">
                    <div className="h-3 bg-slate-200 rounded w-3/4" />
                    <div className="h-2 bg-slate-200 rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {visibleConversations.length === 0 && !loading && (
            <div className="text-sm text-slate-500 px-1">
              No conversations yet.
            </div>
          )}

          {visibleConversations.map((conv) => {
            const payload = { ...conv, otherUser: deriveOtherUser(conv) }; // ✅ currentUserId from closure
            return (
              <ConversationItem
                key={payload.id}
                conversation={payload}
                isActive={String(activeConversationId) === String(payload.id)}
                onClick={() => onSelect?.(payload)}
              />
            );
          })}

        </div>
      </div>
    </div>
  );
};

export default ConversationList;