"use client";

import { useTheme } from "next-themes";

const guidelines = [
  "Interns must strictly follow the attendance timings from 11 AM to 12 PM daily.",
  "Weekly project progress reports are mandatory for attendance approval.",
  "Maintain professional conduct during online and offline internships.",
  "Timely submission of all required documents and reports is expected.",
  "Any grievances or issues should be reported to the Admin or Project Manager promptly.",
  "Internet and device requirements should be met to access ISMS features without disruption.",
  "Adhere to MRSAC’s rules and policies for internship completion.",
];

export default function GuidelinesPage() {
  const { theme } = useTheme();

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-center">Internship Guidelines</h1>
      <ul className="space-y-4 list-disc list-inside">
        {guidelines.map((item, idx) => (
          <li
            key={idx}
            className={`p-4 rounded shadow ${
              theme === "dark"
                ? "bg-gray-800 text-gray-100"
                : "bg-gray-100 text-gray-900"
            }`}
          >
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
