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

export default function QuestionsPage() {
  const questionData = {
    labels: ["Question 1", "Question 2", "Question 3", "Question 4", "Question 5"],
    datasets: [
      {
        data: [50, 100, 150, 75, 125],
        backgroundColor: ["#FF99A5", "#6FB8F2", "#FFD580", "#76D7D7", "#B08CFF"], 
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"], 
        borderWidth: 2,
        borderRadius: 6,
        barThickness: 40, 
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"], // Matches border on hover
      },
    ]
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-blue-100">
      {/* Chart Container */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">
          Most Asked Questions
        </h2>
        <div className="w-full h-64 sm:h-72"> {/* Increased height */}
          <Bar
            data={questionData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
            }}
          />
        </div>
      </div>
    </div>
  );
}
