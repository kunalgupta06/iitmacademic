"use client";

import Link from "next/link";

export default function AnalysisPage() {
  return (
    <div
      className="min-h-screen flex flex-col items-center relative"
      style={{ 
        backgroundImage: "url('/instructor.png')",
        backgroundSize: "98% 125%",  // Adjust width & height
        backgroundPosition: "center 44%",  // Adjust top & left
        backgroundRepeat: "no-repeat",
        backgroundColor: "white" // Fallback color
      }}
      
    >
      {/* Dark Overlay for better text visibility */}
      <div className="absolute inset-0"></div>

      {/* Content */}
      <div 
        className="relative text-black p-6"
        style={{
          top: "70%",   // Adjust vertical position (from top)
          left: "45%",  // Shift content towards the right
          transform: "translate(-63%, 25%)" // Center content at the given position
          }}>
        <h2 className="text-3xl font-bold mb-1">Hey! Welcome to your Dashboard!</h2>
        <p className="text-lg text-center mb-4">What would you like to explore detailed insights for?</p>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
          <Link href="/most-asked-ques">
            <button className="w-full px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-lg transition">
              Most Asked Questions
            </button>
          </Link>

          <Link href="/most-asked-concepts">
            <button className="w-full px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-semibold rounded-lg transition">
              Most Asked <br></br>Concepts
            </button>
          </Link>

          <Link href="/course-performance">
            <button className="w-full px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-lg transition">
              Course Performance
            </button>
          </Link>

          <Link href="/study-patterns">
            <button className="w-full px-6 py-3 bg-purple-500 hover:bg-purple-600 text-white font-semibold rounded-lg transition">
              Study Patterns
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

