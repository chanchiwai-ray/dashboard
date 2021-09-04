import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api_host } from "../../utils.jsx";

export default function createNamedSlice(namespace = "1") {
  const initialState = {
    value: { dailyRecords: [], categories: [] },
    success: false,
    message: "Loading",
  };

  const getDailyRecords = createAsyncThunk(`chart:${namespace}/getDailyRecords`, async (args) => {
    const response = await fetch(
      `${api_host}/finances/${args.userId}/records/daily${
        args.query ? "?" + new URLSearchParams(args.query).toString() : ""
      }`,
      {
        credentials: "include",
      }
    );
    if (!response.ok) {
      throw new Error("Failed to fetch resource.");
    }
    return response.json();
  });

  const getCategories = createAsyncThunk(`chart:${namespace}/getCategories`, async (args) => {
    const response = await fetch(`${api_host}/finances/${args.userId}/categories`, {
      credentials: "include",
    });
    if (!response.ok) {
      throw new Error("Failed to fetch resource.");
    }
    return response.json();
  });

  const slice = createSlice({
    name: `chart:${namespace}`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(getDailyRecords.pending, (state) => {
          (state.value = { dailyRecords: [], categories: [] }), (state.success = false);
          state.message = "Loading";
        })
        .addCase(getDailyRecords.fulfilled, (state, action) => {
          const data = action.payload;
          state.value.dailyRecords = data.payload;
          state.success = data.success;
          state.message = data.message;
        })
        .addCase(getDailyRecords.rejected, (state) => {
          (state.value = { dailyRecords: [], categories: [] }), (state.success = false);
          state.message = "Network Error";
        })
        .addCase(getCategories.pending, (state) => {
          (state.value = { dailyRecords: [], categories: [] }), (state.success = false);
          state.message = "Loading";
        })
        .addCase(getCategories.fulfilled, (state, action) => {
          const data = action.payload;
          state.value.categories = data.payload;
          state.success = data.success;
          state.message = data.message;
        })
        .addCase(getCategories.rejected, (state) => {
          (state.value = { dailyRecords: [], categories: [] }), (state.success = false);
          state.message = "Network Error";
        });
    },
  });

  const selector = (state) => state[namespace];

  return {
    reducer: slice.reducer,
    selector: selector,
    actions: slice.actions,
    extraActions: { getDailyRecords: getDailyRecords, getCategories: getCategories },
  };
}
