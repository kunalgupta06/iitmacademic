"use client";

import { useState } from "react";

const faqs = [
  { question: "How do I reset my password?", answer: "Click 'Forgot password?' on the login page." },
  { question: "Can I change my role after signing up?", answer: "Contact support for role changes." },
  { question: "What subjects are available?", answer: "Mathematics, Physics, Chemistry, and more!" },
  { question: "Is there a mobile app available?", answer: "Not yet, but we are working on it!" },
  { question: "How do I contact support?", answer: "Use the 'Contact Us' page or email us." },
  { question: "How can I track my progress?", answer: "Your dashboard shows all progress stats." },
  { question: "Can I suggest new features?", answer: "Yes! Email us with your feature suggestions." },
  { question: "Do you offer certificates?", answer: "Yes, certificates are awarded for completed courses." },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleFAQ = (index) => setOpenIndex(openIndex === index ? null : index);

  const filteredFAQs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Left Side: Scrollable FAQ List (Without Visible Scrollbar) */}
      <div className="w-2/3 h-full px-10 py-10 flex flex-col">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">FAQs</h1>

        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white shadow-md text-gray-900 mb-4"
        />

        {/* Scrollable FAQ List (Without Scrollbar) */}
        <div
          className="overflow-y-auto pr-4"
          style={{ 
            maxHeight: "calc(100vh - 150px)", 
            scrollbarWidth: "none", /* Hide scrollbar in Firefox */
            msOverflowStyle: "none"  /* Hide scrollbar in IE/Edge */
          }}
        >
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 transition duration-300 hover:shadow-lg">
                <button
                  className="flex justify-between items-center w-full text-left text-lg font-medium text-gray-700"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <span className="text-blue-600">{openIndex === index ? "−" : "+"}</span>
                </button>
                {openIndex === index && <p className="mt-2 text-gray-600">{faq.answer}</p>}
              </div>
            ))
          ) : (
            <p className="text-gray-600">No FAQs match your search.</p>
          )}
        </div>
      </div>

      {/* Right Side: Fixed Image */}
      <div className="w-1/2 h-full hidden lg:flex justify-center items-center bg-white">
        <img src="/faq.jpg" alt="FAQs" className="w-[450px] rounded-lg" />
      </div>
    </div>
  );
}
