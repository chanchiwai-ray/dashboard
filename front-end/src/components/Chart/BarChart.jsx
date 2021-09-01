import React, { useEffect, useState } from "react";

import { Bar } from "react-chartjs-2";

export default function BarChart({ datasource, ...props }) {
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
    // initialize
    const categorizedData = {};
    const categories = datasource.categories.map((category) => category.label);
    categories.forEach((category) => {
      categorizedData[category] = Array(datasource.dates.length).fill(0);
    });
    datasource.records.forEach((record) => {
      record["categorySubTotal"].forEach(({ category, total }) => {
        if (categorizedData[category]) {
          categorizedData[category][record._id.day - 1] = total;
        }
      });
    });

    // update state
    setData({
      labels: datasource.dates.map((date) => `${date.getMonth() + 1}/${date.getDate()}`),
      datasets: categories.map((category, index) => ({
        label: category,
        data: categorizedData[category],
        backgroundColor: `rgb(${(index * (index + 10) + 100) % 255}, ${
          (index * (index + 20) + 100) % 255
        }, ${(index * (index + 30) + 100) % 255})`,
        borderColor: `rgba(${(index * (index + 10) + 100) % 255}, ${
          (index * (index + 20) + 100) % 255
        }, ${(index * (index + 30) + 100) % 255}, 0.2)`,
        stack: "stack 0",
      })),
    });
  }, [datasource]);

  return <Bar data={data} options={options} {...props} />;
}
