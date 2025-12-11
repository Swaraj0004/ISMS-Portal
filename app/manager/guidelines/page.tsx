"use client";

import { ShieldCheck, AlertTriangle, Info } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function GuidelinesPage() {
  const { theme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    setIsDarkMode(theme === "dark");
  }, [theme]);

  const guidelines = [
    "Monitor daily attendance and weekly progress reports of assigned students diligently.",
    "Provide timely feedback and assistance to student interns as needed.",
    "Maintain confidentiality of all student data and project details.",
    "Ensure all pending weekly reports are reviewed and approved before attendance finalization.",
    "Communicate updates and notices from Admin to students in your group effectively.",
    "Follow MRSAC’s HR policies and guidelines when managing projects and interns.",
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        padding: "clamp(1rem, 4vw, 2rem)",
        minHeight: "100vh",
        backgroundColor: isDarkMode ? "#0f172a" : "#f9fafb",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
      }}
    >
      <div
        style={{
          backgroundColor: isDarkMode
            ? "rgba(31,41,55,0.9)"
            : "rgba(255,255,255,0.95)",
          backdropFilter: "blur(10px)",
          borderRadius: "1rem",
          padding: "clamp(1.25rem, 3vw, 2rem)",
          boxShadow: isDarkMode
            ? "0 4px 20px rgba(0,0,0,0.4)"
            : "0 4px 20px rgba(0,0,0,0.1)",
          border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
          width: "100%",
          maxWidth: "850px",
          transition: "all 0.3s ease",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.75rem",
            marginBottom: "clamp(1rem, 3vw, 1.5rem)",
            flexWrap: "wrap",
          }}
        >
          <ShieldCheck
            style={{
              width: "clamp(1.5rem, 3vw, 2rem)",
              height: "clamp(1.5rem, 3vw, 2rem)",
              color: isDarkMode ? "#60a5fa" : "#2563eb",
            }}
          />
          <h1
            style={{
              fontSize: "clamp(1.25rem, 2.5vw, 1.75rem)",
              fontWeight: 600,
              color: isDarkMode ? "#f3f4f6" : "#1f2937",
              lineHeight: 1.2,
            }}
          >
            Manager Guidelines
          </h1>
        </div>

        <p
          style={{
            color: isDarkMode ? "#d1d5db" : "#4b5563",
            marginBottom: "1.5rem",
            lineHeight: 1.6,
            fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
          }}
        >
          Please review and follow these operational guidelines carefully to
          ensure smooth, secure, and compliant functioning of the internship
          management portal.
        </p>

        <ul
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "1rem",
          }}
        >
          {guidelines.map((line, index) => (
            <li
              key={index}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: "0.75rem",
                padding: "clamp(0.75rem, 2vw, 1rem)",
                backgroundColor: isDarkMode
                  ? "rgba(17,24,39,0.7)"
                  : "rgba(243,244,246,0.9)",
                border: `1px solid ${isDarkMode ? "#374151" : "#e5e7eb"}`,
                borderRadius: "0.75rem",
                transition: "background-color 0.3s ease, transform 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.backgroundColor = isDarkMode
                  ? "rgba(31,41,55,0.8)"
                  : "rgba(249,250,251,1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.backgroundColor = isDarkMode
                  ? "rgba(17,24,39,0.7)"
                  : "rgba(243,244,246,0.9)";
              }}
            >
              <Info
                style={{
                  width: "1.25rem",
                  height: "1.25rem",
                  color: isDarkMode ? "#60a5fa" : "#2563eb",
                  marginTop: "0.25rem",
                  flexShrink: 0,
                }}
              />
              <span
                style={{
                  color: isDarkMode ? "#e5e7eb" : "#1f2937",
                  fontSize: "clamp(0.9rem, 1.8vw, 1rem)",
                  lineHeight: 1.6,
                }}
              >
                {line}
              </span>
            </li>
          ))}
        </ul>

        <div
          style={{
            marginTop: "2rem",
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            fontSize: "clamp(0.8rem, 1.5vw, 0.9rem)",
            color: isDarkMode ? "#9ca3af" : "#6b7280",
            lineHeight: 1.4,
            flexWrap: "wrap",
          }}
        >
          <AlertTriangle
            style={{
              width: "1rem",
              height: "1rem",
              color: isDarkMode ? "#fbbf24" : "#d97706",
            }}
          />
          <span>
            Non-compliance with these guidelines may result in restricted access
            or administrative action.
          </span>
        </div>
      </div>
    </motion.div>
  );
}
