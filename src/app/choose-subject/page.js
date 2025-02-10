import React from "react";
import Link from "next/link";

export default function ChooseSubject() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Choose a Subject</h1>
      <p className="text-gray-600 max-w-md mb-6 text-center">
        Select a subject to access the chatbot for subject-specific queries.
      </p>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full max-w-md">
        <Link href="/subject-queries" className="p-6 bg-white shadow-lg rounded-xl cursor-pointer hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 text-center">
          <h2 className="text-xl font-semibold text-blue-600">Subject A</h2>
          <p className="text-gray-500">Ask queries related to Subject A.</p>
        </Link>

        <Link href="/subject-queries" className="p-6 bg-white shadow-lg rounded-xl cursor-pointer hover:shadow-2xl transform transition-transform duration-300 hover:scale-105 text-center">
          <h2 className="text-xl font-semibold text-green-600">Subject B</h2>
          <p className="text-gray-500">Ask queries related to Subject B.</p>
        </Link>
      </div>
    </div>
  );
}
 
