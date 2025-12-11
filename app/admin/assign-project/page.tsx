"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

interface ConfirmModalProps {
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}
function ConfirmModal({ message, onConfirm, onCancel }: ConfirmModalProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div
        className={`w-[90%] max-w-sm rounded-xl p-6 shadow-lg text-center ${isDark ? "bg-gray-800 text-gray-100" : "bg-white text-gray-900"
          }`}
      >
        <p className="mb-5 text-base font-medium">{message}</p>
        <div className="flex justify-center gap-3 flex-wrap">
          <button
            onClick={onCancel}
            className={`px-4 py-2 rounded-lg ${isDark
              ? "bg-gray-600 hover:bg-gray-500"
              : "bg-gray-200 hover:bg-gray-300"
              } transition-colors`}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-colors"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

interface Project {
  _id: string;
  title: string;
}

interface Assignment {
  project: Project;
  startDate: string;
  endDate: string;
  status: string;
}

interface Intern {
  _id: string;
  fullName: string;
  projectsAssigned: Assignment[];
}

export default function InternProjectDashboard() {
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [interns, setInterns] = useState<Intern[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedIntern, setSelectedIntern] = useState("");
  const [selectedProject, setSelectedProject] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [editAssignment, setEditAssignment] = useState<Assignment | null>(null);
  const [confirmModal, setConfirmModal] = useState<any>(null);

  useEffect(() => {
    async function fetchData() {
      const internsRes = await fetch("/api/admin/interns/project");
      const internsData: Intern[] = await internsRes.json();
      setInterns(internsData);

      const projectsRes = await fetch("/api/project");
      const projectsData: Project[] = await projectsRes.json();
      setProjects(projectsData);
    }
    fetchData();
  }, []);

  const fetchInterns = async () => {
    const res = await fetch("/api/admin/interns/project");
    const data: Intern[] = await res.json();
    setInterns(data);
  };

  const handleAssign = async () => {
    if (!selectedIntern || !selectedProject || !startDate || !endDate)
      return toast.error("Please fill all fields");

    setLoading(true);
    try {
      const res = await fetch("/api/admin/interns/assign-project", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internId: selectedIntern,
          projectId: selectedProject,
          startDate,
          endDate,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to assign project");

      toast.success("Project assigned successfully");
      setSelectedIntern("");
      setSelectedProject("");
      setStartDate("");
      setEndDate("");
      fetchInterns();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAssignment = async () => {
    if (!selectedIntern || !editAssignment) return;

    try {
      const res = await fetch("/api/intern/project", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internId: selectedIntern,
          projectId: editAssignment.project
            ? typeof editAssignment.project === "string"
              ? editAssignment.project
              : editAssignment.project._id
            : "",
          startDate: editAssignment.startDate,
          endDate: editAssignment.endDate,
          status: editAssignment.status,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update assignment");

      toast.success("Assignment updated successfully");
      setEditAssignment(null);
      fetchInterns();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleDeleteAssignment = async (
    internId: string,
    projectId: string | { _id: string }
  ) => {
    try {
      const finalProjectId =
        typeof projectId === "string" ? projectId : projectId._id;

      const res = await fetch("/api/intern/project", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          internId,
          projectId: finalProjectId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to delete assignment");

      toast.success("Assignment removed");
      fetchInterns();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`px-4 sm:px-6 md:px-8 py-6 max-w-6xl mx-auto ${isDarkMode ? "text-gray-100" : "text-gray-900"
        }`}
    >
      {confirmModal && (
        <ConfirmModal
          message={confirmModal.message}
          onConfirm={() => {
            handleDeleteAssignment(
              confirmModal.internId,
              confirmModal.projectId
            )
              .then(() => setConfirmModal(null))
              .catch((err) => console.error("Delete error:", err));
          }}
          onCancel={() => setConfirmModal(null)}
        />
      )}

      <h1 className="text-2xl sm:text-3xl font-semibold text-center mb-6">
        Intern Project Management
      </h1>

      <div
        className={`rounded-2xl p-6 mb-8 shadow-md border transition-colors ${isDarkMode
          ? "bg-gray-800 border-gray-700"
          : "bg-white border-gray-200"
          }`}
      >
        <h2 className="font-semibold text-lg mb-4">Assign New Project</h2>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <select
            value={selectedIntern}
            onChange={(e) => setSelectedIntern(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "0.375rem",
              border: isDarkMode ? "1px solid #4b5563" : "1px solid #d1d5db",
              backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
              color: isDarkMode ? "#f9fafb" : "#111827",
              width: "100%",
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = isDarkMode ? "#60a5fa" : "#2563eb")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = isDarkMode ? "#4b5563" : "#d1d5db")
            }
          >
            <option value="">Select Intern</option>
            {interns.map((i) => (
              <option
                key={i._id}
                value={i._id}
                style={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  color: isDarkMode ? "#f3f4f6" : "#111827",
                }}
              >
                {i.fullName}
              </option>
            ))}
          </select>

          <select
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            style={{
              padding: "0.5rem",
              borderRadius: "0.375rem",
              border: isDarkMode ? "1px solid #4b5563" : "1px solid #d1d5db",
              backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
              color: isDarkMode ? "#f9fafb" : "#111827",
              width: "100%",
              outline: "none",
              transition: "all 0.2s ease",
            }}
            onFocus={(e) =>
              (e.target.style.borderColor = isDarkMode ? "#60a5fa" : "#2563eb")
            }
            onBlur={(e) =>
              (e.target.style.borderColor = isDarkMode ? "#4b5563" : "#d1d5db")
            }
          >
            <option value="">Select Project</option>
            {projects.map((p) => (
              <option
                key={p._id}
                value={p._id}
                style={{
                  backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                  color: isDarkMode ? "#f3f4f6" : "#111827",
                }}
              >
                {p.title}
              </option>
            ))}
          </select>

          <div className="flex flex-col sm:flex-row gap-2 col-span-full lg:col-span-1">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="flex-1 p-2 rounded-md border border-gray-300 dark:border-gray-600"
            />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="flex-1 p-2 rounded-md border border-gray-300 dark:border-gray-600"
            />
          </div>
        </div>

        <button
          onClick={handleAssign}
          disabled={loading}
          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-medium px-4 py-2 rounded-md transition disabled:opacity-50"
        >
          {loading ? "Assigning..." : "Assign Project"}
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
        <table className="min-w-full text-sm">
          <thead
            className={`${isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100"
              }`}
          >
            <tr>
              {["Intern", "Project", "Start", "End", "Status", "Actions"].map(
                (header) => (
                  <th
                    key={header}
                    className="px-3 py-2 sm:px-4 sm:py-3 text-left font-semibold"
                  >
                    {header}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {interns.flatMap((i) =>
              i.projectsAssigned.map((a, idx) => (
                <tr
                  key={`${i._id}-${a.project?._id || idx}`}
                  className={`transition-colors ${isDarkMode
                    ? "hover:bg-gray-700"
                    : "hover:bg-gray-50 bg-white"
                    }`}
                >
                  <td className="px-3 py-2">{i.fullName}</td>
                  <td className="px-3 py-2">
                    {a.project?.title || "Unknown Project"}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(a.startDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2">
                    {new Date(a.endDate).toLocaleDateString()}
                  </td>
                  <td className="px-3 py-2 capitalize">{a.status}</td>
                  <td className="px-3 py-2 flex gap-2">
                    <button
                      onClick={() => {
                        setSelectedIntern(i._id);
                        setEditAssignment(a);
                      }}
                      className="bg-yellow-400 hover:bg-yellow-500 text-black px-3 py-1 rounded-md text-xs sm:text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() =>
                        setConfirmModal({
                          message:
                            "Are you sure you want to remove this assignment?",
                          internId: i._id,
                          projectId: a.project
                            ? typeof a.project === "string"
                              ? a.project
                              : a.project._id
                            : "",
                        })
                      }
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-xs sm:text-sm"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {editAssignment && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div
            className={`w-[90%] max-w-sm rounded-xl p-6 shadow-lg ${isDarkMode
              ? "bg-gray-800 text-gray-100"
              : "bg-white text-gray-900"
              }`}
          >
            <h2 className="text-lg font-semibold mb-4 text-center">
              Edit Assignment
            </h2>

            <div className="flex flex-col gap-3">
              <label className="text-sm">Start Date</label>
              <input
                type="date"
                value={editAssignment.startDate.split("T")[0]}
                onChange={(e) =>
                  setEditAssignment({
                    ...editAssignment,
                    startDate: e.target.value,
                  })
                }
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 w-full"
              />

              <label className="text-sm">End Date</label>
              <input
                type="date"
                value={editAssignment.endDate.split("T")[0]}
                onChange={(e) =>
                  setEditAssignment({
                    ...editAssignment,
                    endDate: e.target.value,
                  })
                }
                className="p-2 rounded-md border border-gray-300 dark:border-gray-600 w-full"
              />

              <label className="text-sm">Status</label>
              <select
                value={editAssignment.status}
                onChange={(e) =>
                  setEditAssignment({
                    ...editAssignment,
                    status: e.target.value,
                  })
                }
                style={{
                  padding: "0.5rem",
                  borderRadius: "0.375rem",
                  border: isDarkMode
                    ? "1px solid #4b5563"
                    : "1px solid #d1d5db",
                  backgroundColor: isDarkMode ? "#374151" : "#f9fafb",
                  color: isDarkMode ? "#f9fafb" : "#111827",
                  width: "100%",
                  outline: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>

            <div className="flex justify-center gap-3 mt-5">
              <button
                onClick={() => setEditAssignment(null)}
                className={`px-4 py-2 rounded-lg ${isDarkMode
                  ? "bg-gray-600 hover:bg-gray-500"
                  : "bg-gray-200 hover:bg-gray-300"
                  } transition-colors`}
              >
                Cancel
              </button>

              <button
                onClick={handleUpdateAssignment}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white transition-colors"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
}
