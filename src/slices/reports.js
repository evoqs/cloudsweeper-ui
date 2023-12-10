import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import ReportsService from "../services/reports";

const initialState = [];

export const retrieveReports = createAsyncThunk(
  "reports/get",
  async (data) => {
    const res = await ReportsService.getReports(data.pipelineID);
    return res.data;
  }
);


const reportsPageSlice = createSlice({
  name: "reports",
  initialState,
  extraReducers: {
    [retrieveReports.fulfilled]: (state, action) => {
      return [...action.payload];
    }
  },
});

const { reducer } = reportsPageSlice;
export default reducer;