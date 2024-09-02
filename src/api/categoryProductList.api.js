import request, { api_request } from "./request";

export const fetchCategoryProductList = (
  params = {
    page: 1,
    limit: 20,
    order: "desc",
    orderBy: undefined,
    "search[category]": [],
    "search[asin]": undefined,
    "search[sku]": undefined,
    "search[product_title]": undefined,
    "search[product_status]": undefined,
  }
) => {
  return request.get(`/categories/product-data`, {
    params: {
      ...params,
      "search[category]": params["search[category]"].join(","),
    },
  });
};

export const ImportCategoryProductList = (data) => {
  return api_request.post("/api/data-upload/category-product", data);
};

export const ImportForecastList = (data, params) => {
  console.log(params);
  return request.put(
    `/forecast/${params.brandId}/import?year=${params.year}`,
    data
  );
};

export const deleteCategoryProduct = (id) => {
  return request.delete(`/categories/product-data/${id}`);
};
