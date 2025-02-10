import Link from "next/link";

export default function Dashboard() {
  return (
    <div className="flex flex-col h-screen items-center justify-center bg-gray-100">
      <h1 className="text-3xl font-bold mb-6">Hey! Your academic companion is here!</h1>

      <div className="flex space-x-4">
        <Link href="/programme-guideline">
          <button className="px-6 py-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700">
            Programme Guideline
          </button>
        </Link>
        <Link href="/subject-queries">
          <button className="px-6 py-3 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700">
            Subject Queries
          </button>
        </Link>
      </div>
    </div>
  );
}
