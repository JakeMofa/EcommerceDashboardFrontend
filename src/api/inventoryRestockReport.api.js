import request from "./request";

export const fetchInventoryRestockReport = () => {
  return request.get("/inventory/latest-restock");
};
