import React from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

interface BarChartProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: any; // The chart data passed in as a prop
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  options: any; // The chart options passed in as a prop
}

const BarChart: React.FC<BarChartProps> = ({ data, options }) => {
  return (
    <div>
      <Bar data={data} options={options} />
    </div>
  );
};

export default BarChart;
