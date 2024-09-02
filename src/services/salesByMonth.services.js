import { message } from "antd";
import {
  fetchSalesByMonthData,
  fetchSalesByMonthDetail,
  fetchSalesByMonthGraph,
  fetchSalesMonthGraphAsinList,
  fetchSalesMonthDetails,
} from "../api/salesByMonth.api";
import {
  setSalesByMonthData,
  setSalesByMonthDetail,
  setSalesByMonthGraph,
  setSalesMonthGraphAsinList,
  setSalesSelectedMonthDetails,
} from "../store/slice/salesByMonth.slice";
import initialState from "../store/initialState";

export const getSalesByMonthData = (data) => {
  return (dispatch) => {
    fetchSalesByMonthData(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setSalesByMonthData({ status: true, data: res.data }));
        } else {
          message.error("No Sales data available yet.");
          dispatch(
            setSalesByMonthData({
              status: true,
              ...initialState.salesByMonth.salesByMonthData,
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

export const getSalesByMonthDetail = (data) => {
  return (dispatch) => {
    fetchSalesByMonthDetail(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(
            setSalesByMonthDetail({
              status: true,
              data: res.data.result.sort((a, b) => a.month - b.month),
              summary: res.data.comparisonSummary,
            })
          );
        } else {
          dispatch(
            setSalesByMonthDetail({
              ...initialState.salesByMonth.salesByMonthDetail,
              status: false,
            })
          );

          message.error("No Summary data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};

export const getSalesByMonthGraph = (data) => {
  return (dispatch) => {
    fetchSalesByMonthGraph(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setSalesByMonthGraph({ status: true, data: res.data }));
        } else {
          dispatch(
            setSalesByMonthGraph({
              ...initialState.salesByMonth.salesByMonthGraph,
              status: false,
            })
          );
          message.error("No Graph data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};

export const getSalesMonthGraphAsinList = (data) => {
  return (dispatch) => {
    fetchSalesMonthGraphAsinList(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setSalesMonthGraphAsinList({
              status: true,
              data: res.status === 200 ? res.data : [],
            })
          );
        } else {
          dispatch(
            setSalesWeekGraphAsinList({
              ...initialState.salesByMonth.graphAsinList,
              status: false,
            })
          );
          message.error("No Graph data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};

export const getSalesMonthDetails = (data) => {
  return (dispatch) => {
    fetchSalesMonthDetails(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(
            setSalesSelectedMonthDetails({ status: true, data: res.data })
          );
        } else {
          dispatch(
            setSalesSelectedMonthDetails({
              ...initialState.salesByMonth.salesSelectedMonthDetail,
              status: false,
            })
          );
          message.error("No Sales data details available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};
