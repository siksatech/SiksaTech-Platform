"use client";

import { useState, useEffect } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import Link from "next/link";
import {
  db,
  createBrowserClient,
  isRealSupabase,
  LearningPath,
  Course
} from "@siksatech/database";
import {
  BookOpen, Cpu, Terminal, Hammer, ArrowRight, ArrowLeft, Lock,
  Clock, BarChart3, Layers, GraduationCap, Sparkles, CheckCircle2,
  Package, Search, Star, ShieldCheck, Video
} from "lucide-react";

export default function LearnPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<{ name?: string; email?: string; role?: string } | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedClassTab, setSelectedClassTab] = useState<string>("all");

  useEffect(() => {
    const initData = async () => {
      // Load paths & courses
      const loadedPaths = await db.getLearningPaths();
      const loadedCourses = await db.getCourses();
      setPaths(loadedPaths);
      setCourses(loadedCourses);

      // Auth state
      if (isRealSupabase) {
        try {
          const supabase = createBrowserClient();
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            setUser({
              name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Student",
              email: authUser.email || "",
              role: "student"
            });
          }
        } catch (e) {
          console.error("LearnPage auth error:", e);
        }
      } else {
        const legacy = db.getCurrentUser();
        if (legacy) setUser(legacy);
      }
    };

    initData();
  }, []);

  const pathColors: Record<string, { bg: string; border: string; text: string; badgeBg: string; accent: string }> = {
    explorer: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badgeBg: "bg-emerald-100", accent: "#10B981" },
    builder: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badgeBg: "bg-blue-100", accent: "#3B82F6" },
    creator: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", badgeBg: "bg-purple-100", accent: "#8B5CF6" },
    engineer: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-700", badgeBg: "bg-amber-100", accent: "#F59E0B" },
  };

  const pathIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    explorer: BookOpen,
    builder: Terminal,
    creator: Hammer,
    engineer: Cpu,
  };

  // Filter courses based on class and search
  const filteredCourses = courses.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.skills.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesClass = selectedClassTab === "all" || c.learningPathId === selectedClassTab;

    return matchesSearch && matchesClass;
  });

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans">
      <Navbar />

      <main className="flex-1">
        {/* PhysicsWallah Style Header & Search Banner */}
        <section className="bg-slate-950 text-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/40 text-blue-400 text-xs font-mono font-bold uppercase rounded-full">
                  🇮🇳 BHARAT&apos;S POPULAR STEM BATCHES
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
                  Explore Structured STEM Batches &amp; Practical Tracks
                </h1>
                <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
                  Every batch includes hands-on hardware kit doorstep delivery, live weekend labs, daily practice problems, and verifiable certifications.
                </p>
              </div>

              {/* Search Bar */}
              <div className="relative max-w-md w-full">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search Arduino, Python, IoT, Robotics..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 rounded-2xl text-xs text-white placeholder-slate-400 focus:outline-none focus:border-blue-500 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* PW-Style Horizontal Class Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-slate-800/80">
              {[
                { id: "all", label: "🌟 All Classes" },
                { id: "explorer", label: "Class 5–7 (Explorer)" },
                { id: "builder", label: "Class 8–10 (Builder)" },
                { id: "creator", label: "Class 11–12 (Creator)" },
                { id: "engineer", label: "College / Engg (Engineer)" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedClassTab(tab.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer border ${
                    selectedClassTab === tab.id
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-900/40"
                      : "bg-slate-900 text-slate-300 border-slate-800 hover:border-slate-700 hover:bg-slate-800"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Course Catalog Grid */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {selectedClassTab === "all" ? "All Active Batches" : `${paths.find(p => p.id === selectedClassTab)?.title || "Selected"} Batches`}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">Showing {filteredCourses.length} active hands-on courses</p>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-slate-600 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>100% Practical Kits Included</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const colors = pathColors[course.learningPathId] || pathColors.explorer;
              const Icon = pathIcons[course.learningPathId] || Cpu;

              return (
                <div
                  key={course.id}
                  className="bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-500 overflow-hidden transition-all shadow-sm hover:shadow-xl flex flex-col justify-between group"
                >
                  <div>
                    {/* Top Accent Strip */}
                    <div className="h-1.5 w-full" style={{ background: colors.accent }} />

                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div className={`w-10 h-10 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center`}>
                          <Icon className={`w-5 h-5 ${colors.text}`} />
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            Hinglish + Eng
                          </span>
                          <span className={`text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded ${colors.badgeBg} ${colors.text}`}>
                            {course.difficulty}
                          </span>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-600 leading-relaxed mt-2 line-clamp-2">
                          {course.description}
                        </p>
                      </div>

                      {/* Course Deliverables Badges */}
                      <div className="grid grid-cols-2 gap-2 text-[11px] font-mono font-medium text-slate-600 pt-2 border-t border-slate-100">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          {course.duration}
                        </span>
                        <span className="flex items-center gap-1">
                          <Layers className="w-3.5 h-3.5 text-purple-600" />
                          {course.modulesCount} Modules
                        </span>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {course.skills.map((skill, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                          >
                            #{skill}
                          </span>
                        ))}
                      </div>

                      {/* Hardware Kit Included Tag */}
                      <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
                        <Package className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="truncate">Hardware Kit Delivered to Home</span>
                      </div>
                    </div>
                  </div>

                  {/* Card Action Footer */}
                  <div className="p-6 pt-0 border-t border-slate-100">
                    <div className="flex items-center justify-between pt-4">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-xl font-bold font-mono text-slate-900">₹1,999</span>
                          <span className="text-xs font-mono text-slate-400 line-through">₹4,999</span>
                        </div>
                        <span className="text-[10px] font-bold text-emerald-600 font-mono">60% OFF</span>
                      </div>

                      <Link
                        href={`/learn/${course.id}`}
                        className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md inline-flex items-center gap-1"
                      >
                        <span>View Batch &rarr;</span>
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCourses.length === 0 && (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
              <p className="text-slate-500 text-sm">No batches found matching your search.</p>
              <button
                onClick={() => { setSearchQuery(""); setSelectedClassTab("all"); }}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl"
              >
                Reset Filters
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}
