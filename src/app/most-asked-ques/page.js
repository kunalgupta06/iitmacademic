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

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip);

export default function QuestionsPage() {
  const questionData = {
    labels: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
    datasets: [
      {
        data: [50, 100, 150, 75, 125],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderWidth: 2,
        borderRadius: 8,
        barThickness: 50,
        hoverBackgroundColor: "rgba(0, 0, 0, 0.2)",
      },
    ],
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0">
        <img src="/graphs.jpeg" alt="Questions Background" className="w-full h-full object-cover opacity-70" />
      </div>

      <div className="relative bg-black bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-3xl font-bold text-white text-center mb-6">Most Asked Questions</h2>
        <div className="w-full">
          <Bar data={questionData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}
