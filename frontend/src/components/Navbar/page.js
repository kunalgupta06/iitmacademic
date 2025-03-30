"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState, useEffect } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [username, setUsername] = useState(null);

  // Fetch username from localStorage when component mounts
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser = JSON.parse(storedUser);
        if (parsedUser?.username) {
          setUsername(parsedUser.username);
        }
      }
    } catch (error) {
      console.error("Error fetching username:", error);
    }
  }, []);

  // Hide Navbar on Login, Register, and Home pages
  if (["/login", "/forgot-password", "/", "/register"].includes(pathname)) {
    return null;
  }

  const isPortalPage = ["/student-portal", "/instructor-portal"].includes(pathname);
  const isCourseContentPage = ["/course-content/ba", "/course-content/se"].includes(pathname);

  return (
    <header className="bg-gray-100 p-4 shadow flex justify-between items-center w-full fixed top-0 left-0 right-0 z-10">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Image src="/IITM_logo.png" alt="IIT Madras" width={300} height={80} />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center space-x-2">
        <span className="font-semibold text-black">{username ?? "Guest"}</span>
        <span className="text-lg text-black">👤</span>
        </div>

        {isPortalPage || isCourseContentPage ? (
          <>
            {/* AskIVA Button */}
            <Link href="/student-dashboard">
              <div
                className={`flex items-center space-x-1 cursor-pointer transition-all duration-300 ${isHovered ? "transform scale-110" : ""}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                <span className="font-semibold text-black">AskIVA</span>
                <Image src="/app_name.png" alt="AskIVA" width={20} height={20} />
                {isHovered && (
                  <div className="absolute mt-20 p-2 bg-[#f8f8f8] text-black text-sm rounded-md border-2 border-black w-max max-w-xs">
                    Got any Questions? Just AskIVA!
                  </div>
                )}
              </div>
            </Link>

            {/* Go Back or Latest Updates */}
            {isCourseContentPage ? (
              <button
                onClick={() => history.back()}
                className="px-4 py-2 rounded-lg border border-gray-700 text-gray-900 font-semibold transition-all hover:bg-gray-900 hover:text-white shadow-md"
              >
                ⬅ Go Back
              </button>
            ) : (
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-black">Latest Updates</span>
                <span className="text-lg text-black">🔔</span>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Go Back Button */}
            <button
              onClick={() => history.back()}
              className="px-4 py-2 rounded-lg border border-gray-700 text-gray-900 font-semibold transition-all hover:bg-gray-900 hover:text-white shadow-md"
            >
              ⬅ Go Back
            </button>

            {/* Our Mission & Team */}
            {pathname !== "/about-us" && (
              <Link href="/about-us">
                <button className="px-4 py-2 rounded-lg border border-gray-700 text-gray-900 font-semibold transition-all hover:bg-gray-900 hover:text-white shadow-md">
                  🎯 About Us
                </button>
              </Link>
            )}
          </>
        )}

        {/* Sign Out Button */}
        <button
          onClick={() => {
            localStorage.removeItem("username"); // ✅ Clear username on logout
            window.location.href = "/login";
          }}
          className="bg-gray-100 border-2 border-black font-semibold text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white"
        >
          Sign Out
        </button>
      </div>
    </header>
  );
}




