import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const salesSlice = createSlice({
  initialState: initialState.sales,
  name: "sales",
  reducers: {
    setSalesGraphData: (state, action) => {
      state.salesGraphData = action.payload;
    },
    setSalesByWeekData: (state, action) => {
      state.salesByWeekData = action.payload;
    },
    setSalesReportCallOuts: (state, action) => {
      state.salesReportCallOuts = action.payload;
    },
    setSalesStats: (state, action) => {
      state.salesStats = action.payload;
    },
  },
});

export const {
  setSalesGraphData,
  setSalesByWeekData,
  setSalesReportCallOuts,
  setSalesStats,
} = salesSlice.actions;

export default salesSlice.reducer;

const selectSalesByWeekData = (state) => state.sales.salesByWeekData;
const selectSalesGraphData = (state) => state.sales.salesGraphData;
const selectSalesByReportCallOuts = (state) => state.sales.salesReportCallOuts;
const selectSalesStats = (state) => state.sales.salesStats;

export {
  selectSalesByWeekData,
  selectSalesGraphData,
  selectSalesByReportCallOuts,
  selectSalesStats,
};
