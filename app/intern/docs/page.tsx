"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import Toast from "@/components/global/Toast";
import { BouncingDots } from "@/components/global/Loader";

interface IDocument {
  type: string;
  data: string;
  uploadedAt: string;
}

interface IIntern {
  documents: IDocument[];
  recommendation?: string;
  collegeId?: string;
}

export default function DocumentsPage() {
  const [intern, setIntern] = useState<IIntern | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{
    message: string;
    type?: "success" | "error";
  } | null>(null);
  const [uploading, setUploading] = useState(false);
  const [docType, setDocType] = useState("College ID");
  const [file, setFile] = useState<File | null>(null);
  const { theme } = useTheme();

  useEffect(() => {
    const fetchIntern = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("/api/intern/me", {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Failed to fetch intern data");
        const data: IIntern = await res.json();
        setIntern(data);
      } catch (err) {
        console.error(err);
        setToast({ message: "Failed to load documents", type: "error" });
      } finally {
        setLoading(false);
      }
    };
    fetchIntern();
  }, []);

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

  const handleUpload = async () => {
    if (!file || !intern) return;
    setUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = async () => {
        const base64 = (reader.result as string).split(",")[1];
        const newDoc: IDocument = {
          type: docType,
          data: base64,
          uploadedAt: new Date().toISOString(),
        };

        const token = localStorage.getItem("token");
        const res = await fetch("/api/intern/me", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ documents: [newDoc] }),
        });

        if (!res.ok) throw new Error("Failed to upload document");
        const updatedIntern: IIntern = await res.json();
        setIntern(updatedIntern);
        setToast({
          message: "Document uploaded successfully!",
          type: "success",
        });
        setFile(null);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      console.error(err);
      setToast({ message: "Upload failed", type: "error" });
    } finally {
      setUploading(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BouncingDots />
      </div>
    );

  if (!intern) return <p className="text-center mt-10">No documents found.</p>;

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

  return (
    <div
      className="min-h-screen transition-colors duration-500"
      style={{
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <div
        className=" w-full max-w-6xl mx-auto"
        style={{
          padding: "2rem",
        }}
      >
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
            <h2
              className="text-2xl font-semibold tracking-tight"
              style={{ color: theme === "dark" ? "#f8fafc" : "#0f172a" }}
            >
              My Documents
            </h2>

            <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full sm:w-auto">
              <select
                value={docType}
                onChange={(e) => setDocType(e.target.value)}
                className="rounded-lg px-3 py-2 border focus:outline-none transition-all duration-200"
                style={{
                  borderColor: theme === "dark" ? "#475569" : "#cbd5e1",
                  backgroundColor:
                    theme === "dark" ? "rgba(30,41,59,0.7)" : "#ffffff",
                  color: theme === "dark" ? "#f1f5f9" : "#0f172a",
                }}
              >
                <option>NOC</option>
                <option>Resume</option>
                <option>Joining Letter</option>
              </select>

              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="rounded-lg px-3 py-2 border focus:outline-none flex-1 transition-all duration-200"
                style={{
                  borderColor: theme === "dark" ? "#475569" : "#cbd5e1",
                  backgroundColor:
                    theme === "dark" ? "rgba(30,41,59,0.7)" : "#ffffff",
                  color: theme === "dark" ? "#f1f5f9" : "#0f172a",
                }}
              />

              <button
                onClick={handleUpload}
                disabled={uploading || !file}
                className="font-semibold rounded-lg shadow px-5 py-2 transition-all duration-200"
                style={{
                  backgroundColor:
                    uploading || !file
                      ? theme === "dark"
                        ? "#1e3a8a"
                        : "#93c5fd"
                      : theme === "dark"
                      ? "#2563eb"
                      : "#1d4ed8",
                  color: "white",
                  cursor: uploading || !file ? "not-allowed" : "pointer",
                  opacity: uploading || !file ? 0.7 : 1,
                }}
              >
                {uploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>

          <p
            className="text-sm italic"
            style={{ color: theme === "dark" ? "#94a3b8" : "#64748b" }}
          >
            Make sure the document clearly shows your credentials.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {allDocs.map((doc, idx) => (
            <div
              key={idx}
              className="rounded-xl shadow-md p-4 flex flex-col justify-between transition-all"
              style={{
                background:
                  theme === "dark"
                    ? "rgba(30,41,59,0.7)"
                    : "rgba(255,255,255,0.95)",
                border:
                  theme === "dark" ? "1px solid #1e293b" : "1px solid #e2e8f0",
              }}
            >
              <div className="flex flex-col gap-1 mb-3">
                <p
                  className="font-medium text-base"
                  style={{ color: theme === "dark" ? "#f1f5f9" : "#0f172a" }}
                >
                  {doc.type}
                </p>
                <p
                  className="text-sm"
                  style={{ color: theme === "dark" ? "#94a3b8" : "#475569" }}
                >
                  {new Date(doc.uploadedAt).toLocaleDateString()}
                </p>
              </div>

              <button
                onClick={() => viewDocument(doc)}
                className="rounded-md font-medium transition-all px-4 py-2"
                style={{
                  backgroundColor: theme === "dark" ? "#2563eb" : "#1d4ed8",
                  color: "white",
                }}
              >
                View PDF
              </button>
            </div>
          ))}
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
