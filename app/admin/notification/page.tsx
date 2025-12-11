"use client";

import { useEffect, useState } from "react";

interface PendingUser {
  _id: string;
  fullName: string;
  email: string;
  college: string;
  phone: string;
  course: string;
  year: string;
  resume?: string;
  idProof?: string;
  additionalDocs?: string;
  offerLetter?: string;
}

const AdminPendingVerifications: React.FC = () => {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    projectTitle: "",
  });
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);

  useEffect(() => {
    const fetchPendingUsers = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/pending-verifications");
        const data = await res.json();
        if (res.ok && Array.isArray(data.users)) {
          setPendingUsers(data.users);
        } else {
          setPendingUsers([]);
        }
      } catch (err) {
        console.error(err);
        setPendingUsers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPendingUsers();
  }, []);

  const approveUser = async (id: string) => {
    if (!formData.startDate || !formData.endDate || !formData.projectTitle) {
      alert("Please enter Start Date, End Date, and Project Title.");
      return;
    }

    try {
      const res = await fetch("/api/admin/verify-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: id,
          action: "approve",
          ...formData,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert("User verified successfully");
        setPendingUsers((prev) => prev.filter((u) => u._id !== id));
        setSelectedUserId(null);
        setFormData({ startDate: "", endDate: "", projectTitle: "" });
      } else {
        alert(data.error || "Failed to verify user");
      }
    } catch (err) {
      console.error(err);
      alert("Error verifying user");
    }
  };

  const openPdf = (base64: string, fileName: string) => {
    const byteCharacters = atob(base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: "application/pdf" });
    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = blobUrl;
    link.download = fileName || "document.pdf";
    link.target = "_blank";
    link.click();
    URL.revokeObjectURL(blobUrl);
  };

  const renderDocument = (
    doc?: string,
    type?: "resume" | "id" | "additional" | "offerLetter",
    userName?: string
  ) => {
    if (!doc) return null;
    const isImage = doc.startsWith("/9j/") || doc.startsWith("iVBOR");
    if (isImage) {
      return (
        <img
          src={`data:image/*;base64,${doc}`}
          className="w-48 mt-1 border rounded"
          alt={type}
        />
      );
    } else {
      return (
        <button
          onClick={() => openPdf(doc, `${userName || "document"}_${type}.pdf`)}
          className="text-blue-600 dark:text-blue-400 underline text-sm block mt-1"
        >
          View{" "}
          {type === "resume"
            ? "Resume"
            : type === "id"
            ? "ID Proof"
            : type === "offerLetter"
            ? "Offer Letter"
            : "Additional Document"}
        </button>
      );
    }
  };

  return (
    <div className="p-6 min-h-screen bg-gray-100 dark:bg-gray-950">
      <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
        Pending Student Verifications
      </h2>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading...</p>
      ) : pendingUsers?.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No pending verifications.
        </p>
      ) : (
        <div className="space-y-6">
          {pendingUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white dark:bg-gray-900 p-4 rounded-lg shadow border border-slate-200 dark:border-gray-800"
            >
              <h3 className="font-semibold text-lg text-slate-800 dark:text-slate-200">
                {user.fullName}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">{user.email}</p>
              <p className="text-gray-600 dark:text-gray-400">{user.college}</p>
              <p className="text-gray-600 dark:text-gray-400">{user.phone}</p>
              <p className="text-gray-600 dark:text-gray-400">
                {user.course} - Year {user.year}
              </p>

              <div className="mt-2 space-y-1">
                {renderDocument(user.resume, "resume", user.fullName)}
                {renderDocument(user.offerLetter, "offerLetter", user.fullName)}
                {renderDocument(user.idProof, "id", user.fullName)}
                {renderDocument(
                  user.additionalDocs,
                  "additional",
                  user.fullName
                )}
              </div>

              {selectedUserId === user._id ? (
                <div className="mt-4 space-y-2">
                  <input
                    type="date"
                    className="border rounded p-2 w-full"
                    value={formData.startDate}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e.target.value })
                    }
                    placeholder="Start Date"
                  />
                  <input
                    type="date"
                    className="border rounded p-2 w-full"
                    value={formData.endDate}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e.target.value })
                    }
                    placeholder="End Date"
                  />
                  <input
                    type="text"
                    className="border rounded p-2 w-full"
                    value={formData.projectTitle}
                    onChange={(e) =>
                      setFormData({ ...formData, projectTitle: e.target.value })
                    }
                    placeholder="Project Title"
                  />

                  <button
                    onClick={() => approveUser(user._id)}
                    className="mt-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg shadow transition-all"
                  >
                    Confirm & Verify
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedUserId(user._id)}
                  className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg shadow transition-all"
                >
                  Verify User
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPendingVerifications;
