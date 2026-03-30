"use client";

import { motion } from "framer-motion";
import { type ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  style?: Record<string, string>;
  delay?: number;
}

export function GlassCard({ children, className = "", style, delay = 0 }: GlassCardProps) {
  return (
    <motion.div
      className={`glass-card glass-card-hover rounded-2xl overflow-hidden transition-all duration-300 ${className}`}
      style={style}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: "easeOut" as const }}
    >
      {children}
    </motion.div>
  );
}
