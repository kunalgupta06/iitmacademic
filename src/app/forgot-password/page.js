"use client";

export default function ForgotPassword() {
  return (
    <div className="relative w-full min-h-screen bg-white flex justify-center items-center">
      
      {/* Background Image Positioned Using Percentages */}
      <div 
        className="absolute bg-no-repeat bg-contain"
        style={{ 
          bottom: "0%",  // Adjust vertical position
          left: "4%",  // Adjust horizontal position
          width: "100%",  // Adjust width
          height: "100%", // Adjust height
          backgroundImage: "url('/forgot_pwd_img.jpg')" 
        }}
      />

      {/* Forgot Password Container Positioned Using Percentages */}
      <div 
        className="bg-white/90 p-8 rounded-lg shadow-lg border-2 border-black relative"
        style={{ 
          width: "35%",  // Adjust container width
          height: "auto", // Keeps height flexible
          top: "-10%", // Adjust vertical position
          left: "20%", // Adjust horizontal position
        }}
      >
        {/* Forgot Password Heading (Now Black) */}
        <h2 className="text-3xl font-bold text-center text-black">
          Forgot Password
        </h2>

        <p className="text-sm text-gray-600 text-center mt-2">
          Enter your email to receive a password reset link.
        </p>

        <form className="mt-6">
          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-900">Email</label>
            <input 
              type="email" 
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none text-black placeholder-gray-500" 
            />
          </div>

          {/* Submit Button (Yellow) */}
          <button className="w-full mt-6 px-4 py-2 text-black bg-yellow-400 rounded-md hover:bg-yellow-500 font-semibold">
            Send Reset Link
          </button>
        </form>

        {/* Back to Login */}
        <p className="mt-4 text-center text-sm text-gray-600">
          Remember your password? <a href="/login" className="text-blue-600 hover:underline">Login</a>
        </p>
      </div>
    </div>
  );
}







  