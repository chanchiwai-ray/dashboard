import { createSlice } from "@reduxjs/toolkit";

const name = "common/settings";

const initialState = {
  currentPage: undefined,
};

const slice = createSlice({
  name: name,
  initialState,
  reducers: {
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setCurrentPage } = slice.actions;
export default slice.reducer;
