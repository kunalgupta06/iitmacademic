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
        backgroundColor: [
          "rgba(255, 99, 132, 0.6)",
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
          "rgba(75, 192, 192, 0.6)",
          "rgba(153, 102, 255, 0.6)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
        ],
        borderWidth: 2,
        borderRadius: 8, // Rounded bars
        barThickness: 50, // Increased bar width
        hoverBackgroundColor: "rgba(0, 0, 0, 0.2)", // Subtle hover effect
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false }, // Hides the legend
      title: {
        display: true,
        text: "Top 5 Most Asked Concepts",
        font: { size: 18 },
        color: "#000",
      },
    },
    scales: {
      x: {
        ticks: { color: "#000" }, // White x-axis labels
      },
      y: {
        ticks: { color: "#000" }, // White y-axis labels
      },
    },
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center p-6">
      {/* Full Page Background Image */}
      <div className="absolute inset-0">
        <img
          src="/graphs.jpeg"
          alt="Graphs Background"
          className="w-full h-full object-cover opacity-70"
        />
      </div>

      {/* Content Container */}
      <div className="relative bg-white bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-black text-center mb-6">
          Most Asked Concepts
        </h2>
        <div className="w-full">
          <Bar data={conceptData} options={chartOptions} />
        </div>
      </div>
    </div>
  );
}

