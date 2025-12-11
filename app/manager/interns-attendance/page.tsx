"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import toast from "react-hot-toast";
import { BouncingDots } from "@/components/global/Loader";

interface Attendance {
  _id: string;
  date: string;
  status: string;
  confirmedByManager: boolean;
  intern: {
    _id: string;
    fullName: string;
    email: string;
    department: string;
  };
}

export default function AttendancePage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [records, setRecords] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/manager/attendance", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setRecords(data);
    } catch (err) {
      toast.error("Failed to fetch attendance");
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (id: string, confirmed: boolean) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/manager/attendance", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id, confirmed }),
      });

      if (!res.ok) throw new Error("Failed to update");

      toast.success("Attendance updated");
      setRecords((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, confirmedByManager: confirmed, status: confirmed ? "present" : "absent" } : r
        )
      );
    } catch {
      toast.error("Error updating attendance");
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BouncingDots />
      </div>
    );

  return (
    <div
      className={`min-h-screen px-4 sm:px-6 py-4 transition-colors ${isDark ? "bg-slate-900 text-slate-100" : "bg-gray-50 text-gray-900"
        }`}
    >
      <h1 className="text-2xl font-semibold mb-6 text-center sm:text-left">
        Confirm Intern Attendance
      </h1>

      <div className="hidden md:block overflow-x-auto rounded-lg shadow border border-gray-300 dark:border-slate-700">
        <table className="w-full border-collapse">
          <thead
            className={`${isDark ? "bg-slate-800 text-slate-200" : "bg-gray-200 text-gray-900"
              }`}
          >
            <tr>
              {["Name", "Department", "Date", "Status", "Confirmation"].map(
                (h) => (
                  <th key={h} className="p-3 text-left font-medium border-b">
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {records.map((r) => (
              <tr
                key={r._id}
                className={`border-b ${isDark
                  ? "border-slate-700 hover:bg-slate-800"
                  : "border-gray-200 hover:bg-gray-100"
                  }`}
              >
                <td className="p-3">{r.intern?.fullName}</td>
                <td className="p-3">{r.intern?.department}</td>
                <td className="p-3">{r.date}</td>
                <td className="p-3 capitalize">{r.status}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() => handleConfirm(r._id, true)}
                    className={`px-3 py-1 rounded-md text-sm ${r.confirmedByManager
                      ? "bg-green-600 text-white"
                      : "bg-green-500 hover:bg-green-600 text-white"
                      }`}
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleConfirm(r._id, false)}
                    className="px-3 py-1 rounded-md text-sm bg-red-500 text-white hover:bg-red-600"
                  >
                    Reject
                  </button>
                  <button
                    onClick={async () => {
                      try {
                        const res = await fetch(
                          `/api/intern/attendance/${r.intern._id}`
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
                    className="px-3 py-1 rounded-md text-sm bg-blue-500 text-white hover:bg-blue-600"
                    title="Download Monthly Report"
                  >
                    ⬇️
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-4">
        {records.map((r) => (
          <div
            key={r._id}
            className={`p-4 rounded-xl shadow ${isDark ? "bg-slate-800 text-slate-100" : "bg-white text-slate-900"
              }`}
          >
            <p>
              <strong>Name:</strong> {r.intern?.fullName}
            </p>
            <p>
              <strong>Department:</strong> {r.intern?.department}
            </p>
            <p>
              <strong>Date:</strong> {r.date}
            </p>
            <p>
              <strong>Status:</strong> {r.status}
            </p>

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleConfirm(r._id, true)}
                className={`flex-1 py-2 rounded-lg font-medium ${r.confirmedByManager
                  ? "bg-green-600 text-white"
                  : "bg-green-500 text-white hover:bg-green-600"
                  }`}
              >
                Confirm
              </button>
              <button
                onClick={() => handleConfirm(r._id, false)}
                className="flex-1 py-2 rounded-lg bg-red-500 text-white font-medium hover:bg-red-600"
              >
                Reject
              </button>
              <button
                onClick={async () => {
                  try {
                    const res = await fetch(
                      `/api/intern/attendance/${r.intern._id}`
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
                className="flex-1 py-2 rounded-lg bg-blue-500 text-white font-medium hover:bg-blue-600"
              >
                Download PDF
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
