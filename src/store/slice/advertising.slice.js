import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const advertisingSlice = createSlice({
  initialState: initialState.advertising,
  name: "advertising",
  reducers: {
    setLastWeekKPIsData: (state, action) => {
      state.lastWeekKPIs = action.payload;
    },
    setYearToDayKPIsData: (state, action) => {
      state.yearToDayKPIs = action.payload;
    },
    setAdvertisementsData: (state, action) => {
      state.advertisements = action.payload;
    },
    setGraphData: (state, action) => {
      state.graphData = action.payload;
    },
    setCampaignData: (state, action) => {
      state.campaignData = action.payload;
    },
  },
});

export const {
  setLastWeekKPIsData,
  setYearToDayKPIsData,
  setAdvertisementsData,
  setGraphData,
  setCampaignData,
} = advertisingSlice.actions;

export default advertisingSlice.reducer;

const selectLastWeekKPIs = (state) => state.advertising.lastWeekKPIs;
const selectYearToDayKPIs = (state) => state.advertising.yearToDayKPIs;
const selectAdvertisements = (state) => state.advertising.advertisements;
const selectAdvertisementGraphData = (state) => state.advertising.graphData;
const selectAdvertisementCampaignData = (state) =>
  state.advertising.campaignData;

export {
  selectAdvertisementCampaignData,
  selectLastWeekKPIs,
  selectYearToDayKPIs,
  selectAdvertisements,
  selectAdvertisementGraphData,
};
