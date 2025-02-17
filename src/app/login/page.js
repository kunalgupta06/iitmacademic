"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "", role: "student" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Redirect based on role
    if (formData.role === "student") {
      window.location.href = "/student-dashboard";
    } else if (formData.role === "instructor") {
      window.location.href = "/instructor-dashboard";
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center ">
      {/* Background Image (Same as Signup Page) */}
      <div className="absolute inset-0">
        <img src="/signup_bg.jpg" alt="Login Background" className="w-full h-full object-cover" />
      </div>

      {/* Login Form Section */}
      <div className="relative w-full max-w-4xl p-8 flex flex-col items-center mt-60">
        {/* Cool Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mb-10">Welcome Back!</h1>

        {/* Form Fields - Horizontally Aligned */}
        <form className="w-full flex flex-wrap justify-center gap-6 items-center" onSubmit={handleSubmit}>
          {/* Email */}
          <div className="w-1/4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none text-black placeholder-gray-500"
            />
          </div>

          {/* Password */}
          <div className="w-1/4">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none text-black placeholder-gray-500"
            />
          </div>

          {/* Role Selection */}
          <div className="w-1/4">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-400 rounded-md bg-white text-black cursor-pointer shadow-sm transition-all duration-300 
                        focus:ring-2 focus:ring-blue-400 focus:border-blue-500 
                        hover:bg-gray-100 hover:border-blue-500"
            >
              <option value="" disabled hidden>Select Role</option>
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>
          
          {/* Login Button */}
          <button
            type="submit"
            className="mt-2 px-6 py-1 border border-blue-600 bg-blue-100 text-blue-700 text-lg rounded-lg shadow-lg hover:bg-blue-200  transition w-1/4"
          >
            Login
          </button>
        </form>

        {/* Forgot Password */}
        <p className="mt-2 text-sm text-gray-600">
          <Link href="/forgot-password" className="text-red-500 hover:underline">Forgot Password?</Link>
        </p>

        {/* Redirect to Signup */}
        <p className="mt-2 text-sm text-gray-600">
          Don't have an account? <Link href="/signup" className="text-blue-600 hover:underline">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

