"use client";

import Link from "next/link";

export default function AnalysisPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {/* Heading (Centered) */}
      <h1 className="text-4xl md:text-5xl font-bold text-blue-900 drop-shadow-lg text-center">
        AskIVA welcomes you to your dashboard!
      </h1>
      <p className="text-gray-700 text-lg mt-4 text-center">
        What would you like to get detailed insights for:
      </p>

      {/* Buttons Grid (Responsive) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mt-6">
        <Link href="/most-asked-ques">
          <button className="flex items-center justify-center w-full sm:w-72 px-6 py-4 sm:px-8 sm:py-5 text-lg sm:text-xl bg-[#a31d1d] hover:bg-[#811515] text-white font-semibold rounded-lg transition">
            📊 Most Asked Questions
          </button>
        </Link>

        <Link href="/most-asked-concepts">
          <button className="flex items-center justify-center w-full sm:w-72 px-6 py-4 sm:px-8 sm:py-5 text-lg sm:text-xl bg-[#a31d1d] hover:bg-[#811515] text-white font-semibold rounded-lg transition">
            📈 Most Asked Concepts
          </button>
        </Link>

        <Link href="/course-performance">
          <button className="flex items-center justify-center w-full sm:w-72 px-6 py-4 sm:px-8 sm:py-5 text-lg sm:text-xl bg-[#a31d1d] hover:bg-[#811515] text-white font-semibold rounded-lg transition">
            📉 Course Performance
          </button>
        </Link>

        <Link href="/study-patterns">
          <button className="flex items-center justify-center w-full sm:w-72 px-6 py-4 sm:px-8 sm:py-5 text-lg sm:text-xl bg-[#a31d1d] hover:bg-[#811515] text-white font-semibold rounded-lg transition">
            📌 Study Patterns of Students
          </button>
        </Link>
      </div>
    </div>
  );
}




