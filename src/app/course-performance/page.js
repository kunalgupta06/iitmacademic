"use client";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Link from "next/link";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function PerformancePage() {
  const performanceData = {
    labels: ["Course A", "Course B", "Course C", "Course D"],
    datasets: [
      {
        label: "Performance",
        data: [80, 90, 70, 85],
        backgroundColor: "rgba(54, 162, 235, 0.2)",
        borderColor: "rgba(54, 162, 235, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-orange-600 mb-6">Course Performance</h2>
      <div className="w-full max-w-2xl">
        <Bar data={performanceData} options={{ responsive: true }} />
      </div>
    </div>
  );
}
