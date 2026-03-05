import api from "../api/axios";

export const getAllAlumni = () => api.get("/alumni/");

export const getAlumniById = (userId) => api.get(`/alumni/${userId}`);
