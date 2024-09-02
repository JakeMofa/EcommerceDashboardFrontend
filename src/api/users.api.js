import request from "./request";

export const fetchUserList = (data) => {
  return request.get("/users/all", {
    params: {
      name: data?.search_term || "",
      role: data?.role || "",
      account_type: data?.account_type || "",
      page: data?.page || 1,
      limit: data?.perPage || 10,
    },
  });
};

export const updateBrandAM = ({ brandId, accountManagerId }) => {
  return request.put(`/brands/${brandId}/account-manager/${accountManagerId}`);
};

export const removeBrandAM = ({ brandId }) => {
  return request.delete(`/brands/${brandId}/account-manager`);
};

export const updateBrandCategory = ({ brandId, categoriesId }) => {
  return request.put(`/brands/${brandId}/category/${categoriesId}`);
};

export const removeBrandCategory = ({ brandId, categoriesId }) => {
  return request.delete(`/brands/${brandId}/category/${categoriesId}`);
};

export const fetchSwitchUser = (id) => {
  return request.get(`/auth/user-token/${id}`);
};

export const createUserRequest = (data) => {
  return request.post(`/users`, data);
};

export const addBrandsRequest = (id, data) => {
  return request.post(`/users/${id}/verify`, data);
};

export const updateUserRequest = (id, data) => {
  return request.patch(`/users/${id}`, data);
};

export const fetchUserBrands = (id) => {
  return request.get(`/users/${id}/brands`);
};

export const updateUserAM = (id, brandsId) => {
  return request.put(
    `/users/${id}/account-manager`,
    {},
    { params: { brandsId: (brandsId || [])?.join(",") } }
  );
};

export const deleteUserAM = (id, brandsId) => {
  return request.delete(`/users/${id}/account-manager`, {
    params: { brandsId: (brandsId || [])?.join(",") },
  });
};

export const deleteUserRequest = (id) => {
  return request.delete(`/users/${id}`);
};
