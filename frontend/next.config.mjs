// next.config.mjs
import 'dotenv/config'; // <-- Loads .env.local or .env automatically

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY, // <- Expose to your frontend/backend code
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://localhost:5000/:path*",
      },
    ];
  },
};

export default nextConfig;

  
