import { createSlice, current } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const planningSlice = createSlice({
  initialState: initialState.planning,
  name: "planning",
  reducers: {
    setInventoryPlaning: (state, action) => {
      state.inventoryPlaning = action.payload;
    },
    setInventoryPlaningColumnsList: (state, action) => {
      state.inventoryPlaningColumnsList = action.payload;
    },
    setInventoryPlaningColumnsSave: (state, action) => {
      state.inventoryPlaningColumnsSave = action.payload;
    },
    setUpdateInventoryPlaning: (state, { payload }) => {
      const result = current(state).inventoryPlaning.data.reduce(
        (acc, item) => {
          if (item.asin === payload.asin) {
            acc.push({
              ...item,
              on_hand: payload.on_hand,
              inventory_multiplier: payload.multiplier,
            });
          } else {
            acc.push(item);
          }
          return acc;
        },
        []
      );
      state.inventoryPlaning.data = result;
    },
  },
});

export const {
  setInventoryPlaning,
  setInventoryPlaningColumnsList,
  setInventoryPlaningColumnsSave,
  setUpdateInventoryPlaning,
} = planningSlice.actions;

export default planningSlice.reducer;

const selectInventoryPlanningList = (state) =>
  state.planning.inventoryPlaning || {};
const selectInventoryPlanningColumnList = (state) =>
  state.planning.inventoryPlaningColumnsList || {};
const selectInventoryPlanningColumnSave = (state) =>
  state.planning.inventoryPlaningColumnsSave || {};

export {
  selectInventoryPlanningList,
  selectInventoryPlanningColumnList,
  selectInventoryPlanningColumnSave,
};
