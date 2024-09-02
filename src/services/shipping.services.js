import { message } from "antd";
import { fetchShippingList } from "../api/shipping.api";
import { setShippingList } from "../store/slice/shipping.slice";

export const getShippingList = (data) => {
  return (dispatch) => {
    fetchShippingList(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setShippingList(res.data));
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
