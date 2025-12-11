"use client";

import { useState, useEffect, useRef } from "react";
import { FiSend } from "react-icons/fi";
import { useTheme } from "next-themes";
import Toast from "@/components/global/Toast";

interface IMessage {
  _id: string;
  message: string;
  createdAt: string;
  sender: {
    _id: string;
    fullName: string;
    email: string;
  };
}

export default function GroupChat() {
  const { theme } = useTheme();
  const [projectId, setProjectId] = useState<string | null>(null);
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  const userId = user?._id;
  const isDark = theme === "dark";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/intern/projects", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: userId }),
        });

        const data = await res.json();
        if (res.ok && data.projects?.length > 0) {
          setProjectId(data.projects[0].project._id);
        } else {
          setToast({ message: "No assigned projects found", type: "error" });
        }
      } catch (err) {
        console.error(err);
        setToast({ message: "Failed to load projects", type: "error" });
      }
    };

    if (userId) fetchProjects();
  }, [userId]);

  const fetchMessages = async () => {
    if (!projectId) return;
    try {
      const res = await fetch(`/api/project/${projectId}/messages`);
      const data = await res.json();
      if (res.ok) setMessages(data.messages || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (projectId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    }
  }, [projectId]);
  useEffect(() => {
    if (!loading) {
      inputRef.current?.focus();
    }
  }, [loading]);

  const sendMessage = async () => {
    if (!input.trim() || !projectId) return;
    setLoading(true);
    const newMessage = {
      message: input,
      sender: user,
      createdAt: new Date().toISOString(),
    };

    try {
      await fetch(`/api/project/${projectId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newMessage),
      });
      setInput("");
      setMessages((prev) => [...prev, newMessage as IMessage]);
    } catch (err) {
      setToast({ message: "Failed to send message", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  if (!projectId) {
    return (
      <div
        className={`flex flex-col h-full max-h-[90vh] w-full mx-auto rounded-xl shadow-lg border overflow-hidden transition-colors ${
          isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Group Chat</h2>
        </div>
        <div className="flex-1 p-4 flex items-center justify-center">
          <p>No Project Assigned</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex flex-col h-full max-h-[90vh] w-full mx-auto rounded-xl shadow-lg border overflow-hidden transition-colors ${
        isDark ? "bg-gray-900 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <div
        className={`p-4 border-b ${
          isDark ? "border-gray-700 bg-gray-800" : "border-gray-200 bg-gray-50"
        }`}
      >
        <h2 className="text-lg font-semibold">Group Chat</h2>
      </div>
      <div className="flex-1 p-4 overflow-y-auto space-y-3 min-h-[calc(100vh-200px)]">
        {messages.length === 0 && (
          <p className={`${isDark ? "text-gray-400" : "text-gray-500"}`}>
            No messages yet
          </p>
        )}
        {messages.map((msg, idx) => {
          const isCurrentUser = msg.sender._id === userId;
          return (
            <div
              key={idx}
              className={`flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`px-4 py-2 rounded-lg max-w-[80%] ${
                  isCurrentUser
                    ? "bg-blue-600 text-white rounded-br-none"
                    : isDark
                    ? "bg-gray-700 text-gray-100 rounded-bl-none"
                    : "bg-gray-200 text-gray-900 rounded-bl-none"
                }`}
              >
                <p className="text-sm font-semibold mb-1">
                  {isCurrentUser ? "You" : msg.sender.fullName}
                </p>
                <p>{msg.message}</p>
                <span className="text-xs text-gray-400 block mt-1">
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </div>
            </div>
          );
        })}
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
          placeholder="Type your message..."
          className={`flex-1 border rounded-l-lg px-4 py-2 ${
            isDark
              ? "bg-gray-700 border-gray-600 text-gray-100"
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
