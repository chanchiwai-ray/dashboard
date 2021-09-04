import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import { api_host } from "../../utils.jsx";

export default function createNamedSlice(namespace = "1") {
  const initialState = {
    value: 0,
    success: false,
    message: "Loading",
  };

  const fetchTotalExpense = createAsyncThunk(
    `summaryCard:${namespace}/fetchTotalExpense`,
    async (args) => {
      const response = await fetch(
        `${api_host}/finances/${args.userId}/records/total${
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
    }
  );

  const slice = createSlice({
    name: `summaryCard:${namespace}`,
    initialState,
    reducers: {},
    extraReducers: (builder) => {
      builder
        .addCase(fetchTotalExpense.pending, (state) => {
          (state.value = 0), (state.success = false);
          state.message = "Loading";
        })
        .addCase(fetchTotalExpense.fulfilled, (state, action) => {
          const data = action.payload;
          state.value = data.payload;
          state.success = data.success;
          state.message = data.message;
        })
        .addCase(fetchTotalExpense.rejected, (state) => {
          (state.value = 0), (state.success = false);
          state.message = "Network Error";
        });
    },
  });

  const selector = (state) => state[namespace];

  return {
    reducer: slice.reducer,
    selector: selector,
    actions: slice.actions,
    extraActions: { fetchTotalExpense: fetchTotalExpense },
  };
}
