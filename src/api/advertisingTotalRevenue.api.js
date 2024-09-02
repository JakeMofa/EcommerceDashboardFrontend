import request from "./request";

export const fetchAdvertisingTotalRevenue = (data) => {
  return request.get(
    `/advertising-total-revenue?years=${data?.search_year || ""}&weeks=${
      data?.search_week || ""
    }`
  );
};
