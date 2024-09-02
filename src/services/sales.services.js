import { message } from "antd";
import {
  fetchSalesGraphData,
  fetchSalesByWeekData,
  fetchSalesByMonthData,
  fetchSalesWeeklyReportCallOuts,
  fetchSalesMonthlyReportCallOuts,
} from "../api/sales.api";
import {
  setSalesByWeekData,
  setSalesGraphData,
  setSalesReportCallOuts,
  setSalesStats,
} from "../store/slice/sales.slice";
import initialState from "../store/initialState";

export const getSalesGraphData = (data) => {
  return (dispatch) => {
    fetchSalesGraphData(data)
      .then((res) => {
        if (res.status == 200 && res.data) {
          dispatch(setSalesGraphData({ status: true, data: res.data }));
        } else {
          dispatch(
            setSalesGraphData({
              status: false,
              ...initialState.sales.salesGraphData,
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

export const getSalesReportCallOuts = (data) => {
  return (dispatch) => {
    (data.search_week
      ? fetchSalesWeeklyReportCallOuts(data)
      : fetchSalesMonthlyReportCallOuts(data)
    )
      .then((res) => {
        if (res.status == 200 && res.data) {
          const { weekDetail, ...reportCallout } = res.data;
          dispatch(
            setSalesReportCallOuts({ status: true, data: reportCallout })
          );
        } else {
          dispatch(
            setSalesReportCallOuts({
              status: false,
              ...initialState.sales.salesReportCallOuts,
            })
          );
          message.error("No Report Call Outs data available yet.");
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};

export const getSalesTableData = (data) => {
  return (dispatch) => {
    (data.search_week
      ? fetchSalesByWeekData(data)
      : fetchSalesByMonthData(data)
    )
      .then((res) => {
        if (res.status == 200 && res.data) {
          const { weekDetail, monthDetail, ...reportCallout } = res.data;
          dispatch(setSalesStats({ status: true, data: reportCallout }));
          dispatch(
            setSalesByWeekData({
              status: true,
              data: weekDetail || monthDetail,
            })
          );
        } else {
          dispatch(
            setSalesStats({
              status: false,
              ...initialState.sales.selectSalesStats,
            })
          );
          dispatch(
            setSalesByWeekData({
              status: false,
              ...initialState.sales.salesByWeekData,
            })
          );
          message.error("No Report Call Outs data available yet.");
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
