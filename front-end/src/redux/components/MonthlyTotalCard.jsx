import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { faYenSign } from "@fortawesome/free-solid-svg-icons";
import { faMoneyBillAlt } from "@fortawesome/free-regular-svg-icons";

import { getMonthlyExpense } from "../slices/finance/records.js";
import { selectRecords, selectAuth } from "../app/store.js";
import SummaryCard from "../../components/SummaryCard/SummaryCard.jsx";

const now = new Date();
const startDate = new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0);
const endDate = new Date(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0);
const monthString = [
  "January",
  "Feburary",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "Decemeber",
];

export default (props) => {
  const auth = useSelector(selectAuth);
  const records = useSelector(selectRecords);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.value.userId) {
      dispatch(
        getMonthlyExpense({
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
        value: records.value.totals.monthlyTotal,
        icon: faYenSign,
        label: `Total Expense in ${monthString[now.getMonth()]}`,
        lastUpdated: now.toLocaleDateString(),
      }}
      icon={{ icon: faMoneyBillAlt, color: "gray" }}
    />
  );
};
