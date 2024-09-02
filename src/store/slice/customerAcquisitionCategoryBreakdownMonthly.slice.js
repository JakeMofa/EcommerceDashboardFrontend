import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const CustomerAcquisitionCategoryBreakdownMonthly = createSlice({
  initialState: initialState.customerAcquisitionCategoryBreakdownMonthly,
  name: "customerAcquisitionCategoryBreakdownMonthly",
  reducers: {
    setCustomerAcquisitionCategoryBreakdownMonthly: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

export const { setCustomerAcquisitionCategoryBreakdownMonthly } =
  CustomerAcquisitionCategoryBreakdownMonthly.actions;

export default CustomerAcquisitionCategoryBreakdownMonthly.reducer;

const selectCustomerAcquisitionCategoryBreakdownMonthly = (state) =>
  state.customerAcquisitionCategoryBreakdownMonthly;

export { selectCustomerAcquisitionCategoryBreakdownMonthly };
