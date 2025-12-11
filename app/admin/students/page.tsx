"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { BouncingDots } from "@/components/global/Loader";

interface Intern {
  _id: string;
  fullName: string;
  college: string;
  course: string;
  department: string;
  semester: string;
  email: string;
  phone: string;
  isActive: boolean;
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

export default function StudentPage() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editIntern, setEditIntern] = useState<Intern | null>(null);
  const [confirmModal, setConfirmModal] = useState<{
    id: string;
    message: string;
  } | null>(null);

  const fetchInterns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/interns");
      const data: Intern[] = await res.json();
      setInterns(data);
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch interns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const getYearFromSemester = (sem: string) => {
    const num = parseInt(sem);
    if (num <= 2) return "1st";
    if (num <= 4) return "2nd";
    if (num <= 6) return "3rd";
    return "4th";
  };

  const handleChange = (field: string, value: string) => {
    if (!editIntern) return;
    setEditIntern({ ...editIntern, [field]: value });
  };

  const handleSave = async () => {
    if (!editIntern) return;
    setSaving(true);
    try {
      const res = await fetch("/api/admin/interns", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editIntern),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update intern");

      toast.success("Intern updated successfully");
      setEditIntern(null);
      fetchInterns();
    } catch (err: any) {
      toast.error(err.message || "Error updating intern");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (_id: string) => {
    try {
      const res = await fetch("/api/admin/interns", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ _id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete intern");

      toast.success("Intern deleted successfully");
      fetchInterns();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete intern");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BouncingDots />
      </div>
    );

  return (
    <div
      style={{
        padding: "1.5rem",
        backgroundColor: isDarkMode ? "#0f172a" : "#f9fafb",
        minHeight: "100vh",
        transition: "background-color 0.3s ease",
      }}
    >
      <h1
        style={{
          fontSize: "1.5rem",
          fontWeight: 600,
          marginBottom: "1rem",
          color: isDarkMode ? "#f3f4f6" : "#111827",
        }}
      >
        Active Interns
      </h1>
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

      <div className="hidden md:block overflow-x-auto">
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            border: `1px solid ${isDarkMode ? "#334155" : "#d1d5db"}`,
            borderRadius: "0.5rem",
            overflow: "hidden",
          }}
        >
          <thead
            style={{
              backgroundColor: isDarkMode ? "#1e293b" : "#e5e7eb",
              color: isDarkMode ? "#f9fafb" : "#111827",
            }}
          >
            <tr>
              {[
                "Name",
                "College",
                "Course",
                "Department",
                "Semester",
                "Year",
                "Email",
                "Phone",
                "Actions",
              ].map((header) => (
                <th
                  key={header}
                  style={{
                    padding: "0.75rem",
                    border: `1px solid ${isDarkMode ? "#334155" : "#d1d5db"}`,
                    textAlign: "left",
                    fontWeight: 500,
                  }}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {interns.map((i) => (
              <tr
                key={i._id}
                style={{
                  backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
                  color: isDarkMode ? "#f9fafb" : "#111827",
                }}
              >
                <td style={{ padding: "0.75rem", border: "1px solid #334155" }}>
                  {i.fullName}
                </td>
                <td style={{ padding: "0.75rem", border: "1px solid #334155" }}>
                  {i.college}
                </td>
                <td style={{ padding: "0.75rem", border: "1px solid #334155" }}>
                  {i.course}
                </td>
                <td style={{ padding: "0.75rem", border: "1px solid #334155" }}>
                  {i.department}
                </td>
                <td style={{ padding: "0.75rem", border: "1px solid #334155" }}>
                  {i.semester}
                </td>
                <td style={{ padding: "0.75rem", border: "1px solid #334155" }}>
                  {getYearFromSemester(i.semester)}
                </td>
                <td style={{ padding: "0.75rem", border: "1px solid #334155" }}>
                  {i.email}
                </td>
                <td style={{ padding: "0.75rem", border: "1px solid #334155" }}>
                  {i.phone}
                </td>
                <td
                  style={{
                    padding: "0.75rem",
                    border: "1px solid #334155",
                  }}
                >
                  <button
                    onClick={() => setEditIntern(i)}
                    style={{
                      padding: "0.25rem 0.75rem",
                      backgroundColor: "#eab308",
                      color: "#fff",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontWeight: 500,
                      border: "none",
                      margin: "0.25rem 0.75rem",
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      setConfirmModal({
                        id: i._id,
                        message:
                          "Are you sure you want to delete this?",
                      })
                    }
                    style={{
                      padding: "0.25rem 0.75rem",
                      backgroundColor: "#dc2626",
                      color: "#fff",
                      borderRadius: "0.375rem",
                      cursor: "pointer",
                      fontWeight: 500,
                      border: "none",
                      margin: "0.25rem 0.75rem",
                    }}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-4">
        {interns.map((i) => (
          <div
            key={i._id}
            style={{
              backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
              border: `1px solid ${isDarkMode ? "#334155" : "#d1d5db"}`,
              borderRadius: "0.75rem",
              padding: "1rem",
              boxShadow: isDarkMode
                ? "0 1px 2px rgba(255,255,255,0.05)"
                : "0 1px 2px rgba(0,0,0,0.1)",
            }}
          >
            <p>
              <strong>Name:</strong> {i.fullName}
            </p>
            <p>
              <strong>College:</strong> {i.college}
            </p>
            <p>
              <strong>Course:</strong> {i.course}
            </p>
            <p>
              <strong>Dept:</strong> {i.department}
            </p>
            <p>
              <strong>Semester:</strong> {i.semester} (
              {getYearFromSemester(i.semester)})
            </p>
            <p>
              <strong>Email:</strong> {i.email}
            </p>
            <p>
              <strong>Phone:</strong> {i.phone}
            </p>
            <div
              style={{ display: "flex", gap: "0.5rem", marginTop: "0.75rem" }}
            >
              <button
                onClick={() => setEditIntern(i)}
                style={{
                  flex: 1,
                  backgroundColor: "#eab308",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.375rem",
                  padding: "0.5rem",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(i._id)}
                style={{
                  flex: 1,
                  backgroundColor: "#dc2626",
                  color: "#fff",
                  border: "none",
                  borderRadius: "0.375rem",
                  padding: "0.5rem",
                  cursor: "pointer",
                  fontWeight: 500,
                }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editIntern && (
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
          <div
            style={{
              backgroundColor: isDarkMode ? "#1e293b" : "#ffffff",
              padding: "1.5rem",
              borderRadius: "0.75rem",
              width: "90%",
              maxWidth: "400px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
            }}
          >
            <h2
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "1rem",
                color: isDarkMode ? "#f9fafb" : "#111827",
              }}
            >
              Edit Intern
            </h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem",
              }}
            >
              {[
                "fullName",
                "college",
                "course",
                "department",
                "semester",
                "email",
                "phone",
              ].map((field) => (
                <input
                  key={field}
                  type="text"
                  placeholder={field}
                  value={(editIntern as any)[field]}
                  onChange={(e) => handleChange(field, e.target.value)}
                  style={{
                    padding: "0.5rem",
                    borderRadius: "0.375rem",
                    border: `1px solid ${isDarkMode ? "#475569" : "#d1d5db"}`,
                    backgroundColor: isDarkMode ? "#0f172a" : "#ffffff",
                    color: isDarkMode ? "#f3f4f6" : "#111827",
                  }}
                />
              ))}
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "0.5rem",
                marginTop: "1rem",
              }}
            >
              <button
                onClick={() => setEditIntern(null)}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #9ca3af",
                  backgroundColor: "transparent",
                  color: isDarkMode ? "#e5e7eb" : "#111827",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                style={{
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
