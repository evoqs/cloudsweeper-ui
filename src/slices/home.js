import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import HomeDataService from "../services/home";

const initialState = [];

export const retrieveUsers = createAsyncThunk(
  "home/retrieve",
  async () => {
    const res = await HomeDataService.getAll();
    return res.data;
  }
);

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
    [retrieveUsers.fulfilled]: (state, action) => {
      return [...action.payload];
    },
    [userProfile.fulfilled]: (state, action) => {
      return [...action.payload]
    }
  },
});

const { reducer } = homeSlice;
export default reducer;