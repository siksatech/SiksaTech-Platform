"use client";

import { useState, useEffect } from "react";
import { Navbar } from "@siksatech/ui";
import { Footer } from "@siksatech/ui";
import Link from "next/link";
import { db, LearningPath, Course } from "@siksatech/database";
import {
  BookOpen, Cpu, Terminal, Hammer, ArrowRight, ArrowLeft, Lock,
  Clock, BarChart3, Layers, GraduationCap, Sparkles
} from "lucide-react";

export default function LearnPage() {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<any>(null);

  // Intake step
  const [step, setStep] = useState<"intake" | "browse">("intake");
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [selectedInterest, setSelectedInterest] = useState<string>("");
  const [recommendedPath, setRecommendedPath] = useState<string>("");

  useEffect(() => {
    db.getLearningPaths().then(setPaths);
    db.getCourses().then(setCourses);
    setUser(db.getCurrentUser());
  }, []);

  const classOptions = [
    { label: "Class 5–7", value: "5-7", pathId: "explorer" },
    { label: "Class 8–10", value: "8-10", pathId: "builder" },
    { label: "Class 11–12", value: "11-12", pathId: "creator" },
    { label: "College / Graduate", value: "college", pathId: "engineer" },
  ];

  const interestOptions = [
    "Electronics & Circuits",
    "Coding & Programming",
    "Robotics & Drones",
    "IoT & Smart Devices",
    "AI & Computer Vision",
    "PCB Design & Manufacturing",
  ];

  const handleIntakeSubmit = () => {
    const match = classOptions.find((c) => c.value === selectedClass);
    setRecommendedPath(match?.pathId || "explorer");
    setStep("browse");
  };

  const pathIcons: Record<string, any> = {
    explorer: BookOpen,
    builder: Terminal,
    creator: Hammer,
    engineer: Cpu,
  };

  const pathColors: Record<string, { bg: string; border: string; text: string; badgeBg: string }> = {
    explorer: { bg: "bg-emerald-50", border: "border-emerald-200", text: "text-emerald-700", badgeBg: "bg-emerald-100" },
    builder: { bg: "bg-blue-50", border: "border-blue-200", text: "text-blue-700", badgeBg: "bg-blue-100" },
    creator: { bg: "bg-purple-50", border: "border-purple-200", text: "text-purple-700", badgeBg: "bg-purple-100" },
    engineer: { bg: "bg-orange-50", border: "border-orange-200", text: "text-orange-700", badgeBg: "bg-orange-100" },
  };

  const difficultyColors: Record<string, string> = {
    Beginner: "bg-emerald-100 text-emerald-700",
    Intermediate: "bg-blue-100 text-blue-700",
    Advanced: "bg-purple-100 text-purple-700",
  };

  const filteredCourses = recommendedPath
    ? courses.filter((c) => c.learningPathId === recommendedPath)
    : courses;

  const recommendedPathData = paths.find((p) => p.id === recommendedPath);

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-slate-50 min-h-screen">
        {step === "intake" ? (
          /* ==================
             INTAKE SELECTOR
             ================== */
          <section className="py-16 lg:py-24">
            <div className="max-w-2xl mx-auto px-4">
              <div className="text-center mb-10">
                <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center mx-auto mb-5">
                  <GraduationCap className="w-8 h-8 text-blue-600" />
                </div>
                <h1 className="text-3xl font-extrabold text-slate-900 mb-3">
                  Let&apos;s find the right path for you
                </h1>
                <p className="text-base text-slate-600">
                  Tell us a bit about yourself so we can show you the most relevant courses.
                </p>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-8">
                {/* Class Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-3">
                    What class or level are you in?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {classOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSelectedClass(opt.value)}
                        className={`p-4 rounded-xl border-2 text-left transition-all ${
                          selectedClass === opt.value
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-slate-200 hover:border-slate-300 bg-white"
                        }`}
                      >
                        <span className={`text-sm font-bold ${
                          selectedClass === opt.value ? "text-blue-700" : "text-slate-800"
                        }`}>
                          {opt.label}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Interest Selection */}
                <div>
                  <label className="block text-sm font-bold text-slate-800 mb-3">
                    What interests you most?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {interestOptions.map((interest) => (
                      <button
                        key={interest}
                        onClick={() => setSelectedInterest(interest)}
                        className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all ${
                          selectedInterest === interest
                            ? "border-blue-500 bg-blue-50 text-blue-700"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <button
                  onClick={handleIntakeSubmit}
                  disabled={!selectedClass}
                  className={`w-full py-3.5 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2 ${
                    selectedClass
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                      : "bg-slate-100 text-slate-400 cursor-not-allowed"
                  }`}
                >
                  Show My Courses
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </section>
        ) : (
          /* ==================
             COURSE BROWSER
             ================== */
          <section className="py-12 lg:py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {/* Back + Header */}
              <div className="flex items-center gap-4 mb-8">
                <button
                  onClick={() => setStep("intake")}
                  className="p-2 rounded-lg border border-slate-200 text-slate-500 hover:text-slate-700 hover:bg-white transition-all"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">
                    Courses for You
                  </h1>
                  {recommendedPathData && (
                    <p className="text-sm text-slate-500 mt-0.5">
                      Recommended track: <span className="font-semibold text-blue-600">{recommendedPathData.title}</span>
                    </p>
                  )}
                </div>
              </div>

              {/* Path Tabs */}
              <div className="flex flex-wrap gap-2 mb-8">
                <button
                  onClick={() => setRecommendedPath("")}
                  className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                    !recommendedPath
                      ? "bg-slate-900 text-white"
                      : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  All Courses
                </button>
                {paths.map((path) => {
                  const colors = pathColors[path.id] || pathColors.explorer;
                  const isActive = recommendedPath === path.id;
                  return (
                    <button
                      key={path.id}
                      onClick={() => setRecommendedPath(path.id)}
                      className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wide transition-all ${
                        isActive
                          ? `${colors.bg} ${colors.text} ${colors.border} border`
                          : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
                      }`}
                    >
                      {path.title}
                    </button>
                  );
                })}
              </div>

              {/* Course Cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => {
                  const colors = pathColors[course.learningPathId] || pathColors.explorer;
                  const Icon = pathIcons[course.learningPathId] || Cpu;
                  return (
                    <div
                      key={course.id}
                      className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-lg hover:border-blue-200 transition-all group"
                    >
                      {/* Top accent bar */}
                      <div className={`h-1.5 ${colors.bg.replace("50", "400")}`}
                        style={{ background: colors.text === "text-emerald-700" ? "#10B981" : colors.text === "text-blue-700" ? "#3B82F6" : colors.text === "text-purple-700" ? "#8B5CF6" : "#F97316" }}
                      />
                      <div className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`w-10 h-10 rounded-lg ${colors.bg} flex items-center justify-center`}>
                            <Icon className={`w-5 h-5 ${colors.text}`} />
                          </div>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${difficultyColors[course.difficulty]}`}>
                            {course.difficulty}
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-slate-600 leading-relaxed mb-4">
                          {course.description}
                        </p>

                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {course.duration}
                          </span>
                          <span className="flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" />
                            {course.modulesCount} modules
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5 mb-5">
                          {course.skills.map((skill, i) => (
                            <span
                              key={i}
                              className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-100 text-slate-600"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>

                        {user ? (
                          <button className="w-full py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-all flex items-center justify-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5" />
                            Enroll Now
                          </button>
                        ) : (
                          <Link
                            href="/auth/login"
                            className="w-full py-2.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-bold transition-all flex items-center justify-center gap-1.5 hover:bg-slate-200"
                          >
                            <Lock className="w-3.5 h-3.5" />
                            Login to Enroll
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {filteredCourses.length === 0 && (
                <div className="text-center py-16">
                  <p className="text-slate-500">No courses found for this selection.</p>
                </div>
              )}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
