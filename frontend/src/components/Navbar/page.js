"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function Navbar() {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide Navbar on Login Page
  if (pathname === "/login" || "forgot-password") {
    return null;
  }

  const isPortalPage = ["/student-portal", "/instructor-portal", "/course-content/bdm", "/course-content/se"].includes(pathname);

  return (
    <header className="bg-gray-100 p-4 shadow flex justify-between items-center w-full fixed top-0 left-0 right-0 z-10">
      {/* Logo */}
      <div className="flex items-center space-x-4">
        <Image src="/IITM_logo.png" alt="IIT Madras" width={300} height={80} />
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center space-x-2">
          <span className="font-semibold text-black">John Doe</span>
          <span className="text-lg text-black">👤</span>
        </div>

        {isPortalPage ? (
          <>
            {/* AskIVA Button with Navigation */}
            <Link href="/student-dashboard">
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
            </Link>

            {/* Latest Updates */}
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-black">Latest Updates</span>
              <span className="text-lg text-black">🔔</span>
            </div>
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
        <Link href="/login">
          <button className="bg-gray-100 border-2 border-black font-semibold text-black px-4 py-2 rounded-lg hover:bg-black hover:text-white">
            Sign Out
          </button>
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)} className="text-gray-900 text-xl">
          ☰
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {menuOpen && (
        <div className="absolute top-full right-0 w-full bg-white shadow-md flex flex-col items-center p-4 space-y-3 md:hidden">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-black">John Doe</span>
            <span className="text-lg text-black">👤</span>
          </div>

          {isPortalPage ? (
            <>
              <Link href="/student-dashboard">
                <div className="flex items-center space-x-1 cursor-pointer transition-all duration-300">
                  <span className="font-semibold text-black">AskIVA</span>
                  <Image src="/app_name.png" alt="AskIVA" width={20} height={20} />
                </div>
              </Link>

              <div className="flex items-center space-x-2">
                <span className="font-semibold text-black">Latest Updates</span>
                <span className="text-lg text-black">🔔</span>
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => history.back()}
                className="w-full px-4 py-2 rounded-lg border border-gray-700 text-gray-900 font-semibold transition-all hover:bg-gray-900 hover:text-white shadow-md"
              >
                ⬅ Go Back
              </button>

              {pathname !== "/about-us" && (
                <Link href="/about-us">
                  <button className="w-full px-4 py-2 rounded-lg border border-gray-700 text-gray-900 font-semibold transition-all hover:bg-gray-900 hover:text-white shadow-md">
                    🎯 About Us
                  </button>
                </Link>
              )}
            </>
          )}

          <Link href="/login">
            <button className="w-full px-4 py-2 rounded-lg border border-red-500 text-red-600 font-semibold transition-all hover:bg-red-500 hover:text-white shadow-md">
              ⏻ Logout
            </button>
          </Link>
        </div>
      )}
    </header>
  );
}


