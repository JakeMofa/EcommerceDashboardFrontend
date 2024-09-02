import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const shipping = createSlice({
  initialState: initialState.shipping,
  name: "shipping",
  reducers: {
    setShippingList: (state, action) => {
      state.shippingList = action.payload;
    },
  },
});

export const { setShippingList } = shipping.actions;

export default shipping.reducer;

const selectShippingList = (state) => state.shipping.shippingList;

export { selectShippingList };
