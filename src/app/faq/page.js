"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar/page"; // Import Navbar

const faqs = [
  { question: "How do I reset my password?", answer: "Click 'Forgot password?' on the 'Login' page." },
  { question: "Can I change my role after signing up?", answer: "No, roles once selected while registering/signing up cannot be changed." },
  { question: "What subjects are available?", answer: "Software Engineering, English, Statistics, and more!" },
  { question: "Is there a mobile app available?", answer: "Not yet, but we are working on it!" },
  { question: "How do I contact support?", answer: "Email any team member on the 'About Us'page." },
  { question: "Can I suggest new features?", answer: "Yes! Email any team member with your feedback and/or suggestions on 'About Us' page." },
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
    <div 
      className="w-full h-screen flex flex-col items-center justify-start overflow-hidden"
      style={{ backgroundColor: "#00d0ea" }} 
    >
      {/* Navbar with Go Back to Dashboard 
      <Navbar backLink="/Dashboard" /> */}

      {/* Centered FAQ Image (Heading) */}
      <img 
        src="/faq_img.jpg" 
        alt="FAQ Heading" 
        className="w-[20%] mb-2 mt-8" 
      />

      {/* Transparent FAQ Section */}
      <div className="w-[55%] p-6 rounded-lg shadow-lg bg-white/10 backdrop-blur-md">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search FAQs..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white text-black shadow-md mb-4"
        />

        {/* FAQ List */}
        <div className="overflow-y-auto max-h-[60vh]">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq, index) => (
              <div key={index} className="bg-white shadow-md rounded-lg p-4 mb-4 transition duration-300 hover:shadow-lg">
                <button
                  className="flex justify-between items-center w-full text-left text-lg font-medium text-black"
                  onClick={() => toggleFAQ(index)}
                >
                  {faq.question}
                  <span className="text-blue-600">{openIndex === index ? "−" : "+"}</span>
                </button>
                {openIndex === index && <p className="mt-2 text-black">{faq.answer}</p>}
              </div>
            ))
          ) : (
            <p className="text-white text-center">No FAQs match your search.</p>
          )}
        </div>
      </div>
    </div>
  );
}




