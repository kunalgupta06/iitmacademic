"use client";

import Image from "next/image";

const teamMembers = [
  { name: "Ann Kurian", email: "21f2000397@ds.study.iitm.ac.in" },
  { name: "Bhavya Sharma", email: "21f2000707@ds.study.iitm.ac.in" },
  { name: "Diya Nathwani", email: "21f1003794@ds.study.iitm.ac.in" },
  { name: "G Hamsini", email: "22f3000767@ds.study.iitm.ac.in" },
  { name: "Kunal Gupta", email: "21f3001818@ds.study.iitm.ac.in" },
  { name: "Riya Palesha", email: "21f1003329@ds.study.iitm.ac.in" },
  { name: "Sankalp Kundu", email: "21f1002742@ds.study.iitm.ac.in" },
];

export default function AboutUsPage() {
  return (
    <div className="min-h-screen py-20 px-6 flex flex-col items-center">
      {/* About Us Heading and Image */}
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 items-center gap-10 animate-fadeIn">
        {/* Left - About Us Heading & Project Overview */}
        <div>
          <h1 className="text-5xl font-extrabold bg-gradient-to-r from-blue-600 to-purple-500 text-transparent bg-clip-text">
            About Us
          </h1>
          <p className="text-gray-700 mt-2 text-lg">
            Learn more about AskIVA and the team behind it!
          </p>

          <h2 className="mt-10 text-3xl font-bold bg-gradient-to-r from-blue-500 to-indigo-500 text-transparent bg-clip-text">
            Project Overview
          </h2>
          <p className="text-gray-800 mt-4 text-lg font-semibold">
            AskIVA - Your IITM Academic Companion!
          </p>
          <p className="text-gray-700 mt-2 text-lg">
            AskIVA (IITM Virtual Assistant) is an AI-powered academic guidance
            agent designed to enhance the learning experience for students
            enrolled in the IITM BS program.
          </p>
          <p className="text-gray-700 mt-2 text-lg">
            Rather than directly providing answers, AskIVA nudges students
            toward better learning strategies and suggests relevant resources.
          </p>
        </div>

        {/* Right - Image */}
        <div className="flex justify-center animate-fadeIn">
          <Image
            src="/about-us.jpg"
            alt="About Us"
            width={600}
            height={500}
            className="transition-transform duration-300 hover:scale-105"
          />
        </div>
      </div>

      {/* Key Features Section */}
      <div className="mt-16 max-w-6xl w-full bg-blue-50 p-8 rounded-lg shadow-lg animate-fadeIn">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Key Features
        </h2>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transform transition duration-300 hover:scale-105">
            <h3 className="text-xl font-semibold text-blue-700">
              🎯 Personalized Academic Guidance
            </h3>
            <p className="text-gray-700 mt-2">
              Directs students to relevant resources.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transform transition duration-300 hover:scale-105">
            <h3 className="text-xl font-semibold text-blue-700">
              📖 Study Strategy Support
            </h3>
            <p className="text-gray-700 mt-2">
              Encourages effective learning habits.
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow hover:shadow-xl transform transition duration-300 hover:scale-105">
            <h3 className="text-xl font-semibold text-blue-700">
              🔗 Collaborative Learning
            </h3>
            <p className="text-gray-700 mt-2">
              Helps students find credible academic references.
            </p>
          </div>
        </div>
      </div>

      {/* Team Section with Grid Design */}
      <div className="mt-16 max-w-6xl w-full animate-fadeIn">
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
          Meet Our Team
        </h2>
        <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-lg shadow-md text-center border border-gray-200 hover:shadow-lg transform transition duration-300 hover:scale-105"
            >
              <h3 className="text-2xl font-semibold text-blue-700">
                {member.name}
              </h3>
              <p className="text-gray-600 mt-2">{member.email}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
