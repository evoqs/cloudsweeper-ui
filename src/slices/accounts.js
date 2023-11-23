import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AccountsDataService from "../services/accounts";

const initialState = [];

export const retrieveAccounts = createAsyncThunk(
  "accounts/list",
  async () => {
    const res = await AccountsDataService.getAll();
    return res.data;
  }
);

export const addAccount = createAsyncThunk(
  "accounts/",
  async ({accounttype, description, aws_access_key_id, aws_secret_access_key, aws_region}) => {
    console.log("in slices", accounttype, description, aws_access_key_id, aws_secret_access_key, aws_region)
    const res = await AccountsDataService.addAccount(accounttype, description, aws_access_key_id, aws_secret_access_key, aws_region);
    return res.data;
  }
);

export const deleteAccount = createAsyncThunk(
  "accounts/",
  async ({id}) => {
    const res = await AccountsDataService.deleteAccount(id);
    return res.data;
  }
);

const accountsPageSlice = createSlice({
  name: "accounts",
  initialState,
  extraReducers: {
    [retrieveAccounts.fulfilled]: (state, action) => {
      return [...action.payload];
    },
    [addAccount.fulfilled]: (state, action) => {
      return [...action.payload];
    }    
  },
});

const { reducer } = accountsPageSlice;
export default reducer;