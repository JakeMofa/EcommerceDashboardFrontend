import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const CustomerAcquisitionMonthlySlice = createSlice({
  initialState: initialState.customerAcquisitionMonthly,
  name: "customerAcquisitionMonthly",
  reducers: {
    setCustomerAcquisitionMonthly: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

export const { setCustomerAcquisitionMonthly } = CustomerAcquisitionMonthlySlice.actions;

export default CustomerAcquisitionMonthlySlice.reducer;

const selectCustomerAcquisitionMonthly = (state) => state.customerAcquisitionMonthly;

export { selectCustomerAcquisitionMonthly };
