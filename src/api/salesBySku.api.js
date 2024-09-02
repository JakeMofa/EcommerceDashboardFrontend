import request from "./request";

export const fetchSalesSkuDetailList = (data) => {
  return request.get(
    `/get-sales-by-sku-detail?start_date=${data?.start_date || ""}&end_date=${
      data?.end_date || ""
    }&search_text=${data?.search_text || ""}`,
    data
  );
};

export const fetchSalesBySkuDetails = (data) => {
  return request.get("/sales/sales-by-sku", {
    params: {
      search: data?.search_text || "",
      startDate: data?.start_date || "2023-1-24",
      endDate: data?.end_date || "2023-12-12",
      page: data?.page || 1,
      limit: data?.perPage || 10,
      orderBy: data?.orderBy || "astr_units_ordered_sum",
      order: data?.order || "desc",
    },
  });
};

export const fetchSalesSkuGraphData = (data) => {
  return request.get(
    `/sales/sales-by-sku-graph?search=${data?.search_text || ""}&startDate=${
      data?.start_date || "2023-1-24"
    }&endDate=${data?.end_date || "2023-12-12"}&limit=${data?.perPage || 99999}`
  );
};
