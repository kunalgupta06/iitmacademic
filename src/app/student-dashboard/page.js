"use client";

import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-6">
      {/* Heading */}
      <h1 className="text-5xl font-bold text-blue-900 drop-shadow-lg text-center">
        AskIVA welcomes you to your dashboard!
      </h1>
      <p className="text-gray-700 text-lg mt-4 text-center">
        Select from below what you'd like help with:
      </p>

      {/* Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10 w-full max-w-3xl">
        {/* Card 1 */}
        <Link
          href="/choose-subject"
          className="bg-[#a31d1d] text-white p-6 rounded-lg shadow-lg text-center transform transition-transform hover:scale-105"
        >
          <h2 className="text-2xl font-bold">Subject-Related Queries</h2>
          <p className="text-sm mt-4">
            Get help with subject-related doubts and explanations
          </p>
        </Link>

        {/* Card 2 */}
        <Link
          href="/programme-guideline"
          className="bg-[#a31d1d] text-white p-6 rounded-lg shadow-lg text-center transform transition-transform hover:scale-105"
        >
          <h2 className="text-2xl font-bold">Programme Guidelines</h2>
          <p className="text-sm mt-4">
            Get help for doubts related to rules, courses, and policies of the programme
          </p>
        </Link>
      </div>

      {/* Card 3 - Centered Below */}
      <div className="mt-6 w-full max-w-md">
        <Link
          href="/faq"
          className="bg-[#a31d1d] text-white p-6 rounded-lg shadow-lg text-center block transform transition-transform hover:scale-105"
        >
          <h2 className="text-2xl font-bold">FAQs</h2>
          <p className="text-sm mt-4">Frequently asked questions</p>
        </Link>
      </div>
    </div>
  );
}



