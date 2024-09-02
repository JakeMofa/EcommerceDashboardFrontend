import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const CustomerAcquisitionSliceLTV = createSlice({
  initialState: initialState.customerAcquisitionLTV,
  name: "customerAcquisitionLTV",
  reducers: {
    setCustomerAcquisitionLTV: (state, action) => {
      state.LTV = action.payload;
    },
    setCustomerAcquisitionPredictiveLTV: (state, action) => {
      state.predictiveLTV = action.payload;
    },
  },
});

export const {
  setCustomerAcquisitionLTV,
  setCustomerAcquisitionPredictiveLTV,
} = CustomerAcquisitionSliceLTV.actions;

export default CustomerAcquisitionSliceLTV.reducer;

const selectCustomerAcquisitionLTV = (state) =>
  state.customerAcquisitionLTV.LTV;
const selectCustomerAcquisitionPredictiveLTV = (state) =>
  state.customerAcquisitionLTV.predictiveLTV;

export { selectCustomerAcquisitionLTV, selectCustomerAcquisitionPredictiveLTV };
