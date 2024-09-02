import { createSlice, current } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const CategoryProductListSlice = createSlice({
  initialState: initialState.categoryProductList,
  name: "categoryProductList",
  reducers: {
    setCategoryProductList: (state, action) => {
      state = {
        ...state,
        count: current(state).count || action.payload.items.length,
        ...action.payload,
      };
      return state;
    },
    setUpdateCategoryProduct: (state, { payload }) => {
      const result = current(state).items.reduce((acc, item) => {
        if (item.asin === payload.asin) {
          acc.push(payload);
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
      state.items = result;
    },
  },
});

export const { setCategoryProductList, setUpdateCategoryProduct } =
  CategoryProductListSlice.actions;

export default CategoryProductListSlice.reducer;

const selectCategoryProductList = (state) => state.categoryProductList;

export { selectCategoryProductList };
