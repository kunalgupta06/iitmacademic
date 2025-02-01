'use client';

import { useState } from 'react';

export default function Profile() {
  const [user, setUser] = useState({
    name: 'John Doe',
    password: '********',
    profilePic: 'https://via.placeholder.com/150'
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    alert('Profile Saved Successfully!');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser((prev) => ({ ...prev, profilePic: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 shadow-lg rounded-xl bg-white mt-10">
      <h1 className="text-2xl font-bold text-center mb-4 text-black">User Profile</h1>
      <div className="flex justify-center mb-4">
        <div className="w-24 h-24 bg-gray-200 border border-gray-300 rounded-md">
          <img
            src={user.profilePic}
            alt="Profile Picture"
            className="w-full h-full object-cover rounded-md"
          />
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-black">Name</label>
        <input
          type="text"
          name="name"
          value={user.name}
          onChange={handleChange}
          className="w-full mt-1 p-2 border rounded-md"
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-black">Password</label>
        <div className="flex items-center">
          <input
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={user.password}
            onChange={handleChange}
            className="w-full mt-1 p-2 border rounded-md"
          />
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="ml-2 text-blue-500"
          >
            {showPassword ? 'Hide' : 'Show'}
          </button>
        </div>
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-black">Upload New Profile Picture</label>
        <input
          type="file"
          onChange={handleProfilePicChange}
          className="mt-1 p-2 border rounded-md"
        />
      </div>
      <button
        onClick={handleSave}
        className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
      >
        Save Changes
      </button>
    </div>
  );
}


