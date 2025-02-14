"use client";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import Link from "next/link";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export default function QuestionsPage() {
  const questionData = {
    labels: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
    datasets: [
      {
        label: "Frequency of Questions",
        data: [50, 100, 150, 75, 125],
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-blue-600 mb-6">Most Asked Questions</h2>
      <div className="w-full max-w-2xl">
        <Bar data={questionData} options={{ responsive: true }} />
      </div>
    </div>
  );
}
