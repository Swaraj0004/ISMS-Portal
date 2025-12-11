"use client";

import { useEffect, useState } from "react";
import Toast from "@/components/global/Toast";
import { BouncingDots } from "@/components/global/Loader";

interface INotification {
  _id: string;
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type?: "success" | "error" } | null>(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/intern/notifications", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch notifications");

      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to load notifications", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/intern/notifications", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (!res.ok) throw new Error("Failed to mark as read");

      setNotifications((prev) =>
        prev.map((n) => (n._id === id ? { ...n, read: true } : n))
      );
    } catch (err) {
      console.error(err);
      setToast({ message: "Failed to mark notification", type: "error" });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <BouncingDots />
      </div>
    );

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Notifications</h2>
      {notifications.length === 0 ? (
        <p>No notifications.</p>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => (
            <div
              key={n._id}
              className={`p-4 rounded shadow flex justify-between items-start ${
                n.read ? "bg-gray-100 dark:bg-gray-800" : "bg-blue-100 dark:bg-blue-900"
              }`}
            >
              <div>
                <p className="font-medium">{n.title}</p>
                <p className="text-sm">{n.message}</p>
                <p className="text-xs text-gray-500">{new Date(n.createdAt).toLocaleString()}</p>
              </div>
              {!n.read && (
                <button
                  onClick={() => markAsRead(n._id)}
                  className="ml-4 text-sm px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                >
                  Mark Read
                </button>
              )}
            </div>
          ))}
        </div>
      )}
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
}
