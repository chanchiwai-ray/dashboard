import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// import { api_host } from "../../../configs.jsx";

const name = "contacts";

const initialState = {
  value: [],
  success: true,
  message: "Loading",
};

export const getContacts = createAsyncThunk(`${name}/getContacts`, async () => {
  const response = await fetch(``, {
    credentials: "include",
  });
  return response.json();
});

export const putContact = createAsyncThunk(`${name}/putContact`, async (args) => {
  const response = await fetch(``, {
    method: "PUT",
    body: JSON.stringify(args.data),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return response.json();
});

export const postContact = createAsyncThunk(`${name}/postContact`, async (args) => {
  const response = await fetch(``, {
    method: "POST",
    body: JSON.stringify({ ...args.data, userId: args.userId }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return response.json();
});

export const deleteContact = createAsyncThunk(`${name}/deleteContact`, async () => {
  const response = await fetch(``, {
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
      .addCase(getContacts.fulfilled, (state, action) => {
        const data = action.payload;
        state.value = data.payload;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(getContacts.rejected, (state) => {
        state.value = [];
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(putContact.fulfilled, (state, action) => {
        const data = action.payload;
        const index = state.value.findIndex((contact) => contact._id === data.payload._id);
        state.value[index] = data.payload;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(putContact.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(postContact.fulfilled, (state, action) => {
        const data = action.payload;
        state.value.push(data.payload);
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(postContact.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(deleteContact.fulfilled, (state, action) => {
        const data = action.payload;
        state.value = state.value.filter((contact) => contact._id !== data.payload._id);
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(deleteContact.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      });
  },
});

export default slice.reducer;
