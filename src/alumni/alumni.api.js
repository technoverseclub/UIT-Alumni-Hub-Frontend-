import api from "../api/axios";

/* ================= PROFILE ================= */

export const createAlumniProfile = (data) => {
  return api.post("/alumni/profile", data);
};

export const getAlumniProfile = () => {
  return api.get("/alumni/profile/me");
};

export const updateAlumniProfile = (data) => {
  return api.put("/alumni/profile", data);
};

/* ================= MESSAGES ================= */

export const getAlumniConversations = () => {
  return api.get("/alumni/messages");
};

export const sendAlumniMessage = (conversationId, data) => {
  return api.post(`/alumni/messages/${conversationId}`, data);
};

/* ================= SETTINGS ================= */

export const updateAlumniSettings = (data) => {
  return api.put("/alumni/settings", data);
};