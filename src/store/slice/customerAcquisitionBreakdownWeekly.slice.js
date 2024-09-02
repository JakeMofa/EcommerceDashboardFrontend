import { createSlice, current } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const CustomerAcquisitionBreakdownWeekly = createSlice({
  initialState: initialState.customerAcquisitionBreakdownWeekly,
  name: "customerAcquisitionBreakdownWeekly",
  reducers: {
    setCustomerAcquisitionBreakdownWeekly: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

export const {
  setCustomerAcquisitionBreakdownWeekly,
} = CustomerAcquisitionBreakdownWeekly.actions;

export default CustomerAcquisitionBreakdownWeekly.reducer;

const selectCustomerAcquisitionBreakdownWeekly = (state) =>
  state.customerAcquisitionBreakdownWeekly;

export { selectCustomerAcquisitionBreakdownWeekly };
