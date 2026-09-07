"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import jsPDF from "jspdf";
import { motion, AnimatePresence } from "framer-motion";
import { Droplet, Flame, Zap, BatteryCharging, Wrench, Home as HomeIcon, CloudRain, Wind, DoorClosed } from "lucide-react";

const steps = [
  {
    key: "water",
    title: "Water Supply",
    icon: Droplet,
    fields: [
      { key: "tank", label: "Tank type", type: "select", options: ["Overhead", "Underground", "Both", "None"] },
      { key: "motor", label: "Motor/pump working?", type: "select", options: ["Yes", "No", "Not sure"] },
      { key: "pressure", label: "Water pressure", type: "select", options: ["Good", "Weak", "Inconsistent"] },
    ],
  },
  {
    key: "geyser",
    title: "Geyser",
    icon: Flame,
    fields: [
      { key: "type", label: "Type", type: "select", options: ["Gas", "Electric", "Solar", "Hybrid", "None"] },
      { key: "age", label: "Approximate age", type: "select", options: ["Under 2 years", "2-5 years", "5-10 years", "10+ years"] },
      { key: "issues", label: "Any issues?", type: "text" },
    ],
  },
  {
    key: "electrical",
    title: "Electrical System",
    icon: Zap,
    fields: [
      { key: "wiring", label: "Wiring age", type: "select", options: ["Recently redone", "Original/old", "Not sure"] },
      { key: "exposed", label: "Exposed or loose wiring?", type: "select", options: ["Yes", "No"] },
      { key: "tripping", label: "Frequent tripping?", type: "select", options: ["Yes", "No"] },
    ],
  },
  {
    key: "backup",
    title: "Backup Power",
    icon: BatteryCharging,
    fields: [
   { key: "type", label: "Type", type: "select", options: ["UPS", "Generator", "Solar", "Multiple", "None"] },
      { key: "condition", label: "Condition", type: "select", options: ["Good", "Needs repair", "Not working", "N/A"] },
    ],
  },
  {
    key: "plumbing",
    title: "Plumbing & Drainage",
    icon: Wrench,
    fields: [
      { key: "leaks", label: "Any visible leaks?", type: "select", options: ["Yes", "No"] },
      { key: "clogging", label: "Drains clogging often?", type: "select", options: ["Yes", "No"] },
    ],
  },
  {
    key: "structural",
    title: "Structural",
    icon: HomeIcon,
    fields: [
      { key: "cracks", label: "Visible cracks?", type: "select", options: ["Yes", "No"] },
      { key: "notes", label: "Notes (where, how big)", type: "text" },
    ],
  },
  {
    key: "roof",
    title: "Roof & Ceiling",
    icon: CloudRain,
    fields: [
      { key: "seepage", label: "Seepage or water stains?", type: "select", options: ["Yes", "No"] },
    ],
  },
  {
    key: "damp",
    title: "Dampness & Ventilation",
    icon: Wind,
    fields: [
      { key: "damp", label: "Damp patches anywhere?", type: "select", options: ["Yes", "No"] },
      { key: "airflow", label: "Poor airflow in any room?", type: "select", options: ["Yes", "No"] },
    ],
  },
  {
    key: "security",
    title: "Doors, Windows & Security",
    icon: DoorClosed,
    fields: [
      { key: "locks", label: "All locks functional?", type: "select", options: ["Yes", "No"] },
      { key: "broken", label: "Any broken glass/screens?", type: "select", options: ["Yes", "No"] },
    ],
  },
];

export default function CreateReport() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [ownerName, setOwnerName] = useState("");
  const [address, setAddress] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [analyzingPhoto, setAnalyzingPhoto] = useState(false);
  const [photoError, setPhotoError] = useState("");
  const [showCamera, setShowCamera] = useState(false);
  const [stream, setStream] = useState(null);

  const step = steps[current];
  const Icon = step.icon;
  const progress = ((current + 1) / steps.length) * 100;

  function updateField(fieldKey, value) {
    setAnswers((prev) => ({
      ...prev,
      [step.key]: { ...prev[step.key], [fieldKey]: value },
    }));
  }

  async function handlePhotoAutofill(file, category) {
  if (!file) return;
  setAnalyzingPhoto(true);
  setPhotoError("");

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("category", category);

    const res = await fetch("/api/analyze-photo", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    const cleaned = data.result.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(cleaned);

    setAnswers((prev) => ({
      ...prev,
      [category]: {
        ...prev[category],
        ...parsed,
      },
    }));
  } catch (err) {
    setPhotoError("Couldn't read that photo clearly. Please try again or fill in manually.");
    console.error(err);
  }

  setAnalyzingPhoto(false);
}
async function openCamera() {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "environment" },
    });
    setStream(mediaStream);
    setShowCamera(true);
  } catch (err) {
    setPhotoError("Couldn't access camera. Please check permissions or use Upload instead.");
    console.error(err);
  }
}

