"use client";

import Image from "next/image";
import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Background Image */}
      <Image src={"/dashboard_img.png"} alt="Books Background" layout="fill" objectFit="cover" quality={100} />
      
      {/* Top-right buttons */}
      
      <div className="absolute top-5 right-5 flex space-x-4">
      {/* <a href="/login" className="text-blue-600 hover:underline">Login</a> */}
        <Link href="/profile">
          <button className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-md hover:bg-gray-700 transition">
            Your Profile
          </button>
        </Link>

        <Link href="/login">
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-500 transition">
            Logout
          </button>
        </Link>
      </div>

      
      {/* Overlaying Content */}
      <div className="absolute top-10 w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-lg">Hey! Your academic companion is here!</h1>
        <p className="text-gray-600 text-lg mt-2 drop-shadow-lg">
        Click on the book titles below— 
        <strong>FAQs</strong> for answers to frequently asked questions about the programme, 
        <strong> Subject-Specific Queries</strong> to get help with subject-related doubts and explanations, 
        and <strong>Programme Guidelines</strong> for doubts related to rules, courses, and policies of the programme.
        </p>
      </div>

      {/* Clickable Book Titles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Link
          href="/faq"
          className="absolute text-white text-lg font-bold drop-shadow-md transition-transform transform hover:scale-110 hover:text-yellow-300"
          style={{ top: "57%", left: "40%" }}
        >
         FAQs
        </Link>
        
        <Link 
          href="/choose-subject" 
          className="absolute text-white text-lg font-bold drop-shadow-md transition-transform transform hover:scale-110 hover:text-blue-400" 
          style={{ top: "66%", left: "35%" }}>
          Subject-Specific Queries
        </Link>

        <Link 
          href="/programme-guideline" 
          className="absolute text-white text-lg font-bold drop-shadow-md text-center transition-transform transform hover:scale-110 hover:text-purple-400" 
          style={{ top: "77%", left: "33%" }}>
          Programme <br /> Guidelines
        </Link>
      </div>
    </div>
  );
}


