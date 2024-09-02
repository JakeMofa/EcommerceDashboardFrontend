import request from "./request";

export const fetchAdvertising = (data) => {
  return request.get(
    `/advertising-data?year=${data?.search_year || ""}&weeks=${
      data?.search_week || ""
    }`
  );
};

export const fetchGraphData = (data) => {
  return request.get(`/advertising-campaign-graph`, {
    params: {
      ...data,
      start_date: data?.start_date || "2023-1-24",
      end_date: data?.end_date || "2023-12-12",
    },
  });
};

export const fetchCampaignData = (data) => {
  return request.get(`/advertising-campaign-data`, {
    params: {
      ...data,
      start_date: data?.start_date || "2023-1-24",
      end_date: data?.end_date || "2023-12-12",
    },
  });
};
