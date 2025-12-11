
"use client";

import React, { useState } from "react";
import { toast } from "react-hot-toast";

const MarkAttendance: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const handleMark = async () => {
    const userData = localStorage.getItem("user");
    if (!userData) {
      toast.error("Please log in.");
      return;
    }
    const user = JSON.parse(userData);
    const studentId = user._id;
    setLoading(true);
    try {
      const res = await fetch("/api/student/attendence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Failed to mark attendance");
      } else {
        toast.success("Attendance marked (pending approval).");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error marking attendance");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleMark}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-60"
    >
      {loading ? "Marking..." : "Mark Attendance"}
    </button>
  );
};

export default MarkAttendance;
