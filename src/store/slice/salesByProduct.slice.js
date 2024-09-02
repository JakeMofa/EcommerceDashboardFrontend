import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const salesByProductSlice = createSlice({
  initialState: initialState.salesByProduct,
  name: "salesByProduct",
  reducers: {
    setSalesByProductList: (state, action) => {
      state.salesByProductList = action.payload;
    },
  },
});

export const { setSalesByProductList } = salesByProductSlice.actions;

export default salesByProductSlice.reducer;

const selectSalesByProductList = (state) =>
  state.salesByProduct.salesByProductList;

export { selectSalesByProductList };
