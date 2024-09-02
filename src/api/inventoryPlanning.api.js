import request from "./request";

export const fetchInventoryPlanningData = () => {
  return request.get("/inventory/management");
};

export const updateInventoryPlanningData = ({ asin, ...data }) => {
  return request.put(`/inventory/management/${asin}`, data);
};
