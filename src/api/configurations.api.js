import request from "./request";

export const fetchConfigurations = (key) => {
  return request.get(`/configurations?key=${key}`);
};

export const updateConfigurations = (key, data) => {
  return request.patch(`/configurations?key=${key}`, data);
};
