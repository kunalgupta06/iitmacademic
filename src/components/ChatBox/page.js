"use client";

import { useState } from "react";
import { sendProgrammeGuidelineQuery, sendSubjectQuery } from "@/services/chatService";

export default function ChatBox({ apiType }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input.trim()) return;
    console.log(input)
    const newMessages = [...messages, { sender: "user", text: input }];
    console.log(newMessages)
    setMessages(newMessages);
    setInput("");
    console.log(apiType)
    try {
      let response;
      if (apiType === "programme-guideline") {
        console.log("riya")
        response = await sendProgrammeGuidelineQuery(input);
      } else if (apiType === "subject-queries") {
        response = await sendSubjectQuery(input);
      }

      setMessages([...newMessages, { sender: "ai", text: response?.answer || "No response received." }]);
    } catch (error) {
      setMessages([...newMessages, { sender: "ai", text: "Error: Unable to get a response." }]);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <div className="p-4 bg-blue-600 text-white text-xl font-semibold text-center shadow-md">
        Chat Assistant
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
            <div className={`p-3 rounded-lg max-w-xs text-white ${msg.sender === "user" ? "bg-blue-500" : "bg-gray-700"} shadow-md`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 bg-white shadow-md flex">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border border-gray-300 rounded-l-lg focus:outline-none"
          placeholder="Ask your question..."
        />
        <button
          onClick={sendMessage}
          className="px-4 bg-blue-600 text-white font-semibold rounded-r-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
}
