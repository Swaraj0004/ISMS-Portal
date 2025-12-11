"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Toast from "@/components/global/Toast";
import { BouncingDots } from "@/components/global/Loader";

interface IProject {
  _id: string;
  title: string;
  description?: string;
}

interface IProjectAssignment {
  project?: IProject | string;
  startDate: string;
  endDate: string;
  status: "assigned" | "in-progress" | "completed";
}

export default function ProjectDetailsPage() {
  const { theme } = useTheme();
  const [projects, setProjects] = useState<IProjectAssignment[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  const managerId = user?._id;

  const fetchProjects = async () => {
    if (!managerId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/manager/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: managerId }),
      });
      if (!res.ok) throw new Error("Failed to fetch projects");

      const data = await res.json();
      setProjects(data.projects || []);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to load projects", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [managerId]);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return {
          backgroundColor: theme === "dark" ? "#14532d" : "#dcfce7",
          color: theme === "dark" ? "#86efac" : "#166534",
        };
      case "in-progress":
        return {
          backgroundColor: theme === "dark" ? "#78350f" : "#fef9c3",
          color: theme === "dark" ? "#facc15" : "#854d0e",
        };
      case "assigned":
        return {
          backgroundColor: theme === "dark" ? "#1e3a8a" : "#dbeafe",
          color: theme === "dark" ? "#93c5fd" : "#1e40af",
        };
      default:
        return {
          backgroundColor: theme === "dark" ? "#374151" : "#f3f4f6",
          color: theme === "dark" ? "#d1d5db" : "#111827",
        };
    }
  };

  const tableStyle: React.CSSProperties = {
    width: "100%",
    borderCollapse: "collapse",
    border: `1px solid ${theme === "dark" ? "#374151" : "#d1d5db"}`,
    backgroundColor: theme === "dark" ? "#111827" : "#ffffff",
    color: theme === "dark" ? "#f9fafb" : "#111827",
  };

  const cellStyle: React.CSSProperties = {
    border: `1px solid ${theme === "dark" ? "#374151" : "#d1d5db"}`,
    padding: "10px",
    fontSize: "0.95rem",
  };

  const headerStyle: React.CSSProperties = {
    backgroundColor: theme === "dark" ? "#1f2937" : "#f3f4f6",
    color: theme === "dark" ? "#e5e7eb" : "#111827",
    fontWeight: 600,
  };

  return (
    <div
      className="p-6 space-y-6 min-h-screen transition-all duration-300"
      style={{
        backgroundColor: theme === "dark" ? "#0f172a" : "#f9fafb",
        color: theme === "dark" ? "#f9fafb" : "#111827",
      }}
    >
      <h2 className="text-xl font-semibold text-center md:text-left">
        Assigned Projects
      </h2>

      {loading ? (
        <div className="p-6 flex justify-center items-center">
          <BouncingDots />
        </div>
      ) : projects.length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>
          No projects assigned yet.
        </p>
      ) : (
        <>
          <div className="block md:hidden space-y-4">
            {projects.map((p, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: theme === "dark" ? "#1e293b" : "#ffffff",
                  border: `1px solid ${
                    theme === "dark" ? "#334155" : "#e5e7eb"
                  }`,
                  borderRadius: "1rem",
                  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                  padding: "16px",
                  transition: "all 0.3s ease",
                }}
              >
                <h3
                  style={{
                    fontWeight: 600,
                    fontSize: "1.1rem",
                    marginBottom: "0.5rem",
                  }}
                >
                  {typeof p.project === "string"
                    ? p.project
                    : p.project?.title ?? "-"}
                </h3>

                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(p.startDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>End Date:</strong>{" "}
                  {new Date(p.endDate).toLocaleDateString()}
                </p>

                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    style={{
                      ...getStatusBadge(p.status),
                      padding: "4px 10px",
                      borderRadius: "9999px",
                      fontSize: "0.85rem",
                      fontWeight: 600,
                    }}
                  >
                    {p.status}
                  </span>
                </p>

                {p.project &&
                  typeof p.project === "object" &&
                  p.project.description && (
                    <p style={{ marginTop: "0.5rem" }}>
                      <strong>Description:</strong> {p.project.description}
                    </p>
                  )}
              </div>
            ))}
          </div>

          <div className="hidden md:block overflow-x-auto shadow-md rounded-2xl">
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={{ ...cellStyle, ...headerStyle }}>Project</th>
                  <th style={{ ...cellStyle, ...headerStyle }}>Start Date</th>
                  <th style={{ ...cellStyle, ...headerStyle }}>End Date</th>
                  <th style={{ ...cellStyle, ...headerStyle }}>Status</th>
                  <th style={{ ...cellStyle, ...headerStyle }}>Description</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((p, idx) => (
                  <tr key={idx}>
                    <td style={cellStyle}>
                      {typeof p.project === "string"
                        ? p.project
                        : p.project?.title ?? "-"}
                    </td>
                    <td style={cellStyle}>
                      {new Date(p.startDate).toLocaleDateString()}
                    </td>
                    <td style={cellStyle}>
                      {new Date(p.endDate).toLocaleDateString()}
                    </td>
                    <td style={cellStyle}>
                      <span
                        style={{
                          ...getStatusBadge(p.status),
                          padding: "4px 10px",
                          borderRadius: "9999px",
                          fontSize: "0.85rem",
                          fontWeight: 600,
                        }}
                      >
                        {p.status}
                      </span>
                    </td>
                    <td style={cellStyle}>
                      {typeof p.project === "object"
                        ? p.project?.description ?? "-"
                        : "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}

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
