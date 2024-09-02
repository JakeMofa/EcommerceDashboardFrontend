import { message } from "antd";
import {
  fetchSalesWeekData,
  fetchSalesWeekDetailList,
  fetchSalesWeekGraph,
  fetchSalesWeekGraphAsinList,
  fetchSalesWeekDetails,
} from "../api/salesByWeek.api";
import {
  setSalesWeekData,
  setSalesWeekDetailList,
  setSalesWeekGraph,
  setSalesWeekGraphAsinList,
  setSalesSelectedWeekDetails,
} from "../store/slice/salesByWeek.slice";
import initialState from "../store/initialState";

export const getSalesWeekDetailList = (data) => {
  return (dispatch) => {
    fetchSalesWeekDetailList(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(
            setSalesWeekDetailList({
              status: true,
              data: res.data.result.sort((a, b) => a.week - b.week),
              summary: res.data.comparisonSummary,
            })
          );
        } else {
          dispatch(
            setSalesWeekDetailList({
              ...initialState.salesByWeek.salesWeekDetailList,
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

export const getSalesWeekGraph = (data) => {
  return (dispatch) => {
    fetchSalesWeekGraph(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setSalesWeekGraph({
              status: true,
              data: res.status === 200 ? res.data : [],
            })
          );
        } else {
          dispatch(
            setSalesWeekGraph({
              ...initialState.salesByWeek.salesWeekGraph,
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

export const getSalesWeekGraphAsinList = (data) => {
  return (dispatch) => {
    fetchSalesWeekGraphAsinList(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setSalesWeekGraphAsinList({
              status: true,
              data: res.status === 200 ? res.data : [],
            })
          );
        } else {
          dispatch(
            setSalesWeekGraphAsinList({
              ...initialState.salesByWeek.graphAsinList,
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

export const getSalesWeekData = (data) => {
  return (dispatch) => {
    fetchSalesWeekData(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setSalesWeekData({ status: true, data: res.data }));
        } else {
          dispatch(
            setSalesWeekData({
              ...initialState.salesByWeek.salesWeekData,
              status: false,
            })
          );
          message.error("No Sales data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};

export const getSalesWeekDetails = (data) => {
  return (dispatch) => {
    fetchSalesWeekDetails(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(
            setSalesSelectedWeekDetails({ status: true, data: res.data })
          );
        } else {
          dispatch(
            setSalesSelectedWeekDetails({
              ...initialState.salesByWeek.salesSelectedWeekDetail,
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
