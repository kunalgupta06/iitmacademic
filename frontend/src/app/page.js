import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f5f5] p-4">
      {/* IITM Logo */}
      <div className="mt-4 mb-6 w-full flex justify-center">
        <Image
          src="/IITM_logo.png"
          alt="IITM Logo"
          width={360}
          height={480}
          priority
          className="max-w-full h-auto"
        />
      </div>

      {/* Heading */}
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mt-8 text-center">
        <span className="text-[#a94442]">Welcome to </span>
        <span className="text-[#800000]">AskIVA</span>
      </h1>

      {/* Tagline */}
      <p className="text-gray-700 text-center mt-4 text-base sm:text-lg md:max-w-2xl px-4">
        Your AI-powered academic sidekick—ask away and get instant answers!
      </p>

      {/* Buttons */}
      <div className="flex flex-wrap gap-4 mt-8 justify-center">
        <Link href="/login">
          <button className="bg-[#800000] text-white px-6 py-2 rounded-full hover:bg-[#a94442] transition text-sm sm:text-base">
            Login
          </button>
        </Link>
        <Link href="/register">
          <button className="bg-[#800000] text-white px-6 py-2 rounded-full hover:bg-[#a94442] transition text-sm sm:text-base">
            Sign Up
          </button>
        </Link>
        <Link href="/about-us">
          <button className="border-2 border-[#800000] text-[#800000] px-6 py-2 rounded-full hover:bg-[#800000] hover:text-white transition text-sm sm:text-base">
            Our Mission & Team
          </button>
        </Link>
      </div>
    </div>
  );
}