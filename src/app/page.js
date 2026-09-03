"use client";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen relative flex flex-col items-center justify-center px-6 text-center overflow-hidden">
      <div className="absolute inset-0 blueprint-grid opacity-30 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10"
      >
    
     <p className="font-mono-label text-xs text-teal-400 mb-4">
     RESIDENTIAL SYSTEM
   </p>
       <motion.svg
          width="90"
          height="90"
          viewBox="0 0 90 90"
          className="mx-auto mb-6"
        >
          <motion.path
            d="M10 45 L45 15 L80 45 M20 40 V75 H70 V40"
            fill="none"
            stroke="#5eead4"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />
        </motion.svg>

        <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white">
          Home Guardian
        </h1>

        <p className="text-lg text-slate-400 mt-4 max-w-md mx-auto">
          Your house, explained. Know what's serious, know what to do.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-10 justify-center">
          <Link
            href="/emergency"
            className="px-8 py-4 rounded-lg bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 transition-all duration-300"
          >
            Something's wrong
          </Link>

          <Link
            href="/report"
            className="px-8 py-4 rounded-lg border border-slate-700 text-white font-semibold hover:border-teal-400 transition-all duration-300"
          >
            Read my report
          </Link>
        </div>
      </motion.div>
    </div>
  );
}