import { configureStore } from "@reduxjs/toolkit";
import createSummaryCardSlice from "./components/SummaryCard/summaryCardSlice.js";

export const monthlyExpenseCardSlice = createSummaryCardSlice("monthlyExpenseCard");
export const yearlyExpenseCardSlice = createSummaryCardSlice("yearlyExpenseCard");

export const store = configureStore({
  reducer: {
    monthlyExpenseCard: monthlyExpenseCardSlice.reducer,
    yearlyExpenseCard: yearlyExpenseCardSlice.reducer,
  },
});
