import request from "./request";

export const fetchSalesByProductList = (data) => {
  return request.get("/sales/sales-by-product", {
    params: {
      years: data?.search_year || "",
      weeks: data?.search_week || "1,2,3",
      page: data?.page || 1,
      limit: data?.perPage || 10,
      orderBy: data?.orderBy || "total_ordered_units",
      order: data?.order || "desc",
      search: data?.searchText || '',
    },
  });
};
