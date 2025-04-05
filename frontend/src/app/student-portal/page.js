"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function StudentPortal() {
  const [isHovered, setIsHovered] = useState(false);
  const [assignmentScores, setAssignmentScores] = useState(null);
  const [username, setUsername] = useState("");

  useEffect(() => {
    // Fetch stored username
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUsername(user.username);
    }

    const scores = {};
    ["Machine Learning Foundations", "Software Engineering"].forEach((course) => {
      scores[course] = Array.from({ length: 4 }, () => Math.floor(Math.random() * 16) + 85);
    });
    setAssignmentScores(scores);
  }, []);

  const courseLinks = {
    "Machine Learning Foundations": "/course-content/mlf",
    "Software Engineering": "/course-content/se",
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Sidebar */}
      <div className="w-[6%] h-[90vh] flex-shrink-0 absolute left-0 top-2/3 transform -translate-y-1/2">
        <Image src="/IITM_nav.png" alt="IITM Navigation" layout="responsive" width={100} height={100} />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-[5%]">
        {/* Header */}
        <header className="bg-gray-100 p-4 shadow flex justify-between items-center w-full fixed top-0 left-0 right-0 z-10">
          <div className="flex items-center space-x-4">
            <Image src="/IITM_logo.png" alt="IIT Madras" width={300} height={80} />
          </div>
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-black">{username || "Guest"}</span>
              <span className="text-lg text-black">👤</span>
            </div>
            <Link href="/student-dashboard">
              <div
                className="flex items-center space-x-1 cursor-pointer transition-all duration-300"
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{ transform: isHovered ? "scale(1.1)" : "scale(1)" }}
              >
                <span className="font-semibold text-black">AskIVA</span>
                <Image src="/app_name.png" alt="AskIVA" width={20} height={20} />
                {isHovered && (
                  <div className="absolute mt-16 p-2 bg-[#f8f8f8] text-black text-sm rounded-md border-2 border-black w-max max-w-xs">
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

        {/* Main Section */}
        <div className="container mx-auto mt-20 p-4">
          <div className="text-right mb-3 mt-10">
            <p className="font-semibold text-lg text-black">18 February, 2025</p>
            <p className="text-gray-600 text-black">JANUARY 2025 TERM</p>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">My Current Courses</h2>
          </div>
          <p className="mt-4 text-black">
            Cumulative Grade Point Average (CGPA) till this term - <b>8.91</b>
          </p>
          <p className="text-black">
            Project Cumulative Grade Point Average (Project CGPA) till this term - <b>9.25</b>
          </p>

          {/* Course Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {Object.keys(courseLinks).map((course, index) => (
              <div key={index} className="bg-white text-black rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
                <div className="bg-[#4a100e] text-white p-5 h-[55%] text-left">
                  <h3 className="text-lg font-bold">{course}</h3>
                  <p className="text-sm text-white">NEW COURSE</p>
                </div>
                <div className="bg-gray-100 text-black p-1 text-xs flex-grow">
                  {assignmentScores ? (
                    assignmentScores[course]?.map((score, i) => (
                      <p key={i}>Week {i + 1} Assignment - {score}.00</p>
                    ))
                  ) : (
                    <p>Loading scores...</p>
                  )}
                </div>
                <Link href={courseLinks[course]} passHref>
                  <button className="bg-white text-red-800 px-6 py-2 rounded w-full text-right pl-4 text-sm flex-none transition-all duration-300 hover:text-black">
                    Go to Course page &gt;
                  </button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}













  