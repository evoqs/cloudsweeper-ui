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

export const retrieveRegions = createAsyncThunk(
  "pipelines/regions",
  async () => {
    const res = await PipelinesService.getRegions();
    return res.data;
  }
)

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
  async({cloudAccID, pipelineName, policies, schedule, execregions, email, enabled}) => {
    console.log(cloudAccID, pipelineName, policies, schedule, execregions, email, enabled)
    const res = await PipelinesService.addPipeline(cloudAccID, pipelineName, policies, schedule, execregions, email, enabled)
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
    },
    [retrieveRegions.fulfilled]: (state, action) => {
      return [...action.payload]
    }
  },
});

const { reducer } = pipelinesSlice;
export default reducer;