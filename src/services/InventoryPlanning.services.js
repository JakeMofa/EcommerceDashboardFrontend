import { message } from "antd";
import {
  updateInventoryPlanningData,
  fetchInventoryPlanningData,
} from "../api/inventoryPlanning.api";
import {
  setInventoryPlaning,
  setUpdateInventoryPlaning,
} from "../store/slice/planning.slice";

export const getInventoryPlanningData = () => {
  return (dispatch) => {
    fetchInventoryPlanningData()
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setInventoryPlaning({ data: res.data, status: true }));
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

export const editInventoryPlanningData = (data) => {
  return (dispatch) => {
    message.destroy();
    message.loading({ content: "In Progress...", key: "loading", duration: 0 });
    updateInventoryPlanningData(data)
      .then((res) => {
        if (res.status == 200 && res.data) {
          dispatch(setUpdateInventoryPlaning(res.data));
        } else {
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy();
      });
  };
};
