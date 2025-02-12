"use client"; 

import { useState } from "react";
import Image from "next/image";
import Navbar from "@/components/Navbar/page"; // Ensure correct path

export default function Profile() {
  const defaultPic = "/user_icon.png"; // Default profile picture

  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    username: "johndoe123",
    password: "********",
    gender: "male",
    role: "Student", // Non-editable field
    profilePic: defaultPic, // Default profile picture
  });

  const [isEditing, setIsEditing] = useState(false);

  // Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle file upload for profile picture
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, profilePic: imageUrl });
    }
  };

  // Handle profile picture removal
  const handleRemoveProfilePic = () => {
    setProfile({ ...profile, profilePic: defaultPic });
  };

  // Toggle edit mode
  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <div 
      className="min-h-screen bg-cover bg-center" 
      style={{
        backgroundImage: `url(${profile.gender === "male" ? "/Profile_male.jpg" : "/Profile_female.jpg"})`
      }}
    >
      {/* Navbar (Ensure it is imported and renders) */}
      <Navbar />

      <div className="flex items-center justify-start min-h-screen pl-20">
        <div className="w-full max-w-xl bg-white bg-opacity-80 p-6 rounded-lg shadow-md">
          {/* Profile Picture */}
          <div className="flex flex-col items-center">
            <Image
              src={profile.profilePic}
              alt="Profile"
              width={100}
              height={100}
              className="w-24 h-24 rounded-full border-4 border-blue-500"
            />

            {/* Upload & Remove Buttons */}
            {isEditing && (
              <div className="mt-3 flex flex-col items-center gap-2">
                {/* Choose File Button */}
                <label className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
                  Choose File
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden"
                    onChange={handleFileUpload} 
                  />
                </label>

                {/* Remove Profile Picture Button */}
                {profile.profilePic !== defaultPic && (
                  <button 
                    onClick={handleRemoveProfilePic} 
                    className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                  >
                    Remove Profile Picture
                  </button>
                )}
              </div>
            )}

            <h2 className="text-2xl font-semibold mt-3 text-gray-900">{profile.fullName}</h2>
            <p className="text-gray-700">{profile.email}</p>
          </div>

          {/* Profile Details */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            {isEditing ? (
              // Editable Fields
              <>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-900">Full Name:</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    className="border rounded-md p-2 text-gray-900"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-900">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="border rounded-md p-2 text-gray-900"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-900">Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    className="border rounded-md p-2 text-gray-900"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-medium text-gray-900">Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={profile.password}
                    onChange={handleChange}
                    className="border rounded-md p-2 text-gray-900"
                  />
                </div>

                {/* Gender Dropdown */}
                <div className="flex flex-col">
                  <label className="font-medium text-gray-900">Gender:</label>
                  <select
                    name="gender"
                    value={profile.gender}
                    onChange={handleChange}
                    className="border rounded-md p-2 bg-white text-gray-900"
                  >
                    <option value="male" className="text-gray-900">Male</option>
                    <option value="female" className="text-gray-900">Female</option>
                  </select>
                </div>
              </>
            ) : (
              // Display Mode
              <>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">Full Name:</span>
                  <span className="text-gray-700">{profile.fullName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">Email:</span>
                  <span className="text-gray-700">{profile.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">Username:</span>
                  <span className="text-gray-700">{profile.username}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">Password:</span>
                  <span className="text-gray-700">{profile.password}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">Gender:</span>
                  <span className="text-gray-700">{profile.gender === "male" ? "Male" : "Female"}</span>
                </div>

                {/* Non-editable Role Field */}
                <div className="flex flex-col">
                  <span className="font-medium text-gray-900">Role:</span>
                  <span className="text-gray-700">{profile.role}</span>
                </div>
              </>
            )}
          </div>

          {/* Buttons */}
          <div className="mt-6 flex justify-end">
            {isEditing ? (
              <button
                onClick={toggleEdit}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
              >
                Update
              </button>
            ) : (
              <button
                onClick={toggleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Edit Profile
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}




