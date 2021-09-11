import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api_host } from "../../../configs.jsx";

const name = "common/authenticate";

const initialState = {
  value: { userId: null, authenticated: false, redirect: "/login" },
  success: false,
  message: "Loading",
};

export const verify = createAsyncThunk(`${name}/verify`, async () => {
  const response = await fetch(`${api_host}/authenticate/verify`, {
    credentials: "include",
  });
  return response.json();
});

export const login = createAsyncThunk(`${name}/login`, async (args) => {
  const response = await fetch(`${api_host}/authenticate/login`, {
    method: "POST",
    body: JSON.stringify(args.data),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return response.json();
});

export const logout = createAsyncThunk(`${name}/logout`, async () => {
  const response = await fetch(`${api_host}/authenticate/logout`, {
    credentials: "include",
  });
  return response.json();
});

export const signup = createAsyncThunk(`${name}/signup`, async (args) => {
  const response = await fetch(`${api_host}/authenticate/signup`, {
    method: "POST",
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
      .addCase(verify.fulfilled, (state, action) => {
        const data = action.payload;
        if (data.success) {
          state.value = { userId: data.payload, authenticated: true, redirect: "/home" };
        } else {
          state.value = { userId: null, authenticated: false, redirect: "/login" };
        }
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(verify.rejected, (state) => {
        state.value = { userId: null, authenticated: false, redirect: "/login" };
        state.success = false;
        state.message = "Network Error.";
      })
      .addCase(login.fulfilled, (state, action) => {
        const data = action.payload;
        if (data.success) {
          state.value = { userId: data.payload, authenticated: true, redirect: "/home" };
        } else {
          state.value = { userId: null, authenticated: false, redirect: "/login" };
        }
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(login.rejected, (state) => {
        state.value = { userId: null, authenticated: false, redirect: "/login" };
        state.success = false;
        state.message = "Network Error.";
      })
      .addCase(logout.fulfilled, (state, action) => {
        const data = action.payload;
        state.value = { userId: null, authenticated: false, redirect: "/login" };
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(logout.rejected, (state) => {
        state.value = { userId: null, authenticated: false, redirect: "/login" };
        state.success = false;
        state.message = "Network Error.";
      })
      .addCase(signup.fulfilled, (state, action) => {
        const data = action.payload;
        if (data.success) {
          state.value = { userId: data.payload, authenticated: true, redirect: "/home" };
        } else {
          state.value = { userId: null, authenticated: false, redirect: "/login" };
        }
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(signup.rejected, (state) => {
        state.value = { userId: null, authenticated: false, redirect: "/login" };
        state.success = false;
        state.message = "Network Error.";
      });
  },
});

export default slice.reducer;
