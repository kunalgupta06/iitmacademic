"use client";

export default function AboutUs() {
  return (
    <div className="relative w-full h-screen bg-white">
      {/* Right-side Background Image */}
      <div className="absolute top-0 right-2 w-[50%] h-full">
        <img
          src="/about_us_img.jpg"
          alt="About Us"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Title - Centered Below Navbar 
      <h1 className="absolute top-[5%] left-1/2 transform -translate-x-1/2 text-3xl font-bold text-gray-900">
        Our Mission & Team
      </h1>*/}

      {/* Content Section on the Left */}
      <div
        className="absolute w-[45%] h-[90%] left-[3%] top-[7.5%] bg-white p-8"
      >
        {/* About Project */}
        <h2 className="text-2xl font-semibold text-black mb-3">
          Project Overview
        </h2>
        <p className="text-yellow-500 mb-2">
          <strong>AskIVA - Your IITM Academic Companion!</strong>
        </p>
        <p className="text-gray-700 mb-2">
          AskIVA (IITM Virtual Assistant) is an AI-powered academic guidance
          agent designed to enhance the learning experience for students
          enrolled in the IITM BS program.
        </p>
        <p className="text-gray-700 mb-2">
          Rather than directly providing answers, AskIVA nudges students toward
          better learning strategies and suggests relevant resources.
        </p>

        {/* Key Features */}
        <h3 className="text-lg font-semibold text-red-500 mt-4 mb-2">
          Key Features
        </h3>
        <ul className="list-disc list-inside text-gray-700 space-y-1">
          <li>
            <strong>Personalized Academic Guidance:</strong> Directs students to
            relevant resources.
          </li>
          <li>
            <strong>Study Strategy Support:</strong> Encourages effective
            learning habits.
          </li>
          <li>
            <strong>Collaborative Learning Environment:</strong> Helps students
            find credible academic references.
          </li>
        </ul>

        {/* Meet Our Team */}
        <h2 className="text-2xl font-semibold text-black mt-6 mb-2">
          Meet Our Team
        </h2>
        <ul className="text-gray-700 space-y-1">
          <li>
            Ann Kurian -{" "}
            <a
              href="mailto:21f2000397@ds.study.iitm.ac.in"
              className="text-blue-600 hover:underline"
            >
              21f2000397@ds.study.iitm.ac.in
            </a>
          </li>
          <li>
            Bhavya Sharma -{" "}
            <a
              href="mailto:21f2000707@ds.study.iitm.ac.in"
              className="text-blue-600 hover:underline"
            >
              21f2000707@ds.study.iitm.ac.in
            </a>
          </li>
          <li>
            Diya Nathwani -{" "}
            <a
              href="mailto:21f1003794@ds.study.iitm.ac.in"
              className="text-blue-600 hover:underline"
            >
              21f1003794@ds.study.iitm.ac.in
            </a>
          </li>
          <li>
            G Hamsini -{" "}
            <a
              href="mailto:22f3000767@ds.study.iitm.ac.in"
              className="text-blue-600 hover:underline"
            >
              22f3000767@ds.study.iitm.ac.in
            </a>
          </li>
          <li>
            Kunal Gupta -{" "}
            <a
              href="mailto:21f3001818@ds.study.iitm.ac.in"
              className="text-blue-600 hover:underline"
            >
              21f3001818@ds.study.iitm.ac.in
            </a>
          </li>
          <li>
            Riya Palesha -{" "}
            <a
              href="mailto:21f1003329@ds.study.iitm.ac.in"
              className="text-blue-600 hover:underline"
            >
              21f1003329@ds.study.iitm.ac.in
            </a>
          </li>
          <li>
            Sankalp Kundu -{" "}
            <a
              href="mailto:21f1002742@ds.study.iitm.ac.in"
              className="text-blue-600 hover:underline"
            >
              21f1002742@ds.study.iitm.ac.in
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}





  
  
  