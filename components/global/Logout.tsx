"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem("user");

    router.push("/auth");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={handleLogout}
      className="px-4 py-2 bg-red-500 text-white rounded-lg font-semibold shadow-md hover:bg-red-600"
    >
      Logout
    </motion.button>
  );
}
