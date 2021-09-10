import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../slices/common/auth.js";
import datesReducer from "../slices/common/dates.js";
import profileReducer from "../slices/user/profile.js";
import settingsReducer from "../slices/common/settings.js";
import recordsReducer from "../slices/finance/records.js";
import categoriesReducer from "../slices/finance/categories.js";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    dates: datesReducer,
    profile: profileReducer,
    settings: settingsReducer,
    records: recordsReducer,
    categories: categoriesReducer,
  },
});

export const selectAuth = (state) => state.auth;
export const selectDates = (state) => state.dates;
export const selectProfile = (state) => state.profile;
export const selectSettings = (state) => state.settings;
export const selectRecords = (state) => state.records;
export const selectCategories = (state) => state.categories;
