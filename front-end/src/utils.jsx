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
      startDate.setHours(23);
      startDate.setMinutes(59);
      startDate.setSeconds(59);
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

// convert a date to UTC Date object
export function toNearestDate(date) {
  const d = new Date(date);
  const newDate = new Date();
  newDate.setFullYear(d.getFullYear());
  newDate.setMonth(d.getMonth());
  newDate.setDate(d.getDate());
  newDate.setHours(23);
  newDate.setMinutes(59);
  newDate.setSeconds(59);
  return newDate;
}

// given an array of records with unix time (ms) <date : String> return an object of records grouped by the its closest date <date: Date>.
export function toDatedRecords(dates, records) {
  if (!dates || !records) {
    return {};
  }

  const datedRecords = {};
  records.forEach((record) => {
    const date = toNearestDate(Number(record.date));
    if (!datedRecords[date]) {
      datedRecords[date] = [];
    }
    datedRecords[date].push(record);
  });

  const thisRecords = {};
  dates.forEach((date) => {
    // shallow copy
    thisRecords[date] = datedRecords[date];
  });
  return thisRecords;
}

// authenticated fetch api
export function useAuthFetch(collection, resource, query) {
  const api_host = process.env.REACT_APP_API_HOST;
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
      get(query);
    }
  }, [state, auth]);

  const get = (query) => {
    if (auth.isAuthenticated() && auth.userId) {
      fetch(
        `${api_host}/${collection}/${auth.userId}/${resource}${
          query ? "?" + new URLSearchParams(query).toString() : ""
        }`,
        {
          credentials: "include",
        }
      )
        .then((res) => {
          if (!res.ok)
            throw new Error(
              `Error: fail to GET ${api_host}/${collection}/${auth.userId}/${resource}${
                query ? "?" + new URLSearchParams(query).toString() : ""
              }`
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
  };

  const put = () => {
    return (id, data) => {
      fetch(`${api_host}/${collection}/${auth.userId}/${resource}/${id || ""}`, {
        method: "PUT",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      })
        .then((res) => {
          if (!res.ok)
            throw new Error(
              `Error: fail to PUT ${api_host}/${collection}/${auth.userId}/${resource}/${id || ""}`
            );
          setState((state) => ({ ...state, success: true, reload: true }));
        })
        .catch((err) => {
          setState((state) => ({ ...state, success: false, reload: false }));
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

  return [state, { reload: get, update: put, create: post, delete: del }];
}
