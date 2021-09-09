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

export const postCategories = createAsyncThunk(`${name}/postCategories`, async (args) => {
  const response = await fetch(`${api_host}/finances/${args.userId}/categories`, {
    method: "POST",
    body: JSON.stringify({ ...args.data, userId: args.userId }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return response.json();
});

export const deleteCategories = createAsyncThunk(`${name}/putCategories`, async (args) => {
  const response = await fetch(`${api_host}/finances/${args.userId}/categories/${args.id}`, {
    method: "DELETE",
    credentials: "include",
  });
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
      })
      .addCase(postCategories.fulfilled, (state, action) => {
        const data = action.payload;
        state.value.push(data.payload);
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(postCategories.rejected, (state) => {
        state.value = [];
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(deleteCategories.fulfilled, (state, action) => {
        const data = action.payload;
        state.value = state.value.filter((category) => category._id !== data.payload._id);
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(deleteCategories.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      });
  },
});

export default slice.reducer;
