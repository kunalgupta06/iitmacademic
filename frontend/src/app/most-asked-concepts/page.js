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
    labels: [
      "Software Development Life Cycle (SDLC)",
      "Object-Oriented Programming (OOP)",
      "Design Patterns",
      "Agile Methodology",
      "Version Control Systems (Git)"
    ],
    datasets: [
      {
        label: "Frequency of Concepts",
        data: [45, 80, 90, 110, 130],
        backgroundColor: ["#FF99A5", "#6FB8F2", "#FFD580", "#76D7D7", "#B08CFF"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"], 
        borderWidth: 2,
        borderRadius: 6,
        barThickness: "flex", 
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    indexAxis: "y", // Horizontal bars for better text fit
    plugins: {
      legend: { display: false },
      title: {
        display: true,
        text: "Top 5 Most Asked Concepts (SE)",
        font: { size: 16 },
        color: "#000",
      },
    },
    scales: {
      y: {
        ticks: {
          font: { size: 12 },
          callback: (value) => (value.length > 30 ? value.slice(0, 30) + "..." : value),
          color: "#000",
        },
      },
      x: { ticks: { font: { size: 12 }, color: "#000" } },
    },
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-blue-100 mt-10">
      {/* Smaller Chart Container */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-3">
          Most Asked Concepts
        </h2>
        <div className="w-full h-[350px] sm:h-[300px]"> {/* Reduced height */}
          <Bar data={conceptData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}
