"use client";
import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";

function ReportHeading({ children }) {
  const text = children?.toString() || "";
  const config = {
    "Fix Now": { color: "border-red-400 text-red-400", icon: "▲" },
    "Plan Soon": { color: "border-amber-400 text-amber-400", icon: "◆" },
    "Routine": { color: "border-teal-400 text-teal-400", icon: "●" },
  };
  const match = config[text] || { color: "border-slate-500 text-slate-400", icon: "■" };

  return (
    <div className={`flex items-center gap-3 border-l-4 pl-4 mt-8 mb-4 ${match.color}`}>
      <span className="text-lg">{match.icon}</span>
      <h2 className="text-xl font-bold text-white m-0">{text}</h2>
    </div>
  );
}
const statusMessages = [
  "Reading your document...",
  "Scanning for hazards...",
  "Checking system ages...",
  "Sorting findings...",
];

export default function Report() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");
  const [dragActive, setDragActive] = useState(false);
  const [statusIndex, setStatusIndex] = useState(0);

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    const interval = setInterval(() => {
  setStatusIndex((i) => (i + 1) % statusMessages.length);
}, 1800);
    setResult("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data.result);
clearInterval(interval);
setLoading(false);
  }

  function handleDrag(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragover" || e.type === "dragenter");
  }

  function handleDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  }

  return (
    <div className="min-h-screen relative px-6 py-16 max-w-2xl mx-auto">
      <div className="fixed inset-0 blueprint-grid opacity-20 pointer-events-none" />

      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative z-10">
        <Link href="/" className="font-mono-label text-slate-500 hover:text-teal-400 transition-colors">
          ← BACK
        </Link>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-white mt-4"
        >
          Inspection Report Reader
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-slate-400 mt-2 mb-8"
        >
          Upload your home inspection report PDF. We'll sort what matters.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <label
            onDragOver={handleDrag}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            className={`relative overflow-hidden block cursor-pointer rounded-lg border-2 border-dashed p-10 text-center transition-colors duration-300 ${
              dragActive
                ? "border-teal-400 bg-teal-400/5"
                : "border-slate-700 bg-slate-900/60 hover:border-slate-500"
            }`}
          >
            <input
              type="file"
              accept="application/pdf"
              onChange={(e) => setFile(e.target.files[0])}
              className="hidden"
            />

            {loading && (
  <motion.div
    initial={{ top: "0%" }}
    animate={{ top: "100%" }}
    transition={{ repeat: Infinity, repeatType: "reverse", duration: 1.4, ease: "easeInOut" }}
    className="absolute left-1/2 -translate-x-1/2 w-4/5 h-0.5 bg-teal-400/70 shadow-[0_0_12px_2px_rgba(94,234,212,0.6)]"
  />
)}

            <p className="text-slate-300 font-medium">
              {file ? file.name : "Drop your PDF here"}
            </p>
            <p className="text-slate-500 text-sm mt-1">
              {file ? "Ready to analyze" : "or click to choose a file"}
            </p>
          </label>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleUpload}
            disabled={!file || loading}
            className="block mt-5 px-6 py-3 rounded-lg bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 transition-colors duration-300 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <motion.span
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  className="inline-block w-4 h-4 border-2 border-slate-900 border-t-transparent rounded-full"
                />
{statusMessages[statusIndex]}              </span>
            ) : (
              "Analyze Report"
            )}
          </motion.button>
        </motion.div>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-8 p-6 rounded-lg border border-slate-800 bg-slate-900 text-slate-200 prose prose-invert max-w-none prose-headings:text-teal-400 prose-strong:text-white"
            >
              <ReactMarkdown components={{ h2: ReportHeading }}>{result}</ReactMarkdown>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}