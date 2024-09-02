import { message } from "antd";
import { fetchAdvertisingTotalRevenue } from "../api/advertisingTotalRevenue.api";
import { setAdvertisingTotalRevenue } from "../store/slice/advertisingTotalRevenue.slice";
import initialState from "../store/initialState";

export const getAdvertising = (data) => {
  return (dispatch) => {
    fetchAdvertisingTotalRevenue(data)
      .then((res) => {
        if (res.status == 200 && res.data) {
          dispatch(
            setAdvertisingTotalRevenue({
              status: true,
              data: res.data,
            })
          );
        } else {
          dispatch(
            setAdvertisingTotalRevenue({
              ...initialState.advertisingTotalRevenue.list,
              status: false,
            })
          );
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
