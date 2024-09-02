import { createSlice } from "@reduxjs/toolkit";
import initialState from "../initialState";

export const usersSlice = createSlice({
  initialState: initialState.users,
  name: "users",
  reducers: {
    setUserList: (state, action) => {
      state.userList = action.payload;
    },
    setSwitchUser: (state, action) => {
      state.switchUser = action.payload;
    },
  },
});

export const { setUserList, setSwitchUser } = usersSlice.actions;

export default usersSlice.reducer;

const selectUserList = (state) => state.users.userList;

export { selectUserList };
