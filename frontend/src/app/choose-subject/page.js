"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "../../components/Navbar/page"; // Assuming your Navbar component is imported

const subjects = [
  { name: "Software Engineering", color: "text-[#A31D1D]" },
  { name: "Business Analytics", color: "text-[#A31D1D]" },
  { name: "Mathematics II", color: "text-[#A31D1D]" },
  { name: "Statistics I", color: "text-[#A31D1D]" },
  { name: "SPG", color: "text-[#A31D1D]" },
  { name: "AI", color: "text-[#A31D1D]" },
  { name: "Software Testing", color: "text-[#A31D1D]" },
  { name: "English", color: "text-[#A31D1D]" },
  { name: "BDM", color: "text-[#A31D1D]" },
  { name: "Mathematics I", color: "text-[#A31D1D]" },
  { name: "MLP", color: "text-[#A31D1D]" },
  { name: "MLT", color: "text-[#A31D1D]" },
  { name: "MAD I", color: "text-[#A31D1D]" },
  { name: "MAD II", color: "text-[#A31D1D]" },
  { name: "Java", color: "text-[#A31D1D]" },
  { name: "DBMS", color: "text-[#A31D1D]" }
];

export default function ChooseSubject() {
  const [searchTerm, setSearchTerm] = useState("");
  const [startIndex, setStartIndex] = useState(0);
  const subjectsPerPage = 8;

  // Filter subjects based on search term
  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get the current slice of subjects to display
  const displayedSubjects = filteredSubjects.slice(startIndex, startIndex + subjectsPerPage);

  // Function to show the next set of subjects
  const showNextSubjects = () => {
    if (startIndex + subjectsPerPage < filteredSubjects.length) {
      setStartIndex(startIndex + subjectsPerPage);
    } else {
      setStartIndex(0); // Restart from the beginning if at the end
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center relative text-white bg-gray-100">
      {/* Fixed Container to Prevent Shifting */}
      <div className="flex flex-col items-center w-full max-w-6xl mt-24 px-4">
        {/* Subtitle */}
        <div className="flex items-center justify-center space-x-2 mb-0">
        <p className="text-lg sm:text-xl md:text-2xl mt-4 font-semibold drop-shadow-lg text-center text-[#A31D1D] px-4">
            Select a subject to access the chatbot for subject-specific queries.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-md mt-6 mb-5">
          <input
            type="text"
            placeholder="Search for a subject..."
            className="p-3 w-full border border-gray-300 rounded-lg shadow-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Subject Grid - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-5xl min-h-[340px]">
          {displayedSubjects.length > 0 ? (
            displayedSubjects.map((subject, index) => (
              <Link
                key={index}
                href="/subject-queries"
                className="p-6 bg-white/90 text-black shadow-lg rounded-xl cursor-pointer hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 text-center"
                style={{ height: "150px", display: "flex", flexDirection: "column", justifyContent: "center" }}
              >
                <h2 className={`text-xl font-semibold ${subject.color}`}>
                  {subject.name}
                </h2>
                <p className="text-gray-600">Ask queries related to {subject.name}.</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 col-span-full text-center">No subjects found.</p>
          )}
        </div>

        {/* Show More Subjects Button Below the Cards */}
        {filteredSubjects.length > subjectsPerPage && (
          <button
            onClick={showNextSubjects}
            className="text-lg font-semibold text-gray-700 mt-3 hover:underline transition"
          >
            More Subjects →
          </button>
        )}
      </div>
    </div>
  );
}
