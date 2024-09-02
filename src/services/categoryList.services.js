import { message } from "antd";
import {
  CreateCategory,
  fetchCategoryList,
  fetchCategoryNoBrandRelatedList,
  fetchSpecificCategoryList,
} from "../api/categoryList.api";
import {
  selectCategoryList,
  setCategoryList,
  setCategoryNoBrandRelatedList,
  setCategorySpecificBrandList,
} from "../store/slice/categoryList.slice";
import initialState from "../store/initialState";

export const getCategoryList = (
  data = {
    page: "1",
    limit: "20",
    order: "desc",
    orderBy: "name",
  }
) => {
  return (dispatch) => {
    dispatch(setCategoryList({ status: null }));
    fetchCategoryList(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(setCategoryList({ ...res.data, status: true }));
        } else {
          dispatch(
            setCategoryList({ ...initialState.categoryList, status: false })
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

export const getCategoryNoBrandRelatedList = (data) => {
  return (dispatch) => {
    dispatch(setCategoryNoBrandRelatedList({ status: null }));
    fetchCategoryNoBrandRelatedList(data)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setCategoryNoBrandRelatedList({ data: res.data, status: true })
          );
        } else {
          dispatch(
            setCategoryNoBrandRelatedList({
              ...initialState.categoryList.noBrandRelated,
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

export const getCategorySpecificList = (brandId) => {
  return (dispatch) => {
    fetchSpecificCategoryList(brandId)
      .then((res) => {
        if (res.status === 200) {
          dispatch(
            setCategorySpecificBrandList({
              data: { [brandId]: res.data },
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

export const DeleteCategory = (id, subcategory) => {
  return (dispatch, getState) => {
    const state = getState();
    let categoryList = selectCategoryList(state);
    let data = [];
    if (subcategory) {
      data = categoryList.data.map((fid) => ({
        ...fid,
        subcategories: fid.subcategories.filter((s) => s.id !== id),
      }));
    } else {
      data = categoryList.data.filter((fid) => fid.id !== id);
    }
    dispatch(setCategoryList({ ...categoryList, data }));
  };
};
