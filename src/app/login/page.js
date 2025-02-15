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
    console.log("Login Data:", formData);

    // Redirect based on role
    if (formData.role === "student") {
      window.location.href = "/student-dashboard"; // Redirect to Student Dashboard
    } else if (formData.role === "instructor") {
      window.location.href = "/instructor-dashboard"; // Redirect to Instructor Analysis Page
    }
  };

  return (
    <div 
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-end pr-24"
      style={{ backgroundImage: "url('/login_bg.jpg')" }} // Background image
    >
      <div className="bg-white bg-opacity-80 p-6 rounded-lg shadow-xl w-[450px]">
        <h2 className="text-2xl font-bold text-green-800 text-center">Login</h2> {/* Dark Green Heading */}

        <form className="mt-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-900 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              //required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white bg-opacity-90 text-gray-900"
            />
          </div>

          <div className="mt-3">
            <label className="block text-gray-900 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              //required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white bg-opacity-90 text-gray-900"
            />
          </div>

          {/* Role Selection Field */}
          <div className="mt-3">
            <label className="block text-gray-900 font-medium">Login as</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white bg-opacity-90 text-gray-900"
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
            </select>
          </div>

          <div className="text-right mt-2">
            <Link href="/forgot-password" className="text-sm text-red-400 hover:underline">
              Forgot password?
            </Link> {/* Light Red */}
          </div>

          <button
            type="submit"
            className="w-full mt-4 bg-green-400 text-white py-2 rounded-lg hover:bg-green-500 transition text-lg"
          >
            Login
          </button> {/* Light Green Button */}
        </form>

        <p className="text-center text-gray-800 mt-3 text-sm">
          Don't have an account? <Link href="/signup" className="text-blue-800 hover:underline">Sign Up</Link> {/* Dark Blue */}
        </p>
      </div>
    </div>
  );
}

