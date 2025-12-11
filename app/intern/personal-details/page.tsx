"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import Toast from "@/components/global/Toast";
import { BouncingDots } from "@/components/global/Loader";
import { Moon, Sun, LockKeyhole } from "lucide-react";

interface IProject {
  _id: string;
  title: string;
}

interface IProjectAssignment {
  project?: IProject | string;
  startDate: string;
  endDate: string;
  status: "assigned" | "in-progress" | "completed";
  assignedAt: string;
}

interface IAttendance {
  date: string;
  status: "pending" | "present" | "absent";
  project?: IProject | string;
  requestedAt: string;
  approvedAt?: string;
  approvedBy?: string;
}

interface IIntern {
  fullName: string;
  college: string;
  course: string;
  department: string;
  semester: string;
  refNo: string;
  email: string;
  phone: string;
  projectsAssigned: IProjectAssignment[];
  attendance: IAttendance[];
}

export default function PersonalDetailsPage() {
  const [intern, setIntern] = useState<IIntern | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [saving, setSaving] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const { theme, setTheme } = useTheme();
  const router = useRouter();

  useEffect(() => {
    const fetchIntern = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/auth");
        return;
      }

      try {
        const res = await fetch("/api/intern/me", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/auth");
          return;
        }

        const data: IIntern = await res.json();
        setIntern(data);
      } catch {
        setToast({ message: "Failed to load intern data", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchIntern();
  }, [router]);

  const handleUpdate = async () => {
    if (!intern) return;
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
          email: intern.email,
          currentPassword,
          newPassword,
        }),
      });

      if (!res.ok) throw new Error("Failed to update password");

      setToast({ message: "Password updated successfully!", type: "success" });
      setCurrentPassword("");
      setNewPassword("");
    } catch {
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

  if (!intern) return <p className="text-center mt-10">No data found.</p>;
  const getYearFromSemester = (sem: number) => {
    if (sem <= 2) return "1st Year";
    if (sem <= 4) return "2nd Year";
    if (sem <= 6) return "3rd Year";
    return "4th Year";
  };

  const year = getYearFromSemester(parseInt(intern.semester));

  return (
    <div
      className="min-h-screen flex flex-col items-center transition-all duration-500"
      style={{
        padding: "1.5rem",
        gap: "2rem",
      }}
    >
      <div
        className="w-full max-w-5xl rounded-2xl shadow-lg backdrop-blur-md"
        style={{
          background:
            theme === "dark" ? "rgba(30,41,59,0.7)" : "rgba(255,255,255,0.9)",
          border: theme === "dark" ? "1px solid #334155" : "1px solid #e2e8f0",
          padding: "2rem",
        }}
      >
        <h2
          className="text-2xl font-semibold mb-6 border-b pb-2 flex items-center gap-2"
          style={{
            color: theme === "dark" ? "#f1f5f9" : "#0f172a",
            borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
          }}
        >
          <Sun
            className="cursor-pointer"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            style={{ width: 20, height: 20 }}
          />
          Personal Details
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {[
            { label: "Full Name", value: intern.fullName },
            { label: "Course", value: intern.course },
            { label: "Department", value: intern.department },
            { label: "Semester", value: intern.semester },
            { label: "Year", value: year },
            { label: "Ref No", value: intern.refNo },
            { label: "Phone", value: intern.phone },
            { label: "College", value: intern.college },
            { label: "Email", value: intern.email },
          ].map((item) => (
            <div key={item.label} className="flex flex-col gap-1">
              <label
                className="font-medium text-sm"
                style={{
                  color: theme === "dark" ? "#cbd5e1" : "#475569",
                }}
              >
                {item.label}
              </label>
              <input
                readOnly
                type="text"
                value={item.value}
                className="border rounded-md p-2 bg-transparent focus:outline-none"
                style={{
                  borderColor: theme === "dark" ? "#475569" : "#d1d5db",
                  color: theme === "dark" ? "#f1f5f9" : "#0f172a",
                }}
              />
            </div>
          ))}
        </div>
      </div>

      <div
        className="w-full max-w-5xl rounded-2xl shadow-lg backdrop-blur-md"
        style={{
          background:
            theme === "dark" ? "rgba(30,41,59,0.7)" : "rgba(255,255,255,0.9)",
          border: theme === "dark" ? "1px solid #334155" : "1px solid #e2e8f0",
          padding: "2rem",
        }}
      >
        <h2
          className="text-2xl font-semibold mb-6 border-b pb-2 flex items-center gap-2"
          style={{
            color: theme === "dark" ? "#f1f5f9" : "#0f172a",
            borderColor: theme === "dark" ? "#334155" : "#e2e8f0",
          }}
        >
          <LockKeyhole size={20} />
          Reset Password
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <div className="flex flex-col gap-1">
            <label
              className="font-medium text-sm"
              style={{
                color: theme === "dark" ? "#cbd5e1" : "#475569",
              }}
            >
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Enter current password"
              className="border rounded-md p-2 bg-transparent focus:outline-none"
              style={{
                borderColor: theme === "dark" ? "#475569" : "#d1d5db",
                color: theme === "dark" ? "#f1f5f9" : "#0f172a",
              }}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label
              className="font-medium text-sm"
              style={{
                color: theme === "dark" ? "#cbd5e1" : "#475569",
              }}
            >
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Enter new password"
              className="border rounded-md p-2 bg-transparent focus:outline-none"
              style={{
                borderColor: theme === "dark" ? "#475569" : "#d1d5db",
                color: theme === "dark" ? "#f1f5f9" : "#0f172a",
              }}
            />
          </div>
        </div>

        <button
          onClick={handleUpdate}
          disabled={saving}
          className="mt-6 font-semibold rounded-lg shadow transition-all"
          style={{
            padding: "0.6rem 1.2rem",
            backgroundColor: theme === "dark" ? "#2563eb" : "#1d4ed8",
            color: "white",
            opacity: saving ? 0.8 : 1,
            cursor: saving ? "not-allowed" : "pointer",
            width: "100%",
            maxWidth: "200px",
          }}
        >
          {saving ? "Updating..." : "Update Password"}
        </button>
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
