"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Star, Loader2, Mail, User, MessageSquare, Calendar } from "lucide-react";

interface Feedback {
    _id: string;
    name: string;
    email: string;
    rating: number;
    message: string;
    createdAt: string;
}

export default function FeedbackPage() {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchFeedback() {
            try {
                const res = await fetch("/api/feedback");
                const data = await res.json();
                if (data.success) {
                    setFeedbacks(data.feedbacks);
                } else {
                    setError(data.error || "Failed to fetch feedback");
                }
            } catch (err) {
                setError("An error occurred while fetching feedback");
            } finally {
                setLoading(false);
            }
        }
        fetchFeedback();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-[var(--accent)]" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-[60vh] text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-[var(--foreground)]">User Feedback</h1>
                <p className="text-[var(--foreground-secondary)] mt-2">
                    View and manage feedback from users
                </p>
            </div>

            {feedbacks.length === 0 ? (
                <div className="text-center py-12 bg-[var(--card)] rounded-xl border border-[var(--border)]">
                    <MessageSquare className="w-12 h-12 mx-auto text-[var(--foreground-secondary)] mb-4" />
                    <h3 className="text-lg font-medium text-[var(--foreground)]">No feedback yet</h3>
                    <p className="text-[var(--foreground-secondary)]">
                        Feedback submitted by users will appear here.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {feedbacks.map((feedback, index) => (
                        <motion.div
                            key={feedback._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-[var(--card)] border border-[var(--border)] rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[var(--accent)]/10 flex items-center justify-center text-[var(--accent)] font-bold text-lg">
                                        {feedback.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-[var(--foreground)] line-clamp-1">
                                            {feedback.name}
                                        </h3>
                                        <div className="flex items-center gap-1 text-yellow-500">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={14}
                                                    fill={i < feedback.rating ? "currentColor" : "none"}
                                                    className={i < feedback.rating ? "" : "text-gray-300 dark:text-gray-600"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <span className="text-xs text-[var(--foreground-secondary)] bg-[var(--background)] px-2 py-1 rounded-full border border-[var(--border)] flex items-center gap-1">
                                    <Calendar size={12} />
                                    {new Date(feedback.createdAt).toLocaleDateString()}
                                </span>
                            </div>

                            <div className="space-y-3">
                                {feedback.email && (
                                    <div className="flex items-center gap-2 text-sm text-[var(--foreground-secondary)]">
                                        <Mail size={14} />
                                        <span className="truncate">{feedback.email}</span>
                                    </div>
                                )}

                                <div className="bg-[var(--background)] rounded-lg p-3 text-sm text-[var(--foreground)] border border-[var(--border)]">
                                    <p className="whitespace-pre-wrap">{feedback.message}</p>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}
        </div>
    );
}
