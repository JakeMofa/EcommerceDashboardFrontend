import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const CustomerAcquisitionWeeklySlice = createSlice({
  initialState: initialState.customerAcquisitionWeekly,
  name: "customerAcquisitionWeekly",
  reducers: {
    setCustomerAcquisitionWeekly: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
  },
});

export const { setCustomerAcquisitionWeekly } = CustomerAcquisitionWeeklySlice.actions;

export default CustomerAcquisitionWeeklySlice.reducer;

const selectCustomerAcquisitionWeekly = (state) => state.customerAcquisitionWeekly;

export { selectCustomerAcquisitionWeekly };
