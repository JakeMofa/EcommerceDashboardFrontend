import { message } from "antd";
import { fetchSalesByProductList } from "../api/salesByProduct.api";
import { setSalesByProductList } from "../store/slice/salesByProduct.slice";
import initialState from "../store/initialState";

export const getSalesByProductList = (data) => {
  return (dispatch) => {
    message.destroy();
    message.loading({ content: "Loading...", key: "loading", duration: 0 });
    fetchSalesByProductList(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(setSalesByProductList({ status: true, ...res.data }));
        } else {
          dispatch(
            setSalesByProductList({
              ...initialState.salesByProduct.salesByProductList,
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
      })
      .finally(() => {
        message.destroy("loading");
      });
  };
};
