import { configureStore } from "@reduxjs/toolkit";

import storage from "redux-persist/lib/storage";
import thunk from "redux-thunk";
import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";

import authReducer from "../slices/common/auth.js";
import tasksReducer from "../slices/tasks/index.js";
import notesReducer from "../slices/notes/index.js";
import profileReducer from "../slices/users/profile.js";
import contactsReducer from "../slices/contacts/index.js";
import settingsReducer from "../slices/common/settings.js";
import recordsReducer from "../slices/finance/records.js";
import categoriesReducer from "../slices/finance/categories.js";
import autoMergeLevel1 from "redux-persist/es/stateReconciler/autoMergeLevel1";

const rootReducer = combineReducers({
  auth: authReducer,
  tasks: tasksReducer,
  notes: notesReducer,
  profile: profileReducer,
  contacts: contactsReducer,
  settings: settingsReducer,
  records: recordsReducer,
  categories: categoriesReducer,
});

const persistConfig = {
  key: "root",
  storage,
  stateReconciler: autoMergeLevel1,
  whitelist: ["auth", "settings"],
};

const persistingReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistingReducer,
  middleware: [thunk], // required by redux-persist
});

export const selectAuth = (state) => state.auth;
export const selectTasks = (state) => state.tasks;
export const selectNotes = (state) => state.notes;
export const selectProfile = (state) => state.profile;
export const selectContacts = (state) => state.contacts;
export const selectSettings = (state) => state.settings;
export const selectRecords = (state) => state.records;
export const selectCategories = (state) => state.categories;
