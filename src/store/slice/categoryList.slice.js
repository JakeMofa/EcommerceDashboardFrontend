import { createSlice, current } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const CategoryListSlice = createSlice({
  initialState: initialState.categoryList,
  name: "categoryList",
  reducers: {
    setCategoryList: (state, action) => {
      state = { ...state, ...action.payload };
      return state;
    },
    setCategoryNoBrandRelatedList: (state, action) => {
      state = {
        ...state,
        noBrandRelated: {
          ...state.noBrandRelated,
          ...action.payload,
        },
      };
      return state;
    },
    setCategorySpecificBrandList: (state, action) => {
      state = {
        ...state,
        categorySpecificBrand: {
          ...state.categorySpecificBrand,
          ...action.payload,
        },
      };
      return state;
    },
    setUpdateCategory: (state, { payload }) => {
      const result = current(state).data.reduce((acc, item) => {
        if (item.id === payload.parent_id) {
          acc.push({
            ...item,
            subcategories: item.subcategories.map((m) =>
              m.id === payload.id ? payload : m
            ),
          });
        } else if (item.id === payload.id) {
          acc.push(payload);
        } else {
          acc.push(item);
        }
        return acc;
      }, []);
      state.data = result;
    },
  },
});

export const {
  setCategoryList,
  setUpdateCategory,
  setCategoryNoBrandRelatedList,
  setCategorySpecificBrandList,
} = CategoryListSlice.actions;

export default CategoryListSlice.reducer;

const selectCategoryList = (state) => state.categoryList;
const selectBrandCategoryList = (state,id) => state.categoryList.categorySpecificBrand?.data?.[id];

export { selectCategoryList,selectBrandCategoryList };
