"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar({ backLink = "/" }) {
  const pathname = usePathname();

  // Hide Navbar on home page
  if (pathname === "/home-page") {
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full p-4 flex justify-between items-center z-50">
      {/* App Name (Non-Clickable) */}
      <span className="text-xl font-bold text-black">MyApp</span>

      {/* Navigation Buttons */}
      <div className="space-x-4 flex">
        {/* "Go Back" Button (Now Uses history.back()) */}
        <button
          onClick={() => history.back()}
          className="px-4 py-2 border-2 border-black text-black font-semibold rounded-lg transition-colors hover:bg-black hover:text-white"
        >
          Go Back
        </button>

        {/* Hide "Profile" and "Logout" on Forgot Password & Signup & Login pages */}
        {pathname !== "/forgot-password" && pathname !== "/signup" && pathname !== "/login" && pathname !== "/profile" && (
          <Link href="/profile">
            <button className="px-4 py-2 border-2 border-black text-black font-semibold rounded-lg transition-colors hover:bg-black hover:text-white">
              Profile
            </button>
          </Link>
        )}

        {pathname !== "/forgot-password" && pathname !== "/signup" && pathname !== "/login" && (
          <Link href="/home-page">
            <button className="px-4 py-2 border-2 border-black text-black font-semibold rounded-lg transition-colors hover:bg-black hover:text-white">
              Logout
            </button>
          </Link>
        )}
      </div>
    </nav>
  );
}








