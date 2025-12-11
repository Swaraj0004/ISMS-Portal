"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Toast from "@/components/global/Toast";
import { BouncingDots } from "@/components/global/Loader";
import { ChevronDown, ChevronUp } from "lucide-react";

interface IIntern {
  _id: string;
  fullName: string;
  email: string;
  course: string;
  department: string;
  documents?: IDocument[];
  recommendation?: string;
  collegeId?: string;
}

interface IDocument {
  type: string;
  data: string;
  uploadedAt: string;
}

export default function StudentDocsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [interns, setInterns] = useState<IIntern[]>([]);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [docs, setDocs] = useState<Record<string, IDocument[]>>({});
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [loadingDocs, setLoadingDocs] = useState<string | null>(null);

  const fetchInterns = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/interns");
      if (!res.ok) throw new Error("Failed to fetch interns");
      const data = await res.json();
      setInterns(data.interns || data || []);
    } catch (err: any) {
      console.error(err);
      setToast({
        message: err.message || "Error loading interns",
        type: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterns();
  }, []);

  const fetchDocs = async (id: string) => {
    if (docs[id]) {
      setExpanded(expanded === id ? null : id);
      return;
    }

    setLoadingDocs(id);
    try {
      const res = await fetch(`/api/admin/intern-docs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!res.ok) throw new Error("Failed to fetch documents");

      const data = await res.json();
      const intern: IIntern = data.intern || data;

      const allDocs: IDocument[] = [
        ...(intern.documents || []),
        ...(intern.recommendation
          ? [
              {
                type: "Recommendation",
                data: intern.recommendation,
                uploadedAt: new Date().toISOString(),
              },
            ]
          : []),
        ...(intern.collegeId
          ? [
              {
                type: "College ID",
                data: intern.collegeId,
                uploadedAt: new Date().toISOString(),
              },
            ]
          : []),
      ];

      setDocs((prev) => ({ ...prev, [id]: allDocs }));
      setExpanded(id);
    } catch (err: any) {
      console.error(err);
      setToast({
        message: err.message || "Failed to load documents",
        type: "error",
      });
    } finally {
      setLoadingDocs(null);
    }
  };

  const viewDocument = (doc: IDocument) => {
    try {
      const base64Data = doc.data.split(",").pop()?.trim();
      if (!base64Data) throw new Error("Invalid Base64 data");

      const byteCharacters = atob(base64Data);
      const byteNumbers = Array.from(byteCharacters, (char) =>
        char.charCodeAt(0)
      );
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (err) {
      console.error("Error viewing document:", err);
      alert("This file is corrupted or not a valid PDF.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BouncingDots />
      </div>
    );
  }

  return (
    <div
      className="p-6 space-y-6 transition-colors"
      style={{
        color: isDark ? "#f9fafb" : "#111827",
        minHeight: "100vh",
      }}
    >
      <h2 className="text-xl font-semibold">Intern Documents</h2>

      {interns.length === 0 ? (
        <p>No intern found.</p>
      ) : (
        <div className="space-y-4">
          {interns.map((student) => (
            <div
              key={student._id}
              className={`rounded-lg shadow border transition-colors ${
                isDark
                  ? "bg-gray-900 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => fetchDocs(student._id)}
              >
                <div>
                  <p className="font-semibold">{student.fullName}</p>
                  <p className="text-sm opacity-80">{student.email}</p>
                  <p className="text-xs opacity-70">
                    {student.course} • {student.department}
                  </p>
                </div>
                <button
                  className="flex items-center text-blue-600 hover:text-blue-700"
                  disabled={loadingDocs === student._id}
                >
                  {loadingDocs === student._id ? (
                    <span className="text-sm text-gray-500">...</span>
                  ) : expanded === student._id ? (
                    <ChevronUp size={20} />
                  ) : (
                    <ChevronDown size={20} />
                  )}
                </button>
              </div>

              {expanded === student._id && (
                <div
                  className={`border-t transition-colors ${
                    isDark
                      ? "border-gray-700 bg-gray-800"
                      : "border-gray-200 bg-gray-50"
                  } p-4`}
                >
                  {docs[student._id]?.length ? (
                    <ul className="space-y-2">
                      {docs[student._id].map((doc, idx) => (
                        <li
                          key={idx}
                          className={`flex justify-between items-center p-3 rounded-md cursor-pointer transition-all ${
                            isDark
                              ? "bg-gray-700 hover:bg-gray-600"
                              : "bg-gray-100 hover:bg-gray-200"
                          }`}
                          onClick={() => viewDocument(doc)}
                        >
                          <span className="font-medium text-sm">
                            {doc.type}
                          </span>
                          <span className="text-blue-600 text-sm font-semibold">
                            View
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">
                      No documents uploaded yet.
                    </p>
                  )}
                </div>
              )}
            </div>
          ))}
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
