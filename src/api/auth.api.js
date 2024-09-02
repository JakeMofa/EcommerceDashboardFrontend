import request from "./request";

export const signInRequest = (data) => {
  return request.post("/auth/login", data);
};

export const signUpRequest = (data) => {
  return request.post("/auth/signup", data);
};

export const fetchMeRequest = () => {
  return request.get("/auth/me");
};

export const resetPasswordEmailRequest = (email) => {
  return request.get(`/auth/reset-password?email=${email}`);
};

export const resetPasswordRequest = (data) => {
  return request.patch("/auth/reset-password", data);
};
