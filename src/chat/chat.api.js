import api from "../api/axios";
import { connectSocket, getSocket } from "../socket/socket";

export const fetchConversations = async () => {
  const res = await api.get("/chat/conversations");
  return Array.isArray(res.data) ? res.data : [];
};

export const createConversation = async (targetUserId) => {
  const res = await api.post("/chat/conversation", { targetUserId });
  return res.data;
};

export const fetchMessages = async (conversationId) => {
  const res = await api.get(`/chat/conversation/${conversationId}/messages`);
  return Array.isArray(res.data) ? res.data : [];
};

export const sendMessageSocket = ({ conversationId, targetUserId, content }) => {
  const socket = getSocket() || connectSocket();
  if (!socket) return;

  socket.emit("send_message", {
    conversationId,
    targetUserId,
    content,
  });
};
