import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const salesByWeekSlice = createSlice({
  initialState: initialState.salesByWeek,
  name: "salesByWeek",
  reducers: {
    setSalesWeekDetailList: (state, action) => {
      state.salesWeekDetailList = action.payload;
    },
    setSalesWeekGraph: (state, action) => {
      state.salesWeekGraph = action.payload;
    },
    setSalesWeekData: (state, action) => {
      state.salesWeekData = action.payload;
    },
    setSalesWeekGraphAsinList: (state, action) => {
      state.graphAsinList = action.payload;
    },
    setSalesSelectedWeekDetails: (state, action) => {
      state.salesSelectedWeekDetail = action.payload;
    },
  },
});

export const {
  setSalesWeekData,
  setSalesWeekDetailList,
  setSalesWeekGraph,
  setSalesWeekGraphAsinList,
  setSalesSelectedWeekDetails,
} = salesByWeekSlice.actions;

export default salesByWeekSlice.reducer;

const selectSalesWeekData = (state) => state.salesByWeek.salesWeekData;
const selectSalesWeekGraph = (state) => state.salesByWeek.salesWeekGraph;
const selectSalesWeekGraphAsinList = (state) => state.salesByWeek.graphAsinList;
const selectSalesWeekDetail = (state) => state.salesByWeek.salesWeekDetailList;
const selectSalesSelectedWeekDetail = (state) => state.salesByWeek.salesSelectedWeekDetail;

export {
  selectSalesWeekData,
  selectSalesWeekGraph,
  selectSalesWeekDetail,
  selectSalesWeekGraphAsinList,
  selectSalesSelectedWeekDetail
};
