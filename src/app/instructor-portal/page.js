"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function InstructorPortal() {
  const [isHovered, setIsHovered] = useState(false);

  // Course data for each level
  const foundationCourses = [
    "English I", "Programming in Python", "Computational Thinking", "Mathematics I", "Mathematics II", "English II", "Statistics I", "Statistics II"
  ];
  const diplomaCourses = [
    "Tools in Data Science", "MLP", "MAD I", "DBMS", "MAD II", "MLT ", "PDSA", "Business Analytics", "System Commands", "BDM"
  ];
  const degreeCourses = [
    "Software Engineering", "Software Testing", "Strategies for Professional Growth", "Deep Learning", "AI", "LLM", "Industry 4.0", "Corporate Finance", "Game Theory", "Managerial Econimcs"
  ];

  // State for showing the current visible courses
  const [foundationVisible, setFoundationVisible] = useState([0, 1, 2, 3]);
  const [diplomaVisible, setDiplomaVisible] = useState([0, 1, 2, 3]);
  const [degreeVisible, setDegreeVisible] = useState([0, 1, 2, 3]);

  // Function to show the next set of 4 courses when arrow is clicked
  const handleNextClick = (level) => {
    if (level === "foundation") {
      const currentIndex = foundationVisible[foundationVisible.length - 1];
      const newIndex = currentIndex + 4;
      const newCourses = foundationCourses.slice(newIndex, newIndex + 4);
      setFoundationVisible(newCourses.length > 0 ? newCourses : foundationVisible);
    } else if (level === "diploma") {
      const currentIndex = diplomaVisible[diplomaVisible.length - 1];
      const newIndex = currentIndex + 4;
      const newCourses = diplomaCourses.slice(newIndex, newIndex + 4);
      setDiplomaVisible(newCourses.length > 0 ? newCourses : diplomaVisible);
    } else if (level === "degree") {
      const currentIndex = degreeVisible[degreeVisible.length - 1];
      const newIndex = currentIndex + 4;
      const newCourses = degreeCourses.slice(newIndex, newIndex + 4);
      setDegreeVisible(newCourses.length > 0 ? newCourses : degreeVisible);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Main Content (shifted left) */}
      <div className="flex-1 ml-0">
        {/* Header */}
        <header className="bg-gray-100 p-4 shadow flex justify-between items-center w-full fixed top-0 left-0 right-0 z-10">
          <div className="flex items-center space-x-4">
            <Image src="/IITM_logo.png" alt="IIT Madras" width={300} height={80} />
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-black">Lorem Ipsum</span>
              <span className="text-lg text-black">👤</span>
            </div>
            {/* AskIVA Button */}
            <div
              className={`flex items-center space-x-1 cursor-pointer transition-all duration-300 ${isHovered ? 'transform scale-110' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="font-semibold text-black">AskIVA</span>
              <Image src="/app_name.png" alt="AskIVA" width={20} height={20} />
              {isHovered && (
                <div className="absolute mt-16 p-2 bg-[#f8f8f8] text-black text-sm rounded-md border-2 border-black w-max max-w-xs">
                  Got any Questions? Just AskIVA!
                </div>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-black">Latest Updates</span>
              <span className="text-lg text-black">🔔</span>
            </div>
            <button className="bg-gray-100 border-2 border-black font-semibold text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white">Sign Out</button>
          </div>
        </header>

        {/* Main Section */}
        <div className="container mx-auto mt-20 p-6">
          <div className="text-right mb-3 mt-0">
            <p className="font-semibold text-lg text-black">18 February, 2025</p>
            <p className="text-gray-600 text-black">JANUARY 2025 TERM</p>
          </div>

          {/* Course Levels */}
          {["Foundational Level Courses", "Diploma Level Courses", "Degree Level Courses"].map((level, index) => {
            const courses = level === "Foundational Level Courses" ? foundationCourses : level === "Diploma Level Courses" ? diplomaCourses : degreeCourses;
            const visibleCourses = level === "Foundation Level Courses" ? foundationVisible : level === "Diploma Level Courses" ? diplomaVisible : degreeVisible;

            return (
              <div key={index} className="mb-10">
                <h2 className="text-2xl font-semibold text-black mb-4">{level}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {visibleCourses.map((courseIndex, idx) => (
                    <div 
                      key={idx} 
                      className="bg-red-800 text-white rounded-lg shadow-lg p-4 transform transition-transform hover:scale-105 cursor-pointer"
                    >
                      <h3 className="font-semibold text-lg">{courses[courseIndex]}</h3>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center mt-4">
                  <div className="flex space-x-4">
                    <button className="text-red-800 px-2 py-3 transform transition-transform hover:scale-105 cursor-pointer">
                      Add New Course
                    </button>
                    <button className="text-red-800 px-2 py-3 transform transition-transform hover:scale-105 cursor-pointer">
                      Remove Existing Course
                    </button>
                  </div>
                  <button 
                    className="text-2xl text-black cursor-pointer transform transition-transform hover:scale-110"
                    onClick={() => handleNextClick(level.toLowerCase().replace(/\s/g, ""))}
                  >
                    More ➡
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}




