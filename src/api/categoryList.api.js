import request from "./request";

export const fetchCategoryList = (
  query = {
    page: "1",
    limit: "20",
    order: "desc",
    orderBy: "name",
  }
) => {
  return request.get(`/categories`, { params: query });
};

export const fetchSpecificCategoryList = (brandId) => {
  return request.get(`/brands/${brandId}/categories`);
};

export const fetchCategoryNoBrandRelatedList = () => {
  return request.get(`/brands/category`);
};

export const CreateCategory = (data) => {
  return request.post(`/categories`, data);
};

export const EditCategory = ({ id, ...data }) => {
  return request.patch(`/categories/${id}`, data);
};

export const DeleteCategoryAPI = (id) => {
  return request.delete(`/categories/${id}`);
};

export const EditCategoryProductData = (id, data) => {
  return request.patch(`/categories/product-data/${id}`, data);
};
