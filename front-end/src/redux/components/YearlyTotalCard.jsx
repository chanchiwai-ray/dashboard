import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { faYenSign } from "@fortawesome/free-solid-svg-icons";
import { faMoneyBillAlt } from "@fortawesome/free-regular-svg-icons";

import { getYearlyExpense } from "../slices/finance/records.js";
import { selectRecords, selectAuth } from "../app/store.js";
import SummaryCard from "../../components/SummaryCard/SummaryCard.jsx";

const now = new Date();
const startDate = new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0);
const endDate = new Date(now.getFullYear() + 1, 0, 1, 0, 0, 0, 0);

export default (props) => {
  const auth = useSelector(selectAuth);
  const records = useSelector(selectRecords);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.value.userId) {
      dispatch(
        getYearlyExpense({
          userId: auth.value.userId,
          query: {
            start: Date.parse(startDate),
            end: Date.parse(endDate),
          },
        })
      );
    }
  }, []);

  return (
    <SummaryCard
      data={{
        value: records.value.totals.yearlyTotal,
        icon: faYenSign,
        label: `Total Expense in ${now.getFullYear()}`,
        lastUpdated: now.toLocaleDateString(),
      }}
      icon={{ icon: faMoneyBillAlt, color: "gray" }}
    />
  );
};
