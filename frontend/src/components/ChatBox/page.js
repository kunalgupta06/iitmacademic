"use client";

import { useState, useEffect, useRef } from "react";
import { sendProgrammeGuidelineQuery, sendSubjectQuery } from "../../services/chatService";
import { useSearchParams } from "next/navigation";
import ReactMarkdown from "react-markdown";

export default function ChatBox({ apiType }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [currentChat, setCurrentChat] = useState([]);
  const [selectedChatId, setSelectedChatId] = useState(null);
  const [messageCount, setMessageCount] = useState(0);
  const [messageLimitReached, setMessageLimitReached] = useState(false);
  const chatEndRef = useRef(null);

  const searchParams = useSearchParams();
  const subject = searchParams.get("subject");

  const MAX_MESSAGES = 5;

  const sendMessage = async () => {
    if (!input.trim() || messageLimitReached) return;

    const newMessages = [...currentChat, { sender: "user", text: input }];
    setCurrentChat(newMessages);
    setInput("");
    setMessageCount((prev) => {
      const updated = prev + 1;
      if (updated >= MAX_MESSAGES) {
        setMessageLimitReached(true);
      }
      return updated;
    });

    try {
      let response;
      if (apiType === "programme-guideline") {
        response = await sendProgrammeGuidelineQuery(input);
      } else if (apiType === "subject-queries") {
        response = await sendSubjectQuery(input, subject);
      }

      const updatedMessages = [
        ...newMessages,
        { sender: "ai", text: response?.answer || "No response received." },
      ];
      setCurrentChat(updatedMessages);
    } catch (error) {
      setCurrentChat([
        ...newMessages,
        { sender: "ai", text: "Error: Unable to get a response." },
      ]);
    }
  };

  const startNewChat = () => {
    if (currentChat.length > 0) {
      setChatHistory([
        { id: Date.now(), name: `Chat ${chatHistory.length + 1}`, messages: currentChat },
        ...chatHistory,
      ]);
    }
    setCurrentChat([]);
    setSelectedChatId(null);
    setMessageCount(0);
    setMessageLimitReached(false);
  };

  const openChat = (chatId) => {
    const chat = chatHistory.find((c) => c.id === chatId);
    if (chat) {
      setCurrentChat(chat.messages);
      setSelectedChatId(chatId);
    }
  };

  const renameChat = (chatId, newName) => {
    setChatHistory(
      chatHistory.map((chat) =>
        chat.id === chatId ? { ...chat, name: newName } : chat
      )
    );
  };

  const deleteChat = (chatId) => {
    setChatHistory(chatHistory.filter((chat) => chat.id !== chatId));
    if (selectedChatId === chatId) {
      setCurrentChat([]);
      setSelectedChatId(null);
    }
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentChat]);

  return (
    <div className="w-full min-h-screen flex flex-col items-center justify-center bg-[#a31d1d] p-4">
      <div className="flex items-center justify-center space-x-3 mt-20">
        <h1 className="text-white text-2xl font-bold text-center">
          How can I assist you today?
        </h1>
      </div>

      <div className="bg-white rounded-2xl shadow-lg flex flex-col md:flex-row overflow-hidden w-full md:w-4.5/5 lg:w-4/5 h-[78vh] mt-2">
        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-gray-200 p-4 flex flex-col rounded-t-2xl md:rounded-l-2xl md:rounded-tr-none">
          <h2 className="text-lg text-black font-bold mb-3 text-center">Chat History</h2>
          <button
            onClick={startNewChat}
            className="w-full bg-blue-500 text-white py-2 rounded-md mb-4 hover:bg-blue-700"
          >
            + New Chat
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 custom-scrollbar">
            {chatHistory.map((chat) => (
              <div
                key={chat.id}
                className="flex items-center text-black justify-between bg-white p-2 rounded-md hover:bg-gray-300"
              >
                <input
                  type="text"
                  value={chat.name}
                  onChange={(e) => renameChat(chat.id, e.target.value)}
                  className="w-full bg-transparent focus:outline-none"
                  onClick={() => openChat(chat.id)}
                />
                <button
                  onClick={() => deleteChat(chat.id)}
                  className="text-red-500 font-bold hover:text-red-700"
                >
                  ✖
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Window */}
        <div className="w-full md:w-3/4 flex flex-col justify-between p-4 rounded-b-2xl md:rounded-r-2xl md:rounded-bl-none">
          {/* Chat messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {currentChat.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`p-3 rounded-lg max-w-[80%] text-white whitespace-pre-wrap ${
                    msg.sender === "user" ? "bg-blue-500" : "bg-gray-700"
                  } shadow-md`}
                >
                  {msg.sender === "ai" ? (
                    <ReactMarkdown>{msg.text}</ReactMarkdown>
                  ) : (
                    msg.text
                  )}
                </div>
              </div>
            ))}
            <div ref={chatEndRef}></div>
          </div>

          {/* Input box */}
          <div className="w-full p-4">
            <div className="relative w-full">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                className="w-full p-3 pl-5 pr-28 border-none rounded-full text-black bg-gray-200 focus:outline-none"
                placeholder="Type your message..."
                disabled={messageLimitReached}
              />
              <button
                onClick={sendMessage}
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 rounded-full transition-all duration-200 ${
                  messageLimitReached
                    ? "bg-gray-400 cursor-not-allowed text-white"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
                disabled={messageLimitReached}
              >
                Ask
              </button>
            </div>

            {messageLimitReached && (
              <p className="text-red-600 mt-2 text-center font-semibold">
                Maximum limit reached for messages. Please try again later.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}













