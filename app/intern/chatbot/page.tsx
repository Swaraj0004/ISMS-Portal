"use client";

import { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { useTheme } from "next-themes";
import Toast from "@/components/global/Toast";

interface IMessage {
  _id?: string;
  sender: "user" | "bot";
  message: string;
}

export default function Chatbot() {
  const { theme } = useTheme();
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage: IMessage = { sender: "user", message: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input.trim() }),
      });
      if (!res.ok) throw new Error("Failed to fetch response");
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: "bot", message: data.answer }]);
    } catch (err: any) {
      console.error(err);
      setToast({
        message: err.message || "Something went wrong",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  const isDark = theme === "dark";

  return (
    <div
      className={`flex flex-col h-full max-h-[90vh] w-4/4 mx-auto rounded-xl shadow-lg border overflow-hidden transition-colors ${
        isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div
        className={`p-4 border-b ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
        }`}
      >
        <h2
          className={`${
            isDark ? "text-gray-100" : "text-gray-800"
          } text-lg font-semibold`}
        >
          Chatbot
        </h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[calc(100vh-200px)]">
        {messages.length === 0 && (
          <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
            Ask me anything...
          </p>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-[80%] break-words ${
                msg.sender === "user"
                  ? "bg-blue-600 text-white rounded-br-none"
                  : `${
                      isDark
                        ? "bg-gray-700 text-gray-100 rounded-bl-none"
                        : "bg-gray-200 text-gray-900 rounded-bl-none"
                    }`
              }`}
            >
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef}></div>
      </div>

      <div
        className={`flex p-4 border-t ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
        }`}
      >
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Type your question..."
          className={`flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            isDark
              ? "dark:bg-gray-700 dark:border-gray-600 dark:text-gray-100"
              : "bg-white border-gray-300 text-gray-900"
          }`}
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg flex items-center justify-center"
        >
          {loading ? "..." : <FiSend />}
        </button>
      </div>

      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
