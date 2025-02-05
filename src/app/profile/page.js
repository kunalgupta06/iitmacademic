"use client"; // This is required because we are using useState (a client component)

import { useState } from "react";
import Image from "next/image";

export default function Profile() {
  const gender = "male"; // Change to "female" for testing

  // State for edit mode
  const [isEditing, setIsEditing] = useState(false);

  // User profile state
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "johndoe@example.com",
    phone: "+123 456 7890",
    address: "New York, USA",
  });

  // Handle input change
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Toggle edit mode
  const toggleEdit = () => setIsEditing(!isEditing);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-xl bg-white p-6 rounded-lg shadow-md">
        {/* Profile Picture */}
        <div className="flex flex-col items-center">
          <Image
            src={gender === "male" ? "/boy_profile.jpeg" : "/girl_profile.jpeg"}
            alt="Profile"
            width={100}
            height={100}
            className="w-24 h-24 rounded-full border-4 border-blue-500"
          />
          <h2 className="text-2xl font-semibold mt-3">{profile.fullName}</h2>
          <p className="text-gray-600">{profile.email}</p>
        </div>

        {/* Profile Details (Two-Column Layout) */}
        <div className="mt-6 grid grid-cols-2 gap-4">
          {isEditing ? (
            // Editable Fields
            <>
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">Full Name:</label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleChange}
                  className="border rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">Email:</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleChange}
                  className="border rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">Phone:</label>
                <input
                  type="text"
                  name="phone"
                  value={profile.phone}
                  onChange={handleChange}
                  className="border rounded-md p-2"
                />
              </div>
              <div className="flex flex-col">
                <label className="font-medium text-gray-700">Address:</label>
                <input
                  type="text"
                  name="address"
                  value={profile.address}
                  onChange={handleChange}
                  className="border rounded-md p-2"
                />
              </div>
            </>
          ) : (
            // Display Mode
            <>
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">Full Name:</span>
                <span className="text-gray-600">{profile.fullName}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">Email:</span>
                <span className="text-gray-600">{profile.email}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">Phone:</span>
                <span className="text-gray-600">{profile.phone}</span>
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-700">Address:</span>
                <span className="text-gray-600">{profile.address}</span>
              </div>
            </>
          )}
        </div>

        {/* Buttons */}
        <div className="mt-6 flex justify-between">
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
          <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
