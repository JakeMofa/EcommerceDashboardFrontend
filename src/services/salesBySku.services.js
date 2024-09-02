import { message } from "antd";
import {
  fetchSalesBySkuDetails,
  fetchSalesSkuDetailList,
  fetchSalesSkuGraphData,
} from "../api/salesBySku.api";
import {
  setSalesBySkuDetails,
  setSalesSkuDetailsList,
  setSalesBySkuGraphData,
} from "../store/slice/salesBySku.slice";
import initialState from "../store/initialState";

export const getSalesBySkuDetails = (data) => {
  return (dispatch) => {
    fetchSalesBySkuDetails(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(
            setSalesBySkuDetails({
              status: true,
              data: res.data.items.summary,
            })
          );
          dispatch(
            setSalesSkuDetailsList({
              status: true,
              ...res.data,
              items: res.data.items.details,
            })
          );
        } else {
          message.error("No data available yet.");
          dispatch(
            setSalesBySkuDetails({
              ...initialState.salesBySku.salesBySkuDetails,
              status: false,
            })
          );
          dispatch(
            setSalesSkuDetailsList({
              ...initialState.salesBySku.salesSkuDetailsList,
              status: false,
            })
          );
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};

export const getSalesBySkuDetailsList = (data) => {
  return (dispatch) => {
    fetchSalesSkuDetailList(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setSalesSkuDetailsList(res.data));
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

export const getSalesBySkuGraphData = (data) => {
  return (dispatch) => {
    fetchSalesSkuGraphData(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setSalesBySkuGraphData({ status: true, data: res.data }));
        } else {
          message.error("No data available yet.");
          dispatch(
            setSalesBySkuGraphData({
              ...initialState.salesBySku.salesBySkuDetails,
              status: false,
            })
          );
          dispatch(
            setSalesSkuDetailsList({
              ...initialState.salesBySku.salesBySkuGraphData.data,
              status: false,
            })
          );
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};
