"use client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function StudentsPerCoursePage() {
  const studentsPerCourseData = {
    labels: ["SE", "BA", "SPG", "MLF", "AI"],
    datasets: [
      {
        label: "Students Registered",
        data: [150, 120, 100, 80, 90], 
        backgroundColor: ["#FF99A5", "#6FB8F2", "#FFD580", "#76D7D7", "#A2FF99"], 
        borderColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#7AC74F"], 
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center p-4 bg-blue-100 mt-10">
      {/* Chart Container */}
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 text-center mb-4">
          Students Registered across Courses
        </h2>
        <div className="w-full h-64 sm:h-72 flex items-center justify-center"> {/* Centered Pie Chart */}
          <Pie data={studentsPerCourseData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
      </div>
    </div>
  );
}
