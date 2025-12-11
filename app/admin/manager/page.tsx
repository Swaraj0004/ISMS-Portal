"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Pencil, Trash2, PlusCircle } from "lucide-react";
import Toast from "@/components/global/Toast";

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

interface Manager {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  isActive: boolean;
}

export default function ManagerPage() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [managers, setManagers] = useState<Manager[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingManager, setEditingManager] = useState<Manager | null>(null);
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
  });
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);

  const [confirmModal, setConfirmModal] = useState<{
    id: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    fetchManagers();
  }, []);

  const fetchManagers = async () => {
    setLoading(true);
    const res = await fetch("/api/manager");
    const data = await res.json();
    setManagers(data);
    setLoading(false);
  };

  const openCreateModal = () => {
    setEditingManager(null);
    setForm({ fullName: "", email: "", phone: "", password: "" });
    setModalOpen(true);
  };

  const openEditModal = (manager: Manager) => {
    setEditingManager(manager);
    setForm({
      fullName: manager.fullName,
      email: manager.email,
      phone: manager.phone,
      password: "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingManager ? "PUT" : "POST";
    const url = editingManager
      ? `/api/manager/${editingManager._id}`
      : "/api/manager";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (res.ok) {
      await fetchManagers();
      setModalOpen(false);
      setToast({
        message: editingManager
          ? "Manager updated successfully!"
          : "Manager created!",
        type: "success",
      });
    } else {
      const err = await res.json();
      setToast({ message: err.error || "An error occurred", type: "error" });
    }
  };

  const handleDelete = async (id: string) => {

    const res = await fetch(`/api/manager/${id}`, { method: "DELETE" });
    if (res.ok) {
      await fetchManagers();
      setToast({ message: "Manager deleted successfully!", type: "success" });
    } else {
      setToast({ message: "Failed to delete manager", type: "error" });
    }
  };

  const toggleActive = async (manager: Manager) => {
    const res = await fetch(`/api/manager/${manager._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !manager.isActive }),
    });

    if (res.ok) {
      await fetchManagers();
      setToast({
        message: manager.isActive
          ? "Manager deactivated!"
          : "Manager activated!",
        type: "success",
      });
    } else {
      setToast({ message: "Action failed", type: "error" });
    }
  };

  return (
    <div
      style={{
        padding: "1.5rem",
        backgroundColor: isDarkMode ? "#0f172a" : "#f9fafb",
        color: isDarkMode ? "#f3f4f6" : "#1f2937",
        minHeight: "100vh",
        transition: "background-color 0.3s ease, color 0.3s ease",
      }}
    >
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
          marginBottom: "1.5rem",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600 }}>Manage Managers</h2>

        <button
          onClick={openCreateModal}
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.5rem",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            padding: "0.5rem 1rem",
            borderRadius: "0.5rem",
            border: "none",
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
          }}
        >
          <PlusCircle size={18} /> Add Manager
        </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", marginTop: "2rem", color: "#6b7280" }}>
          Loading managers...
        </p>
      ) : managers.length === 0 ? (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          No managers found.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gap: "1rem",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          }}
        >
          {managers.map((manager) => (
            <div
              key={manager._id}
              style={{
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                borderRadius: "1rem",
                padding: "1.25rem",
                boxShadow: isDarkMode
                  ? "0 4px 12px rgba(0,0,0,0.4)"
                  : "0 4px 12px rgba(0,0,0,0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                transition: "all 0.3s ease",
                border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-4px)";
                e.currentTarget.style.boxShadow = isDarkMode
                  ? "0 6px 18px rgba(0,0,0,0.5)"
                  : "0 6px 18px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = isDarkMode
                  ? "0 4px 12px rgba(0,0,0,0.4)"
                  : "0 4px 12px rgba(0,0,0,0.1)";
              }}
            >
              <div style={{ flex: "1 1 250px", marginBottom: "0.5rem" }}>
                <h3
                  style={{
                    fontSize: "1.1rem",
                    fontWeight: 600,
                    color: isDarkMode ? "#f9fafb" : "#111827",
                    marginBottom: "0.25rem",
                  }}
                >
                  {manager.fullName}
                </h3>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: isDarkMode ? "#9ca3af" : "#6b7280",
                    marginBottom: "0.15rem",
                  }}
                >
                  {manager.email}
                </p>
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: isDarkMode ? "#9ca3af" : "#6b7280",
                  }}
                >
                  {manager.phone}
                </p>
              </div>

              <div
                style={{
                  display: "flex",
                  gap: "0.5rem",
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <button
                  onClick={() => toggleActive(manager)}
                  style={{
                    backgroundColor: manager.isActive
                      ? "#10b981"
                      : isDarkMode
                      ? "#4b5563"
                      : "#d1d5db",
                    color: "#ffffff",
                    border: "none",
                    padding: "0.4rem 0.9rem",
                    borderRadius: "0.5rem",
                    cursor: "pointer",
                    fontWeight: 500,
                    fontSize: "0.85rem",
                    transition: "background-color 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = manager.isActive
                      ? "#059669"
                      : "#9ca3af")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = manager.isActive
                      ? "#10b981"
                      : isDarkMode
                      ? "#4b5563"
                      : "#d1d5db")
                  }
                >
                  {manager.isActive ? "Active" : "Inactive"}
                </button>

                <button
                  onClick={() => openEditModal(manager)}
                  style={{
                    color: isDarkMode ? "#60a5fa" : "#2563eb",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.25rem",
                    borderRadius: "0.5rem",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = isDarkMode
                      ? "rgba(59,130,246,0.1)"
                      : "rgba(59,130,246,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }
                >
                  <Pencil size={18} />
                </button>

                <button
                  onClick={() =>
                    setConfirmModal({
                      id: manager._id,
                      message: "Are you sure you want to delete this?",
                    })
                  }
                  style={{
                    color: "#ef4444",
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    padding: "0.25rem",
                    borderRadius: "0.5rem",
                    transition: "background 0.2s ease",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.background = "rgba(239,68,68,0.1)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.background = "none")
                  }
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {modalOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.5)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 50,
            padding: "1rem",
          }}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
              color: isDarkMode ? "#f9fafb" : "#1f2937",
              borderRadius: "1rem",
              width: "100%",
              maxWidth: "480px",
              padding: "1.5rem",
              boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
            }}
          >
            <h3
              style={{
                fontSize: "1.25rem",
                fontWeight: 600,
                marginBottom: "1rem",
              }}
            >
              {editingManager ? "Edit Manager" : "Add Manager"}
            </h3>
            <form
              onSubmit={handleSubmit}
              autoComplete="off"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0.75rem",
              }}
            >
              <input
                type="text"
                placeholder="Full Name"
                value={form.fullName}
                onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                required
                autoComplete="off"
                style={{
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
                }}
              />
              <input
                type="email"
                placeholder="Email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                autoComplete="off"
                style={{
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
                }}
              />
              <input
                type="text"
                placeholder="Phone"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                required
                autoComplete="off"
                style={{
                  padding: "0.5rem",
                  borderRadius: "0.5rem",
                  border: "1px solid #d1d5db",
                  backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
                }}
              />
              {!editingManager && (
                <input
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                  autoComplete="new-password"
                  style={{
                    padding: "0.5rem",
                    borderRadius: "0.5rem",
                    border: "1px solid #d1d5db",
                    backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
                  }}
                />
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                  gap: "0.5rem",
                  marginTop: "1rem",
                }}
              >
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: isDarkMode ? "#374151" : "#e5e7eb",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    padding: "0.5rem 1rem",
                    borderRadius: "0.5rem",
                    backgroundColor: "#2563eb",
                    color: "#ffffff",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  {editingManager ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
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
