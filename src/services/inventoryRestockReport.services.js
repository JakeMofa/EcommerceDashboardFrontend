import { message } from "antd";
import { fetchInventoryRestockReport } from "../api/inventoryRestockReport.api";
import { setInventoryRestockReport } from "../store/slice/inventoryRestockReport.slice";

export const getInventoryRestockReport = () => {
  return (dispatch) => {
    fetchInventoryRestockReport()
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setInventoryRestockReport({ data: res.data, status: true }));
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
};
