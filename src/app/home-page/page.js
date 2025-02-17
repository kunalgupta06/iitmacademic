"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    document.body.classList.add("overflow-hidden"); // Prevent scrolling
    return () => document.body.classList.remove("overflow-hidden"); // Cleanup
  }, []);

  return (
    <div className="h-screen w-screen flex overflow-hidden">
      {/* Left Side - Full-Height Image */}
      <div
        className={`w-3/5 h-full relative flex items-end transition-transform duration-1000 ease-out ${
          isVisible ? "translate-y-6 opacity-100" : "translate-y-16 opacity-0"
        }`}
      >
        <Image
          src="/home.jpg"
          alt="AskIVA Home"
          layout="fill"
          objectFit="cover"
          className="absolute inset-0"
        />
      </div>

      {/* Right Side - Welcome Message (Shifted Closer to Image) */}
      <div
        className={`w-2/5 h-full flex flex-col justify-center items-center p-10 bg-white -ml-6 transition-opacity duration-1000 ease-in ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
      >
        <h1 className="text-5xl font-bold text-blue-700 text-center animate-fadeIn">
          Welcome to AskIVA
        </h1>
        <p className="text-gray-600 mt-4 text-lg text-center">
          Your IITM Academic Chatbot – Ask questions and get instant answers!
        </p>

        {/* Styled Buttons */}
        <div className="mt-6 flex space-x-4">
          <Link href="/login">
            <button className="px-6 py-3 border border-green-600 bg-green-100 text-green-700 text-lg rounded-lg shadow-lg hover:bg-green-200 transition-transform transform hover:scale-105 duration-300">
              Login
            </button>
          </Link>
          <Link href="/signup">
            <button className="px-6 py-3 border border-blue-600 bg-blue-100 text-blue-700 text-lg rounded-lg shadow-lg hover:bg-blue-200 transition-transform transform hover:scale-105 duration-300">
              Signup
            </button>
          </Link>
        </div>

        {/* "Our Mission and Team" Button */}
        <div className="mt-4">
          <Link href="/about-us">
            <button className="px-6 py-3 border border-orange-600 bg-orange-100 text-orange-700 text-lg rounded-lg shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105 duration-300">
              Our Mission and Team
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}
