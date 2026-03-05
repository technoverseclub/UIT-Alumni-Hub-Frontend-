import api from "../api/axios";

export const requestLoginOtp = (data) => {
  return api.post("/auth/login", data);
};

export const verifyLoginOtp = (data) => {
  return api.post("/auth/login/verify", data);
};

export const resendOtp = (data) => {
  return api.post("/auth/resend-otp", data);
};

export const getMe = (token) =>
  api.get("/auth/me", {
    headers: { Authorization: `Bearer ${token}` },
  });

export const requestSignupOtp = (data) => {
  return api.post("/auth/signup/request-otp", data);
};

export const verifySignupOtp = (data) => {
  return api.post("/auth/signup/verify", data);
};