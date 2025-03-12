"use client";

import { useState } from "react";

const faqCategories = {
  General: [
    { question: "How can I access my courses?", answer: "You can access your courses from the student dashboard under the 'Course Content' section." },
    { question: "Is there a mobile app for this platform?", answer: "Currently, there is no mobile app, but the website is fully responsive." },
    { question: "How can I access my courses?", answer: "You can access your courses from the student dashboard under the 'Course Content' section." },
    { question: "Is there a mobile app for this platform?", answer: "Currently, there is no mobile app, but the website is fully responsive." },
    { question: "How can I access my courses?", answer: "You can access your courses from the student dashboard under the 'Course Content' section." },
    { question: "Is there a mobile app for this platform?", answer: "Currently, there is no mobile app, but the website is fully responsive." },
  ],
  Technical: [
    { question: "What browsers are supported?", answer: "We recommend using Chrome, Firefox, or Edge for the best experience." },
    { question: "Why is my video not playing?", answer: "Ensure you have a stable internet connection and try refreshing the page." },
    { question: "What browsers are supported?", answer: "We recommend using Chrome, Firefox, or Edge for the best experience." },
    { question: "Why is my video not playing?", answer: "Ensure you have a stable internet connection and try refreshing the page." },
    { question: "What browsers are supported?", answer: "We recommend using Chrome, Firefox, or Edge for the best experience." },
    { question: "Why is my video not playing?", answer: "Ensure you have a stable internet connection and try refreshing the page." },
  ],
  Courses: [
    { question: "What is the course duration?", answer: "Each course lasts approximately 8 weeks with weekly modules and assignments." },
    { question: "Can I rewatch lectures?", answer: "Yes! All recorded lectures are available in the course content section." },
    { question: "What is the course duration?", answer: "Each course lasts approximately 8 weeks with weekly modules and assignments." },
    { question: "Can I rewatch lectures?", answer: "Yes! All recorded lectures are available in the course content section." },
    { question: "What is the course duration?", answer: "Each course lasts approximately 8 weeks with weekly modules and assignments." },
    { question: "Can I rewatch lectures?", answer: "Yes! All recorded lectures are available in the course content section." },
  ],
  Faculty: [
    { question: "How do I contact my instructor?", answer: "You can message your instructor through the 'Instructor Portal' or email them directly." },
    { question: "How do I contact my instructor?", answer: "You can message your instructor through the 'Instructor Portal' or email them directly." },
    { question: "How do I contact my instructor?", answer: "You can message your instructor through the 'Instructor Portal' or email them directly." },
  ],
};

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("General");
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Get FAQs for the selected category
  const faqs = faqCategories[selectedCategory];

  // Filter FAQs based on search
  const filteredFAQs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen p-6 bg-gray-100 flex flex-col items-center">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 mt-20">Frequently Asked Questions</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder={`Search ${selectedCategory} FAQs...`}
        className="p-3 w-full max-w-md border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-gray-400 mb-4"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      {/* Horizontal Category Bar */}
      <div className="w-full max-w-2xl overflow-x-auto scrollbar-hide">
        <div className="flex space-x-4 pb-2 border-b-2 border-gray-300">
          {Object.keys(faqCategories).map((category) => (
            <div
              key={category}
              className={`px-5 py-2 text-sm font-semibold cursor-pointer transition-all ${
                selectedCategory === category
                  ? " border-blue-600 text-[#A31D1D]"
                  : "text-gray-700 hover:text-[#A31D1D]"
              }`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </div>
          ))}
        </div>
      </div>

      {/* FAQ List */}
      <div className="w-full max-w-2xl bg-white p-6 rounded-lg shadow-lg mt-4">
        {filteredFAQs.length > 0 ? (
          filteredFAQs.map((faq, index) => (
            <div key={index} className="mb-4 border-b border-gray-200 pb-4">
              <button
                className="w-full text-left text-lg font-semibold text-gray-800 flex justify-between items-center"
                onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
              >
                {faq.question}
                <span>{expandedIndex === index ? "▲" : "▼"}</span>
              </button>
              {expandedIndex === index && <p className="mt-2 text-gray-600">{faq.answer}</p>}
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-center">No FAQs found.</p>
        )}
      </div>
    </div>
  );
}
