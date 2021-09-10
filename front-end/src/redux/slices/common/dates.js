import { createSlice } from "@reduxjs/toolkit";

const name = "common/dates";

const generate = (date) => {
  const dateArray = [];
  const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
  const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  while (startDate < endDate) {
    dateArray.push(Date.parse(new Date(startDate)));
    startDate.setDate(startDate.getDate() + 1);
    startDate.setHours(23);
    startDate.setMinutes(59);
    startDate.setSeconds(59);
  }
  return dateArray;
};

const initialState = {
  value: generate(new Date()),
};

const slice = createSlice({
  name: name,
  initialState,
  reducers: {
    nextMonth: (state) => {
      const date = new Date(Number(state.value[0]));
      state.value = generate(new Date(date.getFullYear(), date.getMonth() + 1));
    },
    prevMonth: (state) => {
      const date = new Date(Number(state.value[0]));
      state.value = generate(new Date(date.getFullYear(), date.getMonth() - 1));
    },
    resetMonth: (state) => {
      state.value = generate(new Date());
    },
  },
});

export const { prevMonth, resetMonth, nextMonth } = slice.actions;
export default slice.reducer;
