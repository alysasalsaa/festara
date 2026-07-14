"use client";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export default function AnimatedSection({ children, delay = 0, className = "", id }: {
  children: React.ReactNode; delay?: number; className?: string; id?: string;
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <motion.div ref={ref} id={id}
      initial={{ opacity: 0, y: 32 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 32 }}
      transition={{ duration: 0.5, delay, ease: "easeOut" }}
      className={className}>
      {children}
    </motion.div>
  );
}