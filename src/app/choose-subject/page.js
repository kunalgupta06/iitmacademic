"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar/page"; // Import Navbar

const subjects = [
  { name: "Mathematics", color: "text-blue-600" },
  { name: "Physics", color: "text-green-600" },
  { name: "Chemistry", color: "text-red-600" },
  { name: "Biology", color: "text-purple-600" },
  { name: "Computer Science", color: "text-yellow-600" },
  { name: "History", color: "text-pink-600" },
  { name: "Geography", color: "text-teal-600" },
  { name: "English", color: "text-indigo-600" },
];

export default function ChooseSubject() {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center p-6">
      {/* Navbar with "Go Back" link set to Dashboard */}
      <Navbar backLink="/Dashboard" />

      {/* Reduced margin-top to bring the heading closer */}
      <div className="mt-12 text-center">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Choose a Subject</h1>
        <p className="text-gray-600 max-w-lg mb-4">
          Select a subject to access the chatbot for subject-specific queries.
        </p>
      </div>

      {/* Search Bar with Black Input Text */}
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Search for a subject..."
          className="mb-6 p-3 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Fixed Size Subject Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-6 gap-y-0 w-full max-w-5xl min-h-[400px]">
        {filteredSubjects.length > 0 ? (
          filteredSubjects.map((subject, index) => (
            <Link
              key={index}
              href="/subject-queries"
              className="p-6 bg-white shadow-lg rounded-xl cursor-pointer hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 text-center"
              style={{ height: "150px", display: "flex", flexDirection: "column", justifyContent: "center" }}
            >
              <h2 className={`text-xl font-semibold ${subject.color}`}>
                {subject.name}
              </h2>
              <p className="text-gray-500">Ask queries related to {subject.name}.</p>
            </Link>
          ))
        ) : (
          <p className="text-gray-500 col-span-4 text-center">No subjects found.</p>
        )}

        {/* Invisible placeholders to maintain row height when filtering */}
        {filteredSubjects.length < 4 &&
          Array.from({ length: 4 - filteredSubjects.length }).map((_, index) => (
            <div key={`placeholder-${index}`} className="h-[150px]"></div>
          ))}
      </div>
    </div>
  );
}



