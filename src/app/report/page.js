"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
export default function Report() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState("");

  async function handleUpload() {
    if (!file) return;
    setLoading(true);
    setResult("");

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setResult(data.result);
    setLoading(false);
  }

  return (
    <div className="min-h-screen px-6 py-16 max-w-2xl mx-auto">
      <h1 className="text-4xl font-bold text-white">📋 Inspection Report Reader</h1>
      <p className="text-zinc-400 mt-2 mb-8">
        Upload your home inspection report PDF. We'll sort what matters.
      </p>

      <input
        type="file"
        accept="application/pdf"
        onChange={(e) => setFile(e.target.files[0])}
        className="text-zinc-300"
      />

      <button
        onClick={handleUpload}
        disabled={!file || loading}
        className="block mt-6 px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-semibold transition-all duration-300 disabled:opacity-40"
      >
        {loading ? "Reading your report..." : "Analyze Report"}
      </button>

         {result && (
     <div className="mt-8 p-6 rounded-xl border border-zinc-700 bg-zinc-900 text-zinc-200 prose prose-invert max-w-none prose-headings:text-orange-400 prose-strong:text-white">
       <ReactMarkdown>{result}</ReactMarkdown>
     </div>
   )}
    </div>
  );
}