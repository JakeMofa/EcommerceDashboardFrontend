import axios from "axios";

export const sendEmail = (data) => {
  return axios.post("/api/email", data, {
    headers: {
      "Content-Type": "application/json",
    },
  });
};
