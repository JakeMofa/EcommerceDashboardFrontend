import { message } from "antd";
import {
  fetchAdvertising,
  fetchCampaignData,
  fetchGraphData,
} from "../api/advertising.api";
import {
  setLastWeekKPIsData,
  setYearToDayKPIsData,
  setAdvertisementsData,
  setGraphData,
  selectAdvertisementGraphData,
  setCampaignData,
  selectAdvertisementCampaignData,
} from "../store/slice/advertising.slice";
import initialState from "../store/initialState";

export const getAdvertising = (data) => {
  return (dispatch) => {
    fetchAdvertising(data)
      .then((res) => {
        if (res.status == 200 && res.data) {
          dispatch(
            setLastWeekKPIsData({ status: true, data: res.data.lastWeekKPIs })
          );
          dispatch(
            setYearToDayKPIsData({ status: true, data: res.data.yearToDayKPIs })
          );
          dispatch(
            setAdvertisementsData({
              status: true,
              data: res.data.advertisingData,
            })
          );
        } else {
          message.error("No data available yet.");
          dispatch(
            setLastWeekKPIsData({
              ...initialState.advertising.lastWeekKPIs,
              status: false,
            })
          );
          dispatch(
            setYearToDayKPIsData({
              ...initialState.advertising.yearToDayKPIs,
              status: false,
            })
          );
          dispatch(
            setAdvertisementsData({
              ...initialState.advertising.advertisements,
              status: false,
            })
          );
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};

export const getGraphData = (data) => {
  return (dispatch, store) => {
    const state = selectAdvertisementGraphData(store());
    dispatch(setGraphData({ ...state, status: true }));
    fetchGraphData(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setGraphData({ status: false, data: res.data }));
        } else {
          message.error("No data available yet.");
          dispatch(
            setGraphData({
              ...initialState.advertising.graphData,
              status: false,
            })
          );
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};

export const getCampaignData = (data) => {
  return (dispatch, store) => {
    const state = selectAdvertisementCampaignData(store());
    const hasData = state.data.length > 0;
    if (!hasData) {
      dispatch(setCampaignData({ ...state, status: true }));
    }
    fetchCampaignData(data)
      .then((res) => {
        if (res.status === 200 && res.data) {
          dispatch(setCampaignData({ status: false, data: res.data }));
        } else {
          message.error("No data available yet.");
          dispatch(
            setCampaignData({
              ...initialState.advertising.graphData,
              status: false,
            })
          );
        }
      })
      .catch((err) => {
        if (err?.response?.status !== 401) {
          message.error(err?.response?.message || "Something Went Wrong.");
        }
      });
  };
};
