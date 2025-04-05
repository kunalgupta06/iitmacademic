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
    labels: [
      "What are the key phases of SDLC?",
      "Difference: functional vs. non-functional requirements?",
      "What is Agile? How does it differ from Waterfall?",
      "What are design patterns? Examples?",
      "Why is Git commonly used for version control?"
    ],
    datasets: [
      {
        data: [50, 100, 150, 75, 125],
        backgroundColor: ["#FF99A5", "#6FB8F2", "#FFD580", "#76D7D7", "#B08CFF"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
        borderWidth: 2,
        borderRadius: 6,
        barThickness: "flex",
        hoverBackgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      },
    ],
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-blue-100 mt-10">
      {/* Smaller Chart Container */}
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-2xl">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 text-center mb-3">
          Most Asked Questions
        </h2>
        <div className="w-full h-[350px] sm:h-[300px]"> {/* Reduced height */}
          <Bar
            data={questionData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              indexAxis: "y",
              plugins: {
                legend: { display: false },
                title: {
                  display: false,
                },
              },
              scales: {
                y: {
                  ticks: {
                    callback: (value) => value.length > 30 ? value.slice(0, 30) + "..." : value,
                    font: { size: 12 },
                  },
                },
                x: {
                  beginAtZero: true,
                  ticks: { font: { size: 12 } },
                },
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
