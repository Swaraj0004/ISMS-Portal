"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BouncingDots } from "@/components/global/Loader";

const availableSlots = [
  "10:00 AM - 11:00 AM",
  "11:30 AM - 12:30 PM",
  "02:00 PM - 03:00 PM",
  "03:30 PM - 04:30 PM",
];

const StudentVerifyForm: React.FC = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    course: "",
    year: "",
  });

  const [resumeBase64, setResumeBase64] = useState<string | null>(null);
  const [idProofBase64, setIdProofBase64] = useState<string | null>(null);
  const [additionalDocsBase64, setAdditionalDocsBase64] = useState<
    string | null
  >(null);

  const [interviewDate, setInterviewDate] = useState("");
  const [interviewSlot, setInterviewSlot] = useState("");

  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");
  const minDate = `${yyyy}-${mm}-${dd}`;

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setFormData((prev) => ({
          ...prev,
          fullName: user.fullName || "",
          email: user.email || "",
          phone: user.phone || "",
          college: user.college || "",
        }));
      } catch {
        console.warn("Invalid user data in localStorage");
      }
    }
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64String = (reader.result as string).split(",")[1];
      setter(base64String);
    };
    reader.readAsDataURL(file);
  };

  const isWorkingDay = (dateStr: string) => {
    const date = new Date(dateStr);
    const day = date.getDay();
    return day >= 1 && day <= 5;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!resumeBase64 || !idProofBase64) {
      alert("Please upload resume and ID proof.");
      return;
    }

    if (!interviewDate || !interviewSlot) {
      alert("Please select interview date and time slot.");
      return;
    }

    if (!isWorkingDay(interviewDate)) {
      alert(
        "Please select a working day (Monday to Friday) for the interview."
      );
      return;
    }

    try {
      const response = await fetch("/api/student/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          resume: resumeBase64,
          idProof: idProofBase64,
          additionalDocs: additionalDocsBase64,
          interviewDate,
          interviewSlot,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert("Verification submitted successfully!");
        router.push("/student");
      } else {
        alert(data.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to submit verification");
    }
  };
  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      router.push("/auth");
      return;
    }

    try {
      const user = JSON.parse(storedUser);

      if (user.verified) {
        router.push("/student");
        return;
      }

      setIsVerified(false);
      setLoading(false);
    } catch {
      localStorage.removeItem("user");
      router.push("/auth");
    }
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BouncingDots />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6 bg-gray-100 dark:bg-gray-950">
      <div className="max-w-3xl mx-auto p-6 bg-white dark:bg-gray-900 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-200 mb-4">
          Internship Application Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="p-2 border rounded-md w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="p-2 border rounded-md w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={formData.phone}
              onChange={handleChange}
              required
              className="p-2 border rounded-md w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
            <input
              type="text"
              name="college"
              placeholder="College / University"
              value={formData.college}
              onChange={handleChange}
              required
              className="p-2 border rounded-md w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="course"
              placeholder="Course / Program"
              value={formData.course}
              onChange={handleChange}
              required
              className="p-2 border rounded-md w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            />
            <select
              name="year"
              value={formData.year}
              onChange={handleChange}
              required
              className="p-2 border rounded-md w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
            >
              <option value="">Select Year</option>
              <option value="1">1st Year</option>
              <option value="2">2nd Year</option>
              <option value="3">3rd Year</option>
              <option value="4">4th Year</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-sm text-slate-700 dark:text-gray-300">
                Preferred Interview Date
              </label>
              <input
                type="date"
                value={interviewDate}
                min={minDate}
                onChange={(e) => setInterviewDate(e.target.value)}
                required
                className="p-2 border rounded-md w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-slate-700 dark:text-gray-300">
                Preferred Time Slot
              </label>
              <select
                value={interviewSlot}
                onChange={(e) => setInterviewSlot(e.target.value)}
                required
                className="p-2 border rounded-md w-full dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
              >
                <option value="">Select Time Slot</option>
                {availableSlots.map((slot, idx) => (
                  <option key={idx} value={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm text-slate-700 dark:text-gray-300">
                Upload Resume (PDF)
              </label>
              <input
                type="file"
                accept=".pdf"
                required
                onChange={(e) => handleFileChange(e, setResumeBase64)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-slate-700 dark:text-gray-300">
                Upload ID Proof (PDF or Image)
              </label>
              <input
                type="file"
                accept=".pdf"
                required
                onChange={(e) => handleFileChange(e, setIdProofBase64)}
                className="w-full"
              />
            </div>
            <div>
              <label className="block mb-1 text-sm text-slate-700 dark:text-gray-300">
                Additional Documents (Optional)
              </label>
              <input
                type="file"
                accept=".pdf"
                onChange={(e) => handleFileChange(e, setAdditionalDocsBase64)}
                className="w-full"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg shadow mt-4 transition-all"
          >
            Submit Application
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentVerifyForm;
