import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const CategoryPerformanceSlice = createSlice({
  initialState: initialState.categoryPerformanceReport,
  name: "categoryPerformanceReport",
  reducers: {
    setCategoryPerformanceList: (state, action) => {
      state.categoryPerformanceList = action.payload;
    },
  },
});

export const { setCategoryPerformanceList } = CategoryPerformanceSlice.actions;

export default CategoryPerformanceSlice.reducer;

const selectCategoryPerformanceList = (state) =>
  state.categoryPerformanceReport.categoryPerformanceList;

export { selectCategoryPerformanceList };
