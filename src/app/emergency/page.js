"use client";
import { useState } from "react";
import Link from "next/link";

const problems = [
  {
    name: "Water leak / dripping",
    urgency: "🔴 Act now",
    color: "border-red-500",
    action: "Turn off your main water shutoff valve immediately.",
    call: "Call a plumber",
  },
  {
    name: "Gas smell",
    urgency: "🔴 Emergency",
    color: "border-red-500",
    action: "Leave the house immediately. Do not turn on lights or switches.",
    call: "Call your gas company or 911",
  },
  {
    name: "Breaker keeps tripping",
    urgency: "🟠 Investigate soon",
    color: "border-orange-500",
    action: "Unplug devices on that circuit. Don't keep resetting it repeatedly.",
    call: "Call an electrician",
  },
  {
    name: "Ceiling stain / water spot",
    urgency: "🟠 Investigate soon",
    color: "border-orange-500",
    action: "Check the floor above for leaks. Don't ignore it.",
    call: "Call a plumber or roofer",
  },
  {
    name: "Toilet overflowing",
    urgency: "🔴 Act now",
    color: "border-red-500",
    action: "Turn off the small valve behind the toilet, then stop using it.",
    call: "Call a plumber",
  },
];

export default function Emergency() {
  const [selected, setSelected] = useState(null);

  return (
    <div className="min-h-screen px-6 py-16 max-w-2xl mx-auto">
      <Link href="/" className="text-zinc-500 hover:text-orange-400 text-sm transition-colors">
        ← Back home
      </Link>

      <h1 className="text-4xl font-bold text-white mt-4">
        🚨 Is this an emergency?
      </h1>
      <p className="text-zinc-400 mt-2 mb-8">
        Pick what's happening in your house.
      </p>

      <div className="flex flex-col gap-3">
        {problems.map((problem) => (
          <button
            key={problem.name}
            onClick={() => setSelected(problem)}
            className={`text-left p-4 rounded-xl border transition-all duration-300 ${
              selected?.name === problem.name
                ? "border-orange-500 bg-orange-500/10"
                : "border-zinc-700 hover:border-zinc-500 bg-zinc-900"
            }`}
          >
            <span className="text-white font-medium">{problem.name}</span>
          </button>
        ))}
      </div>

      {selected && (
        <div
          className={`animate-fade-up mt-8 p-6 rounded-xl border-2 ${selected.color} bg-zinc-900`}
        >
          <h2 className="text-2xl font-bold text-white">{selected.urgency}</h2>
          <p className="text-zinc-300 mt-3">
            <strong className="text-white">Do this now:</strong> {selected.action}
          </p>
          <p className="text-zinc-300 mt-2">
            <strong className="text-white">Who to call:</strong> {selected.call}
          </p>
        </div>
      )}
    </div>
  );
}