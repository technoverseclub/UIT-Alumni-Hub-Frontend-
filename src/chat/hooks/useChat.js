import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAuthStore } from "../../auth/auth.store";
import { fetchMessages, sendMessageSocket } from "../chat.api";
import { connectSocket, getSocket } from "../../socket/socket";

const MAX_MESSAGE_LENGTH = 2000;

export const useChat = (conversation) => {
  const accessToken = useAuthStore((s) => s.accessToken);
  const currentUserId = useAuthStore((s) => s.user?.id);

  const conversationId = conversation?.id ?? null;
  const targetUserId = useMemo(() => {
    if (!conversation) return null;
    return (
      conversation.otherUser?.id ??
      conversation.otherParticipant?.id ??
      null
    );
  }, [conversation]);

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [sending, setSending] = useState(false);

  // Track latest conversationId in a ref so socket handler is always fresh
  const conversationIdRef = useRef(conversationId);
  useEffect(() => {
    conversationIdRef.current = conversationId;
  }, [conversationId]);

  // ─── Load messages ────────────────────────────────────────────────
  const load = useCallback(async () => {
    if (!accessToken || !conversationId) {
      setMessages([]);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMessages(conversationId);
      setMessages(Array.isArray(data) ? data : []);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load messages");
    } finally {
      setLoading(false);
    }
  }, [accessToken, conversationId]);

  useEffect(() => {
    load();
  }, [load]);

  // ─── Socket: receive + reconnect sync ────────────────────────────
  useEffect(() => {
    if (!accessToken) return;

    const socket = getSocket() || connectSocket();
    if (!socket) return;

    // Replace optimistic temp message with real one from server
    const handleReceive = (payload) => {
      const incomingConvId = payload?.conversationId;
      if (incomingConvId == null) return;
      if (String(incomingConvId) !== String(conversationIdRef.current)) return;

      setMessages((prev) => {
        // Check for exact duplicate (same real id already exists)
        const alreadyExists = prev.some(
          (m) => !String(m.id).startsWith("tmp_") && m.id === payload.id
        );
        if (alreadyExists) return prev;

        // Replace matching temp message
        const withoutTemp = prev.filter(
          (m) =>
            !(
              String(m.id).startsWith("tmp_") &&
              m.content === payload.content &&
              String(m.senderId) === String(payload.senderId ?? payload.sender?.id)
            )
        );
        return [...withoutTemp, payload];
      });
    };

    // Re-sync missed messages on reconnect
    const handleReconnect = () => {
      load();
    };

    socket.on("receive_message", handleReceive);
    socket.on("reconnect", handleReconnect);

    return () => {
      socket.off("receive_message", handleReceive);
      socket.off("reconnect", handleReconnect);
    };
  }, [accessToken, load]);

  // ─── Send message ─────────────────────────────────────────────────
  const send = useCallback(
    async (content) => {
      if (!conversationId || !targetUserId) return;

      const trimmed = String(content || "").trim();
      if (!trimmed) return;

      if (trimmed.length > MAX_MESSAGE_LENGTH) {
        setError(`Message cannot exceed ${MAX_MESSAGE_LENGTH} characters`);
        return;
      }

      if (sending) return; // prevent spam

      setSending(true);
      setError(null);

      const tempId = `tmp_${Date.now()}`;

      // Optimistic append
      setMessages((prev) => [
        ...prev,
        {
          id: tempId,
          content: trimmed,
          senderId: currentUserId,
          sender: { id: currentUserId, name: "You" },
          conversationId,
          createdAt: new Date().toISOString(),
        },
      ]);

      try {
        sendMessageSocket({
          conversationId,
          targetUserId,
          content: trimmed,
        });
      } catch (e) {
        // Rollback optimistic message on failure
        setMessages((prev) => prev.filter((m) => m.id !== tempId));
        setError("Failed to send message. Please try again.");
      } finally {
        setSending(false);
      }
    },
    [conversationId, targetUserId, currentUserId, sending]
  );

  return {
    messages,
    loading,
    error,
    sending,
    reload: load,
    send,
    targetUserId,
  };
};

export default useChat;