import { createSlice, current } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const CustomerAcquisitionBreakdownMonthly = createSlice({
  initialState: initialState.customerAcquisitionBreakdownMonthly,
  name: "customerAcquisitionBreakdownMonthly",
  reducers: {
    setCustomerAcquisitionBreakdownMonthly: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

export const { setCustomerAcquisitionBreakdownMonthly } =
  CustomerAcquisitionBreakdownMonthly.actions;

export default CustomerAcquisitionBreakdownMonthly.reducer;

const selectCustomerAcquisitionBreakdownMonthly = (state) =>
  state.customerAcquisitionBreakdownMonthly;

export { selectCustomerAcquisitionBreakdownMonthly };
