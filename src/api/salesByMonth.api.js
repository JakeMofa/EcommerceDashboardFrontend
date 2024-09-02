import request from "./request";

export const fetchSalesByMonthData = (data) => {
  return request.get(
    `/sales/sales-by-month-summary?years=${data?.search_year || ""}&months=${
      data?.search_month || ""
    }`
  );
};

export const fetchSalesByMonthDetail = (data) => {
  return request.get(
    `/sales/sales-by-month-data?years=${data?.search_year || ""}&months=${
      data?.search_month || ""
    }`
  );
};

export const fetchSalesByMonthGraph = (data) => {
  return request.get(`/sales/sales-graph-data`, {
    params: {
      years: data?.search_year || "",
      months: data?.search_month || "",
      graph_filter_type: data?.graph_filter_type || "month",
      sku: data?.sku || undefined,
      child_asins: data?.child_asins || undefined,
      parent_asins: data?.parent_asins || undefined,
    },
  });
};

export const fetchSalesMonthGraphAsinList = (data) => {
  return request.get(`/sales/sales-asins`, {
    params: {
      years: data?.search_year || undefined,
      months: data?.search_months || undefined,
    },
  });
};

export const fetchSalesMonthDetails = (data) => {
  return request.get(
    `/sales/sales-detail?year=${data?.year || ""}&month=${data?.month || ""}`
  );
};
