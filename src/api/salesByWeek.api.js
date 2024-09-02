import request from "./request";

export const fetchSalesWeekDetailList = (data) => {
  return request.get(
    `/sales/sales-by-week-data?years=${data?.search_year || ""}&weeks=${
      data?.search_week || ""
    }`
  );
};

export const fetchSalesWeekGraph = (data) => {
  return request.get(`/sales/sales-graph-data`, {
    params: {
      years: data?.search_year || "",
      weeks: data?.search_week || "",
      graph_filter_type: data?.graph_filter_type || "week",
      sku: data?.sku || undefined,
      child_asins: data?.child_asins || undefined,
      parent_asins: data?.parent_asins || undefined,
    },
  });
};

export const fetchSalesWeekGraphAsinList = (data) => {
  return request.get(`/sales/sales-asins`, {
    params: {
      years: data?.search_year || undefined,
      weeks: data?.search_week || undefined,
    },
  });
};

export const fetchSalesWeekData = (data) => {
  return request.get(
    `/sales/sales-by-week-summary?years=${data?.search_year || ""}&weeks=${
      data?.search_week || ""
    }`
  );
};

export const fetchSalesWeekDetails = (data) => {
  return request.get(
    `/sales/sales-detail?year=${data?.year || ""}&week=${
      data?.week || ""
    }`
  );
};
