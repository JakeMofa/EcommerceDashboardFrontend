import { message } from "antd";
import { fetchReportLogs, fetchReportLogsSummary } from "../api/reportLogs.api";
import { setReportLogs, setReportLogsSummary } from "../store/slice/reportLogs.slice";

export const getReportLogs = (data) => {
  return (dispatch) => {
    fetchReportLogs(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setReportLogs({ ...res.data, status: true }));
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

export const getReportLogsSummary = () => {
  return (dispatch) => {
    fetchReportLogsSummary()
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setReportLogsSummary({ data: res.data, status: true }));
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
