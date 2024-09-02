import { message } from "antd";
import { setCategoryPerformanceList } from "../store/slice/categoryPerformanceReport.slice";
import { fetchCategoryPerformanceList } from "../api/categoryPerformance.api";
import initialState from "../store/initialState";

export const getCategoryPerformanceList = (data) => {
  return (dispatch) => {
    message.destroy();
    message.loading({ content: "Loading...", key: "loading", duration: 0 });
    fetchCategoryPerformanceList(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setCategoryPerformanceList({
              status: res.status === 200,
              ...res.data,
            })
          );
        } else {
          message.error("No data available yet.");
          dispatch(
            setCategoryPerformanceList({
              ...initialState.categoryPerformanceReport.categoryPerformanceList,
              status: res.status === 200,
            })
          );
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy("loading");
      });
  };
};
