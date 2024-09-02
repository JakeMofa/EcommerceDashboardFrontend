import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const poTemplateSlice = createSlice({
  initialState: initialState.poTemplate,
  name: "poTemplate",
  reducers: {
    setPoTemplateList: (state, action) => {
      state.poTemplateList = action.payload;
    },
  },
});

export const { setPoTemplateList } = poTemplateSlice.actions;

export default poTemplateSlice.reducer;
