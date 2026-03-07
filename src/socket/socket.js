import { io } from "socket.io-client";
import { useAuthStore } from "../auth/auth.store";

let socket = null;

const getSocketUrl = () =>
  import.meta.env.VITE_BACKEND_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000";

export const connectSocket = () => {
  if (socket) return socket;

  const token =
    useAuthStore.getState().accessToken ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken");

  if (!token) return null;

  socket = io(getSocketUrl(), {
    auth: { token },
    withCredentials: true,
    reconnection: true,
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
  });

  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
