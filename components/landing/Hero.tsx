"use client";

import { ArrowRightIcon } from "lucide-react";
import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";

const Hero: React.FC = () => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) =>
      setMousePos({ x: e.clientX, y: e.clientY });
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const translate = (factor: number) => ({
    transform: `translate(${
      (mousePos.x / window.innerWidth - 0.5) * factor
    }px, ${(mousePos.y / window.innerHeight - 0.5) * factor}px)`,
  });

  return (
    <section
      id="home"
      className="relative h-screen w-full flex flex-col justify-center items-center text-center px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50"
    >
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1.2, opacity: 0.3 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        style={translate(50)}
        className="absolute -top-20 -left-32 w-[500px] h-[500px] bg-purple-900 rounded-full filter blur-2xl"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.25 }}
        transition={{ duration: 1.8, ease: "easeOut", delay: 0.2 }}
        style={translate(60)}
        className="absolute -bottom-32 -right-24 w-[600px] h-[600px] bg-violet-900 rounded-full filter blur-2xl"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.2 }}
        transition={{ duration: 2, ease: "easeOut", delay: 0.4 }}
        style={translate(40)}
        className="absolute top-1/3 left-1/2 w-[450px] h-[450px] bg-blue-900 rounded-full filter blur-2xl"
      />

      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm z-0"></div>

      <div className="relative z-20 flex flex-col items-center">
        <motion.h1
          style={{ y: scrollY * 0.3 }}
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight leading-tight text-gray-900 px-4 py-2 rounded-md"
        >
          Maharashtra Remote Sensing
          <br />
          Application Centre
        </motion.h1>

        <motion.p
          style={{ y: scrollY * 0.15 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="mt-4 text-lg sm:text-xl md:text-2xl text-gray-700 tracking-wider max-w-2xl px-4 py-2 rounded-md"
        >
          Discover and apply to internships that elevate your career journey.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1, backgroundColor: "rgba(0,0,0,0.05)" }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 w-12 h-12 rounded-full flex items-center justify-center bg-white/80 shadow-md hover:shadow-lg transition-all"
          onClick={() =>
            document
              .getElementById("about-us")
              ?.scrollIntoView({ behavior: "smooth" })
          }
        >
          <ArrowRightIcon className="text-gray-900" />
        </motion.button>

        <p className="mt-8 text-sm text-gray-600 max-w-md px-3 py-1 rounded-md">
          AS A STUDENT, YOU CAN TRACK, APPLY, AND MANAGE YOUR INTERNSHIP
          OPPORTUNITIES SEAMLESSLY
        </p>
      </div>
    </section>
  );
};

export default Hero;
