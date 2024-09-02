import { message } from "antd";
import {
  fetchProductReportList,
  fetchProductReportCategoryDetails,
} from "../api/productReport.api";
import {
  setCategoriesList,
  setCategoryProductsList,
} from "../store/slice/productReport.slice";
import initialState from "../store/initialState";

export const getCategoriesReportList = (data) => {
  return (dispatch) => {
    message.destroy();
    message.loading({ content: "Loading...", key: "loading", duration: 0 });
    fetchProductReportList(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setCategoriesList({
              status: true,
              ...res.data,
            })
          );
        } else {
          message.error("No data available yet.");
          dispatch(
            setCategoriesList({
              ...initialState.productReportList.categoriesData,
              status: false,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy("loading");
      });
  };
};

export const getCategoryProductsReportList = (data) => {
  return (dispatch) => {
    message.destroy();
    message.loading({ content: "Loading...", key: "loading", duration: 0 });
    fetchProductReportCategoryDetails(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setCategoryProductsList({
              status: true,
              ...res.data,
            })
          );
        } else {
          message.error("No data available yet.");
          dispatch(
            setCategoryProductsList({
              ...initialState.productReportList.categoryProductsData,
              status: false,
            })
          );
        }
      })
      .catch((err) => {
        console.log(err);
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      })
      .finally(() => {
        message.destroy("loading");
      });
  };
};
