import { message } from "antd";
import { fetchCentralReportLogs } from "../api/centralReportLogs.api";
import { setCentralReportLogs } from "../store/slice/centralReportLogs.slice";

export const getCentralReportLogs = (data) => {
  return (dispatch) => {
    fetchCentralReportLogs(data)
      .then((res) => {
        if (res.status === 201 && res.data) {
          dispatch(setCentralReportLogs({ ...res.data, status: true }));
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
