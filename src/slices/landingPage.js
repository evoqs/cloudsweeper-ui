import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import LandingDataService from "../services/landingPage";

const initialState = [];

export const retrieveUsers = createAsyncThunk(
  "landingPage/retrieve",
  async () => {
    const res = await LandingDataService.getAll();
    return res.data;
  }
);

export const login = createAsyncThunk(
  "landingPage/login",
  async (userInfo) => {
    const res = await LandingDataService.login(userInfo);
    console.log(res.data, "slice")
    return res.data;
  }
);

export const register = createAsyncThunk(
  "landingPage/register",
  async (userInfo) => {
    const res = await LandingDataService.register(userInfo);
    console.log(res.data, "slice..")
    return res.data;
  }
);

const landingPageSlice = createSlice({
  name: "landingPage",
  initialState,
  extraReducers: {
    [retrieveUsers.fulfilled]: (state, action) => {
      return [...action.payload];
    },
    [login.fulfilled]: (state, action) => {
      console.log(action, "reducer")
      return action.payload
    },
    [register.fulfilled]: (state, action) => {
      console.log(action, "reducer")
      return action.payload
    }
  },
});

const { reducer } = landingPageSlice;
export default reducer;