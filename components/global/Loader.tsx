"use client";

import { HTMLMotionProps, motion } from "framer-motion";
import React from "react";

export interface BouncingDotsProps {
  dots?: number;
  message?: string;
  messagePlacement?: "bottom" | "left" | "right";
}

export function BouncingDots({
  dots = 3,
  message,
  messagePlacement = "bottom",
  className = "",
  ...props
}: HTMLMotionProps<"div"> & BouncingDotsProps) {
  const flexDirection =
    messagePlacement === "bottom"
      ? "flex-col"
      : messagePlacement === "left"
      ? "flex-row-reverse"
      : "flex-row";

  const messageMargin =
    messagePlacement === "bottom"
      ? "mt-2"
      : messagePlacement === "left"
      ? "mr-2"
      : "ml-2";

  return (
    <div
      className={`flex ${flexDirection} items-center justify-center ${className}`}
    >
      <div className="flex gap-2 items-center justify-center">
        {Array(dots)
          .fill(undefined)
          .map((_, index) => (
            <motion.div
              key={index}
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: "white" }}
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 0.6,
                repeat: Infinity,
                delay: index * 0.2,
                ease: "easeInOut",
              }}
              {...props}
            />
          ))}
      </div>
      {message && (
        <div className={`${messageMargin} text-sm text-white`}>{message}</div>
      )}
    </div>
  );
}
