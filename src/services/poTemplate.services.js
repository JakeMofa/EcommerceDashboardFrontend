import { message } from "antd";
import { fetchPoTemplateList, postPoTemplate } from "../api/poTemplate.api";
import { setPoTemplateList } from "../store/slice/poTemplate.slice";

export const getPoTemplateList = (data) => {
  return (dispatch) => {
    fetchPoTemplateList(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(setPoTemplateList({ status: true, data: res.data }));
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
export const createPoTemplate = (data) => {
  return () => {
    postPoTemplate(data)
      .then((res) => {
        if (res.status === 200 || res.status === 201) {
          console.log("Successfully Created");
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
