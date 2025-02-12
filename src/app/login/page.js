"use client";

import { useState } from "react";
import Link from "next/link";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login Data:", formData);
  };

  return (
    <div 
      className="relative w-full h-screen bg-cover bg-center flex items-center justify-end pr-32"
      style={{ backgroundImage: "url('/login_bg.jpg')" }} // Background image
    >
      <div className="bg-white bg-opacity-80 p-10 rounded-lg shadow-xl w-[500px]">
        <h2 className="text-3xl font-bold text-green-800 text-center">Login</h2> {/* Dark Green Heading */}

        <form className="mt-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-gray-900 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white bg-opacity-90 text-gray-900"
            />
          </div>

          <div className="mt-4">
            <label className="block text-gray-900 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 bg-white bg-opacity-90 text-gray-900"
            />
          </div>

          <div className="text-right mt-2">
            <Link href="/forgot-password" className="text-sm text-red-400 hover:underline">
              Forgot password?
            </Link> {/* Light Red */}
          </div>

          <button
            type="submit"
            className="w-full mt-6 bg-green-400 text-white py-3 rounded-lg hover:bg-green-500 transition text-lg"
          >
            Login
          </button> {/* Light Green Button */}
        </form>

        <p className="text-center text-gray-800 mt-4 text-lg">
          Don't have an account? <Link href="/signup" className="text-blue-800 hover:underline">Sign Up</Link> {/* Dark Blue */}
        </p>
      </div>
    </div>
  );
}




