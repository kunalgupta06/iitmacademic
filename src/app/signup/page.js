export default function Signup() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-blue-600">Sign Up</h2>
  
          <form className="mt-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input type="text" placeholder="Enter your full name"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none" />
            </div>
  
            {/* Email */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input type="email" placeholder="Enter your email"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none" />
            </div>
  
            {/* Password */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input type="password" placeholder="Create a password"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none" />
            </div>
  
            {/* Confirm Password */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Confirm Password</label>
              <input type="password" placeholder="Confirm your password"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none" />
            </div>
  
            {/* Signup Button */}
            <button className="w-full mt-6 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
              Sign Up
            </button>
          </form>
  
          {/* Redirect to Login */}
          <p className="mt-4 text-center text-sm text-gray-600">
            Already have an account? <a href="/login" className="text-blue-600 hover:underline">Login</a>
          </p>
        </div>
      </div>
    );
  }
  