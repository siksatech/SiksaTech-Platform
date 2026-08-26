"use client";

import { use, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Navbar, Footer } from "@siksatech/ui";
import {
  getProjectBySlug,
  createBrowserClient,
  isRealSupabase,
  type Project
} from "@siksatech/database";
import {
  ArrowLeft, Cpu, Wrench, Code2, User, School, Sparkles,
  BookOpen, CheckCircle2, Copy, Check, Video, Play, ExternalLink
} from "lucide-react";

export default function ProjectDetailPage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();
  const { id } = resolvedParams;

  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setLoading(true);
    const supabase = isRealSupabase ? createBrowserClient() : undefined;
    getProjectBySlug(supabase, id).then((res) => {
      setProject(res);
      setLoading(false);
    });
  }, [id]);

  const handleCopyCode = () => {
    if (project?.codeSnippet) {
      navigator.clipboard.writeText(project.codeSnippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const difficultyColors: Record<string, string> = {
    Easy: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Medium: "bg-amber-50 text-amber-700 border-amber-200",
    Hard: "bg-rose-50 text-rose-700 border-rose-200"
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex items-center justify-center text-xs text-slate-500">
          Loading project schematics and firmware...
        </main>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <main className="flex-1 flex flex-col items-center justify-center text-center p-6 space-y-4">
          <h1 className="text-xl font-bold text-slate-900">Project Not Found</h1>
          <p className="text-xs text-slate-500">The build you are looking for does not exist or is pending review.</p>
          <Link
            href="/build"
            className="px-5 py-2.5 bg-blue-600 text-white font-bold text-xs rounded-xl shadow-md"
          >
            Browse Project Gallery
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/build"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Project Showcase
        </Link>

        {/* Project Header Banner */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                  {project.studentLevel}
                </span>
                <span className={`text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded-full border ${difficultyColors[project.difficulty] || "bg-slate-100 text-slate-700 border-slate-200"}`}>
                  {project.difficulty} Difficulty
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                {project.title}
              </h1>
              <p className="text-sm text-slate-600 max-w-2xl leading-relaxed">
                {project.description}
              </p>
            </div>
          </div>

          {/* Creator Attribution */}
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="w-12 h-12 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0">
              <User className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-mono uppercase text-slate-400 font-bold">Built &amp; Demonstrated by</p>
              <h3 className="text-sm font-bold text-slate-900">{project.creatorName}</h3>
              {project.creatorSchool && (
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <School className="w-3.5 h-3.5" /> {project.creatorSchool} {project.creatorGrade ? `(${project.creatorGrade})` : ""}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Problem Statement & Architecture */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-8">
          <div className="lg:col-span-8 space-y-6">
            {project.problemStatement && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-3">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-500" /> Problem Statement &amp; Innovation Rationale
                </h2>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {project.problemStatement}
                </p>
              </div>
            )}

            {/* Hardware Wiring & Schematics */}
            {project.schematic && (
              <div className="bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm space-y-4">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="w-4 h-4 text-emerald-600" /> Physical Circuit &amp; Pin Connections Guide
                </h2>
                <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs whitespace-pre-line leading-relaxed border border-slate-800">
                  {project.schematic}
                </div>
              </div>
            )}

            {/* Embedded Source Code */}
            {project.codeSnippet && (
              <div className="bg-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono text-blue-400">
                    <Code2 className="w-4 h-4" /> Firmware Source Code (main.cpp / main.py)
                  </div>
                  <button
                    onClick={handleCopyCode}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white transition-all flex items-center gap-1.5"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    {copied ? "Copied" : "Copy Code"}
                  </button>
                </div>
                <div className="p-4 rounded-xl bg-slate-900 border border-slate-800/80 font-mono text-xs text-blue-300 overflow-x-auto leading-5">
                  <pre>{project.codeSnippet}</pre>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar: Components, Skills & Hardware Kit */}
          <div className="lg:col-span-4 space-y-6">
            {/* Components Used */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Components &amp; Sensor Modules
              </h3>
              <div className="space-y-2">
                {project.components.map((comp, idx) => (
                  <div key={idx} className="flex items-center gap-2 text-xs font-medium text-slate-700">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{comp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Skills Demonstrated */}
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                Skills Demonstrated
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {project.skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold font-mono"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Submit Your Own Callout */}
            <div className="bg-slate-900 text-white border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
              <h3 className="text-sm font-bold">Built something exciting?</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Submit your working circuit schematics and firmware to get reviewed by SiksaTech mentors and earn verified credentials.
              </p>
              <Link
                href="/build/submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-900/30 flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4" /> Submit Your Build
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
