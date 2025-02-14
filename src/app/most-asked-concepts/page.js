"use client";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Link from "next/link";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function ConceptsPage() {
  const conceptData = {
    labels: ["Concept 1", "Concept 2", "Concept 3", "Concept 4", "Concept 5"],
    datasets: [
      {
        label: "Frequency of Concepts",
        data: [45, 80, 90, 110, 130],
        backgroundColor: "rgba(255, 159, 64, 0.2)",
        borderColor: "rgba(255, 159, 64, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-green-600 mb-6">Most Asked Concepts</h2>
      <div className="w-full max-w-2xl">
        <Bar data={conceptData} options={{ responsive: true }} />
      </div>
    </div>
  );
}