function closeCamera() {
  if (stream) {
    stream.getTracks().forEach((track) => track.stop());
  }
  setStream(null);
  setShowCamera(false);
}

function capturePhoto(videoEl, category) {
  const canvas = document.createElement("canvas");
  canvas.width = videoEl.videoWidth;
  canvas.height = videoEl.videoHeight;
  canvas.getContext("2d").drawImage(videoEl, 0, 0);

  canvas.toBlob((blob) => {
    const file = new File([blob], `${category}-photo.jpg`, { type: "image/jpeg" });
    closeCamera();
    handlePhotoAutofill(file, category);
  }, "image/jpeg");
}
  function next() {
    if (current < steps.length - 1) setCurrent(current + 1);
  }
  function back() {
    if (current > 0) setCurrent(current - 1);
  }

  async function submitReport() {
  setSubmitting(true);

  const { error } = await supabase.from("reports").insert({
    owner_name: ownerName,
    address: address,
    findings: answers,
  });

  setSubmitting(false);

  if (error) {
    alert("Something went wrong saving your report. Please try again.");
    console.error(error);
  } else {
    setSubmitted(true);
  }
}

function buildPDF() {
  const doc = new jsPDF();
  let y = 20;

  doc.setFontSize(18);
  doc.text("Home Guardian - House Report", 14, y);
  y += 10;

  doc.setFontSize(11);
  doc.text(`Owner: ${ownerName}`, 14, y);
  y += 7;
  doc.text(`Address: ${address}`, 14, y);
  y += 12;

  steps.forEach((s) => {
    if (y > 270) {
      doc.addPage();
      y = 20;
    }

    doc.setFontSize(14);
    doc.text(s.title, 14, y);
    y += 8;

    doc.setFontSize(11);
    s.fields.forEach((field) => {
      const value = answers[s.key]?.[field.key] || "Not answered";
      doc.text(`${field.label}: ${value}`, 18, y);
      y += 7;
    });

    y += 5;
  });

  return doc;
}

function downloadPDF() {
  const doc = buildPDF();
  doc.save("home-guardian-report.pdf");
}

function sendToAnalyzer() {
  const doc = buildPDF();
  const pdfData = doc.output("datauristring");
  sessionStorage.setItem("autofillPdf", pdfData);
  window.location.href = "/report?autofill=true";
}

  return (
    <div className="min-h-screen relative px-6 py-16 max-w-xl mx-auto">
      <div className="fixed inset-0 blueprint-grid opacity-20 pointer-events-none" />

      <div className="relative z-10">
        <Link href="/" className="font-mono-label text-slate-500 hover:text-teal-400 transition-colors">
          ← BACK
        </Link>

        <h1 className="text-3xl font-bold text-white mt-4">Create My Report</h1>
        <p className="text-slate-400 mt-1 mb-6">
          Step {current + 1} of {steps.length}
        </p>

        <div className="h-1 bg-slate-800 rounded-full overflow-hidden mb-10">
          <motion.div
            className="h-full bg-teal-400"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step.key}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.3 }}
            className="p-6 rounded-lg border border-slate-800 bg-slate-900/60"
          >
            <div className="flex items-center gap-3 mb-6">
              <Icon className="text-teal-400" size={28} />
              <h2 className="text-xl font-bold text-white">{step.title}</h2>
            </div>

            {step.key === "geyser" && (
  <div className="mb-6 p-4 rounded-lg border border-dashed border-slate-700 bg-slate-900/40">
    <label className="text-sm text-slate-400 block mb-3">
      📷 Have a photo of your geyser's nameplate/label? Let AI fill this in for you.
    </label>

    {!showCamera && (
      <div className="flex flex-wrap gap-3">
        <button
          onClick={openCamera}
          className="px-4 py-2 rounded-lg bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 transition-colors"
        >
          Take Photo
        </button>

        <label className="px-4 py-2 rounded-lg border border-teal-400 text-teal-400 font-semibold hover:bg-teal-400/10 transition-colors cursor-pointer">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoAutofill(e.target.files[0], "geyser")}            className="hidden"
          />
        </label>
      </div>
    )}

    {showCamera && (
      <div className="mt-2">
        <video
          autoPlay
          playsInline
          ref={(videoEl) => {
            if (videoEl && stream) videoEl.srcObject = stream;
          }}
          className="w-full rounded-lg border border-teal-400"
        />
        <div className="flex gap-3 mt-3">
          <button
          onClick={(e) => capturePhoto(e.target.parentElement.previousSibling, "geyser")}            className="px-4 py-2 rounded-lg bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 transition-colors"
          >
            Capture
          </button>
          <button
            onClick={closeCamera}
            className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-slate-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )}

    {analyzingPhoto && (
      <p className="text-teal-400 text-sm mt-3">Reading photo...</p>
    )}
    {photoError && (
      <p className="text-red-400 text-sm mt-3">{photoError}</p>
    )}
  </div>
)}

