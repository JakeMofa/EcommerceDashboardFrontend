import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const inventoryRestockReportSlice = createSlice({
  initialState: initialState.centralReportLogs,
  name: "inventoryRestockReport",
  reducers: {
    setInventoryRestockReport: (state, action) => {
      state.list = action.payload;
    },
  },
});

export const { setInventoryRestockReport } =
  inventoryRestockReportSlice.actions;

export default inventoryRestockReportSlice.reducer;

const selectInventoryRestockReport = (state) =>
  state.inventoryRestockReport.list;

export { selectInventoryRestockReport };
