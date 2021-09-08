import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api_host } from "../../../utils.jsx";

const name = "finance/categories";

const initialState = {
  value: [],
  success: false,
  message: "Loading",
};

export const getCategories = createAsyncThunk(`${name}/getCategories`, async (args) => {
  const response = await fetch(`${api_host}/finances/${args.userId}/categories`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch resource.");
  }
  return response.json();
});

const slice = createSlice({
  name: name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getCategories.fulfilled, (state, action) => {
        const data = action.payload;
        state.value = data.payload;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(getCategories.rejected, (state) => {
        state.value = [];
        state.success = false;
        state.message = "Network Error";
      });
  },
});

export default slice.reducer;
