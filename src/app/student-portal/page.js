"use client";

import Image from 'next/image';
import { useState } from 'react';

export default function StudentPortal() {
  const [isHovered, setIsHovered] = useState(false);

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
              <span className="font-semibold text-black">John Doe</span>
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
        <div className="container mx-auto mt-20 p-4">
          <div className="text-right mb-3 mt-10">
              <p className="font-semibold text-lg text-black">18 February, 2025</p>
              <p className="text-gray-600 text-black">JANUARY 2025 TERM</p>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-black">My Current Courses</h2>
          </div>
          <p className="mt-4 text-black">Cumulative Grade Point Average (CGPA) till this term - <b>8.91</b></p>
          <p className="text-black">Project Cumulative Grade Point Average (Project CGPA) till this term - <b>9.25</b></p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-10">
            {["Strategies for Professional Growth", "AI: Search Methods for Problem Solving", "Software Testing", "Software Engineering"].map((course, index) => (
              <div key={index} className="bg-white text-black rounded-lg shadow-lg overflow-hidden flex flex-col h-full">
                <div className="bg-[#4a100e] text-white p-5 h-[55%] text-left">
                  <h3 className="text-lg font-bold">{course}</h3>
                  <p className="text-sm text-white">NEW COURSE</p>
                </div>
                <div className="bg-gray-100 text-black p-1 text-xs flex-grow">
                  <p>Week 1 Assignment - {Math.floor(Math.random() * 16) + 85}.00</p>
                  <p>Week 2 Assignment - {Math.floor(Math.random() * 16) + 85}.00</p>
                  <p>Week 3 Assignment - {Math.floor(Math.random() * 16) + 85}.00</p>
                  <p>Week 4 Assignment - {Math.floor(Math.random() * 16) + 85}.00</p>
                </div>
                <button className="bg-white text-red-800 px-6 py-2 rounded w-full text-right pl-4 text-sm flex-none">Go to Course page &gt;</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}









  