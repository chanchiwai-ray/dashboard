import { configureStore } from "@reduxjs/toolkit";
import createSummaryCardSlice from "./components/SummaryCard/summaryCardSlice.js";
import createChartSlice from "./components/Chart/chartSlice.js";

export const monthlyExpenseCardSlice = createSummaryCardSlice("monthlyExpenseCard");
export const yearlyExpenseCardSlice = createSummaryCardSlice("yearlyExpenseCard");
export const chartSlice = createChartSlice("chart");

export const store = configureStore({
  reducer: {
    monthlyExpenseCard: monthlyExpenseCardSlice.reducer,
    yearlyExpenseCard: yearlyExpenseCardSlice.reducer,
    chart: chartSlice.reducer,
  },
});
