"use client";

import { useState } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import {
  submitStudentBuild,
  createBrowserClient,
  isRealSupabase
} from "@siksatech/database";
import {
  Upload, Code2, Cpu, Wrench, CheckCircle2, ArrowRight,
  ArrowLeft, Sparkles, Loader2
} from "lucide-react";
import Link from "next/link";

export default function SubmitBuildPage() {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    problemStatement: "",
    description: "",
    studentLevel: "Builder (Class 8–10)",
    difficulty: "Medium" as "Easy" | "Medium" | "Hard",
    skills: "Embedded C++, IoT, Sensor Calibration",
    technologies: "Arduino, ESP32, FreeRTOS",
    components: "Soil Sensor, 5V Relay, 1602 LCD Display",
    schematicDiagram: "",
    codeSnippet: "",
    videoUrl: "",
    creatorName: "",
    creatorSchool: "",
    creatorGrade: "Class 9"
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.creatorName || !formData.description) {
      alert("Please fill in the project title, your name, and description.");
      return;
    }

    setIsSubmitting(true);
    let supabase;
    let studentId: string | null = null;

    if (isRealSupabase) {
      try {
        supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) studentId = user.id;
      } catch (err) {
        console.error("Auth context lookup:", err);
      }
    }

    const res = await submitStudentBuild(supabase, {
      student_id: studentId,
      creator_name: formData.creatorName,
      creator_school: formData.creatorSchool,
      creator_grade: formData.creatorGrade,
      title: formData.title,
      description: formData.description,
      problem_statement: formData.problemStatement,
      student_level: formData.studentLevel,
      difficulty: formData.difficulty,
      skills: formData.skills.split(",").map((s) => s.trim()).filter(Boolean),
      technologies: formData.technologies.split(",").map((t) => t.trim()).filter(Boolean),
      components: formData.components.split(",").map((c) => c.trim()).filter(Boolean),
      schematic_diagram: formData.schematicDiagram,
      code_snippet: formData.codeSnippet,
      video_url: formData.videoUrl
    });

    if (res.success) {
      setSubmitted(true);
    } else {
      alert("Submission error: " + (res.error || "Please try again"));
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto w-full">
        <Link
          href="/build"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Project Showcase
        </Link>

        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Upload className="w-4 h-4" /> Student Maker Showcase
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mb-2">
            Submit Your Hardware Build
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto leading-relaxed">
            Get your physical circuit schematics and firmware reviewed by SiksaTech mentors to earn verifiable credentials.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-emerald-200 shadow-xl text-center space-y-5">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Build Submitted for Mentor Review</h2>
              <p className="text-xs text-slate-500 mt-2 max-w-md mx-auto leading-relaxed">
                Our academic engineering mentors will verify your breadboard connections and code. Once approved, your project will appear in the public showcase!
              </p>
            </div>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/build"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all inline-flex items-center gap-2"
              >
                Browse Gallery <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                1. Project Identity &amp; Narrative
              </h3>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                  Project Title *
                </label>
                <input
                  type="text"
                  name="title"
                  required
                  placeholder="e.g. Solar Telemetry Weather Station"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                  Problem Statement (What issue does this build solve?) *
                </label>
                <textarea
                  name="problemStatement"
                  required
                  rows={3}
                  placeholder="e.g. Farmers lack low-cost local soil telemetry, leading to crop damage."
                  value={formData.problemStatement}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                  Detailed Solution Description *
                </label>
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Describe your architecture, sensor logic, and operational flow."
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                2. Hardware &amp; Firmware Specs
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                    Student Level *
                  </label>
                  <select
                    name="studentLevel"
                    value={formData.studentLevel}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="Explorer (Class 5–7)">Explorer (Class 5–7)</option>
                    <option value="Builder (Class 8–10)">Builder (Class 8–10)</option>
                    <option value="Creator (Class 11–12)">Creator (Class 11–12)</option>
                    <option value="Engineer (College)">Engineer (College)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                    Build Difficulty *
                  </label>
                  <select
                    name="difficulty"
                    value={formData.difficulty}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 bg-white focus:outline-none focus:border-blue-600"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                  Components &amp; Sensors Used (comma separated)
                </label>
                <input
                  type="text"
                  name="components"
                  placeholder="e.g. Arduino Uno, DHT22, 1602 LCD, 5V Relay"
                  value={formData.components}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600 font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                  Wiring &amp; Breadboard Guide
                </label>
                <textarea
                  name="schematicDiagram"
                  rows={3}
                  placeholder="e.g. Pin A0 -> Moisture Sensor Signal, Pin D13 -> Relay Trigger"
                  value={formData.schematicDiagram}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 font-mono focus:outline-none focus:border-blue-600"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                  Firmware Code Snippet (C++ / Python)
                </label>
                <textarea
                  name="codeSnippet"
                  rows={6}
                  placeholder="// Paste your Arduino sketch or MicroPython script here"
                  value={formData.codeSnippet}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono text-blue-900 bg-slate-50 focus:outline-none focus:border-blue-600"
                  spellCheck={false}
                />
              </div>
            </div>

            <div className="space-y-4 pt-4 border-t border-slate-100">
              <h3 className="text-sm font-bold text-slate-900 border-b border-slate-100 pb-2">
                3. Creator Credentials
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="creatorName"
                    required
                    placeholder="e.g. Aarav Sharma"
                    value={formData.creatorName}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                    School / College
                  </label>
                  <input
                    type="text"
                    name="creatorSchool"
                    placeholder="e.g. DPS Vasant Kunj"
                    value={formData.creatorSchool}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                    Class / Year
                  </label>
                  <input
                    type="text"
                    name="creatorGrade"
                    placeholder="e.g. Class 9"
                    value={formData.creatorGrade}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 min-h-[44px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> SUBMITTING BUILD...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" /> SUBMIT PROTOTYPE FOR REVIEW
                </>
              )}
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
