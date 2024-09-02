import { createSlice, current } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const ASINsAndSKUsListSlice = createSlice({
  initialState: initialState.asinAndSkuList,
  name: "asinAndSkuList",
  reducers: {
    setSkuList: (state, action) => {
      state.sku = action.payload;
    },
    removeSkuFromList: (state, { payload }) => {
      state.sku.list = current(state).sku.list.filter((a) => a != payload);
    },
    setAsinList: (state, action) => {
      state.asin = action.payload;
    },
  },
});

export const { setSkuList, removeSkuFromList, setAsinList } =
  ASINsAndSKUsListSlice.actions;

export default ASINsAndSKUsListSlice.reducer;

export const selectSkuList = (state) => state.asinAndSkuList.sku;
export const selectAsinList = (state) => state.asinAndSkuList.asin;
