"use client";

import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";

// Register necessary Chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function AnalysisPage() {
  // Sample data for each chart

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

  const studyPatternData = {
    labels: ["Morning", "Afternoon", "Evening", "Night"],
    datasets: [
      {
        label: "Study Time Distribution",
        data: [30, 50, 100, 120],
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        borderColor: "rgba(153, 102, 255, 1)",
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-blue-600 mb-8">Analysis and Visualization</h2>

      <div className="grid grid-cols-2 gap-6 w-full max-w-4xl">
        {/* Tile 1: Most Frequently Asked Questions */}
        <div className="flex flex-col justify-center items-center p-6 rounded-lg shadow-lg hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-4">Most Frequently Asked Questions</h3>
          <div className="w-full h-48">
            <Bar data={questionData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Tile 2: Most Frequently Asked Concepts */}
        <div className="flex flex-col justify-center items-center p-6 rounded-lg shadow-lg hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-4">Most Frequently Asked Concepts</h3>
          <div className="w-full h-48">
            <Bar data={conceptData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Tile 3: Course Performance */}
        <div className="flex flex-col justify-center items-center p-6 rounded-lg shadow-lg hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-4">Course Performance</h3>
          <div className="w-full h-48">
            <Bar data={performanceData} options={{ responsive: true }} />
          </div>
        </div>

        {/* Tile 4: Study Patterns */}
        <div className="flex flex-col justify-center items-center p-6 rounded-lg shadow-lg hover:shadow-xl transition">
          <h3 className="text-xl font-semibold mb-4">Study Patterns</h3>
          <div className="w-full h-48">
            <Pie data={studyPatternData} options={{ responsive: true }} />
          </div>
        </div>
      </div>
    </div>
  );
}
