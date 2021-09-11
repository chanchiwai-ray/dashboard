import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import Chart from "../../components/Chart/Chart.jsx";
import { selectRecords, selectAuth } from "../app/store.js";
import { getDailyRecords } from "../slices/finance/records.js";

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

let dates = generate(new Date());

export default (props) => {
  const auth = useSelector(selectAuth);
  const records = useSelector(selectRecords);
  const dispatch = useDispatch();

  useEffect(() => {
    if (auth.value.userId) {
      dispatch(
        getDailyRecords({
          userId: auth.value.userId,
          query: {
            start: dates[0],
            end: dates[dates.length - 1],
          },
        })
      );
    }
  }, []);

  const render = () => {
    return records.success ? (
      <Chart
        dates={dates.map((unixTime) => new Date(Number(unixTime)))}
        records={records.value.dailyRecords}
        categories={props.categories}
        dateAction={{
          prevMonth: () => {
            const date = new Date(Number(dates[0]));
            dates = generate(new Date(date.getFullYear(), date.getMonth() - 1));
            dispatch(
              getDailyRecords({
                userId: auth.value.userId,
                query: {
                  start: dates[0],
                  end: dates[dates.length - 1],
                },
              })
            );
          },
          resetMonth: () => {
            dates = generate(new Date());
            dispatch(
              getDailyRecords({
                userId: auth.value.userId,
                query: {
                  start: dates[0],
                  end: dates[dates.length - 1],
                },
              })
            );
          },
          nextMonth: () => {
            const date = new Date(Number(dates[0]));
            dates = generate(new Date(date.getFullYear(), date.getMonth() + 1));
            dispatch(
              getDailyRecords({
                userId: auth.value.userId,
                query: {
                  start: dates[0],
                  end: dates[dates.length - 1],
                },
              })
            );
          },
        }}
      />
    ) : (
      <h1>{records.message}</h1>
    );
  };

  return render();
};
