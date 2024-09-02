import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const salesByMonthSlice = createSlice({
  initialState: initialState.salesByMonth,
  name: "salesByMonth",
  reducers: {
    setSalesByMonthData: (state, action) => {
      state.salesByMonthData = action.payload;
    },
    setSalesByMonthDetail: (state, action) => {
      state.salesByMonthDetail = action.payload;
    },
    setSalesByMonthGraph: (state, action) => {
      state.salesByMonthGraph = action.payload;
    },
    setSalesMonthGraphAsinList: (state, action) => {
      state.graphAsinList = action.payload;
    },
    setSalesSelectedMonthDetails: (state, action) => {
      state.salesSelectedMonthDetail = action.payload;
    },
  },
});

export const {
  setSalesByMonthData,
  setSalesByMonthDetail,
  setSalesByMonthGraph,
  setSalesMonthGraphAsinList,
  setSalesSelectedMonthDetails,
} = salesByMonthSlice.actions;

export default salesByMonthSlice.reducer;

const selectSalesByMonthData = (state) => state.salesByMonth.salesByMonthData;
const selectSalesByMonthGraph = (state) => state.salesByMonth.salesByMonthGraph;
const selectSalesByMonthDetail = (state) =>
  state.salesByMonth.salesByMonthDetail;
const selectSalesMonthGraphAsinList = (state) =>
  state.salesByMonth.graphAsinList;
const selectSalesSelectedMonthDetail = (state) =>
  state.salesByMonth.salesSelectedMonthDetail;

export {
  selectSalesByMonthData,
  selectSalesByMonthGraph,
  selectSalesByMonthDetail,
  selectSalesMonthGraphAsinList,
  selectSalesSelectedMonthDetail,
};
