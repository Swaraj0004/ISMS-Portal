"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";
import { AlertCircle, Calendar, Package, CheckCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";

interface User {
  fullName: string;
  verified: boolean;
  offerLetter?: string;
}

const StudentDashboardPage: React.FC = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const [user, setUser] = useState<User | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const sentinelRefs = useRef<(HTMLDivElement | null)[]>([]);

  const entries = [
    {
      icon: Package,
      title: "Upload Documents",
      subtitle: "Step 1",
      description:
        "Upload all required documents to start your verification process.",
      items: ["Passport / ID Proof", "Resume / CV", "Other required documents"],
      image: "/images/t1.png",
    },
    {
      icon: Calendar,
      title: "Schedule Interview",
      subtitle: "Step 2",
      description:
        "Schedule your interview with the MRSAC team at a convenient date and time.",
      items: ["Choose available date", "Confirm schedule", "Prepare documents"],
      image: "/images/t2.png",
    },
    {
      icon: AlertCircle,
      title: "Attend Interview & Verification",
      subtitle: "Step 3",
      description:
        "Complete your interview and document verification to get full account access.",
      items: [
        "Attend the interview",
        "Document verification by MRSAC",
        "Receive confirmation",
      ],
      image: "/images/t3.png",
    },
  ];

  const setSentinelRef = (el: HTMLDivElement | null, i: number): void => {
    sentinelRefs.current[i] = el;
  };

  useEffect(() => {
    const handleScroll = () => {
      let bestIndex = 0;
      sentinelRefs.current.forEach((node, i) => {
        if (!node) return;
        const rect = node.getBoundingClientRect();
        if (rect.top < window.innerHeight / 3) bestIndex = i;
      });
      setActiveIndex(bestIndex);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch {
        localStorage.removeItem("user");
        setUser(null);
      }
    }
  }, []);

  return (
    <div
      className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto"
      style={{
        transition: "background 0.3s ease-in-out",
      }}
    >
      <div
        className="relative overflow-hidden shadow-lg rounded-2xl p-5 sm:p-8 mb-8 border max-w-7xl mx-auto"
        style={{
          backgroundColor:
            theme === "dark"
              ? "rgba(15, 23, 42, 0.8)"
              : "rgba(255, 255, 255, 0.95)",
          borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
          color: theme === "dark" ? "#f8fafc" : "#0f172a",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <div
          className="absolute -top-10 -right-10 w-24 sm:w-32 h-24 sm:h-32 rounded-full blur-3xl"
          style={{
            background:
              theme === "dark"
                ? "rgba(59,130,246,0.15)"
                : "rgba(59,130,246,0.1)",
          }}
        />
        <div
          className="absolute -bottom-12 -left-12 w-32 sm:w-48 h-32 sm:h-48 rounded-full blur-3xl"
          style={{
            background:
              theme === "dark"
                ? "rgba(168,85,247,0.15)"
                : "rgba(168,85,247,0.1)",
          }}
        />
        <div className="relative z-10 text-center md:text-left">
          <h2 className="text-2xl sm:text-3xl font-bold break-words">
            Welcome, {user?.fullName || "Student"}!
          </h2>
          <p
            className="mt-2 max-w-2xl mx-auto md:mx-0 text-sm sm:text-base"
            style={{
              color: theme === "dark" ? "#94a3b8" : "#475569",
            }}
          >
            You’re all set! Explore internships, manage your applications, and
            stay updated.
          </p>
        </div>
      </div>

      {!user?.verified ? (
        <section className="py-8 sm:py-12 max-w-4xl mx-auto relative space-y-14 sm:space-y-16">
          <div
            className="absolute left-5 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 hidden md:block"
            style={{
              backgroundColor: theme === "dark" ? "#334155" : "#cbd5e1",
            }}
          />
          {entries.map((entry, index) => {
            const isActive = index === activeIndex;
            const isPast = index < activeIndex;

            return (
              <div
                key={index}
                className="relative flex flex-col md:flex-row gap-6 sm:gap-8 items-start md:items-center"
                ref={(el) => setSentinelRef(el, index)}
              >
                <div
                  className="absolute left-5 md:left-1/2 -translate-x-1/2 top-0 md:top-1/2 md:-translate-y-1/2 w-4 h-4 rounded-full z-10 border-2"
                  style={{
                    backgroundColor: isActive
                      ? "#22c55e"
                      : isPast
                      ? "#86efac"
                      : theme === "dark"
                      ? "#1e293b"
                      : "#f1f5f9",
                    borderColor: theme === "dark" ? "#334155" : "#cbd5e1",
                    transition: "all 0.4s ease",
                  }}
                />

                <div className="md:sticky md:top-24 flex items-center gap-4 md:w-64 md:justify-end md:text-right pr-6 sm:pr-8">
                  <div
                    className="p-3 rounded-full flex items-center justify-center shadow transition-transform duration-500"
                    style={{
                      backgroundColor: isActive
                        ? "#22c55e"
                        : isPast
                        ? "#4ade80"
                        : theme === "dark"
                        ? "#334155"
                        : "#e2e8f0",
                      color: isActive || isPast ? "#fff" : "#475569",
                      transform: isActive
                        ? "scale(1.2)"
                        : isPast
                        ? "scale(1.1)"
                        : "scale(1)",
                    }}
                  >
                    <entry.icon className="w-5 h-5" />
                  </div>
                  <div className="flex flex-col">
                    <span
                      className="text-sm sm:text-base font-semibold"
                      style={{
                        color:
                          isActive || isPast
                            ? theme === "dark"
                              ? "#f1f5f9"
                              : "#1e293b"
                            : theme === "dark"
                            ? "#64748b"
                            : "#94a3b8",
                      }}
                    >
                      {entry.title}
                    </span>
                    <span
                      className="text-xs sm:text-sm"
                      style={{
                        color: theme === "dark" ? "#64748b" : "#94a3b8",
                      }}
                    >
                      {entry.subtitle}
                    </span>
                  </div>
                </div>

                <div className="flex-1 pl-12 sm:pl-16 md:pl-8">
                  <div
                    className="p-4 sm:p-6 rounded-lg shadow-md border transition-all duration-300"
                    style={{
                      backgroundColor:
                        theme === "dark" ? "rgba(30,41,59,0.8)" : "#ffffff",
                      borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
                      color: theme === "dark" ? "#e2e8f0" : "#1e293b",
                    }}
                  >
                    <h3 className="text-lg sm:text-xl font-semibold mb-2">
                      {entry.title}
                    </h3>
                    <p
                      className="mb-4 text-sm sm:text-base"
                      style={{
                        color: theme === "dark" ? "#94a3b8" : "#475569",
                      }}
                    >
                      {entry.description}
                    </p>
                    <ul
                      className="list-disc list-inside space-y-1 text-sm sm:text-base"
                      style={{
                        color: theme === "dark" ? "#94a3b8" : "#475569",
                      }}
                    >
                      {entry.items.map((item, i) => (
                        <li key={i}>{item}</li>
                      ))}
                    </ul>
                    {entry.image && (
                      <img
                        src={entry.image}
                        alt={entry.title}
                        className="mt-4 w-full max-h-56 sm:max-h-64 rounded-lg object-contain transition-transform duration-500 transform hover:scale-105"
                      />
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </section>
      ) : (
        <div
          className="flex flex-col items-center justify-center text-center p-6 sm:p-8 rounded-2xl shadow-lg max-w-4xl mx-auto border"
          style={{
            backgroundColor:
              theme === "dark"
                ? "rgba(15,23,42,0.8)"
                : "rgba(255,255,255,0.95)",
            borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
            color: theme === "dark" ? "#f8fafc" : "#1e293b",
          }}
        >
          <CheckCircle className="w-14 sm:w-16 h-14 sm:h-16 text-green-500 mb-4" />
          <h3 className="text-xl sm:text-2xl font-bold">
            Verification Complete!
          </h3>
          <p
            className="mt-2 text-sm sm:text-base"
            style={{
              color: theme === "dark" ? "#94a3b8" : "#475569",
            }}
          >
            Your dashboard is ready. Welcome aboard!
          </p>
          {user?.offerLetter && (
            <div className="w-full mt-6">
              <iframe
                src={`data:application/pdf;base64,${user.offerLetter}`}
                className="w-full h-[400px] sm:h-[600px] border rounded-lg"
                title="Offer Letter"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default StudentDashboardPage;
