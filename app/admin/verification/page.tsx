"use client";

import { useEffect, useState } from "react";
import { BouncingDots } from "@/components/global/Loader";
import { FileText, FileDown, UserCheck, X } from "lucide-react";
import { useTheme } from "next-themes";

interface Intern {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  college: string;
  course: string;
  department: string;
  semester: string;
  refNo: string;
  recommendation: string;
  collegeId: string;
}

export default function PendingInternsPage() {
  const [interns, setInterns] = useState<Intern[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedIntern, setSelectedIntern] = useState<Intern | null>(null);
  const [activatingId, setActivatingId] = useState<string | null>(null);
  const [internshipStart, setInternshipStart] = useState("");
  const [internshipEnd, setInternshipEnd] = useState("");
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

  const [collegeData, setCollegeData] = useState<string>("");
  const [editing, setEditing] = useState(false);
  const [collegeSaved, setCollegeSaved] = useState(false);

  useEffect(() => {
    const fetchInterns = async () => {
      try {
        const res = await fetch("/api/admin/interns/pending");
        const data = await res.json();
        setInterns(data.interns || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInterns();
  }, []);

  useEffect(() => {
    if (!selectedIntern) return;
    const fetchCollege = async () => {
      try {
        const res = await fetch("/api/colleges", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name: selectedIntern.college }),
        });
        if (res.ok) {
          const data = await res.json();
          setCollegeData(data.nameData || "");
        } else setCollegeData("");
      } catch {
        setCollegeData("");
      }
    };
    fetchCollege();
  }, [selectedIntern]);

  const openPdf = (base64Data: string, fileName: string) => {
    try {
      const byteCharacters = atob(base64Data.split(",")[1] || base64Data);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++)
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const newWindow = window.open(url, "_blank");
      if (!newWindow)
        alert("Popup blocked! Please allow popups to view the PDF.");
      setTimeout(() => URL.revokeObjectURL(url), 120000);
    } catch (err) {
      alert("Failed to open PDF file.");
    }
  };

  const handleActivate = async (id: string) => {
    if (!internshipStart || !internshipEnd) {
      alert("Please select both start and end dates before activation.");
      return;
    }
    setActivatingId(id);
    try {
      const res = await fetch("/api/admin/interns/pending", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, internshipStart, internshipEnd }),
      });
      if (res.ok) setInterns((prev) => prev.filter((i) => i._id !== id));
      setSelectedIntern(null);
      setInternshipStart("");
      setInternshipEnd("");
    } finally {
      setActivatingId(null);
    }
  };

  const handleSaveCollegeData = async () => {
    if (!selectedIntern) return;
    try {
      const res = await fetch("/api/colleges", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: selectedIntern.college,
          nameData: collegeData,
        }),
      });
      if (!res.ok) throw new Error("Failed to save college data");
      setEditing(false);
      setCollegeSaved(true);
      setTimeout(() => setCollegeSaved(false), 2000);
    } catch {
      alert("Error saving college data");
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <BouncingDots />
      </div>
    );

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: "1rem",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          fontSize: "1.75rem",
          fontWeight: 600,
          marginBottom: "1rem",
          color: isDarkMode ? "#f9fafb" : "#1f2937",
          textAlign: "center",
        }}
      >
        Pending Intern Activations
      </h1>

      {interns.length === 0 ? (
        <p style={{ textAlign: "center", color: "#6b7280" }}>
          ✅ All interns are active.
        </p>
      ) : (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: "1rem",
          }}
        >
          {interns.map((intern) => (
            <div
              key={intern._id}
              onClick={() => setSelectedIntern(intern)}
              style={{
                cursor: "pointer",
                backgroundColor: isDarkMode ? "#1f2937" : "#ffffff",
                padding: "1rem",
                borderRadius: "0.75rem",
                border: isDarkMode ? "1px solid #374151" : "1px solid #e5e7eb",
                boxShadow: isDarkMode
                  ? "0 2px 6px rgba(0,0,0,0.4)"
                  : "0 2px 6px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
              }}
              onMouseEnter={(e) =>
                (e.currentTarget.style.transform = "scale(1.02)")
              }
              onMouseLeave={(e) =>
                (e.currentTarget.style.transform = "scale(1)")
              }
            >
              <p style={{ fontSize: "1.1rem", fontWeight: 600 }}>
                {intern.fullName}
              </p>
              <p style={{ fontSize: "0.9rem" }}>{intern.email}</p>
              <p style={{ fontSize: "0.9rem" }}>{intern.college}</p>
            </div>
          ))}
        </div>
      )}

      {selectedIntern && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "rgba(0,0,0,0.45)",
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "stretch",
            zIndex: 50,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              backgroundColor: isDarkMode ? "#111827" : "#ffffff",
              color: isDarkMode ? "#f9fafb" : "#1f2937",
              width: "100%",
              maxWidth: "30rem",
              height: "100%",
              overflowY: "auto",
              padding: "1.5rem",
              borderTopLeftRadius: "1rem",
              borderBottomLeftRadius: "1rem",
              boxShadow: isDarkMode
                ? "0 0 25px rgba(0,0,0,0.6)"
                : "0 0 25px rgba(0,0,0,0.2)",
              transform: "translateX(0)",
              transition: "transform 0.3s ease-in-out",
              animation: "slideIn 0.3s forwards",
              position: "relative",
            }}
          >
            <button
              onClick={() => setSelectedIntern(null)}
              style={{
                position: "absolute",
                top: "1rem",
                right: "1rem",
                color: isDarkMode ? "#d1d5db" : "#4b5563",
                cursor: "pointer",
                background: "transparent",
                border: "none",
              }}
            >
              <X size={22} />
            </button>

            <h2
              style={{
                fontSize: "1.6rem",
                fontWeight: 700,
                marginBottom: "1rem",
                textAlign: "center",
                borderBottom: isDarkMode
                  ? "1px solid #374151"
                  : "1px solid #e5e7eb",
                paddingBottom: "0.75rem",
              }}
            >
              {selectedIntern.fullName}
            </h2>

            <div style={{ marginBottom: "1.25rem" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                  borderBottom: isDarkMode
                    ? "1px solid #374151"
                    : "1px solid #e5e7eb",
                  paddingBottom: "0.25rem",
                }}
              >
                Intern Details
              </h3>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
                  gap: "0.75rem",
                  marginTop: "0.5rem",
                }}
              >
                <p>
                  <strong>Email:</strong> {selectedIntern.email}
                </p>
                <p>
                  <strong>Phone:</strong> {selectedIntern.phone}
                </p>
                <p>
                  <strong>College:</strong> {selectedIntern.college}
                </p>
                <p>
                  <strong>Course:</strong> {selectedIntern.course}
                </p>
                <p>
                  <strong>Department:</strong> {selectedIntern.department}
                </p>
                <p>
                  <strong>Semester:</strong> {selectedIntern.semester}
                </p>
                <p>
                  <strong>Ref No:</strong> {selectedIntern.refNo}
                </p>
              </div>
            </div>

            <div style={{ marginTop: "1rem" }}>
              <p>
                <strong>Internship Head:</strong>{" "}
                {collegeData && !editing ? (
                  <span>
                    {collegeData}{" "}
                    <button
                      onClick={() => setEditing(true)}
                      style={{
                        marginLeft: "0.5rem",
                        cursor: "pointer",
                        color: isDarkMode ? "#93c5fd" : "#1e40af",
                        background: "none",
                        border: "none",
                        fontWeight: 500,
                      }}
                    >
                      Edit
                    </button>
                    {collegeSaved && (
                      <span style={{ marginLeft: "0.5rem", color: "#10b981" }}>
                        Saved!
                      </span>
                    )}
                  </span>
                ) : !editing ? (
                  <span>
                    Not set{" "}
                    <button
                      onClick={() => setEditing(true)}
                      style={{
                        marginLeft: "0.5rem",
                        cursor: "pointer",
                        color: isDarkMode ? "#93c5fd" : "#1e40af",
                        background: "none",
                        border: "none",
                        fontWeight: 500,
                      }}
                    >
                      Add
                    </button>
                  </span>
                ) : (
                  <span>
                    <input
                      autoFocus
                      value={collegeData}
                      onChange={(e) => setCollegeData(e.target.value)}
                      style={{
                        padding: "0.25rem",
                        borderRadius: "0.25rem",
                        border: "1px solid #ccc",
                        marginRight: "0.5rem",
                      }}
                    />
                    <button
                      onClick={handleSaveCollegeData}
                      style={{
                        cursor: "pointer",
                        color: isDarkMode ? "#f9fafb" : "#1f2937",
                        backgroundColor: isDarkMode ? "#2563eb" : "#dbeafe",
                        borderRadius: "0.25rem",
                        border: "none",
                        padding: "0.25rem 0.5rem",
                      }}
                    >
                      Save
                    </button>
                  </span>
                )}
              </p>
            </div>

            <div style={{ marginBottom: "1.25rem" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                  borderBottom: isDarkMode
                    ? "1px solid #374151"
                    : "1px solid #e5e7eb",
                  paddingBottom: "0.25rem",
                }}
              >
                Internship Duration
              </h3>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "0.8rem",
                  marginTop: "0.5rem",
                }}
              >
                <div>
                  <label style={{ fontWeight: 500 }}>Start Date</label>
                  <input
                    type="date"
                    value={internshipStart}
                    onChange={(e) => setInternshipStart(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      border: isDarkMode
                        ? "1px solid #374151"
                        : "1px solid #d1d5db",
                      backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                      color: isDarkMode ? "#e5e7eb" : "#111827",
                      outline: "none",
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontWeight: 500 }}>End Date</label>
                  <input
                    type="date"
                    value={internshipEnd}
                    onChange={(e) => setInternshipEnd(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.5rem",
                      borderRadius: "0.5rem",
                      border: isDarkMode
                        ? "1px solid #374151"
                        : "1px solid #d1d5db",
                      backgroundColor: isDarkMode ? "#1f2937" : "#f9fafb",
                      color: isDarkMode ? "#e5e7eb" : "#111827",
                      outline: "none",
                    }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: "1.5rem" }}>
              <h3
                style={{
                  fontSize: "1rem",
                  fontWeight: 600,
                  marginBottom: "0.5rem",
                  color: isDarkMode ? "#9ca3af" : "#6b7280",
                  borderBottom: isDarkMode
                    ? "1px solid #374151"
                    : "1px solid #e5e7eb",
                  paddingBottom: "0.25rem",
                }}
              >
                Documents
              </h3>
              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "0.75rem",
                  marginTop: "0.5rem",
                }}
              >
                <button
                  onClick={() =>
                    openPdf(selectedIntern.recommendation, "recommendation.pdf")
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.6rem 1rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    backgroundColor: isDarkMode ? "#1e3a8a" : "#dbeafe",
                    color: isDarkMode ? "#93c5fd" : "#1e3a8a",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = isDarkMode
                      ? "#1d4ed8"
                      : "#bfdbfe")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = isDarkMode
                      ? "#1e3a8a"
                      : "#dbeafe")
                  }
                >
                  <FileText size={18} /> Recommendation
                </button>

                <button
                  onClick={() =>
                    openPdf(selectedIntern.collegeId, "collegeId.pdf")
                  }
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    padding: "0.6rem 1rem",
                    borderRadius: "0.5rem",
                    border: "none",
                    backgroundColor: isDarkMode ? "#064e3b" : "#d1fae5",
                    color: isDarkMode ? "#6ee7b7" : "#065f46",
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = isDarkMode
                      ? "#047857"
                      : "#a7f3d0")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = isDarkMode
                      ? "#064e3b"
                      : "#d1fae5")
                  }
                >
                  <FileDown size={18} /> College ID
                </button>
              </div>
            </div>

            <div style={{ textAlign: "center" }}>
              <button
                onClick={() => handleActivate(selectedIntern._id)}
                disabled={activatingId === selectedIntern._id}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  padding: "0.7rem 1.5rem",
                  borderRadius: "0.5rem",
                  backgroundColor: "#059669",
                  color: "#ffffff",
                  border: "none",
                  cursor:
                    activatingId === selectedIntern._id
                      ? "not-allowed"
                      : "pointer",
                  boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
                  fontWeight: 600,
                  fontSize: "0.95rem",
                  opacity: activatingId === selectedIntern._id ? 0.7 : 1,
                  transition: "all 0.25s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.backgroundColor = "#047857")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.backgroundColor = "#059669")
                }
              >
                <UserCheck size={18} />
                {activatingId === selectedIntern._id
                  ? "Activating..."
                  : "Activate"}
              </button>
            </div>
          </div>

          <style jsx>{`
            @keyframes slideIn {
              from {
                transform: translateX(100%);
              }
              to {
                transform: translateX(0);
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
