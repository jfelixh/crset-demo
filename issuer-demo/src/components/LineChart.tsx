import React from "react";
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { Line } = require("react-chartjs-2");

interface LineChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // The chart data passed in as a prop
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any; // The chart options passed in as a prop
}

const LineChart: React.FC<LineChartProps> = ({ data, options }) => {
  return <Line data={data} options={options} />;
};

export default LineChart;
