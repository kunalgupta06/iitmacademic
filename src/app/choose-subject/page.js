"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar/page"; // Assuming your Navbar component is imported

const subjects = [
  { name: "Mathematics", color: "text-blue-600" },
  { name: "Physics", color: "text-green-600" },
  { name: "Chemistry", color: "text-red-600" },
  { name: "Biology", color: "text-purple-600" },
  { name: "Computer Science", color: "text-yellow-600" },
  { name: "History", color: "text-pink-600" },
  { name: "Geography", color: "text-teal-600" },
  { name: "English", color: "text-indigo-600" },
  { name: "BDM", color: "text-indigo-600" },
  { name: "Economics", color: "text-orange-600" },
  { name: "Political Science", color: "text-cyan-600" },
  { name: "Psychology", color: "text-green-700" },
  { name: "Sociology", color: "text-blue-700" },
  { name: "Environmental Science", color: "text-emerald-600" },
  { name: "Philosophy", color: "text-yellow-700" }
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
    <div
      className="min-h-screen flex flex-col items-center relative text-white"
      style={{ 
        backgroundImage: "url('/choose_subject.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center 30%", // Adjusted upwards
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Navbar with Go Back to Dashboard */}
      <Navbar backLink="/Dashboard" />

      {/* Fixed Container to Prevent Shifting */}
      <div className="flex flex-col items-center w-full max-w-6xl mt-24">
        {/* Subtitle (Larger Text, Now White) */}
        <p className="text-3xl font-semibold drop-shadow-lg mb-8 text-center whitespace-nowrap text-white">
          Select a subject to access the chatbot for subject-specific queries.
        </p>

        {/* Search Bar */}
        <div className="w-full max-w-md mb-6">
          <input
            type="text"
            placeholder="Search for a subject..."
            className="p-3 w-full border border-gray-300 rounded-lg shadow-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Subject Grid with Fixed Height to Prevent Shifting */}
        <div className="grid grid-cols-4 gap-6 w-full max-w-5xl min-h-[350px]">
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
            <p className="text-gray-500 col-span-4 text-center">No subjects found.</p>
          )}
        </div>

        {/* Show More Subjects Button Below the Cards */}
        {filteredSubjects.length > subjectsPerPage && (
          <button
            onClick={showNextSubjects}
            className="text-lg font-semibold text-white mt-6 hover:underline transition"
          >
            More Subjects →
          </button>
        )}
      </div>
    </div>
  );
}







