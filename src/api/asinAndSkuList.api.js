import request from "./request";

export const fetchProductDataNoASINsSKUs = (data) => {
  return request.get("/categories/product-data-no-asin-skus", {
    params: {
      limit: data?.limit || 10,
      search: data?.search,
    },
  });
};

export const fetchProductDataASINs = (data) => {
  return request.get("/categories/product-data-asins", {
    params: {
      limit: data?.limit || 10,
      search: data?.search,
    },
  });
};

export const assignAsinToSku = (data) => {
  return request.post("/categories/product-data", data);
};
