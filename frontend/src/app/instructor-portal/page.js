"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function InstructorPortal() {
  const [isHovered, setIsHovered] = useState(false);
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const options = { day: "numeric", month: "long", year: "numeric" };
    setCurrentDate(new Date().toLocaleDateString("en-GB", options));
  }, []);

  const foundationCourses = [
    "English I", "Programming in Python", "Computational Thinking", "Mathematics I", "Mathematics II",
    "English II", "Statistics I", "Statistics II"
  ];
  const diplomaCourses = [
    "Business Analytics", "Tools in Data Science", "MLP", "MAD I", "DBMS", "MAD II",
    "MLT", "PDSA", "System Commands", "BDM"
  ];
  const degreeCourses = [
    "Software Engineering", "Software Testing", "Strategies for Professional Growth", "Deep Learning",
    "AI", "LLM", "Industry 4.0", "Corporate Finance", "Game Theory", "Managerial Economics"
  ];

  const [foundationVisible, setFoundationVisible] = useState(foundationCourses.slice(0, 4));
  const [diplomaVisible, setDiplomaVisible] = useState(diplomaCourses.slice(0, 4));
  const [degreeVisible, setDegreeVisible] = useState(degreeCourses.slice(0, 4));

  const handleNextClick = (level) => {
    if (level === "foundation") {
      setFoundationVisible((prev) => {
        const nextIndex = foundationCourses.indexOf(prev[prev.length - 1]) + 1;
        return foundationCourses.slice(nextIndex, nextIndex + 4) || prev;
      });
    } else if (level === "diploma") {
      setDiplomaVisible((prev) => {
        const nextIndex = diplomaCourses.indexOf(prev[prev.length - 1]) + 1;
        return diplomaCourses.slice(nextIndex, nextIndex + 4) || prev;
      });
    } else if (level === "degree") {
      setDegreeVisible((prev) => {
        const nextIndex = degreeCourses.indexOf(prev[prev.length - 1]) + 1;
        return degreeCourses.slice(nextIndex, nextIndex + 4) || prev;
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gray-100 p-4 shadow flex justify-between items-center w-full fixed top-0 left-0 right-0 z-10">
        <div className="flex items-center space-x-4">
          <Image src="/IITM_logo.png" alt="IIT Madras" width={300} height={80} />
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-black">John Doe</span>
            <span className="text-lg text-black">👤</span>
          </div>
          <Link href="/instructor-dashboard">
            <div
              className={`relative flex items-center space-x-1 cursor-pointer transition-all duration-300 ${isHovered ? 'transform scale-110' : ''}`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >
              <span className="font-semibold text-black">AskIVA</span>
              <Image src="/app_name.png" alt="AskIVA" width={20} height={20} />
              {isHovered && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 p-2 bg-[#f8f8f8] text-black text-sm rounded-md border-2 border-black w-max max-w-xs">
                  Got any Questions? Just AskIVA!
                </div>
              )}
            </div>
          </Link>
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-black">Latest Updates</span>
            <span className="text-lg text-black">🔔</span>
          </div>
          <Link href="/login">
            <button className="bg-gray-100 border-2 border-black font-semibold text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white">
              Sign Out
            </button>
          </Link>
        </div>
      </header>

      <div className="container mx-auto mt-20 p-6 flex-grow">
        <div className="text-right mb-3">
          <p className="font-semibold text-lg text-black">{currentDate}</p>
          <p className="text-gray-600 text-black">JANUARY 2025 TERM</p>
        </div>

        {[["Foundational Level Courses", foundationVisible, "foundation"],
          ["Diploma Level Courses", diplomaVisible, "diploma"],
          ["Degree Level Courses", degreeVisible, "degree"]].map(([level, visibleCourses, levelKey], index) => (
          <div key={index} className="mb-10">
            <h2 className="text-2xl font-semibold text-black mb-4">{level}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {visibleCourses.map((course, idx) => {
              const isRedirectCourse = course === "Business Analytics" || course === "Software Engineering";
              const linkPath = course === "Business Analytics" ? "/edit-course/ba" :
                               course === "Software Engineering" ? "/edit-course/se" : "";
              const courseCard = (
                <div
                  key={idx}
                  className="bg-red-800 text-white rounded-lg shadow-lg p-4 transform transition-transform hover:scale-105 cursor-pointer"
                >
                  <h3 className="font-semibold text-lg">{course}</h3>
                </div>
              );
              return isRedirectCourse ? (
                <Link key={idx} href={linkPath}>
                  {courseCard}
                </Link>
              ) : courseCard;
            })}
            </div>
            <div className="flex justify-between items-center mt-4 flex-wrap">
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
                onClick={() => handleNextClick(levelKey)}
              >
                More ➡
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}







