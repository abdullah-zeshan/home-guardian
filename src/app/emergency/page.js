"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

const problems = [
  { name: "Water leak / dripping", urgency: "Act now", level: "danger", action: "Turn off your main water shutoff valve immediately.", call: "Call a plumber" },
  { name: "Gas smell", urgency: "Emergency", level: "danger", action: "Leave the house immediately. Do not turn on lights or switches.", call: "Call your gas company or 911" },
  { name: "Breaker keeps tripping", urgency: "Investigate soon", level: "warning", action: "Unplug devices on that circuit. Don't keep resetting it repeatedly.", call: "Call an electrician" },
  { name: "Ceiling stain / water spot", urgency: "Investigate soon", level: "warning", action: "Check the floor above for leaks. Don't ignore it.", call: "Call a plumber or roofer" },
  { name: "Toilet overflowing", urgency: "Act now", level: "danger", action: "Turn off the small valve behind the toilet, then stop using it.", call: "Call a plumber" },
];

const colors = {
  danger: { border: "border-red-400", text: "text-red-400", glow: "hover:shadow-red-500/20" },
  warning: { border: "border-amber-400", text: "text-amber-400", glow: "hover:shadow-amber-500/20" },
};

export default function Emergency() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen relative px-6 py-16 max-w-2xl mx-auto">
      <div className="fixed inset-0 blueprint-grid opacity-20 pointer-events-none" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">
        <Link href="/" className="font-mono-label text-xs text-slate-500 hover:text-teal-400 transition-colors">
          ← BACK
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-white mt-4"
        >
          Is this an emergency?
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 mt-2 mb-8"
        >
          Select what's happening in your house.
        </motion.p>

        <div className="flex flex-col gap-3">
          {problems.map((problem, i) => (
            <motion.button
              key={problem.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + i * 0.08 }}
              whileHover={{ scale: 1.02, x: 6 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelected(problem)}
              className={`text-left p-4 rounded-lg border transition-colors duration-300 shadow-lg ${colors[problem.level].glow} ${
                selected?.name === problem.name
                  ? `${colors[problem.level].border} bg-slate-800`
                  : "border-slate-800 bg-slate-900/60 hover:border-slate-600"
              }`}
            >
              <span className="text-white font-medium">{problem.name}</span>
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {selected && (
            <motion.div
              key={selected.name}
              initial={{ opacity: 0, y: 20, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.96 }}
              transition={{ duration: 0.35 }}
              className={`mt-8 p-6 rounded-lg border-2 ${colors[selected.level].border} bg-slate-900`}
            >
              <span className={`font-mono-label text-xs ${colors[selected.level].text}`}>
                {selected.urgency.toUpperCase()}
              </span>
              <p className="text-slate-300 mt-3">
                <strong className="text-white">Do this now:</strong> {selected.action}
              </p>
              <p className="text-slate-300 mt-2">
                <strong className="text-white">Who to call:</strong> {selected.call}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}