{step.key === "backup" && (
  <div className="mb-6 p-4 rounded-lg border border-dashed border-slate-700 bg-slate-900/40">
    <label className="text-sm text-slate-400 block mb-3">
      📷 Have a photo of your UPS, generator, or solar setup? Let AI fill this in for you.
    </label>

    {!showCamera && (
      <div className="flex flex-wrap gap-3">
        <button
          onClick={openCamera}
          className="px-4 py-2 rounded-lg bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 transition-colors"
        >
          Take Photo
        </button>

        <label className="px-4 py-2 rounded-lg border border-teal-400 text-teal-400 font-semibold hover:bg-teal-400/10 transition-colors cursor-pointer">
          Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={(e) => handlePhotoAutofill(e.target.files[0], "backup")}
            className="hidden"
          />
        </label>
      </div>
    )}

    {showCamera && (
      <div className="mt-2">
        <video
          autoPlay
          playsInline
          ref={(videoEl) => {
            if (videoEl && stream) videoEl.srcObject = stream;
          }}
          className="w-full rounded-lg border border-teal-400"
        />
        <div className="flex gap-3 mt-3">
          <button
            onClick={(e) => capturePhoto(e.target.parentElement.previousSibling, "backup")}
            className="px-4 py-2 rounded-lg bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 transition-colors"
          >
            Capture
          </button>
          <button
            onClick={closeCamera}
            className="px-4 py-2 rounded-lg border border-slate-600 text-slate-300 hover:border-slate-400 transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    )}

    {analyzingPhoto && (
      <p className="text-teal-400 text-sm mt-3">Reading photo...</p>
    )}
    {photoError && (
      <p className="text-red-400 text-sm mt-3">{photoError}</p>
    )}
  </div>
)}
            <div className="flex flex-col gap-5">
              {step.fields.map((field) => (
                <div key={field.key}>
                  <label className="text-sm text-slate-400 block mb-2">{field.label}</label>
                  {field.type === "select" ? (
                    <div className="flex flex-wrap gap-2">
                      {field.options.map((opt) => (
                        <button
                          key={opt}
                          onClick={() => updateField(field.key, opt)}
                          className={`px-4 py-2 rounded-lg border text-sm transition-colors duration-200 ${
                            answers[step.key]?.[field.key] === opt
                              ? "border-teal-400 bg-teal-400/10 text-teal-400"
                              : "border-slate-700 text-slate-300 hover:border-slate-500"
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <input
                      type="text"
                      value={answers[step.key]?.[field.key] || ""}
                      onChange={(e) => updateField(field.key, e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-400 outline-none"
                      placeholder="Optional notes..."
                    />
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>

       {current === steps.length - 1 && !submitted && (
  <div className="mt-8 flex flex-col gap-4">
    <div>
      <label className="text-sm text-slate-400 block mb-2">Your name</label>
      <input
        type="text"
        value={ownerName}
        onChange={(e) => setOwnerName(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-400 outline-none"
        placeholder="e.g. Ahmed Khan"
      />
    </div>
    <div>
      <label className="text-sm text-slate-400 block mb-2">House address</label>
      <input
        type="text"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white focus:border-teal-400 outline-none"
        placeholder="e.g. House 12, Street 4, DHA Phase 5"
      />
    </div>
  </div>
)}

{submitted && (
  <div className="mt-8 flex flex-col gap-4">
    <div className="p-4 rounded-lg border border-teal-400 bg-teal-400/10 text-teal-400 text-center">
      Report saved successfully!
    </div>
    <button
      onClick={sendToAnalyzer}
      className="px-5 py-2 rounded-lg bg-teal-400 text-slate-900 font-semibold hover:bg-teal-300 transition-colors"
    >
      Analyze This Report Now
    </button>
    <button
      onClick={downloadPDF}
      className="px-5 py-2 rounded-lg border border-teal-400 text-teal-400 font-semibold hover:bg-teal-400/10 transition-colors"
    >
      Download PDF
    </button>
  </div>
)}

<div className="flex justify-between mt-8">
  <button
    onClick={back}
    disabled={current === 0}
    className="px-5 py-2 rounded-lg border border-slate-700 text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed"
  >
    Back
  </button>

  {current === steps.length - 1 ? (
    <button
      onClick={submitReport}
      disabled={submitting || submitted}
      className="px-5 py-2 rounded-lg bg-teal-400 text-slate-900 font-semibold disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {submitted ? "Saved" : submitting ? "Saving..." : "Submit Report"}
    </button>
  ) : (
    <button
      onClick={next}
      className="px-5 py-2 rounded-lg bg-teal-400 text-slate-900 font-semibold"
    >
      Next
    </button>
  )}
      </div>
      </div>
      </div>
  );
}