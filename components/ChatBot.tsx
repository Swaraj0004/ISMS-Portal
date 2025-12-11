"use client";

import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";
import { useTheme } from "next-themes";

type Message = { from: "bot" | "user"; text: string; category?: string };

export default function Chatbot() {
  const { theme } = useTheme();

  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      from: "bot",
      text: "Hi 👋 I’m the MRSAC Support Bot. How can I help you today?",
      category: "Welcome",
    },
  ]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [newMessageAlert, setNewMessageAlert] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
    if (open) {
      setNewMessageAlert(false);
      inputRef.current?.focus();
    }
  }, [messages, typing, open]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { from: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setTyping(true);

    try {
      const res = await fetch("/api/faq", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input }),
      });
      const data = await res.json();

      const match = data.answer.match(/^\[(.+?)\]\s(.+)/);
      let category: string | undefined;
      let text = data.answer;
      if (match) {
        category = match[1];
        text = match[2];
      }

      setTimeout(() => {
        setMessages((prev) => [...prev, { from: "bot", text, category }]);
        setTyping(false);

        if (!open) setNewMessageAlert(true);
      }, 800);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          from: "bot",
          text: "Oops! Something went wrong. Please try again later.",
          category: "Error",
        },
      ]);
      setTyping(false);
    }
  };

  const categoryEmoji = (cat?: string) => {
    switch (cat) {
      case "About":
        return "🏢";
      case "Internship":
        return "🎓";
      case "ISMS":
        return "👩‍💻";
      case "Documents":
        return "🧾";
      case "Attendance":
        return "🕒";
      case "Communication":
        return "💬";
      case "Technical Help":
        return "🧠";
      case "Contact":
        return "📞";
      case "Welcome":
        return "👋";
      case "Error":
        return "⚠️";
      default:
        return "🤖";
    }
  };

  const categoryColor = (cat?: string) => {
    switch (cat) {
      case "About":
        return "bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200";
      case "Internship":
        return "bg-green-200 dark:bg-green-800 text-green-800 dark:text-green-200";
      case "ISMS":
        return "bg-purple-200 dark:bg-purple-800 text-purple-800 dark:text-purple-200";
      case "Documents":
        return "bg-pink-200 dark:bg-pink-800 text-pink-800 dark:text-pink-200";
      case "Attendance":
        return "bg-indigo-200 dark:bg-indigo-800 text-indigo-800 dark:text-indigo-200";
      case "Communication":
        return "bg-teal-200 dark:bg-teal-800 text-teal-800 dark:text-teal-200";
      case "Technical Help":
        return "bg-red-200 dark:bg-red-800 text-red-800 dark:text-red-200";
      case "Contact":
        return "bg-gray-200 dark:bg-gray-800 text-gray-800 dark:text-gray-200";
      case "Welcome":
        return "bg-blue-200 dark:bg-blue-800 text-blue-800 dark:text-blue-200";
      case "Error":
        return "bg-red-300 dark:bg-red-900 text-red-900 dark:text-red-300";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-100";
    }
  };

  return (
    <div>
      {open && (
        <div className="fixed bottom-0 right-0 sm:bottom-20 sm:right-5 w-full sm:w-80 flex flex-col max-h-[70vh] md:max-h-[60vh] overflow-hidden z-40">
          <div className="bg-blue-600 text-white p-3 font-semibold text-sm sm:text-base rounded-t-lg flex justify-between items-center">
            <span>🤖 MRSAC Support Chatbot</span>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded-full hover:bg-white/30 dark:hover:bg-black/30 transition"
            >
              <X size={20} />
            </button>
          </div>

          <div
            className="flex-1 overflow-y-auto p-0 sm:p-3 space-y-2 text-sm transition-colors duration-300"
            style={{
              backgroundColor: document.documentElement.classList.contains(
                "dark"
              )
                ? "#ffffff"
                : "#111827",
            }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded-2xl max-w-[75%] break-words relative shadow-md ${
                  msg.from === "bot"
                    ? "bg-white/30 dark:bg-gray-800/60 text-gray-800 dark:text-gray-100 self-start"
                    : "bg-blue-600 text-white self-end ml-auto"
                }`}
              >
                {msg.from === "bot" && msg.category && (
                  <span
                    className={`inline-block mr-1 px-2 py-0.5 text-xs rounded-full font-semibold ${categoryColor(
                      msg.category
                    )}`}
                  >
                    {categoryEmoji(msg.category)} {msg.category}
                  </span>
                )}
                <span>{msg.text}</span>
              </div>
            ))}

            {typing && (
              <div className="flex items-center space-x-1 p-2 rounded-2xl max-w-[40%] bg-white/30 dark:bg-gray-800/60 animate-pulse self-start">
                <span className="w-2 h-2 bg-gray-800 dark:bg-gray-100 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-800 dark:bg-gray-100 rounded-full animate-bounce animation-delay-200"></span>
                <span className="w-2 h-2 bg-gray-800 dark:bg-gray-100 rounded-full animate-bounce animation-delay-400"></span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className="flex border-t border-white/20 dark:border-black/30 p-1 sm:p-2 bg-white/10 dark:bg-black/20 backdrop-blur-md bg-white">
            <input
              ref={inputRef}
              type="text"
              className="flex-1 glass-input text-sm focus:outline-none text-gray-500 dark:text-gray-400 placeholder-gray-500 dark:placeholder-gray-400 rounded-lg px-2 py-1 bg-white"
              placeholder="Ask your question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="ml-2 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition transform hover:scale-105"
            >
              Send
            </button>
          </div>
        </div>
      )}

      {!open && (
        <button
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 md:bottom-6 md:right-6 bg-white/20 dark:bg-black/30 backdrop-blur-md p-4 rounded-full shadow-lg hover:scale-110 transition-transform animate-pulse z-50"
        >
          {newMessageAlert && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full animate-ping"></span>
          )}
          <MessageCircle size={24} className="text-white" />
        </button>
      )}
    </div>
  );
}
