"use client";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PerformancePage() {
  const performanceData = {
    labels: ["SE", "BA", "SPG", "MLF"],
    datasets: [
      {
        data: [80, 90, 70, 85],
        backgroundColor: ["#FF99A5", "#6FB8F2", "#FFD580", "#76D7D7"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 40, // ✅ Makes bars responsive
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
      },
    ],
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-blue-100 mt-10 md:mt-6 sm:mt-4">
      {/* Chart Container */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-3">
          Course Performance
        </h2>
        <div className="w-full min-h-[250px] h-auto sm:h-[300px]"> 
          <Bar
            data={performanceData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: { display: false },
                title: { display: false },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
