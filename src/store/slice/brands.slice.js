import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const brandsSlice = createSlice({
  initialState: initialState.brands,
  name: "brands",
  reducers: {
    setBrandList: (state, action) => {
      state.brandList = action.payload;
    },
    setUserBrandList: (state, action) => {
      state.userBrandList = action.payload;
    },
    setAmazonSpApiCredentialsList: (state, action) => {
      state.amazonSpApiCredentials = action.payload;
    },
    setAmazonAdvertisingCredentialsList: (state, action) => {
      state.amazonAdvertisingCredentials = action.payload;
    },
  },
});

export const {
  setBrandList,
  setUserBrandList,
  setAmazonSpApiCredentialsList,
  setAmazonAdvertisingCredentialsList,
} = brandsSlice.actions;

export default brandsSlice.reducer;

const selectBrandList = (state) => state.brands.brandList;
const selectUserBrandList = (state) => state.brands.userBrandList;
const selectAmazonSpApiCredentialsList = (state) =>
  state.brands.amazonSpApiCredentials;
const selectAmazonAdvertisingCredentialsList = (state) =>
  state.brands.amazonAdvertisingCredentials;

export {
  selectBrandList,
  selectUserBrandList,
  selectAmazonSpApiCredentialsList,
  selectAmazonAdvertisingCredentialsList,
};
