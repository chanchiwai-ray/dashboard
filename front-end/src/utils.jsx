import React, { useEffect, useState } from "react";
import { useAuth } from "./authenticate.jsx";

// given a Date object return an array of dates within the month of the Date
export function useDates(date) {
  const [thisDate, setThisDate] = useState(new Date(date));
  const [dates, setDates] = useState([]);

  const generate = (date) => {
    const dateArray = [];
    const startDate = new Date(date.getFullYear(), date.getMonth(), 1);
    const endDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    while (startDate < endDate) {
      dateArray.push(new Date(startDate));
      startDate.setDate(startDate.getDate() + 1);
    }
    setDates(dateArray);
  };

  useEffect(() => {
    generate(thisDate);
  }, [thisDate]);

  const nextMonth = () => {
    setThisDate(new Date(thisDate.getFullYear(), thisDate.getMonth() + 1));
  };

  const prevMonth = () => {
    setThisDate(new Date(thisDate.getFullYear(), thisDate.getMonth() - 1));
  };

  const resetDates = () => {
    setThisDate(new Date(date.getFullYear(), date.getMonth()));
  };

  return [dates, { nextMonth: nextMonth, prevMonth: prevMonth, resetDates: resetDates }];
}

// given an array of records with unix time <date : String> return an object of *monthly* records grouped by Date.toLocaleDateString()
export function useDatedRecords(records) {
  const [dates, datesAction] = useDates(new Date());
  const [datedRecords, setDatedRecords] = useState({});
  const [monthlyDatedRecords, setMonthlyDatedRecords] = useState({});

  useEffect(() => {
    const thisRecords = {};
    records.forEach((record) => {
      if (!thisRecords[new Date(Number(record.date)).toLocaleDateString()]) {
        thisRecords[new Date(Number(record.date)).toLocaleDateString()] = [];
      }
      thisRecords[new Date(Number(record.date)).toLocaleDateString()].push(record);
    });
    setDatedRecords(thisRecords);
  }, [records]);

  useEffect(() => {
    const thisRecords = {};
    dates.forEach((date) => {
      // shallow copy
      thisRecords[date.toLocaleDateString()] = datedRecords[date.toLocaleDateString()];
    });
    setMonthlyDatedRecords(thisRecords);
  }, [dates, datedRecords]);

  return [
    dates,
    monthlyDatedRecords,
    {
      nextMonthRecords: datesAction.nextMonth,
      prevMonthRecords: datesAction.prevMonth,
      thisMonthRecords: datesAction.resetDates,
    },
  ];
}

// authenticated fetch api
export function useAuthFetch(collection, resource) {
  const api_host = process.env.API_HOST;
  const auth = useAuth();
  const [state, setState] = useState({
    payload: [],
    success: false,
    reload: true,
  });

  useEffect(() => {
    auth.verifySession();
  }, []);

  useEffect(() => {
    if (auth.isAuthenticated() && state.reload && auth.userId) {
      fetch(`${api_host}/${collection}/${auth.userId}/${resource}`, {
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok)
            throw new Error(
              `Error: fail to GET ${api_host}/${collection}/${auth.userId}/${resource}`
            );
          return res;
        })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success) {
            setState((state) => ({
              payload: [],
              success: false,
              reload: false,
            }));
          } else {
            setState((state) => ({
              payload: data.payload,
              success: true,
              reload: false,
            }));
          }
        })
        .catch((err) => {
          setState((state) => ({ payload: [], success: false, reload: false }));
        });
    }
  }, [state, auth]);

  const put = () => {
    return (id, data) => {
      fetch(`${api_host}/${collection}/${auth.userId}/${resource}/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok)
            throw new Error(
              `Error: fail to PUT ${api_host}/${collection}/${auth.userId}/${resource}/${id}`
            );
          setState((state) => ({ ...state, success: true }));
        })
        .catch((err) => {
          setState((state) => ({ ...state, success: false }));
        });
    };
  };

  const post = () => {
    return (data) => {
      data = { ...data, userId: auth.userId };
      fetch(`${api_host}/${collection}/${auth.userId}/${resource}`, {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok)
            throw new Error(
              `Error: fail to POST ${api_host}/${collection}/${auth.userId}/${resource}`
            );
          setState((state) => ({ ...state, success: true, reload: true }));
        })
        .catch((err) => {
          setState((state) => ({ ...state, success: false, reload: false }));
        });
    };
  };

  const del = () => {
    return (id) => {
      fetch(`${api_host}/${collection}/${auth.userId}/${resource}/${id}`, {
        method: "DELETE",
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok)
            throw new Error(
              `Error: fail to DELETE ${api_host}/${collection}/${auth.userId}/${resource}/${id}`
            );
          setState((state) => ({ ...state, success: true, reload: true }));
        })
        .catch((err) => {
          setState((state) => ({ ...state, success: false, reload: false }));
        });
    };
  };

  return [state, { update: put, create: post, delete: del }];
}
