import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api_host } from "../../../configs.jsx";

const name = "tasks";

const initialState = {
  value: [],
  success: true,
  message: "Loading",
};

export const getTasks = createAsyncThunk(`${name}/getTasks`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/tasks`, {
    credentials: "include",
  });
  return response.json();
});

export const putTask = createAsyncThunk(`${name}/putTask`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/tasks/${args.id}`, {
    method: "PUT",
    body: JSON.stringify(args.data),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return response.json();
});

export const postTask = createAsyncThunk(`${name}/postTask`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/tasks`, {
    method: "POST",
    body: JSON.stringify({ ...args.data, userId: args.userId }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return response.json();
});

export const deleteTask = createAsyncThunk(`${name}/deleteTask`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/tasks/${args.id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return response.json();
});

const slice = createSlice({
  name: name,
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.fulfilled, (state, action) => {
        const data = action.payload;
        state.value = data.payload;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(getTasks.rejected, (state) => {
        state.value = [];
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(putTask.fulfilled, (state, action) => {
        const data = action.payload;
        const index = state.value.findIndex((task) => task._id === data.payload._id);
        state.value[index] = data.payload;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(putTask.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(postTask.fulfilled, (state, action) => {
        const data = action.payload;
        state.value.push(data.payload);
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(postTask.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        const data = action.payload;
        state.value = state.value.filter((task) => task._id !== data.payload._id);
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(deleteTask.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      });
  },
});

export default slice.reducer;
