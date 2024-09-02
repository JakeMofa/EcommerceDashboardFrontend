import request from "./request";

export const fetchSalesGraphData = (data) => {
  return request.get("/sales/sales-graph-data", {
    params: {
      years: data?.search_year || "",
      ...(data?.graph_filter_type == "month"
        ? { months: data?.search_month || "" }
        : { weeks: data?.search_week || "" }),
      graph_filter_type: data?.graph_filter_type || "week",
    },
  });
};

export const fetchSalesWeeklyReportCallOuts = (data) => {
  return request.get("/sales/sales-selected-callout", {
    params: {
      year: data?.search_year || "",
      week: data?.search_week,
      lastFullPeriod: data?.lastFullPeriod || false,
    },
  });
};

export const fetchSalesMonthlyReportCallOuts = (data) => {
  return request.get("/sales/sales-selected-callout-monthly", {
    params: {
      year: data?.search_year || "",
      month: data?.search_month,
      lastFullPeriod: data?.lastFullPeriod || false,
    },
  });
};

export const fetchSalesByWeekData = (data) => {
  return request.get(
    `/sales/sales-callout-data?year=${data?.search_year || ""}&weeks=${
      data?.search_week || ""
    }`,
    data
  );
};

export const fetchSalesByMonthData = (data) => {
  return request.get(
    `/sales/sales-callout-data-monthly?year=${data?.search_year || ""}&months=${
      data?.search_month || ""
    }`,
    data
  );
};
