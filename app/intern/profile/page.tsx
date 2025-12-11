"use client";

import { BouncingDots } from "@/components/global/Loader";
import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";

interface Internship {
  projectTitle: string;
  startDate: string;
  endDate: string;
}

interface Student {
  fullName: string;
  college: string;
  email: string;
  phone: string;
  password?: string;
  role: string;
  verified: boolean;
  course: string;
  year: string;
  verifiedAt?: string;
  interviewDate?: string;
  interviewSlot?: string;
  internship?: Internship;
  offerLetter?: string;
}

const StudentProfilePage: React.FC = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsed = JSON.parse(storedUser);
        setStudent(parsed);
        setPhone(parsed.phone || "");
      } catch {
        localStorage.removeItem("user");
        setStudent(null);
      }
    }
    setLoading(false);
  }, []);

  const handleUpdate = async () => {
    if (!student) return;

    if (newPassword && newPassword.length < 6) {
      toast.error("New password should be at least 6 characters.");
      return;
    }

    try {
      const res = await fetch("/api/student/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: student.email,
          oldPassword: oldPassword || undefined,
          newPassword: newPassword || undefined,
          phone,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success(data.message || "Profile updated successfully.");
        setOldPassword("");
        setNewPassword("");
        const updatedStudent = { ...student, phone };
        localStorage.setItem("user", JSON.stringify(updatedStudent));
        setStudent(updatedStudent);
      } else {
        toast.error(data.error || "Failed to update profile.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Internal server error");
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BouncingDots />
      </div>
    );
  if (!student) return <p className="p-6 text-center">Student not found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-slate-800 dark:text-slate-200">
        My Profile
      </h2>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Full Name
          </label>
          <input
            type="text"
            value={student.fullName}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-slate-800 dark:text-slate-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            College
          </label>
          <input
            type="text"
            value={student.college}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-slate-800 dark:text-slate-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Email
          </label>
          <input
            type="email"
            value={student.email}
            disabled
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-100 dark:bg-gray-800 text-slate-800 dark:text-slate-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Phone
          </label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-slate-800 dark:text-slate-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Old Password
          </label>
          <input
            type="password"
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            placeholder="Enter old password"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-slate-800 dark:text-slate-200"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            New Password
          </label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="Enter new password"
            className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-slate-800 dark:text-slate-200"
          />
        </div>

        <div className="mt-4">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            Update Profile
          </button>
        </div>

        <div className="mt-6 space-y-1">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Verified: {student.verified ? "Yes ✅" : "No ❌"}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Course: {student.course}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Year: {student.year}
          </p>
          {student.verifiedAt && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Verified At: {new Date(student.verifiedAt).toLocaleString()}
            </p>
          )}
          {student.interviewDate && student.interviewSlot && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Interview: {student.interviewDate} ({student.interviewSlot})
            </p>
          )}
          {student.internship && (
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Internship: {student.internship.projectTitle} (
              {student.internship.startDate} - {student.internship.endDate})
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfilePage;
