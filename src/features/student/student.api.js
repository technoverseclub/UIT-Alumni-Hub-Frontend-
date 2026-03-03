import api from "../../api/axios";

/* ================= PROFILE ================= */

export const createStudentProfile = (data) => {
  return api.post("/student/profile", data);
};

export const getStudentProfile = () => {
  return api.get("/student/profile/me");
};

export const updateStudentProfile = (data) => {
  return api.put("/student/profile", data);
};


/* ================= MESSAGES ================= */

export const getStudentConversations = () => {
  return api.get("/student/messages");
};

export const sendStudentMessage = (conversationId, data) => {
  return api.post(`/student/messages/${conversationId}`, data);
};


/* ================= SETTINGS ================= */

export const updateStudentSettings = (data) => {
  return api.put("/student/settings", data);
};