"use client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StudyPatternsPage() {
  const studyPatternData = {
    labels: ["Morning", "Afternoon", "Evening", "Night"],
    datasets: [
      {
        label: "Study Time Distribution",
        data: [30, 50, 100, 120],
        backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="relative w-full h-screen flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0">
        <img src="/graphs.jpeg" alt="Study Background" className="w-full h-full object-cover opacity-70" />
      </div>

      <div className="relative bg-black bg-opacity-70 p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-3xl font-bold text-white text-center mb-4">Study Patterns</h2>
        <div className="w-full">
          <Pie data={studyPatternData} options={{ responsive: true }} />
        </div>
      </div>
    </div>
  );
}

