import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const CustomerAcquisitionCategoryBreakdownWeekly = createSlice({
  initialState: initialState.customerAcquisitionCategoryBreakdownWeekly,
  name: "customerAcquisitionCategoryBreakdownWeekly",
  reducers: {
    setCustomerAcquisitionCategoryBreakdownWeekly: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

export const { setCustomerAcquisitionCategoryBreakdownWeekly } =
  CustomerAcquisitionCategoryBreakdownWeekly.actions;

export default CustomerAcquisitionCategoryBreakdownWeekly.reducer;

const selectCustomerAcquisitionCategoryBreakdownWeekly = (state) =>
  state.customerAcquisitionCategoryBreakdownWeekly;

export { selectCustomerAcquisitionCategoryBreakdownWeekly };
