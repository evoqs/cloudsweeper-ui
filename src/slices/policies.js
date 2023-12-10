import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import PoliciesService from "../services/policies";

const initialState = [];

export const retrievePolicies = createAsyncThunk(
  "policies/list",
  async () => {
    const res = await PoliciesService.getAll();
    return res.data;
  }
);

export const retrievePolicyStructure = createAsyncThunk(
  "policies/policyStructure",
  async () => {
    const res = await PoliciesService.getPolicyStructure();
    return res.data;
  }
);

export const deletePolicy = createAsyncThunk(
  "policies/delete",
  async ({id}) => {
    console.log("Deleting policy", id)
    const res = await PoliciesService.deletePolicy(id);
    return res.data;
  }
);

export const addPolicy = createAsyncThunk(
  "policies/add",
  async({policyName, definition}) => {
    console.log(policyName, definition)
    const res = await PoliciesService.addPolicy(policyName, definition)
    return res.data
  }

)

const policiesSlice = createSlice({
  name: "policies",
  initialState,
  extraReducers: {
    [retrievePolicies.fulfilled]: (state, action) => {
      return [...action.payload];
    },
    [retrievePolicyStructure.fulfilled]: (state, action) => {
      return [...action.payload]
    },
    [addPolicy.fulfilled]: (state, action) => {
      return [...action.payload]
    }
  },
});

const { reducer } = policiesSlice;
export default reducer;