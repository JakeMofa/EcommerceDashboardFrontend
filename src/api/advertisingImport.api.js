import request, { api_request } from "./request";

export const ImportAdvertising = (data) => {
  return request.put("/advertising-data", data);
};

export const ImportAdsManualReport = (data) => {
  return api_request.post("/api/data-upload/advertising-data", data);
};
