import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

const inventoryDashboardSlice = createSlice({
  initialState: initialState.inventoryDashboard,
  name: "inventoryDashboard",
  reducers: {
    setInventoryDashboard: (state, action) => {
      state.inventoryDashboard = action.payload;
    },
  },
});

export const { setInventoryDashboard } = inventoryDashboardSlice.actions;

const selectInventoryDashboard = (state) => state.inventoryDashboard;

export { selectInventoryDashboard };

export default inventoryDashboardSlice.reducer;
