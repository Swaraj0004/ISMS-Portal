"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Toast from "@/components/global/Toast";
import { BouncingDots } from "@/components/global/Loader";

interface ITask {
  _id: string;
  week: number;
  title: string;
  description: string;
  deadline: string;
  status: "pending" | "completed";
  feedback?: string;
  proofUrl?: string;
}

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

export default function WeeklyTaskPage() {
  const { theme } = useTheme();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [projects, setProjects] = useState<IProjectAssignment[]>([]);

  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") || "" : "";
  const user =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null;
  const internId = user?._id;

  const fetchProjects = async () => {
    if (!internId) return;
    setLoading(true);
    try {
      const res = await fetch("/api/intern/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: internId }),
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

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/intern/me", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch tasks");
      const data = await res.json();
      setTasks(data.tasks || []);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to load tasks", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const handleMarkComplete = async (taskId: string) => {
    try {
      const res = await fetch("/api/intern/task", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ taskId, action: "complete" }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update task");
      setTasks(data.tasks);
      setToast({ message: "Task marked as completed!", type: "success" });
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    }
  };

  const handleUploadProof = async (taskId: string, file: File) => {
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = (reader.result as string).split(",")[1];
      setUploading(taskId);
      try {
        const res = await fetch("/api/intern/task", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ taskId, action: "upload", file: base64 }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Upload failed");
        setTasks(data.tasks);
        setToast({ message: "Proof uploaded successfully!", type: "success" });
      } catch (err: any) {
        setToast({ message: err.message, type: "error" });
      } finally {
        setUploading(null);
      }
    };
    reader.readAsDataURL(file);
  };

  useEffect(() => {
    fetchProjects();
    fetchTasks();
  }, [internId]);

  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.week]) acc[task.week] = [];
    acc[task.week].push(task);
    return acc;
  }, {} as Record<number, ITask[]>);

  const getStatusStyles = (status: string): React.CSSProperties => {
    if (status === "completed")
      return {
        backgroundColor: theme === "dark" ? "#14532d" : "#dcfce7",
        color: theme === "dark" ? "#86efac" : "#166534",
      };
    return {
      backgroundColor: theme === "dark" ? "#78350f" : "#fef9c3",
      color: theme === "dark" ? "#facc15" : "#854d0e",
    };
  };

  const bgMain = theme === "dark" ? "#0f172a" : "#f9fafb";
  const cardBg = theme === "dark" ? "#1e293b" : "#ffffff";
  const textMain = theme === "dark" ? "#f9fafb" : "#111827";
  const borderColor = theme === "dark" ? "#334155" : "#e5e7eb";

  if (loading)
    return (
      <div
        className="flex items-center justify-center min-h-screen transition-all duration-300"
        style={{ backgroundColor: bgMain, color: textMain }}
      >
        <BouncingDots />
      </div>
    );

  return (
    <div
      className="p-6 space-y-8 min-h-screen transition-all duration-300"
      style={{ backgroundColor: bgMain, color: textMain }}
    >
      <h2 className="text-xl font-semibold text-center md:text-left">
        Weekly Tasks
      </h2>

      {projects.length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>
          No projects assigned yet.
        </p>
      ) : Object.keys(groupedTasks).length === 0 ? (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>
          No tasks assigned yet.
        </p>
      ) : (
        Object.entries(groupedTasks).map(([week, weekTasks]) => (
          <div key={week} className="space-y-4">
            <h3
              style={{
                fontSize: "1.1rem",
                fontWeight: 600,
                color: theme === "dark" ? "#60a5fa" : "#1d4ed8",
              }}
            >
              Week {week}
            </h3>

            <div className="grid gap-4 md:grid-cols-2">
              {weekTasks.map((task) => (
                <div
                  key={task._id}
                  style={{
                    backgroundColor: cardBg,
                    border: `1px solid ${borderColor}`,
                    borderRadius: "1rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                    padding: "16px",
                    transition: "all 0.3s ease",
                  }}
                >
                  <div className="flex justify-between items-center flex-wrap gap-2">
                    <h4 style={{ fontWeight: 600 }}>{task.title}</h4>
                    <span
                      style={{
                        ...getStatusStyles(task.status),
                        padding: "4px 10px",
                        borderRadius: "9999px",
                        fontSize: "0.85rem",
                        fontWeight: 600,
                      }}
                    >
                      {task.status}
                    </span>
                  </div>

                  <p style={{ fontSize: "0.9rem", marginTop: "4px" }}>
                    {task.description}
                  </p>
                  <p
                    style={{
                      fontSize: "0.8rem",
                      opacity: 0.7,
                      marginTop: "4px",
                    }}
                  >
                    Deadline: {new Date(task.deadline).toLocaleDateString()}
                  </p>

                  {task.feedback && (
                    <p
                      style={{
                        marginTop: "6px",
                        fontSize: "0.9rem",
                        color: theme === "dark" ? "#93c5fd" : "#2563eb",
                      }}
                    >
                      💬 Feedback: {task.feedback}
                    </p>
                  )}

                  {task.proofUrl && (
                    <button
                      onClick={() => window.open(task.proofUrl!, "_blank")}
                      style={{
                        marginTop: "6px",
                        color: theme === "dark" ? "#60a5fa" : "#2563eb",
                        textDecoration: "underline",
                        fontSize: "0.9rem",
                      }}
                    >
                      View Uploaded Proof
                    </button>
                  )}

                  {task.status === "pending" && (
                    <div className="flex flex-wrap gap-3 mt-3">
                      <input
                        type="file"
                        accept="image/*,application/pdf"
                        onChange={(e) =>
                          e.target.files &&
                          handleUploadProof(task._id, e.target.files[0])
                        }
                        disabled={uploading === task._id}
                        style={{
                          border: `1px solid ${borderColor}`,
                          backgroundColor:
                            theme === "dark" ? "#0f172a" : "#f9fafb",
                          color: textMain,
                          borderRadius: "0.5rem",
                          padding: "6px",
                          flexGrow: 1,
                        }}
                      />
                      <button
                        onClick={() => handleMarkComplete(task._id)}
                        disabled={uploading === task._id}
                        style={{
                          backgroundColor: "#2563eb",
                          color: "#fff",
                          padding: "8px 14px",
                          borderRadius: "0.5rem",
                          fontWeight: 600,
                          transition: "0.2s",
                          opacity: uploading === task._id ? 0.6 : 1,
                        }}
                      >
                        {uploading === task._id
                          ? "Uploading..."
                          : "Mark Completed"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
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
