import { message } from "antd";
import { setSkuList, setAsinList } from "../store/slice/asinAndSkuList.slice";
import {
  fetchProductDataNoASINsSKUs,
  fetchProductDataASINs,
} from "../api/asinAndSkuList.api";
import initialState from "../store/initialState";

export const getNoAsinSkuList = (data) => {
  return (dispatch) => {
    fetchProductDataNoASINsSKUs(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setSkuList({
              list: res.data || [],
              status: true,
            })
          );
        } else {
          dispatch(
            setSkuList({
              list: [],
              status: false,
            })
          );
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};

export const getAsinList = (data) => {
  return (dispatch) => {
    fetchProductDataASINs(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setAsinList({
              list: res.data || [],
              status: true,
            })
          );
        } else {
          dispatch(
            setAsinList({
              ...initialState.asinAndSkuList.asin,
              status: false,
            })
          );
          message.error("No data available yet.");
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};
