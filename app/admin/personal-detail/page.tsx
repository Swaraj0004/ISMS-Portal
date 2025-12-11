"use client";

import Toast from "@/components/global/Toast";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BouncingDots } from "@/components/global/Loader";
import { useTheme } from "next-themes";

interface IAdmin {
  _id: string;
  fullName: string;
  companyName: string;
  email: string;
  phone: string;
  lastLogin?: string;
  createdAt?: string;
}

export default function AdminPersonalDetailsPage() {
  const [admin, setAdmin] = useState<IAdmin | null>(null);
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

  useEffect(() => {
    const fetchAdmin = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      const storedUser = localStorage.getItem("user");
      if (!storedUser) {
        setToast({ message: "No logged-in user found", type: "error" });
        setLoading(false);
        return;
      }

      const adminId = JSON.parse(storedUser)?._id;
      if (!adminId) {
        setToast({ message: "Admin ID not found", type: "error" });
        setLoading(false);
        return;
      }

      try {
        const res = await fetch("/api/admin", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
          body: JSON.stringify({ id: adminId }),
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/auth");
          return;
        }

        if (!res.ok) throw new Error("Failed to fetch admin data");
        const data: IAdmin = await res.json();
        setAdmin(data);
      } catch (err) {
        console.error(err);
        setToast({ message: "Failed to load admin data", type: "error" });
      } finally {
        setLoading(false);
      }
    };

    fetchAdmin();
  }, [router]);

  const handleUpdate = async () => {
    if (!admin) return;
    setSaving(true);

    const token = localStorage.getItem("token");
    if (!token) {
      setToast({
        message: "Session expired. Please login again.",
        type: "error",
      });
      router.push("/auth");
      return;
    }

    try {
      const res = await fetch("/api/admin", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          id: admin._id,
          fullName: admin.fullName,
          companyName: admin.companyName,
          email: admin.email,
          phone: admin.phone,
        }),
      });

      if (!res.ok) throw new Error("Failed to update admin details");

      const data: IAdmin = await res.json();
      setAdmin(data);
      setToast({ message: "Details updated successfully!", type: "success" });
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to update details", type: "error" });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!admin) return;
    if (!currentPassword || !newPassword) {
      setToast({ message: "Please fill both password fields", type: "error" });
      return;
    }

    setSaving(true);
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: admin.email,
          currentPassword,
          newPassword,
        }),
      });

      if (res.status === 401) {
        setToast({
          message: "Session expired. Please login again.",
          type: "error",
        });
        localStorage.removeItem("token");
        router.push("/auth");
        return;
      }

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || "Failed to update password");
      }

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

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BouncingDots />
      </div>
    );

  if (!admin) return <p className="text-center mt-10">No data found.</p>;

  const cardStyle = {
    backgroundColor:
      theme === "dark" ? "rgba(255, 255, 255, 0.06)" : "rgba(0, 0, 0, 0.05)",
    border: `1px solid ${
      theme === "dark" ? "rgba(255, 255, 255, 0.15)" : "rgba(0, 0, 0, 0.1)"
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
              { label: "Full Name", value: admin.fullName },
              { label: "Company Name", value: admin.companyName },
              { label: "Email", value: admin.email },
              { label: "Phone", value: admin.phone },
              {
                label: "Joined On",
                value: admin.createdAt
                  ? new Date(admin.createdAt).toLocaleDateString()
                  : "N/A",
              },
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
                autoComplete="new-password"
                name="current-password"
                placeholder="Enter Current Password"
                style={{
                  ...inputStyle,
                  backgroundColor: "transparent",
                  color: "inherit",
                }}
                className="w-full p-2 rounded-md shadow-sm outline-none focus:ring-2 focus:ring-blue-500"
                onFocus={(e) => e.target.removeAttribute("readonly")}
                readOnly
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
            style={{
              backgroundColor: theme === "dark" ? "#059669" : "#10b981",
              color: "#fff",
            }}
            className="mt-6 px-5 py-2.5 rounded-md hover:opacity-90 transition-all duration-200"
          >
            Reset Password
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
