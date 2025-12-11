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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div
        className={`rounded-2xl p-6 w-full max-w-sm shadow-lg ${isDark ? "bg-slate-800 text-slate-100" : "bg-white text-slate-900"
          }`}
      >
        <p className="text-center mb-6 text-base font-medium leading-relaxed">
          {message}
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg font-medium ${isDark
              ? "bg-slate-700 text-white hover:bg-slate-600"
              : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

export default function ActiveInternsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirmModal, setConfirmModal] = useState<{
    id: string;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const user = JSON.parse(localStorage.getItem("user") || "{}");
        const res = await fetch("/api/manager/my-interns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: user._id }),
        });
        const data = await res.json();
        setInterns(data.interns || []);
      } catch (err: any) {
        toast.error(err.message || "Failed to fetch interns");
      } finally {
        setLoading(false);
      }
    };
    fetchInterns();
  }, []);

  const getYearFromSemester = (sem: string) => {
    const num = parseInt(sem);
    if (num <= 2) return "1st";
    if (num <= 4) return "2nd";
    if (num <= 6) return "3rd";
    return "4th";
  };

  const handleComplete = async (id: string) => {
    try {
      const res = await fetch("/api/internship/complete", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed");

      toast.success("Intern successfully completed internship");
      setInterns((prev) => prev.filter((i) => i._id !== id));
    } catch (err: any) {
      toast.error(err.message || "Failed to mark complete");
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
      className={`min-h-screen transition-colors duration-300 px-3 sm:px-6 py-4 ${isDark ? "bg-slate-900 text-slate-100" : "bg-gray-50 text-slate-900"
        }`}
    >
      <h1 className="text-xl sm:text-2xl font-semibold mb-5 sm:mb-6 text-center sm:text-left">
        Active Interns
      </h1>

      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={() => {
            handleComplete(confirmModal.id);
            setConfirmModal(null);
          }}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      <div className="hidden md:block overflow-x-auto rounded-lg shadow border border-gray-300 dark:border-slate-700">
        <table className="w-full border-collapse">
          <thead
            className={`${isDark ? "bg-slate-800 text-slate-200" : "bg-gray-200 text-gray-900"
              }`}
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
                  className="p-3 text-left font-medium border-b border-gray-400 dark:border-slate-700"
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
                className={`border-b ${isDark
                  ? "border-slate-700 hover:bg-slate-800"
                  : "border-gray-200 hover:bg-gray-100"
                  }`}
              >
                <td className="p-3">{i.fullName}</td>
                <td className="p-3 whitespace-nowrap">{i.college}</td>
                <td className="p-3">{i.course}</td>
                <td className="p-3">{i.department}</td>
                <td className="p-3">{i.semester}</td>
                <td className="p-3">{getYearFromSemester(i.semester)}</td>
                <td className="p-3">{i.email}</td>
                <td className="p-3">{i.phone}</td>
                <td className="p-3 flex gap-2">
                  <button
                    onClick={() =>
                      setConfirmModal({
                        id: i._id,
                        message:
                          "Confirm if this intern completed their internship?",
                      })
                    }
                    className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600 transition text-sm"
                  >
                    Complete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="md:hidden flex flex-col gap-4 mt-3 sm:mt-4">
        {interns.map((i) => (
          <div
            key={i._id}
            className={`rounded-xl shadow-md p-4 ${isDark ? "bg-slate-800 text-slate-100" : "bg-white text-slate-900"
              }`}
          >
            <div className="space-y-2 text-sm sm:text-base">
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
                <strong>Sem:</strong> {i.semester} (
                {getYearFromSemester(i.semester)})
              </p>
              <p className="break-words">
                <strong>Email:</strong> {i.email}
              </p>
              <p>
                <strong>Phone:</strong> {i.phone}
              </p>
            </div>

            <button
              onClick={() =>
                setConfirmModal({
                  id: i._id,
                  message:
                    "Confirm completion of this intern’s internship?",
                })
              }
              className="w-full mt-4 bg-green-500 text-white py-2 rounded-lg font-medium hover:bg-green-600 transition"
            >
              Complete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
