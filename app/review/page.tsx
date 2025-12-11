"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import Header from "@/components/landing/Header";
import Footer from "@/components/landing/Footer";

const faqs = [
  {
    question: "What is MRSAC?",
    answer:
      "MRSAC stands for Maharashtra Remote Sensing Application Centre. It is an autonomous organization under the Department of Planning, Government of Maharashtra, specializing in remote sensing, GIS, and geospatial data analysis.",
  },
  {
    question: "Where is MRSAC located?",
    answer: "MRSAC is located in Nagpur, Maharashtra, India.",
  },
  {
    question: "What does MRSAC do?",
    answer:
      "MRSAC develops and provides GIS-based solutions, satellite data analysis, and remote sensing applications for various government departments and research institutions.",
  },
  {
    question: "Who manages the ISMS portal?",
    answer:
      "The ISMS (Internship’s Management System) portal is developed by students as a major project for automating the MRSAC internship process.",
  },

  {
    question: "How can I apply for an internship at MRSAC?",
    answer:
      "You can apply directly through the ISMS portal by filling out the registration form, verifying your email, and submitting required documents such as ID proof, LOR, and resume.",
  },
];

export default function ReviewPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    rating: 0,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setFormData({ name: "", email: "", rating: 0, message: "" });
        toast.success("Thank you for your feedback!");
      } else {
        toast.error(data.error || "Failed to submit feedback. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong. Please try again.");
    }
  };

  return (
    <>
      <Header />

      <main className="flex flex-col items-center space-y-6 bg-[var(--background)] text-[var(--foreground)] min-h-screen no-scrollbar">
        <section className="pt-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 text-[var(--accent)]">
            We Value Your Feedback
          </h1>
          <p className="text-[var(--foreground-secondary)] max-w-2xl mx-auto text-lg">
            Help us improve your internship experience by sharing your thoughts.
          </p>
        </section>

        <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-white/20 dark:from-gray-800/20 to-white/10 dark:to-gray-900/10 border border-[var(--border)] rounded-3xl p-8 shadow-xl backdrop-blur-lg hover:shadow-2xl transition-all duration-300"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-[var(--accent)] text-center">
              Share Your Feedback
            </h2>
            {submitted ? (
              <p className="text-[var(--accent)] font-semibold text-center">
                Thank you for your feedback!
              </p>
            ) : (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
                  required
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email (optional)"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
                />
                <div className="flex items-center gap-2">
                  <label className="font-semibold">Rating:</label>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFormData({ ...formData, rating: star })}
                      className={`text-2xl transition-transform transform hover:scale-125 ${formData.rating >= star
                        ? "text-yellow-400"
                        : "text-[var(--foreground-secondary)]"
                        }`}
                    >
                      ★
                    </button>
                  ))}
                </div>
                <textarea
                  name="message"
                  placeholder="Your feedback..."
                  value={formData.message}
                  onChange={handleChange}
                  rows={4}
                  className="w-full p-3 rounded-lg bg-[var(--card)] border border-[var(--border)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] transition"
                  required
                />
                <button
                  type="submit"
                  className="w-full py-3 bg-[var(--accent)] text-[subtn] rounded-lg font-semibold hover:bg-[var(--accent-hover)] transition-colors duration-300"
                >
                  Submit Feedback
                </button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <h2 className="text-2xl sm:text-3xl font-bold mb-4 text-[var(--accent)] text-center lg:text-left">
              Frequently Asked Questions
            </h2>
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className={`border border-[var(--border)] rounded-2xl overflow-hidden bg-[var(--card)] shadow-lg transition-all duration-300 ${isOpen ? "shadow-xl scale-[1.02]" : ""
                    }`}
                >
                  <button
                    onClick={() => setOpenIndex(isOpen ? null : i)}
                    className="w-full flex justify-between items-center px-5 py-4 font-semibold text-[var(--foreground)] hover:bg-[var(--card-hover)] transition-all"
                  >
                    <span>{faq.question}</span>
                    <motion.div
                      animate={{ rotate: isOpen ? 180 : 0 }}
                      transition={{ duration: 0.25 }}
                    >
                      <ChevronDown className="text-[var(--accent)]" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                      >
                        <div className="px-5 pb-4 text-[var(--foreground-secondary)]">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        </section>
      </main>

      <Footer />
    </>
  );
}
