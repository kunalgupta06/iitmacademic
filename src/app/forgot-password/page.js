export default function ForgotPassword() {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-3xl font-bold text-center text-blue-600">Forgot Password</h2>
          <p className="text-sm text-gray-600 text-center mt-2">
            Enter your email to receive a password reset link.
          </p>
  
          <form className="mt-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input 
                type="email" 
                placeholder="Enter your email"
                className="w-full mt-1 px-4 py-2 border rounded-md focus:ring focus:ring-blue-200 outline-none" 
              />
            </div>
  
            {/* Submit Button */}
            <button className="w-full mt-6 px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700">
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
  