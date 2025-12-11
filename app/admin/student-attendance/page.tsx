"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { BouncingDots } from "@/components/global/Loader";

export default function StudentAttendancePage() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [interns, setInterns] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/intern/attendance")
      .then((res) => res.json())
      .then((data) => {
        setInterns(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading)
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: isDarkMode ? "#0f172a" : "#f9fafb",
        }}
      >
        <BouncingDots />
      </div>
    );

  return (
    <div
      style={{
        padding: "1.5rem",
        backgroundColor: isDarkMode ? "#0f172a" : "#f9fafb",
        minHeight: "100vh",
        transition: "background 0.3s ease, color 0.3s ease",
      }}
    >
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          marginBottom: "1rem",
          textAlign: "center",
          color: isDarkMode ? "#f3f4f6" : "#111827",
        }}
      >
        Intern Attendance Overview
      </h1>

      <div className="hidden md:block overflow-x-auto rounded-lg">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            borderRadius: "0.75rem",
            overflow: "hidden",
          }}
        >
          <thead>
            <tr
              style={{
                backgroundColor: isDarkMode ? "#1e293b" : "#e5e7eb",
                color: isDarkMode ? "#f9fafb" : "#111827",
              }}
            >
              {[
                "Name",
                "College",
                "Course",
                "Project",
                "Mentor",
                "Attendance Progress",
              ].map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "0.75rem",
                    textAlign: "left",
                    borderBottom: `1px solid ${isDarkMode ? "#334155" : "#d1d5db"
                      }`,
                    fontWeight: 500,
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {interns.map((i) => {
              const total = i.present + i.absent + i.pending;
              const presentPct = total ? ((i.present / total) * 100).toFixed(0) : 0;
              const absentPct = total ? ((i.absent / total) * 100).toFixed(0) : 0;
              const pendingPct = total ? ((i.pending / total) * 100).toFixed(0) : 0;

              return (
                <motion.tr
                  key={i.id}
                  whileHover={{ scale: 1.01 }}
                  style={{
                    backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                    color: isDarkMode ? "#f9fafb" : "#111827",
                    borderBottom: `1px solid ${isDarkMode ? "#334155" : "#d1d5db"
                      }`,
                    transition: "background 0.2s",
                  }}
                >
                  <td style={{ padding: "0.75rem" }}>{i.name}</td>
                  <td style={{ padding: "0.75rem" }}>{i.college}</td>
                  <td style={{ padding: "0.75rem" }}>{i.course}</td>
                  <td style={{ padding: "0.75rem" }}>{i.project}</td>
                  <td style={{ padding: "0.75rem" }}>{i.mentor}</td>
                  <td style={{ padding: "0.75rem" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem",
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          height: "0.75rem",
                          borderRadius: "1rem",
                          background: isDarkMode ? "#374151" : "#e5e7eb",
                          display: "flex",
                          overflow: "hidden",
                        }}
                      >
                        <div
                          style={{
                            width: `${presentPct}%`,
                            background: "#22c55e",
                          }}
                        />
                        <div
                          style={{
                            width: `${absentPct}%`,
                            background: "#ef4444",
                          }}
                        />
                        <div
                          style={{
                            width: `${pendingPct}%`,
                            background: "#facc15",
                          }}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "0.8rem",
                          color: isDarkMode ? "#9ca3af" : "#4b5563",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {presentPct}% Present
                      </span>
                      <button
                        onClick={async () => {
                          try {
                            const res = await fetch(
                              `/api/intern/attendance/${i.id}`
                            );
                            const data = await res.json();
                            if (data.attendance) {
                              const now = new Date();
                              import("@/utils/generatePDF").then((mod) => {
                                mod.generateAttendancePDF(
                                  data.name,
                                  data.attendance,
                                  now.getMonth(),
                                  now.getFullYear()
                                );
                              });
                            }
                          } catch (error) {
                            console.error("Failed to download PDF", error);
                          }
                        }}
                        style={{
                          padding: "0.25rem 0.5rem",
                          fontSize: "0.75rem",
                          borderRadius: "0.25rem",
                          backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
                          color: isDarkMode ? "#f3f4f6" : "#111827",
                          border: "none",
                          cursor: "pointer",
                        }}
                        title="Download Monthly Report"
                      >
                        ⬇️
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div
        className="md:hidden flex flex-col gap-4"
        style={{ marginTop: "1rem" }}
      >
        {interns.map((i) => {
          const total = i.present + i.absent + i.pending;
          const presentPct = total ? ((i.present / total) * 100).toFixed(0) : 0;
          const absentPct = total ? ((i.absent / total) * 100).toFixed(0) : 0;
          const pendingPct = total ? ((i.pending / total) * 100).toFixed(0) : 0;

          return (
            <motion.div
              key={i.id}
              whileHover={{ scale: 1.01 }}
              style={{
                backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                color: isDarkMode ? "#f9fafb" : "#111827",
                borderRadius: "0.75rem",
                border: `1px solid ${isDarkMode ? "#334155" : "#d1d5db"}`,
                padding: "1rem",
                boxShadow: isDarkMode
                  ? "0 1px 4px rgba(255,255,255,0.05)"
                  : "0 1px 4px rgba(0,0,0,0.1)",
              }}
            >
              <p>
                <strong>Name:</strong> {i.name}
              </p>
              <p>
                <strong>College:</strong> {i.college}
              </p>
              <p>
                <strong>Course:</strong> {i.course}
              </p>
              <p>
                <strong>Project:</strong> {i.project}
              </p>
              <p>
                <strong>Mentor:</strong> {i.mentor}
              </p>
              <div style={{ marginTop: "0.75rem" }}>
                <div
                  style={{
                    background: isDarkMode ? "#374151" : "#e5e7eb",
                    borderRadius: "1rem",
                    height: "0.75rem",
                    display: "flex",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${presentPct}%`,
                      background: "#22c55e",
                    }}
                  />
                  <div
                    style={{
                      width: `${absentPct}%`,
                      background: "#ef4444",
                    }}
                  />
                  <div
                    style={{
                      width: `${pendingPct}%`,
                      background: "#facc15",
                    }}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <p
                    style={{
                      fontSize: "0.8rem",
                      color: isDarkMode ? "#9ca3af" : "#4b5563",
                    }}
                  >
                    {presentPct}% Present
                  </p>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `/api/intern/attendance/${i.id}`
                        );
                        const data = await res.json();
                        if (data.attendance) {
                          const now = new Date();
                          import("@/utils/generatePDF").then((mod) => {
                            mod.generateAttendancePDF(
                              data.name,
                              data.attendance,
                              now.getMonth(),
                              now.getFullYear()
                            );
                          });
                        }
                      } catch (error) {
                        console.error("Failed to download PDF", error);
                      }
                    }}
                    style={{
                      padding: "0.25rem 0.5rem",
                      fontSize: "0.75rem",
                      borderRadius: "0.25rem",
                      backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
                      color: isDarkMode ? "#f3f4f6" : "#111827",
                      border: "none",
                      cursor: "pointer",
                    }}
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
