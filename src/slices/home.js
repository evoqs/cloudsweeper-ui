import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import HomeDataService from "../services/home";

const initialState = [];

export const userProfile = createAsyncThunk(
  "home/profile",
  async () => {
    const res = await HomeDataService.userProfile();
    return res.data;
  }
);

const homeSlice = createSlice({
  name: "home",
  initialState,
  extraReducers: {
    [userProfile.fulfilled]: (state, action) => {
      return action.payload
    }
  },
});

const { reducer } = homeSlice;
export default reducer;