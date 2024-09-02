import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const salesBySkuSlice = createSlice({
  initialState: initialState.salesBySku,
  name: "salesBySku",
  reducers: {
    setSalesSkuDetailsList: (state, action) => {
      state.salesSkuDetailsList = action.payload;
    },
    setSalesBySkuDetails: (state, action) => {
      state.salesBySkuDetails = action.payload;
    },
    setSalesBySkuGraphData: (state, action) => {
      state.salesBySkuGraphData = action.payload;
    },
  },
});

export const {
  setSalesSkuDetailsList,
  setSalesBySkuDetails,
  setSalesBySkuGraphData,
} = salesBySkuSlice.actions;

export default salesBySkuSlice.reducer;

const selectSalesBySkuDetails = (state) => state.salesBySku.salesBySkuDetails;
const selectSalesBySkuDetailsList = (state) =>
  state.salesBySku.salesSkuDetailsList;
const selectSalesBySkuGraphData = (state) =>
  state.salesBySku.salesBySkuGraphData;

export {
  selectSalesBySkuDetails,
  selectSalesBySkuDetailsList,
  selectSalesBySkuGraphData,
};
