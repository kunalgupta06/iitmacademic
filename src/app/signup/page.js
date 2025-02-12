"use client";

export default function Signup() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src="/signup_bg.jpg" alt="Signup Background" className="w-full h-full object-cover" />
      </div>

      {/* Signup Form Section */}
      <div className="relative w-full max-w-4xl p-8 flex flex-col items-center mt-60">
        {/* Cool Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mb-10">Register Today!</h1>

        {/* Form Fields - Arranged Horizontally */}
        <form className="w-full flex flex-wrap justify-center gap-6">
          {/* Full Name */}
          <input 
            type="text" 
            placeholder="Full Name"
            className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none text-black placeholder-gray-500 w-1/4"
          />

          {/* Email */}
          <input 
            type="email" 
            placeholder="Email"
            className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none text-black placeholder-gray-500 w-1/4"
          />

          {/* Username */}
          <input 
            type="text" 
            placeholder="Username"
            className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none text-black placeholder-gray-500 w-1/4"
          />

          {/* Role Dropdown */}
          <select 
            defaultValue="" 
            className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none text-black bg-white cursor-pointer w-1/4"
          >
            <option value="" disabled hidden>Select Role</option>
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>

          {/* Password */}
          <input 
            type="password" 
            placeholder="Password"
            className="px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none text-black placeholder-gray-500 w-1/4"
          />
        </form>

        {/* Sign Up Button */}
        <button className="mt-8 px-6 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition">
          Sign Up
        </button>

        {/* Redirect to Login */}
        <p className="mt-4 text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}











  