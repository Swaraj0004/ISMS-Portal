"use client";

import Toast from "@/components/global/Toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BouncingDots } from "@/components/global/Loader";
import { useTheme } from "next-themes";

interface User {
  _id: string;
  fullName: string;
  email: string;
  role: string;
  token?: string;
}

export default function ManagerPersonalDetailsPage() {
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const { theme } = useTheme();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      setUser(JSON.parse(stored));
    }
    setLoading(false);
  }, []);

  const handlePasswordReset = async () => {
    if (!user) return;
    if (!currentPassword || !newPassword) {
      setToast({ message: "Please fill both password fields", type: "error" });
      return;
    }

    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      setToast({ message: "Need Admin Permission!", type: "error" });

      setToast({ message: "Password updated successfully!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to update password", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BouncingDots />
      </div>
    );
  }

  if (!user)
    return (
      <p className="text-center mt-10 text-gray-500">No user data found.</p>
    );

  const cardStyle = {
    backgroundColor:
      theme === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
    border: `1px solid ${theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"
      }`,
    color: theme === "dark" ? "#e5e7eb" : "#111827",
    backdropFilter: "blur(10px)",
  };

  const inputStyle = {
    backgroundColor: theme === "dark" ? "#1f2937" : "#fff",
    color: theme === "dark" ? "#f9fafb" : "#111827",
    border: `1px solid ${theme === "dark" ? "#374151" : "#d1d5db"}`,
  };

  return (
    <div className="p-6 md:p-10 min-h-screen transition-colors duration-300">
      <div className="max-w-5xl mx-auto space-y-8">

        <div
          className="p-6 rounded-xl shadow-md transition-all duration-300"
          style={cardStyle}
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-6">
            👤 Personal Details
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {[
              { label: "Full Name", value: user.fullName },
              { label: "Email", value: user.email },
              { label: "Role", value: user.role },
            ].map((item) => (
              <div key={item.label}>
                <label className="block font-medium mb-1">{item.label}</label>
                <input
                  type="text"
                  readOnly
                  value={item.value}
                  style={inputStyle}
                  className="w-full p-2 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div
          className="p-6 rounded-xl shadow-md transition-all duration-300"
          style={cardStyle}
        >
          <h2 className="text-xl md:text-2xl font-semibold mb-6">
            🔐 Reset Password
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block font-medium mb-1">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter Current Password"
                style={inputStyle}
                className="w-full p-2 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block font-medium mb-1">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter New Password"
                style={inputStyle}
                className="w-full p-2 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <button
            onClick={handlePasswordReset}
            disabled={saving}
            style={{
              backgroundColor: theme === "dark" ? "#059669" : "#10b981",
              color: "#fff",
              opacity: saving ? 0.7 : 1,
            }}
            className="mt-6 px-5 py-2.5 rounded-md transition-all duration-200"
          >
            {saving ? "Updating..." : "Reset Password"}
          </button>
        </div>
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
