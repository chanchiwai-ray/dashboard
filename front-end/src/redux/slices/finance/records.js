import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

import { api_host } from "../../../utils.jsx";

const name = "finance/records";

const initialState = {
  value: { records: [], dailyRecords: [], totals: { monthlyTotal: 0, yearlyTotal: 0 } },
  success: false,
  message: "Loading",
};

export const getRecords = createAsyncThunk(`${name}/getRecords`, async (args) => {
  const response = await fetch(
    `${api_host}/finances/${args.userId}/records${
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

export const putRecords = createAsyncThunk(`${name}/putRecords`, async (args) => {
  const response = await fetch(`${api_host}/finances/${args.userId}/records/${args.id}`, {
    method: "PUT",
    body: JSON.stringify(args.data),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return response.json();
});

export const postRecords = createAsyncThunk(`${name}/postRecords`, async (args) => {
  const response = await fetch(`${api_host}/finances/${args.userId}/records`, {
    method: "POST",
    body: JSON.stringify({ ...args.data, userId: args.userId }),
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  return response.json();
});

export const deleteRecords = createAsyncThunk(`${name}/deleteRecords`, async (args) => {
  const response = await fetch(`${api_host}/finances/${args.userId}/records/${args.id}`, {
    method: "DELETE",
    credentials: "include",
  });
  return response.json();
});

export const getDailyRecords = createAsyncThunk(`${name}/getDailyRecords`, async (args) => {
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

export const getMonthlyExpense = createAsyncThunk(`${name}/getMonthlyExpense`, async (args) => {
  const response = await fetch(
    `${api_host}/finances/${args.userId}/records/total${
      args.query ? "?" + new URLSearchParams(args.query).toString() : ""
    }`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get resource.");
  }
  return response.json();
});

export const getYearlyExpense = createAsyncThunk(`${name}/getYearlyExpense`, async (args) => {
  const response = await fetch(
    `${api_host}/finances/${args.userId}/records/total${
      args.query ? "?" + new URLSearchParams(args.query).toString() : ""
    }`,
    {
      credentials: "include",
    }
  );
  if (!response.ok) {
    throw new Error("Failed to get resource.");
  }
  return response.json();
});

const slice = createSlice({
  name: name,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getRecords.fulfilled, (state, action) => {
        const data = action.payload;
        state.value.records = data.payload;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(getRecords.rejected, (state) => {
        state.value.records = [];
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(putRecords.fulfilled, (state, action) => {
        const data = action.payload;
        const index = state.value.records.findIndex((record) => record._id === data.payload._id);
        state.value.records[index] = data.payload;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(putRecords.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(postRecords.fulfilled, (state, action) => {
        const data = action.payload;
        state.value.records.push(data.payload);
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(postRecords.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(deleteRecords.fulfilled, (state, action) => {
        const data = action.payload;
        state.value.records = state.value.records.filter((record) => record._id !== data._id);
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(deleteRecords.rejected, (state) => {
        state.success = false;
        state.message = "Network Error";
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
      .addCase(getMonthlyExpense.fulfilled, (state, action) => {
        const data = action.payload;
        state.value.totals.monthlyTotal = data.payload;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(getMonthlyExpense.rejected, (state) => {
        state.value.totals.monthlyTotal = 0;
        state.success = false;
        state.message = "Network Error";
      })
      .addCase(getYearlyExpense.fulfilled, (state, action) => {
        const data = action.payload;
        state.value.totals.yearlyTotal = data.payload;
        state.success = data.success;
        state.message = data.message;
      })
      .addCase(getYearlyExpense.rejected, (state) => {
        state.value.totals.yearlyTotal = 0;
        state.success = false;
        state.message = "Network Error";
      });
  },
});

export default slice.reducer;
