import React from "react";
import { Line } from "react-chartjs-2";

const LineChart = () => {
  const data = {
    labels: [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    datasets: [
      {
        label: "Volume",
        data: [10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10, 10],
        fill: false,
        borderColor: "rgba(75,192,192,1)",
        lineTension: 0.1,
      },
    ],
  };

  return (
    <div>
      <h2>Affiliate Marketing Volume Over Months</h2>
      <Line data={data} />
    </div>
  );
};

export default LineChart;
