import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PipelinesService from "../services/pipelines";

const initialState = [];

export const retrievePipelines = createAsyncThunk(
  "pipelines/list",
  async () => {
    const res = await PipelinesService.getAll();
    return res.data;
  }
);

export const retrievePolicyStructure = createAsyncThunk(
  "pipelines/policyStructure",
  async () => {
    const res = await PipelinesService.getPolicyStructure();
    return res.data;
  }
);

export const deletePipeline = createAsyncThunk(
  "pipelines/delete",
  async ({id}) => {
    console.log("Deleting ", id)
    const res = await PipelinesService.deletePipeline(id);
    return res.data;
  }
);

export const addPipeline = createAsyncThunk(
  "pipelines/add",
  async({accountid, cloudAccID, pipelineName, policies, schedule, execregions, enabled}) => {
    console.log(accountid, cloudAccID, pipelineName, policies, schedule, execregions, enabled)
    const res = await PipelinesService.addPipeline(accountid, cloudAccID, pipelineName, policies, schedule, execregions, enabled)
    return res.data
  }

)

const pipelinesSlice = createSlice({
  name: "pipelines",
  initialState,
  extraReducers: {
    [retrievePipelines.fulfilled]: (state, action) => {
      return [...action.payload];
    },
    [retrievePolicyStructure.fulfilled]: (state, action) => {
      return [...action.payload]
    }
  },
});

const { reducer } = pipelinesSlice;
export default reducer;