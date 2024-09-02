import request from "./request";

export const fetchInventoryDashboard = () => {
    return request.get(`get-inventory-DashBoard`);
  };
