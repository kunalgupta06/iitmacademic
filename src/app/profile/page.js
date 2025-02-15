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
    role: "Student",
    profilePic: defaultPic,
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
      className="relative min-h-screen flex flex-col items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url('/profile_bg.jpg')" }} // Full-page background
    >
      {/* Navbar */}
      <Navbar />

      {/* Transparent Profile Container */}
      <div
        className="absolute flex items-center justify-between p-6"
        style={{
          width: "60%", // Adjust width of the profile container
          height: "50%", // Adjust height of the profile container
          top: "30%", // Adjust distance from top
          left: "16%", // Adjust distance from left
          backgroundColor: "transparent", // Transparent container
        }}
      >
        {/* Left Side: Profile Picture */}
        <div className="flex flex-col items-end w-[76%] mr-10">
          <Image
            src={profile.profilePic}
            alt="Profile"
            width={110}
            height={110}
            className="w-26 h-26 rounded-lg border-4 border-blue-500"
          />

          {/* Upload & Remove Buttons */}
          {isEditing && (
            <div className="mt-3 flex flex-col items-center gap-2">
              <label className="cursor-pointer bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition">
                Choose File
                <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </label>

              {profile.profilePic !== defaultPic && (
                <button
                  onClick={handleRemoveProfilePic}
                  className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition"
                >
                  Remove
                </button>
              )}
            </div>
          )}
        </div>

        {/* Right Side: Details */}
        <div className="w-[85%]">
          <h2 className="text-4xl font-semibold text-gray-900">{profile.fullName}</h2>
          <p className="text-2xl text-gray-700 mb-6">{profile.role}</p>

          {/* Profile Details in 2-Column Grid */}
          <div className="grid grid-cols-2 gap-4">
            {isEditing ? (
              <>
                <div className="flex flex-col">
                  <label className="font-large text-gray-900">Full Name:</label>
                  <input
                    type="text"
                    name="fullName"
                    value={profile.fullName}
                    onChange={handleChange}
                    className="border rounded-md p-2 text-gray-900"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-large text-gray-900">Username:</label>
                  <input
                    type="text"
                    name="username"
                    value={profile.username}
                    onChange={handleChange}
                    className="border rounded-md p-2 text-gray-900"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-large text-gray-900">Email:</label>
                  <input
                    type="email"
                    name="email"
                    value={profile.email}
                    onChange={handleChange}
                    className="border rounded-md p-2 text-gray-900"
                  />
                </div>
                <div className="flex flex-col">
                  <label className="font-large text-gray-900">Password:</label>
                  <input
                    type="password"
                    name="password"
                    value={profile.password}
                    onChange={handleChange}
                    className="border rounded-md p-2 text-gray-900"
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex flex-col">
                  <span className="font-large text-gray-900">Full Name:</span>
                  <span className="text-xl text-gray-700">{profile.fullName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-large text-gray-900">Username:</span>
                  <span className="text-xl text-gray-700">{profile.username}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-large text-gray-900">Email:</span>
                  <span className="text-xl text-gray-700">{profile.email}</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-large text-gray-900">Password:</span>
                  <span className="text-xl text-gray-700">{profile.password}</span>
                </div>
              </>
            )}
          </div>

          {/* Edit Profile Button (Inside the Container) */}
          <div className="mt-8 flex justify-end mr-5">
            <button
              onClick={toggleEdit}
              className="px-6 py-3 bg-blue-600 text-white rounded-md shadow-md hover:bg-blue-700 transition"
            >
              {isEditing ? "Update" : "Edit Profile"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}










