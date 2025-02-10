import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Hey! Your academic companion is here!</h1>
      <p className="text-gray-500 text-center max-w-md mb-8">
        Your academic companion for IIT Madras Degree in Data Science—ask questions, find resources, and boost your learning!
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
        <Link href="/programme-guidelines" className="p-6 bg-white shadow-md rounded-xl cursor-pointer hover:shadow-lg text-center transform transition-transform duration-300 hover:scale-105">
          <div className="h-8 w-8 mb-2 mx-auto text-maroon-600">📜</div>
          <h2 className="text-xl font-semibold text-blue-600">Programme Guidelines</h2>
          <p className="text-gray-500">Get answers related to programme rules, courses, and policies.</p>
        </Link>

        <Link href="/choose-subject" className="p-6 bg-white shadow-md rounded-xl cursor-pointer hover:shadow-lg text-center transform transition-transform duration-300 hover:scale-105">
          <div className="h-8 w-8 mb-2 mx-auto text-mustard-500">📚</div>
          <h2 className="text-xl font-semibold text-green-600">Subject-Specific Queries</h2>
          <p className="text-gray-500">Find explanations, notes, and subject-related information.</p>
        </Link>
      </div>
    </div>
  );
}

