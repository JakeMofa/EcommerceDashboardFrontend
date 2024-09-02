import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const reportLogsSlice = createSlice({
  initialState: initialState.reportLogs,
  name: "reportLogs",
  reducers: {
    setReportLogs: (state, action) => {
      state.reportLogsData = action.payload;
    },
    setReportLogsSummary: (state, action) => {
      state.reportLogsSummary = action.payload;
    },
  },
});

export const { setReportLogs, setReportLogsSummary } = reportLogsSlice.actions;

export default reportLogsSlice.reducer;

const selectReportLogs = (state) => state.reportLogs.reportLogsData;
const selectReportLogsSummary = (state) => state.reportLogs.reportLogsSummary;

export { selectReportLogs, selectReportLogsSummary };
