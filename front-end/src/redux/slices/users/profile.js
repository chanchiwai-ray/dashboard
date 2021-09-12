import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api_host } from "../../../configs.jsx";

const name = "user/profile";

const initialState = {
  value: {
    nickname: "Your Name or Nick Name",
    jobTitle: "Job Title",
    profilePicture: "",
    coverPicture: "",
    firstname: "",
    lastname: "",
    email: "",
    mobile: "",
    address: "",
    city: "",
    country: "",
    zipcode: "",
    github: "",
    linkedin: "",
    website: "",
  },
  success: false,
  message: "Loading",
};

export const getProfile = createAsyncThunk(`${name}/getProfile`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/profile`, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Failed to fetch resource.");
  }
  return response.json();
});

export const putProfile = createAsyncThunk(`${name}/putProfile`, async (args) => {
  const response = await fetch(`${api_host}/users/${args.userId}/profile`, {
    method: "PUT",
    body: JSON.stringify(args.data),
    headers: { "Content-Type": "application/json" },
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
      .addCase(getProfile.fulfilled, (state, action) => {
        const data = action.payload;
        if (data.success) {
          state.value = data.payload;
        } else {
          state.value = { ...initialState };
        }
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(getProfile.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(putProfile.fulfilled, (state, action) => {
        const data = action.payload;
        if (data.success) {
          state.value = data.payload;
        } else {
          state.value = { ...initialState };
        }
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(putProfile.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      });
  },
});

export default slice.reducer;
