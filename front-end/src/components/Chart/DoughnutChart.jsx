import React, { useEffect, useState } from "react";

import { Doughnut } from "react-chartjs-2";

export default function DoughnutChart({ datasource, ...props }) {
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
      categorizedData[category] = 0;
    });
    datasource.records.forEach((record) => {
      record.categorySubTotal.forEach((entry) => {
        categorizedData[entry.category] += entry.total;
      });
    });

    // update state
    setData({
      labels: categories,
      datasets: [
        {
          data: Object.values(categorizedData),
          backgroundColor: categories.map(
            (cat, index) =>
              `rgb(${(index * (index + 10) + 100) % 255}, ${(index * (index + 20) + 100) % 255}, ${
                (index * (index + 30) + 100) % 255
              })`
          ),
          borderColor: categories.map(
            (cat, index) =>
              `rgb(${(index * (index + 10) + 100) % 255}, ${(index * (index + 20) + 100) % 255}, ${
                (index * (index + 30) + 100) % 255
              })`,
            0.2
          ),
          borderWidth: 1,
        },
      ],
    });
  }, [datasource]);

  return <Doughnut data={data} options={options} {...props} />;
}
