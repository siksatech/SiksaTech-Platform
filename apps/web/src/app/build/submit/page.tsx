"use client";

import { useState } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import { db } from "@siksatech/database";
import { Upload, Code2, Cpu, Wrench, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function SubmitBuildPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    problemStatement: "",
    description: "",
    technologies: "Arduino, ESP32, Python",
    components: "Soil Sensor, Relay, LCD Display",
    codeSnippet: "",
    demoUrl: "",
    creatorName: "",
    creatorSchool: "",
    creatorGrade: "Class 9"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.submitLead("student", formData.creatorName, "build-submission@siksatech.in", "", {
      type: "project_submission",
      title: formData.title,
      problemStatement: formData.problemStatement,
      description: formData.description,
      technologies: formData.technologies,
      components: formData.components,
      codeSnippet: formData.codeSnippet,
      demoUrl: formData.demoUrl,
      creatorSchool: formData.creatorSchool,
      creatorGrade: formData.creatorGrade
    });
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-3">
            <Upload className="w-4 h-4" /> Student Maker Showcase
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 mb-2">
            Submit Your Hardware Build
          </h1>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Get your prototype reviewed by SiksaTech hardware mentors and featured in the public showcase.
          </p>
        </div>

        {submitted ? (
          <div className="bg-white p-8 rounded-2xl border border-emerald-200 shadow-sm text-center space-y-4">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-xl font-bold text-slate-900">Prototype Submitted for Review!</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Our engineering review panel will evaluate your schematics, test logic, and code. Once approved, your project will appear in the Build Showcase and issue your verified project badge.
            </p>
            <Link href="/build" className="inline-flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-blue-700 transition-all">
              View Build Showcase <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Project Title</label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g. Autonomous Plant Health Sentinel"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Creator Name</label>
                <input
                  type="text"
                  required
                  value={formData.creatorName}
                  onChange={(e) => setFormData({ ...formData, creatorName: e.target.value })}
                  placeholder="Your full name"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">School / College</label>
                <input
                  type="text"
                  required
                  value={formData.creatorSchool}
                  onChange={(e) => setFormData({ ...formData, creatorSchool: e.target.value })}
                  placeholder="Delhi Public School"
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Problem Statement</label>
              <textarea
                rows={2}
                required
                value={formData.problemStatement}
                onChange={(e) => setFormData({ ...formData, problemStatement: e.target.value })}
                placeholder="What real-world problem does your hardware solve?"
                className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Technologies Used (Comma-separated)</label>
                <input
                  type="text"
                  value={formData.technologies}
                  onChange={(e) => setFormData({ ...formData, technologies: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Hardware Components (BOM)</label>
                <input
                  type="text"
                  value={formData.components}
                  onChange={(e) => setFormData({ ...formData, components: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Firmware / Source Code (C++/Python)</label>
              <textarea
                rows={5}
                value={formData.codeSnippet}
                onChange={(e) => setFormData({ ...formData, codeSnippet: e.target.value })}
                placeholder="void setup() { ... }"
                className="w-full px-3.5 py-2.5 font-mono text-xs bg-slate-900 text-slate-200 border border-slate-700 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Upload className="w-4 h-4" /> Submit Build for Mentor Certification
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
