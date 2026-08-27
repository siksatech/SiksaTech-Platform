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
    explorer: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-800", badgeBg: "bg-emerald-100", accent: "#10B981" },
    builder: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-800", badgeBg: "bg-blue-100", accent: "#3B82F6" },
    creator: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-800", badgeBg: "bg-purple-100", accent: "#8B5CF6" },
    engineer: { bg: "bg-amber-50", border: "border-amber-200", text: "text-amber-800", badgeBg: "bg-amber-100", accent: "#F59E0B" },
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
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Crisp Light Header & Search Banner */}
        <section className="bg-white text-slate-900 py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-200 shadow-xs">
          <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <span className="inline-block px-3 py-1 bg-blue-50 border border-blue-200 text-blue-800 text-xs font-mono font-bold uppercase rounded-full">
                  🇮🇳 BHARAT&apos;S POPULAR STEM BATCHES
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  Explore Structured STEM Batches &amp; Practical Tracks
                </h1>
                <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
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
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:border-blue-600 transition-all shadow-inner"
                />
              </div>
            </div>

            {/* PW-Style Horizontal Class Switcher */}
            <div className="flex items-center gap-2 overflow-x-auto pt-2 pb-1 scrollbar-none border-t border-slate-100">
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
                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Batches Grid Section */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Showing {filteredCourses.length} Available Batches
              </h2>
              <p className="text-xs text-slate-500">Includes complete kit shipment, live labs, and verifiable credentials</p>
            </div>
          </div>

          {filteredCourses.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredCourses.map((course) => {
                const color = pathColors[course.learningPathId] || pathColors.builder;
                const IconComponent = pathIcons[course.learningPathId] || Terminal;

                return (
                  <div
                    key={course.id}
                    className="bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-500 p-6 sm:p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6 group"
                  >
                    <div className="space-y-4">
                      {/* Top Badges */}
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-bold uppercase ${color.bg} ${color.border} ${color.text}`}>
                          {course.difficulty} Level
                        </span>
                        <span className="text-[10px] font-mono font-bold text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          Hinglish + English
                        </span>
                      </div>

                      {/* Title & Tagline */}
                      <div className="space-y-1.5">
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                          {course.title}
                        </h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                          {course.description}
                        </p>
                      </div>

                      {/* Course Features / Specs */}
                      <div className="space-y-2 py-2 border-y border-slate-100 text-xs text-slate-600 font-medium">
                        <div className="flex items-center gap-2">
                          <Clock className="w-3.5 h-3.5 text-blue-600" />
                          <span>{course.duration} Hands-on Labs</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Package className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Physical Hardware Kit Delivered</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                          <span>Verifiable STEM Credential</span>
                        </div>
                      </div>

                      {/* Skills Tags */}
                      <div className="flex flex-wrap gap-1.5">
                        {course.skills.slice(0, 3).map((skill, sIdx) => (
                          <span
                            key={sIdx}
                            className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px]"
                          >
                            #{skill}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Pricing & CTA */}
                    <div className="pt-2 space-y-3">
                      <div className="flex items-baseline justify-between">
                        <div>
                          <div className="flex items-baseline gap-2">
                            <span className="text-2xl font-extrabold font-mono text-slate-900">₹1,999</span>
                            <span className="text-xs font-mono text-slate-400 line-through">₹4,999</span>
                          </div>
                          <span className="text-[10px] text-emerald-700 font-bold font-mono">60% DISCOUNT</span>
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">Kit Included</span>
                      </div>

                      <Link
                        href={`/learn/${course.id}`}
                        className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center justify-center gap-2 text-center"
                      >
                        <span>Explore Batch &amp; Curriculum</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-slate-200 space-y-3">
              <Search className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No Batches Found</h3>
              <p className="text-xs text-slate-500">Try adjusting your search keywords or class filters.</p>
            </div>
          )}

        </section>
      </main>

      <Footer />
    </div>
  );
}
