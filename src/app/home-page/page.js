"use client";

export default function Home() {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
        <h1 className="text-3xl text-black font-bold mb-8">Welcome to MyApp</h1>
        <div className="space-x-4">
          <a href="/login" className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600">Login</a>
          <a href="/signup" className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600">Register</a>
        </div>
      </div>
    );
  }