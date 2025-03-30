"use client";

import { useState } from "react";

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    username: "",
    role: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // const handleSubmit = (e) => {
  //   e.preventDefault();

  //   if (!formData.role) {
  //     alert("Please select a role before signing up.");
  //     return;
  //   }

  //   // Show welcome message
  //   alert(`Welcome ${formData.fullName}! Your ${formData.role === "student" ? "Student" : "Instructor"} Dashboard is ready!`);

  //   // Redirect based on role
  //   if (formData.role === "student") {
  //     window.location.href = "/student-portal";
  //   } else if (formData.role === "instructor") {
  //     window.location.href = "/instructor-portal";
  //   }
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!formData.role) {
      alert("Please select a role before signing up.");
      return;
    }
  
    try {
      const response = await fetch("http://127.0.0.1:5000/register", {  // Flask API URL
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.fullName,  // ✅ Mapping fullName to name (matches your model)
          email: formData.email,
          username: formData.username,
          password: formData.password,
          role: formData.role,
        }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        alert(`Welcome ${formData.fullName}! Your ${formData.role === "student" ? "Student" : "Instructor"} Dashboard is ready!`);
        
        // Redirect based on role
        if (formData.role === "student") {
          window.location.href = "/student-portal";
        } else if (formData.role === "instructor") {
          window.location.href = "/instructor-portal";
        }
      } else {
        alert(data.message);  // Show backend validation errors
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img src="/signup_bg.jpg" alt="Signup Background" className="w-full h-full object-cover" />
      </div>

      {/* Signup Form Section */}
      <div className="relative w-full max-w-4xl p-8 flex flex-col items-center mt-60">
        {/* Cool Heading */}
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Register Today!</h1>

        {/* Form Fields - Horizontally Aligned */}
        <form className="w-full flex flex-wrap justify-center gap-6 items-center" onSubmit={handleSubmit}>
          {/* Full Name */}
          <div className="w-1/4">
            <input 
              type="text" 
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              //required
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none text-black placeholder-gray-500"
            />
          </div>

          {/* Email */}
          <div className="w-1/4">
            <input 
              type="email" 
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              //required
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none text-black placeholder-gray-500"
            />
          </div>

          {/* Username */}
          <div className="w-1/4">
            <input 
              type="text" 
              name="username"
              value={formData.username}
              onChange={handleChange}
              placeholder="Username"
              //required
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none text-black placeholder-gray-500"
            />
          </div>

          {/* Role Dropdown */}
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

          {/* Password */}
          <div className="w-1/4">
            <input 
              type="password" 
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Password"
              //required
              className="w-full px-4 py-2 border rounded-md focus:ring focus:ring-blue-300 outline-none text-black placeholder-gray-500"
            />
          </div>
        </form>

        {/* Sign Up Button */}
        <button 
          type="submit"
          className="mt-4 px-6 py-1 border border-blue-600 bg-blue-100 text-blue-700 text-lg rounded-lg shadow-lg hover:bg-blue-200 transition w-1/4"
          onClick={handleSubmit}
        >
          Sign Up
        </button>

        {/* Redirect to Login */}
        <p className="mt-2 text-sm text-gray-600">
          Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>

      </div>
    </div>
  );
}
