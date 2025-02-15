"use client";

import { useState, useEffect, useRef } from "react";
import Navbar from "@/components/Navbar/page";
import { sendProgrammeGuidelineQuery, sendSubjectQuery } from "@/services/chatService";

export default function ChatBox({ apiType }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null); // Reference for auto-scrolling

  // Function to send message
  const sendMessage = async () => {
    if (!input.trim()) return;
    const newMessages = [...messages, { sender: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      let response;
      if (apiType === "programme-guideline") {
        console.log("working fine"); 
        response = await sendProgrammeGuidelineQuery(input);
      } else if (apiType === "subject-queries") {
        response = await sendSubjectQuery(input);
      }

      setMessages([...newMessages, { sender: "ai", text: response?.answer || "No response received." }]);
    } catch (error) {
      setMessages([...newMessages, { sender: "ai", text: "Error: Unable to get a response." }]);
    }
  };

  // Auto-scroll to latest message
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-orange-300 p-4">
      
      {/* Navbar with Backlink to "choose-subject" 
      <Navbar backLink="/choose-subject" />*/}

      {/* Heading with Image */}
      <div className="flex items-center justify-center space-x-3 mb-4" style={{ marginBottom: "0.5%", marginTop: "1%" }}>
        <img src="/chatbox_img.png" alt="Chatbot" className="w-[8%] h-auto" /> 
        <h1 className="text-white text-2xl font-bold">How can I assist you today?</h1>
      </div>

      {/* Chat Container (Scrollable) */}
      <div 
        className="bg-white p-4 rounded-2xl shadow-lg flex flex-col justify-between" 
        style={{ width: "80%", height: "80vh", overflow: "hidden" }} 
      >
        
        {/* Messages Area (Scrollable) */}
        <div 
          className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar" 
          style={{ maxHeight: "80%" }}
        >
          {messages.map((msg, index) => (
            <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div className={`p-3 rounded-lg max-w-[80%] text-white ${msg.sender === "user" ? "bg-blue-500" : "bg-gray-700"} shadow-md`}>
                {msg.text}
              </div>
            </div>
          ))}
          {/* Empty div to track last message for auto-scroll */}
          <div ref={chatEndRef}></div>
        </div>

        {/* Input Bar */}
        <div className="relative w-full">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="w-full p-3 pl-5 border-none rounded-full text-black bg-gray-200 focus:outline-none"
            placeholder="Type your message..."
          />
          <button
            onClick={sendMessage}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-full hover:bg-blue-700"
          >
            Ask
          </button>
        </div>

      </div>
    </div>
  );
}



