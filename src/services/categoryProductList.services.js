import { message } from "antd";
import { setCategoryProductList } from "../store/slice/categoryProductList.slice";
import { fetchCategoryProductList } from "../api/categoryProductList.api";
import initialState from "../store/initialState";

export const getCategoryProductList = (data) => {
  return (dispatch) => {
    fetchCategoryProductList(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(setCategoryProductList({ ...res.data, status: true }));
        } else {
          dispatch(
            setCategoryProductList({
              ...initialState.categoryProductList,
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
