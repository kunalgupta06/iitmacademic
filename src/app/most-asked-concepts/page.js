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
import Link from "next/link";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ConceptsPage() {
  const conceptData = {
    labels: ["Concept 1", "Concept 2", "Concept 3", "Concept 4", "Concept 5"],
    datasets: [
      {
        label: "Frequency of Concepts",
        data: [45, 80, 90, 110, 130],
        backgroundColor: ["#FF99A5", "#6FB8F2", "#FFD580", "#76D7D7", "#B08CFF"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"], 
        borderWidth: 2,
        borderRadius: 6, 
        barThickness: 40, 
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"], // Matches border on hover
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Top 5 Most Asked Concepts",
        font: { size: 18 },
        color: "#000",
      },
    },
    scales: {
      x: { ticks: { color: "#000" } },
      y: { ticks: { color: "#000" } },
    },
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-blue-100">
      {/* Chart Container */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">
          Most Asked Concepts
        </h2>
        <div className="w-full h-64 sm:h-72"> {/* Adjusted height */}
          <Bar data={conceptData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
