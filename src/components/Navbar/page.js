"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function Navbar({ backLink = "/" }) {
  const pathname = usePathname();

  // Hide Navbar on home page
  if (pathname === "/home-page" || pathname === "/student-portal" || pathname === "/instructor-portal") {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50">
      {/* App Name with Logo */}
      <div className="flex items-center space-x-2">
      <Image 
        src="/app_name.png" 
        alt="App Logo" 
        width={40}  // Fixed width
        height={40}  // Fixed height
        className="h-10 w-10 object-contain"
      />
        <span className="text-2xl font-bold text-black">AskIVA</span>
      </div>

      {/* Navigation Buttons */}
      <div className="space-x-4 flex">
        {/* "Go Back" Button */}
        <button
          onClick={() => history.back()}
          className="px-5 py-2 rounded-full border border-gray-700 text-gray-900 font-semibold transition-all hover:bg-gray-900 hover:text-white shadow-md"
        >
          ⬅ Go Back
        </button>

        {/* Hide "Profile" and "Logout" on certain pages 
        {pathname !== "/forgot-password" &&
          pathname !== "/signup" &&
          pathname !== "/login" &&
          pathname !== "/about-us" &&
          pathname !== "/profile" && (
            <Link href="/profile">
              <button className="px-5 py-2 rounded-full border border-gray-700 text-gray-900 font-semibold transition-all hover:bg-gray-900 hover:text-white shadow-md">
                👤 Profile
              </button>
            </Link>
          )} */}

        {pathname !== "/about-us" && (
          <Link href="/about-us">
            <button className="px-5 py-2 rounded-full border border-gray-700 text-gray-900 font-semibold transition-all hover:bg-gray-900 hover:text-white shadow-md">
              🎯 Our Mission & Team
            </button>
          </Link> )}

        {pathname !== "/forgot-password" && pathname !== "/signup" && pathname !== "/login" && pathname !== "/about-us" && (
          <Link href="/home-page">
            <button className="px-5 py-2 rounded-full border border-red-500 text-red-600 font-semibold transition-all hover:bg-red-500 hover:text-white shadow-md flex items-center space-x-2">
              <span>⏻</span> <span>Logout</span>
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}










