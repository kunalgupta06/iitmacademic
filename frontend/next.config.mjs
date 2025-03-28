/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: "/api/:path*", // Proxy all /api/* requests
          destination: "http://localhost:5000/:path*", // Redirect to Flask backend
        },
      ];
    },
  };
  
  export default nextConfig;
  
