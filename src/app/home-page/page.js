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
    <div
      className="h-screen w-screen flex items-center justify-center bg-cover bg-center relative overflow-hidden"
      style={{ backgroundImage: "url('/homepage_bg.jpg')" }} // Background image
    >
      {/* Top Right - Our Mission & Team Button */}
      <div className="absolute top-5 right-5">
        <Link href="/about-us">
          <button className="px-5 py-2 bg-blue-100 text-blue-700 text-lg font-semibold rounded-full shadow-lg border border-blue-800 hover:bg-white hover:text-blue-600 transition-all duration-300">
            Our Mission & Team
          </button>
        </Link>
      </div>

      {/* Left Side - Animated Image (Shifted & Resized) */}
      <div
        className={`absolute left-10 top-1 w-[60%] h-[90%] transition-transform duration-1000 ease-out ${
          isVisible ? "translate-y-6 opacity-100" : "translate-y-16 opacity-0"
        }`}
      >
        <Image
          src="/homepage_img.png"
          alt="AskIVA Home"
          layout="fill"
          objectFit="contain"
        />
      </div>

      {/* Right Side - Welcome Message & Buttons */}
      <div className="absolute top-[27%] right-10 text-center">
        {/* Rounded Border Effect */}
        <h1 className="text-5xl font-bold animate-fadeIn text-blue-800 px-6 py-2 inline-block">
          Welcome to AskIVA!
        </h1>

        {/* Tagline */}
        <p className="mt-4 text-lg text-blue-700">
          Your AI-powered academic sidekick—ask away and get instant answers!
        </p>

        {/* Call to Action Text */}
        <p className="mt-12 text-xl font-semibold text-white">
          Got any questions? <span className="text-green-700 font-bold">Just AskIVA!</span>
        </p>

        {/* Buttons with Labels (Now Side by Side) */}
        <div className="mt-5 flex flex-col items-center">
          <div className="flex space-x-6">
            <div className="flex flex-col items-center">
              <p className="text-lg text-white font-semibold mb-3">🚀 Dive In</p>
              <Link href="/login">
                <button className="w-40 px-4 py-2 border-3 border-blue-600 bg-blue-100 text-blue-700 text-lg rounded-lg shadow-lg hover:bg-blue-700 hover:text-white transition-transform transform hover:scale-105 duration-300">
                  Login
                </button>
              </Link>
            </div>

            <div className="flex flex-col items-center">
              <p className="text-lg text-white font-semibold mb-3">📝 Register & Explore</p>
              <Link href="/signup">
                <button className="w-40 px-4 py-2 border-3 border-green-600 bg-green-100 text-green-700 text-lg rounded-lg shadow-lg hover:bg-green-700 hover:text-white transition-transform transform hover:scale-105 duration-300">
                  Sign Up
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}






