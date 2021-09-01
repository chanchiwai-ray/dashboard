import React, { useEffect, useState } from "react";

import { Line } from "react-chartjs-2";

export default function LineChart({ datasource, ...props }) {
  const [data, setData] = useState({ labels: [], datasets: [{ data: [] }] });

  const options = {
    maintainAspectRatio: false,
    scales: {
      xAxes: [
        {
          stacked: true,
        },
      ],
      yAxes: [
        {
          stacked: true,
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
  };

  useEffect(() => {
    const dailyTotals = Array(datasource.dates.length).fill(0);
    datasource.records.forEach((record) => {
      dailyTotals[record._id.day - 1] = record.dailyTotal;
    });

    setData({
      labels: datasource.dates.map((date) => `${date.getMonth() + 1}/${date.getDate()}`),
      datasets: [
        {
          label: "Expense",
          data: dailyTotals,
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    });
  }, [datasource]);

  return <Line data={data} options={options} {...props} />;
}
