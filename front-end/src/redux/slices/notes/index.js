import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api_host } from "../../../configs.jsx";

const name = "notes";

const initialState = {
  value: [],
  success: true,
  message: "Loading",
};

export const getNotes = createAsyncThunk(`${name}/getNotes`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/notes`, {
    credentials: "include",
  });
  return response.json();
});

export const putNote = createAsyncThunk(`${name}/putNote`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/notes/${args.id}`, {
    method: "PUT",
    body: args.data,
    credentials: "include",
  });
  return response.json();
});

export const postNote = createAsyncThunk(`${name}/postNote`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/notes`, {
    method: "POST",
    body: args.data,
    credentials: "include",
  });
  return response.json();
});

export const deleteNote = createAsyncThunk(`${name}/deleteNote`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/notes/${args.id}`, {
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
      .addCase(getNotes.fulfilled, (state, action) => {
        const data = action.payload;
        state.value = data.payload;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(getNotes.rejected, (state) => {
        state.value = [];
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(putNote.fulfilled, (state, action) => {
        const data = action.payload;
        const index = state.value.findIndex((note) => note._id === data.payload._id);
        state.value[index] = data.payload;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(putNote.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(postNote.fulfilled, (state, action) => {
        const data = action.payload;
        state.value.push(data.payload);
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(postNote.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        const data = action.payload;
        state.value = state.value.filter((note) => note._id !== data.payload._id);
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(deleteNote.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      });
  },
});

export default slice.reducer;
