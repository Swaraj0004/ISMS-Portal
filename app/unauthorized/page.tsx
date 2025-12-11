"use client";

import { useRouter } from "next/navigation";

export default function Unauthorized() {
  const router = useRouter();

  const loginback = () => {
    localStorage.removeItem("user");
    router.push("/auth");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900 px-4 text-center">
      <h1 className="text-6xl font-bold text-red-600 mb-4">403</h1>
      <h2 className="text-2xl font-semibold mb-2 text-gray-800 dark:text-gray-100">
        Access Denied
      </h2>
      <p className="mb-6 text-gray-600 dark:text-gray-300">
        You do not have permission to view this page.
      </p>
      <div className="flex gap-4">
        <button
          onClick={() => router.push("/")}
          className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
        >
          Go to Home
        </button>
        <button
          onClick={loginback}
          className="px-6 py-2 border border-gray-600 text-gray-800 rounded hover:bg-gray-200 dark:text-gray-200 dark:border-gray-400 dark:hover:bg-gray-700 transition"
        >
          Login
        </button>
      </div>
    </div>
  );
}
