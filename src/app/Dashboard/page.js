"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-100">
      <h2 className="text-4xl font-bold text-center text-blue-600 mb-6 ">
        Hey! Your academic companion is here!
      </h2>

      <p className="text-lg text-gray-700 text-center mb-8">
        Choose an option to proceed:
      </p>

      <div className="flex flex-col items-center space-y-4">
        <Link
          href="/programme-guideline"
          className="w-64 bg-blue-600 text-white py-3 rounded-lg text-center hover:bg-blue-700 transition"
        >
          Programme Guideline
        </Link>

        <Link
          href="/subject-queries"
          className="w-64 bg-green-600 text-white py-3 rounded-lg text-center hover:bg-green-700 transition"
        >
          Subject Queries
        </Link>
      </div>
    </div>
  );
}
