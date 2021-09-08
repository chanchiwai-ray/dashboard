import { configureStore } from "@reduxjs/toolkit";

import recordsReducer from "../slices/finance/records.js";
import categoriesReducer from "../slices/finance/categories.js";

export const store = configureStore({
  reducer: {
    records: recordsReducer,
    categories: categoriesReducer,
  },
});

export const selectRecords = (state) => state.records;
export const selectCategories = (state) => state.categories;
