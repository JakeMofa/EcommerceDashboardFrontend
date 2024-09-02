import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const advertisingTotalRevenueSlice = createSlice({
  initialState: initialState.advertisingTotalRevenue,
  name: "advertisingTotalRevenue",
  reducers: {
    setAdvertisingTotalRevenue: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setAdvertisingTotalRevenue } =
  advertisingTotalRevenueSlice.actions;

export default advertisingTotalRevenueSlice.reducer;

const selectAdvertisingTotalRevenue = (state) =>
  state.advertisingTotalRevenue.list;

export { selectAdvertisingTotalRevenue };
