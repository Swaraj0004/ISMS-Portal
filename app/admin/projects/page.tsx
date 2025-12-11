"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "next-themes";

interface Manager {
  _id: string;
  fullName: string;
}

interface Intern {
  _id: string;
  fullName: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  manager: Manager;
  interns: Intern[];
  startDate?: string;
  endDate?: string;
  isActive: boolean;
}

interface ToastProps {
  message: string;
  type?: "success" | "error";
  onClose: () => void;
}

function Toast({ message, type = "success", onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "success" ? "#22c55e" : "#ef4444";

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        style={{
          position: "fixed",
          top: "20px",
          right: "20px",
          zIndex: 50,
          padding: "10px 16px",
          borderRadius: "8px",
          color: "white",
          fontWeight: 600,
          backgroundColor: bgColor,
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        }}
      >
        {message}
      </motion.div>
    </AnimatePresence>
  );
}

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      <div
        style={{
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#e5e7eb" : "#111827",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: isDark
            ? "0 4px 16px rgba(255,255,255,0.1)"
            : "0 4px 16px rgba(0,0,0,0.15)",
          width: "90%",
          maxWidth: "400px",
          textAlign: "center",
        }}
      >
        <p style={{ marginBottom: "20px", fontSize: "16px", fontWeight: 500 }}>
          {message}
        </p>
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              backgroundColor: isDark ? "#374151" : "#e5e7eb",
              color: isDark ? "#fff" : "#111",
              border: "none",
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              backgroundColor: "#ef4444",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

interface ProjectModalProps {
  project: Project | null;
  onClose: () => void;
  onSave: () => void;
}

function ProjectModal({ project, onClose, onSave }: ProjectModalProps) {
  const { theme } = useTheme();
  const [title, setTitle] = useState(project?.title || "");
  const [description, setDescription] = useState(project?.description || "");
  const [managerId, setManagerId] = useState(project?.manager._id || "");
  const [startDate, setStartDate] = useState(project?.startDate || "");
  const [endDate, setEndDate] = useState(project?.endDate || "");
  const [loading, setLoading] = useState(false);
  const [managers, setManagers] = useState<Manager[]>([]);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const isDark = theme === "dark";

  useEffect(() => {
    async function fetchManagers() {
      const res = await fetch("/api/manager");
      const data: Manager[] = await res.json();
      setManagers(data);
    }
    fetchManagers();
  }, []);

  const handleSubmit = async () => {
    if (!title || !description || !managerId)
      return setToast({ message: "Fill all fields", type: "error" });
    setLoading(true);
    try {
      const url = "/api/project";
      const method = project ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          _id: project?._id,
          title,
          description,
          manager: managerId,
          startDate,
          endDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");
      onSave();
      onClose();
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0,0,0,0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 50,
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      <div
        style={{
          backgroundColor: isDark ? "#1f2937" : "#ffffff",
          color: isDark ? "#e5e7eb" : "#111827",
          padding: "24px",
          borderRadius: "12px",
          boxShadow: isDark
            ? "0 4px 16px rgba(255,255,255,0.1)"
            : "0 4px 16px rgba(0,0,0,0.15)",
          width: "90%",
          maxWidth: "420px",
        }}
      >
        <h2 style={{ fontSize: "20px", fontWeight: 600, marginBottom: "12px" }}>
          {project ? "Edit Project" : "Create Project"}
        </h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: isDark ? "#374151" : "#f9fafb",
              color: isDark ? "#fff" : "#111",
            }}
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: isDark ? "#374151" : "#f9fafb",
              color: isDark ? "#fff" : "#111",
              minHeight: "80px",
            }}
          />
          <select
            value={managerId}
            onChange={(e) => setManagerId(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: isDark ? "#374151" : "#f9fafb",
              color: isDark ? "#fff" : "#111",
            }}
          >
            <option value="">Select Manager</option>
            {managers.map((m) => (
              <option key={m._id} value={m._id}>
                {m.fullName}
              </option>
            ))}
          </select>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="date"
              value={startDate?.slice(0, 10)}
              onChange={(e) => setStartDate(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                flex: 1,
              }}
            />
            <input
              type="date"
              value={endDate?.slice(0, 10)}
              onChange={(e) => setEndDate(e.target.value)}
              style={{
                padding: "10px",
                borderRadius: "8px",
                border: "1px solid #ccc",
                flex: 1,
              }}
            />
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            gap: "8px",
            marginTop: "16px",
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              backgroundColor: isDark ? "#374151" : "#f3f4f6",
              color: isDark ? "#fff" : "#111",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              padding: "8px 16px",
              borderRadius: "8px",
              backgroundColor: "#2563eb",
              color: "white",
              fontWeight: 600,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {project ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ProjectsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    id: string;
    message: string;
  } | null>(null);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/project");
      const data: Project[] = await res.json();
      setProjects(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/project?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete");
      setToast({ message: "Project deleted successfully", type: "success" });
      fetchProjects();
    } catch (err: any) {
      setToast({ message: err.message, type: "error" });
    }
  };

  return (
    <div
      style={{
        padding: "24px",
        minHeight: "100vh",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={() => {
            handleDelete(confirmModal.id);
            setConfirmModal(null);
          }}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: 600 }}>Projects</h1>
        <button
          onClick={() => {
            setEditProject(null);
            setModalOpen(true);
          }}
          style={{
            backgroundColor: "#2563eb",
            color: "white",
            borderRadius: "8px",
            padding: "10px 16px",
            fontWeight: 600,
          }}
        >
          Create Project
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : error ? (
        <p style={{ color: "#ef4444" }}>{error}</p>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              backgroundColor: isDark ? "#1f2937" : "#ffffff",
              borderRadius: "8px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
            }}
          >
            <thead
              style={{
                backgroundColor: isDark ? "#374151" : "#f3f4f6",
                color: isDark ? "#e5e7eb" : "#111827",
              }}
            >
              <tr>
                {["Title", "Manager", "Start Date", "End Date", "Actions"].map(
                  (heading) => (
                    <th
                      key={heading}
                      style={{
                        padding: "10px",
                        borderBottom: "1px solid #ccc",
                        textAlign: "left",
                      }}
                    >
                      {heading}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {projects.map((p) => (
                <tr
                  key={p._id}
                  style={{
                    borderBottom: "1px solid #ccc",
                    backgroundColor: isDark ? "#1f2937" : "#fff",
                  }}
                >
                  <td style={{ padding: "10px" }}>{p.title}</td>
                  <td style={{ padding: "10px" }}>
                    {p.manager?.fullName || "N/A"}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {p.startDate
                      ? new Date(p.startDate).toLocaleDateString()
                      : "-"}
                  </td>
                  <td style={{ padding: "10px" }}>
                    {p.endDate ? new Date(p.endDate).toLocaleDateString() : "-"}
                  </td>
                  <td style={{ padding: "10px" }}>
                    <div style={{ display: "flex", gap: "6px" }}>
                      <button
                        onClick={() => {
                          setEditProject(p);
                          setModalOpen(true);
                        }}
                        style={{
                          backgroundColor: "#f59e0b",
                          color: "white",
                          borderRadius: "6px",
                          padding: "6px 10px",
                        }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() =>
                          setConfirmModal({
                            id: p._id,
                            message:
                              "Are you sure you want to delete this project?",
                          })
                        }
                        style={{
                          backgroundColor: "#ef4444",
                          color: "white",
                          borderRadius: "6px",
                          padding: "6px 10px",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <ProjectModal
          project={editProject}
          onClose={() => setModalOpen(false)}
          onSave={fetchProjects}
        />
      )}
    </div>
  );
}
