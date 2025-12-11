"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Loader2,
  CheckCircle2,
  XCircle,
  GraduationCap,
  Building2,
  Lightbulb,
  CalendarDays,
} from "lucide-react";
import Header from "@/components/landing/Header";
import OfferLetter from "@/models/OfferLetter";

export default function VerificationPage() {
  const [certificateId, setCertificateId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!certificateId.trim()) {
      setError("Please enter a certificate ID.");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/verify-certificate?id=${certificateId}`);
      const data = await res.json();

      if (!res.ok || !data || Object.keys(data).length === 0) {
        setError("Invalid certificate ID. Please check and try again.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />

      <main
        className="flex flex-col items-center space-y-6 no-scrollbar transition-colors duration-300"
        style={{
          background: "var(--verification-bg)",
          color: "var(--verification-text)",
        }}
      >
        <main
          className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4 sm:px-6 lg:px-8"
          style={{ color: "var(--verification-text)" }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.25 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0"
          />

          <form
            onSubmit={handleVerify}
            className="relative w-full max-w-2xl flex flex-col sm:flex-row items-center rounded-full p-0 transition-all duration-300 shadow-lg border"
            style={{
              background: "var(--verification-card-bg)",
              borderColor: "var(--verification-card-border)",
            }}
          >
            <div className="relative w-full sm:flex-1">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="Search certificate ID..."
                className="w-full pl-12 pr-4 py-3 sm:py-3 rounded-full bg-transparent border-none outline-none text-base sm:text-lg"
                style={{ color: "var(--verification-text)" }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-3 sm:mt-0 sm:ml-3 w-full sm:w-auto text-white px-6 py-3 rounded-full font-medium shadow-md hover:shadow-lg transition-all disabled:opacity-50
        bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500"
            >
              {loading ? <Loader2 className="animate-spin mx-auto" /> : "Search"}
            </button>
          </form>

          <div className="w-full max-w-2xl mt-8 sm:mt-10 px-2 sm:px-0">
            <AnimatePresence mode="wait">
              {error && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex flex-col sm:flex-row items-center justify-center gap-2 text-red-500 bg-red-50 border border-red-200 p-3 rounded-2xl text-center"
                >
                  <XCircle />
                  <span>{error}</span>
                </motion.div>
              )}

              {result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6 }}
                  className="rounded-3xl p-5 sm:p-8 w-full shadow-xl border transition-all duration-300"
                  style={{
                    background: "var(--verification-card-bg)",
                    borderColor: "var(--verification-card-border)",
                    color: "var(--verification-text)",
                  }}
                >
                  <h2 className="text-xl sm:text-2xl font-semibold mb-6 flex items-center gap-2 text-cyan-600">
                    <CheckCircle2 size={26} />
                    Certificate Verified
                  </h2>

                  <div className="space-y-4 sm:space-y-5">
                    <p>
                      <strong>Student Name:</strong> {result.name}
                    </p>
                    <p>
                      <strong>College Name:</strong> {result.college}
                    </p>
                    <p>
                      <strong>Department:</strong> {result.department}
                    </p>
                    <p>
                      <strong>Issued On:</strong> {result.issueDate}
                    </p>
                  </div>


                  <div
                    className="mt-5 pt-3 text-xs text-center border-t"
                    style={{ borderColor: "var(--verification-card-border)" }}
                  >
                    Certificate ID: <strong>{result.certificateId}</strong>
                  </div>
                </motion.div>
              )}

              {!error && !result && (
                <motion.p
                  key="helper"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center mt-6 sm:mt-8 text-xs sm:text-sm px-2"
                  style={{ color: "var(--verification-text)" }}
                >
                  Type your certificate ID and press <strong>Enter</strong> to verify.
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </main>
      </main>

    </>
  );
}
