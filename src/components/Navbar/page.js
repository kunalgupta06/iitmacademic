"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { useState } from "react";

export default function Navbar({ backLink = "/" }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Hide Navbar on specific pages
  if (["/home-page", "/student-portal", "/instructor-portal", "/login"].includes(pathname)) {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md px-4 md:px-6 py-3 flex justify-between items-center z-50">
      {/* App Logo & Name */}
      <div className="flex items-center space-x-3">
        <Image
          src="/app_name.png"
          alt="App Logo"
          width={40}
          height={40}
          className="w-10 h-10 object-contain"
        />
        <span className="text-xl md:text-2xl font-bold text-black">AskIVA</span>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex space-x-4">
        <button
          onClick={() => history.back()}
          className="px-4 py-2 rounded-lg border border-gray-700 text-gray-900 font-semibold transition-all hover:bg-gray-900 hover:text-white shadow-md"
        >
          ⬅ Go Back
        </button>

        {pathname !== "/about-us" && (
          <Link href="/about-us">
            <button className="px-4 py-2 rounded-lg border border-gray-700 text-gray-900 font-semibold transition-all hover:bg-gray-900 hover:text-white shadow-md">
              🎯 Our Mission & Team
            </button>
          </Link>
        )}

        {pathname !== "/forgot-password" && pathname !== "/signup" && pathname !== "/login" && (
          <Link href="/login">
            <button className="px-4 py-2 rounded-lg border border-red-500 text-red-600 font-semibold transition-all hover:bg-red-500 hover:text-white shadow-md flex items-center space-x-2">
              <span>⏻</span> <span>Logout</span>
            </button>
          </Link>
        )}
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
          <button
            onClick={() => history.back()}
            className="w-full px-4 py-2 rounded-lg border border-gray-700 text-gray-900 font-semibold transition-all hover:bg-gray-900 hover:text-white shadow-md"
          >
            ⬅ Go Back
          </button>

          {pathname !== "/about-us" && (
            <Link href="/about-us">
              <button className="w-full px-4 py-2 rounded-lg border border-gray-700 text-gray-900 font-semibold transition-all hover:bg-gray-900 hover:text-white shadow-md">
                🎯 Our Mission & Team
              </button>
            </Link>
          )}

          {pathname !== "/forgot-password" && pathname !== "/signup" && pathname !== "/login" && (
            <Link href="/login">
              <button className="w-full px-4 py-2 rounded-lg border border-red-500 text-red-600 font-semibold transition-all hover:bg-red-500 hover:text-white shadow-md">
                ⏻ Logout
              </button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
