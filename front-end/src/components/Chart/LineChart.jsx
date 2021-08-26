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
    setData({
      labels: datasource.dates.map((date) => `${date.getMonth() + 1}/${date.getDate()}`),
      datasets: [
        {
          label: "Expense",
          data: datasource.dates.map((date) =>
            datasource.datedRecords[date]
              ? datasource.datedRecords[date].reduce((acc, curr) => acc + curr.amount, 0)
              : 0
          ),
          backgroundColor: "rgb(255, 99, 132)",
          borderColor: "rgba(255, 99, 132, 0.6)",
        },
      ],
    });
  }, [datasource]);

  return <Line data={data} options={options} {...props} />;
}
