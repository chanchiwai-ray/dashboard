import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api_host } from "../../../configs.jsx";

const name = "notes";

const initialState = {
  value: [],
  imageURLs: {},
  success: true,
  message: "Loading",
};

export const getImage = createAsyncThunk(`${name}/getImage`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/notes/images/${args.id}`, {
    credentials: "include",
  });
  return response.json();
});

export const putImage = createAsyncThunk(`${name}/putImage`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/notes/images/${args.id}`, {
    method: "PUT",
    body: args.data,
    credentials: "include",
  });
  return response.json();
});

export const postImage = createAsyncThunk(`${name}/postImage`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/notes/images`, {
    method: "POST",
    body: args.data,
    credentials: "include",
  });
  return response.json();
});

export const deleteImage = createAsyncThunk(`${name}/deleteImage`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/notes/images/${args.id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return response.json();
});

export const getNotes = createAsyncThunk(`${name}/getNotes`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/notes`, {
    credentials: "include",
  });
  return response.json();
});

export const putNote = createAsyncThunk(`${name}/putNote`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/notes/${args.id}`, {
    method: "PUT",
    body: JSON.stringify({ ...args.data }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.json();
});

export const postNote = createAsyncThunk(`${name}/postNote`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/notes`, {
    method: "POST",
    body: JSON.stringify({ ...args.data, userId: args.userId }),
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
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
      .addCase(getImage.fulfilled, (state, action) => {
        const data = action.payload;
        state.imageURLs[data.payload.id] = data.payload.presignedURL;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(getImage.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(putImage.fulfilled, (state, action) => {
        const data = action.payload;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(putImage.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(postImage.fulfilled, (state, action) => {
        const data = action.payload;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(postImage.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(deleteImage.fulfilled, (state, action) => {
        const data = action.payload;
        state.imageURLs[data.payload.id] = undefined;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(deleteImage.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      })
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
