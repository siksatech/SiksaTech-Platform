"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar, Footer } from "@siksatech/ui";
import {
  db, Course, Lesson, createBrowserClient, isRealSupabase,
  enrollUserInCourse, getUserEnrollment, getCourseWithCurriculum
} from "@siksatech/database";
import Link from "next/link";
import {
  BookOpen, Clock, Layers, ArrowLeft, Play, CheckCircle2,
  Code2, Cpu, Wrench, Sparkles, ChevronRight, Lock, Loader2,
  Package, ShieldCheck, Award
} from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<any[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [user, setUser] = useState<any>(null);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initCourse = async () => {
      setLoading(true);
      let supabase;
      if (isRealSupabase) {
        supabase = createBrowserClient();
      }

      // Fetch real course data and curriculum modules/lessons
      const { course: fetchedCourse, modules: fetchedModules, lessons: fetchedLessons } =
        await getCourseWithCurriculum(supabase, courseId);

      if (fetchedCourse) {
        setCourse(fetchedCourse);
        setModules(fetchedModules);
        setLessons(fetchedLessons);
      }

      // Check local storage enrollments
      const localEnrollments = JSON.parse(localStorage.getItem("siksatech_enrolled_courses") || "[]");
      if (localEnrollments.includes(courseId)) {
        setIsEnrolled(true);
      }

      if (isRealSupabase && supabase) {
        try {
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            setUser({
              id: authUser.id,
              name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Student",
              email: authUser.email,
              role: "student"
            });

            const enrollment = await getUserEnrollment(supabase, authUser.id, courseId);
            if (enrollment && enrollment.status === "active") {
              setIsEnrolled(true);
            }
          }
        } catch (err) {
          console.error("CourseDetailPage auth lookup error:", err);
        }
      } else {
        const legacy = db.getCurrentUser();
        if (legacy) setUser(legacy);
      }
      setLoading(false);
    };

    initCourse();
  }, [courseId]);

  const handleEnroll = async () => {
    setIsEnrolling(true);

    try {
      // 1. Save to local client storage
      const current = JSON.parse(localStorage.getItem("siksatech_enrolled_courses") || "[]");
      if (!current.includes(courseId)) {
        current.push(courseId);
        localStorage.setItem("siksatech_enrolled_courses", JSON.stringify(current));
      }

      // 2. Persist to real Supabase database if connected
      if (isRealSupabase && user?.id) {
        const supabase = createBrowserClient();
        await enrollUserInCourse(supabase, user.id, courseId);
      }

      setIsEnrolled(true);
      setShowSuccessModal(true);
    } catch (e) {
      console.error("Enrollment error:", e);
      setIsEnrolled(true);
      setShowSuccessModal(true);
    } finally {
      setIsEnrolling(false);
    }
  };

  // Build dynamic curriculum display from fetched modules and lessons
  const structuredSyllabus = modules.length > 0 ? modules.map((mod) => ({
    module: mod.title || "Core Module",
    lessons: lessons.filter((l) => l.moduleTitle === mod.id || l.courseId === courseId).map((l) => ({
      id: l.id,
      title: l.title,
      duration: `${l.durationMinutes || 30} mins`,
      type: l.lessonType || "lab"
    }))
  })) : [
    {
      module: "Module 1: Foundations & Architecture",
      lessons: [
        { id: "les-1", title: "Hardware Architecture & Current Flow", duration: "30 mins", type: "theory" },
        { id: "les-2", title: "Connecting Your First Sensor on Breadboard", duration: "45 mins", type: "lab" }
      ]
    },
    {
      module: "Module 2: Firmware & Sensor Interfacing",
      lessons: [
        { id: "les-1", title: "Writing Analog & Digital Read Loops", duration: "45 mins", type: "code" },
        { id: "les-2", title: "Calibrating Environmental Telemetry", duration: "60 mins", type: "lab" }
      ]
    },
    {
      module: "Module 3: End-to-End System Integration",
      lessons: [
        { id: "les-1", title: "Transmitting Data over Serial/WiFi", duration: "50 mins", type: "code" },
        { id: "les-2", title: "Capstone Build: Complete Working Prototype", duration: "90 mins", type: "project" }
      ]
    }
  ];

  if (loading || !course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
          <p className="text-xs text-slate-500 font-mono">Loading real course curriculum from database...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-slate-900 text-white py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/learn" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to All Batches &amp; Tracks
            </Link>

            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="inline-block px-3 py-1 bg-blue-900/60 border border-blue-700 text-blue-400 text-xs font-bold uppercase rounded-full">
                    {course.difficulty} Level
                  </span>
                  <span className="inline-block px-3 py-1 bg-emerald-950 border border-emerald-700 text-emerald-400 text-xs font-bold uppercase rounded-full">
                    Hinglish + English
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  {course.title}
                </h1>
                <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                  {course.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2 font-mono">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" /> {course.duration}</span>
                  <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-emerald-400" /> {course.modulesCount || structuredSyllabus.length} Core Modules</span>
                  <span className="flex items-center gap-2"><Cpu className="w-4 h-4 text-purple-400" /> Physical Hardware Kit Included</span>
                </div>
              </div>

              {/* Action Card */}
              <div className="bg-slate-800 border border-slate-700 p-6 sm:p-7 rounded-3xl shadow-xl space-y-4">
                <div className="flex items-baseline justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold font-mono text-white">₹1,999</span>
                      <span className="text-sm font-mono text-slate-400 line-through">₹4,999</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">Hardware Kit + Live Labs Included</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-950/80 px-2.5 py-1 rounded-lg border border-emerald-700">
                    60% OFF
                  </span>
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  Includes complete 5V hardware kit delivery, 1-on-1 mentor circuit feedback, and verifiable credential.
                </p>

                {isEnrolled ? (
                  <div className="space-y-2">
                    <div className="p-3 rounded-xl bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>You are enrolled in this batch</span>
                    </div>
                    <Link
                      href={`/learn/${courseId}/les-1`}
                      className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" /> Continue Learning Module 1 &rarr;
                    </Link>
                  </div>
                ) : (
                  <button
                    onClick={handleEnroll}
                    disabled={isEnrolling}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isEnrolling ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> ENROLLING BATCH...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" /> ENROLL NOW (START FREE)
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Syllabus & Practical Labs */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <h2 className="text-xl font-bold text-slate-900">Hands-on Course Curriculum</h2>

              <div className="space-y-4">
                {structuredSyllabus.map((mod, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2.5">
                      <span className="w-6 h-6 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center text-xs font-mono font-bold">{idx + 1}</span>
                      {mod.module}
                    </h3>
                    <div className="space-y-2.5 pl-8">
                      {mod.lessons.map((les, lIdx) => (
                        <Link
                          key={lIdx}
                          href={`/learn/${courseId}/${les.id || "les-1"}`}
                          className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 text-xs transition-all group"
                        >
                          <div className="flex items-center gap-2.5">
                            {les.type === "code" ? <Code2 className="w-4 h-4 text-purple-600" /> : les.type === "lab" ? <Wrench className="w-4 h-4 text-emerald-600" /> : <BookOpen className="w-4 h-4 text-blue-600" />}
                            <span className="font-semibold text-slate-800 group-hover:text-blue-600">{les.title}</span>
                          </div>
                          <span className="text-slate-500 font-mono text-[11px]">{les.duration}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Final Assessment Card */}
                <div className="bg-slate-900 text-white rounded-2xl border border-slate-800 p-6 shadow-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-bold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-blue-600 text-white flex items-center justify-center text-xs">★</span>
                      Final Verification &amp; Certification Exam
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-mono font-bold">
                      Pass Score: 75%
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 pl-8 leading-relaxed">
                    Test your mastery of hardware wiring, firmware logic, and calibration formulas to earn your verifiable SiksaTech credential.
                  </p>
                  <div className="pl-8 pt-2">
                    <Link
                      href={`/learn/${courseId}/assessment`}
                      className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-blue-900/30"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Take Certification Exam <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Outcomes */}
            <div className="space-y-6">
              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Skills You Will Master</h3>
                <div className="flex flex-wrap gap-1.5">
                  {course.skills.map((skill, i) => (
                    <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
                      #{skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-3">
                <div className="flex items-center gap-2 text-emerald-700">
                  <Package className="w-5 h-5 text-emerald-600" />
                  <h3 className="text-sm font-bold text-slate-900">Included Hardware Kit</h3>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Includes custom microcontroller development board, breadboards, jumper wires, sensors, and protective casing.
                </p>
                <Link href="/store" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline pt-2">
                  View Kit Specs in Hardware Store <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Enrollment Success Modal */}
        {showSuccessModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in duration-200">
              <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div className="space-y-2">
                <span className="text-[10px] font-mono font-bold uppercase text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                  Enrollment Confirmed
                </span>
                <h3 className="text-xl font-extrabold text-slate-900">
                  Welcome to {course.title}!
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Your batch access is now active. Your physical hardware lab kit has been scheduled for dispatch.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-left space-y-2 text-xs text-slate-700">
                <div className="flex items-center gap-2 font-semibold">
                  <Package className="w-4 h-4 text-blue-600" />
                  <span>Hardware Kit: Dispatched via Express</span>
                </div>
                <div className="flex items-center gap-2 font-semibold">
                  <Award className="w-4 h-4 text-emerald-600" />
                  <span>Certificate: Tracked in Student Portfolio</span>
                </div>
              </div>

              <div className="space-y-2.5 pt-2">
                <Link
                  href={`/learn/${courseId}/les-1`}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4" /> Start Lesson 1 Now &rarr;
                </Link>
                <Link
                  href="/dashboard/student"
                  className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all block text-center"
                >
                  Go to Student Dashboard
                </Link>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
