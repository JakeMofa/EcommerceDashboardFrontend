import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const ProductReportSlice = createSlice({
  initialState: initialState.productReportList,
  name: "productReportList",
  reducers: {
    setCategoriesList: (state, action) => {
      state.categoriesData = action.payload;
    },
    setCategoryProductsList: (state, action) => {
      state.categoryProductsData = action.payload;
    },
  },
});

export const {
  setCategoriesList,
  setCategoryProductsList,
} = ProductReportSlice.actions;

export default ProductReportSlice.reducer;

const selectCategoriesReportList = (state) =>
  state.productReportList.categoriesData;
const selectProductsReportList = (state) =>
  state.productReportList.categoryProductsData;

export { selectCategoriesReportList, selectProductsReportList };
