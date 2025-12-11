"use client";
import React, { useState } from "react";
import dynamic from "next/dynamic";
import { ArrowRightIcon, X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import Link from "next/link";

const Player = dynamic(
  () => import("@lottiefiles/react-lottie-player").then((mod) => mod.Player),
  { ssr: false }
);

const AboutUs: React.FC = () => {
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0 },
  };
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <section
      id="about-us"
      className="w-full min-h-screen px-4 sm:px-6 lg:px-8 
             bg-[var(--background)] text-[var(--foreground)] 
             flex items-center justify-center py-20"
    >
      <div className="max-w-7xl w-full mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="lg:order-last flex justify-center"
        >
          <Player
            autoplay
            loop
            src="https://assets4.lottiefiles.com/packages/lf20_0yfsb3a1.json"
            className="w-full max-w-sm h-auto sm:max-w-md lg:max-w-none lg:w-[500px] lg:h-[500px]"
          />
        </motion.div>

        <motion.div
          className="space-y-6 text-center lg:text-left"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.4 }}
          transition={{ staggerChildren: 0.2 }}
        >
          <motion.h2
            variants={fadeUp}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight 
                   bg-gradient-to-r from-blue-600 to-cyan-400 text-transparent bg-clip-text"
          >
            ABOUT US
          </motion.h2>

          <motion.h3
            variants={{
              hidden: { opacity: 0, y: 40 },
              visible: { opacity: 1, y: 0 },
            }}
            className="text-xl sm:text-2xl font-semibold text-gray-500"
          >
            MRSAC stands for Maharashtra Remote Sensing Applications Centre.
          </motion.h3>

          <motion.p
            variants={fadeUp}
            className="text-base sm:text-lg leading-relaxed text-gray-500"
          >
            It was established in January 1988 under{" "}
            <em className="font-semibold text-blue-600 not-italic">
              the Societies Registration Act, 1860
            </em>
            , functioning as an autonomous body under the administration of the
            Planning Department of the Government of Maharashtra. It serves as
            the nodal agency charged with designing the state's geo-spatial
            digital database system (MGDDS).
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="pt-6 flex flex-wrap justify-center lg:justify-start gap-4"
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Read more about this feature"
              className="px-5 py-2.5 text-sm font-medium rounded-lg 
                     border border-gray-300/30 text-gray-500 
                     hover:bg-gray-100/10 hover:border-gray-200/40
                     dark:border-gray-600/30 dark:hover:bg-gray-800/40 
                     transition-colors duration-300"
            >
              <Link href="/about/#about-mrsac">Read More</Link>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Get started now"
              onClick={() => router.push("/auth")}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl 
                     bg-blue-600 text-white font-semibold shadow-md shadow-blue-500/20 
                     hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 
                     dark:focus:ring-blue-800 transition-all duration-300"
            >
              Get Started
              <ArrowRightIcon className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default AboutUs;
