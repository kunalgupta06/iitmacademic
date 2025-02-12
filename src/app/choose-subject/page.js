"use client";

import React, { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/Navbar/page";
import Image from "next/image";

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
  const [showMore, setShowMore] = useState(false);
  const subjectsPerPage = 4;

  // Filter subjects based on search input
  const filteredSubjects = subjects.filter((subject) =>
    subject.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Logic to handle "More Subjects" pagination
  const displayedSubjects = showMore
    ? filteredSubjects.slice(subjectsPerPage, subjectsPerPage * 2)
    : filteredSubjects.slice(0, subjectsPerPage);

  return (
    <div className="min-h-screen flex">
      {/* Left Side - Background Image (60% width) */}
      <div className="w-4/5 relative">
        <Image
          src="/choose_subject_bg.jpg"
          alt="Choose Subject Background"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
      </div>

      {/* Right Side - White Background & Content (40% width) */}
      <div className="w-2/5 bg-white flex flex-col items-start p-10">
        {/* Navbar with "Go Back" link set to Dashboard */}
        <Navbar backLink="/Dashboard" />

        {/* Heading and description */}
        <div className="mt-16 text-left">
          <h1 className="text-3xl font-bold text-orange-600 mb-3 text-center">Choose a Subject</h1>
          <p className="text-gray-600 max-w-lg mb-4 text-center">
            Select a subject to access the chatbot for subject-specific queries.
          </p>
        </div>

        {/* Search Bar */}
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search for a subject..."
            className="mb-4 p-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 text-black placeholder-gray-500"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setShowMore(false); // Reset pagination on search
            }}
          />
        </div>

        {/* Grid for Subject Cards (Square Shape, 4 at a time) */}
        <div className="grid grid-cols-2 gap-4 w-full">
          {displayedSubjects.length > 0 ? (
            displayedSubjects.map((subject, index) => (
              <Link
                key={index}
                href="/subject-queries"
                className="w-50 h-36 bg-white shadow-md rounded-lg cursor-pointer hover:shadow-xl transform transition-transform duration-300 hover:scale-105 flex flex-col justify-center items-center text-center"
              >
                <h2 className={`text-lg font-semibold ${subject.color}`}>{subject.name}</h2>
                <p className="text-xs text-gray-500">Ask queries related to {subject.name}.</p>
              </Link>
            ))
          ) : (
            <p className="text-gray-500 col-span-2 text-center">No subjects found.</p>
          )}
        </div>

        {/* "More Subjects..." Button */}
        {filteredSubjects.length > subjectsPerPage && (
          <div className="mt-4">
            <button
              onClick={() => setShowMore(!showMore)}
              className="text-blue-600 font-medium hover:underline"
            >
              {showMore ? "Show Previous Subjects" : "More Subjects..."}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}







