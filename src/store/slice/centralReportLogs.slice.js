import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const centralReportLogsSlice = createSlice({
  initialState: initialState.centralReportLogs,
  name: "centralReportLogs",
  reducers: {
    setCentralReportLogs: (state, action) => {
      state.logsList = action.payload;
    },
  },
});

export const { setCentralReportLogs } = centralReportLogsSlice.actions;

export default centralReportLogsSlice.reducer;

const selectCentralReportLogs = (state) => state.centralReportLogs.logsList;

export { selectCentralReportLogs };
