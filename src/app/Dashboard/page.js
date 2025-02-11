import Image from "next/image";
import Link from "next/link";
// import bgImage from "/dashboard_img.png"; // Ensure the image is placed in the public folder

export default function Dashboard() {
  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      {/* Background Image */}
      <Image src={"/dashboard_img.png"} alt="Books Background" layout="fill" objectFit="cover" quality={100} />
      
      {/* Overlaying Content */}
      <div className="absolute top-10 w-full text-center">
        <h1 className="text-4xl font-bold text-gray-800 drop-shadow-lg">Hey! Your academic companion is here!</h1>
        <p className="text-gray-600 text-lg mt-2 drop-shadow-lg">
        Click on the book titles below— 
        <strong>FAQs</strong> for answers to frequently asked questions about the programme, 
        <strong> Subject-Specific Queries</strong> to get help with subject-related doubts and explanations, 
        and <strong>Programme Guidelines</strong> to understand rules, courses, and policies of the programme.
        </p>
      </div>

      {/* Clickable Book Titles */}
      <div className="absolute inset-0 flex items-center justify-center">
        <Link
          href="/faq"
          className="absolute text-white text-lg font-bold drop-shadow-md transition-transform transform hover:scale-110 hover:text-yellow-300"
          style={{ top: "57%", left: "40%" }}
        >
         FAQs
        </Link>
        
        <Link 
          href="/choose-subject" 
          className="absolute text-white text-lg font-bold drop-shadow-md transition-transform transform hover:scale-110 hover:text-blue-400" 
          style={{ top: "66%", left: "35%" }}>
          Subject-Specific Queries
        </Link>

        <Link 
          href="/programme-guideline" 
          className="absolute text-white text-lg font-bold drop-shadow-md text-center transition-transform transform hover:scale-110 hover:text-purple-400" 
          style={{ top: "77%", left: "33%" }}>
          Programme <br /> Guidelines
        </Link>
      </div>
    </div>
  );
}


