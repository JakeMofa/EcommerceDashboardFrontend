import { message } from "antd";
import { fetchInventoryDashboard } from "../api/inventoryDashboard.api";
import { setInventoryDashboard } from "../store/slice/inventoryDashboard.slice";

export const getInventoryDashboard = () => {
  return (dispatch) => {
    fetchInventoryDashboard()
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setInventoryDashboard({ status: true, data: res.data }));
        } else {
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
}