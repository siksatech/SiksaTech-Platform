"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Navbar, Footer } from "@siksatech/ui";
import { db, Course, Lesson, createBrowserClient, isRealSupabase } from "@siksatech/database";
import Link from "next/link";
import {
  BookOpen, Clock, Layers, ArrowLeft, Play, CheckCircle2,
  Code2, Cpu, Wrench, Sparkles, ChevronRight, Lock
} from "lucide-react";

export default function CourseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params.courseId as string;
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<number>(0);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const initCourse = async () => {
      const courses = await db.getCourses();
      const found = courses.find((c) => c.id === courseId);
      if (found) setCourse(found);

      if (isRealSupabase) {
        try {
          const supabase = createBrowserClient();
          const { data: { user: authUser } } = await supabase.auth.getUser();
          if (authUser) {
            setUser({
              id: authUser.id,
              name: authUser.user_metadata?.full_name || authUser.email?.split("@")[0] || "Student",
              email: authUser.email,
              role: "student"
            });
            return;
          }
        } catch (err) {
          console.error("CourseDetailPage auth error:", err);
        }
      }

      setUser(db.getCurrentUser());
    };

    initCourse();
  }, [courseId]);

  const syllabus = [
    {
      module: "Module 1: Foundations & Architecture",
      lessons: [
        { title: "Hardware Architecture & Current Flow", duration: "30 mins", type: "theory" },
        { title: "Connecting Your First Sensor on Breadboard", duration: "45 mins", type: "lab" }
      ]
    },
    {
      module: "Module 2: Firmware & Sensor Interfacing",
      lessons: [
        { title: "Writing Analog & Digital Read Loops", duration: "45 mins", type: "code" },
        { title: "Calibrating Environmental Telemetry", duration: "60 mins", type: "lab" }
      ]
    },
    {
      module: "Module 3: End-to-End System Integration",
      lessons: [
        { title: "Transmitting Data over Serial/WiFi", duration: "50 mins", type: "code" },
        { title: "Capstone Build: Complete Working Prototype", duration: "90 mins", type: "project" }
      ]
    }
  ];

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <p className="text-sm text-slate-500">Loading course curriculum...</p>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Header */}
        <section className="bg-slate-900 text-white py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link href="/learn" className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white mb-6 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to Learning Pathways
            </Link>

            <div className="grid lg:grid-cols-3 gap-8 items-center">
              <div className="lg:col-span-2 space-y-4">
                <span className="inline-block px-3 py-1 bg-blue-900/60 border border-blue-700 text-blue-400 text-xs font-bold uppercase rounded-full">
                  {course.difficulty} Level
                </span>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                  {course.title}
                </h1>
                <p className="text-base text-slate-300 leading-relaxed max-w-2xl">
                  {course.description}
                </p>

                <div className="flex flex-wrap items-center gap-6 text-xs text-slate-400 pt-2">
                  <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-blue-400" /> {course.duration}</span>
                  <span className="flex items-center gap-2"><Layers className="w-4 h-4 text-emerald-400" /> {course.modulesCount} Core Modules</span>
                  <span className="flex items-center gap-2"><Cpu className="w-4 h-4 text-purple-400" /> Physical Hardware Kit Included</span>
                </div>
              </div>

              {/* Action Card */}
              <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl space-y-4">
                <h3 className="text-base font-bold text-white">Enroll in this Track</h3>
                <p className="text-xs text-slate-400">Includes complete kit shipment, mentor feedback on build submissions, and verifiable certificate.</p>
                {user ? (
                  <Link
                    href={`/learn/${courseId}/les-1`}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" /> Start Learning Now
                  </Link>
                ) : (
                  <Link
                    href={`/learn/${courseId}/les-1`}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
                  >
                    <Play className="w-4 h-4" /> Preview Curriculum
                  </Link>
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
                {syllabus.map((mod, idx) => (
                  <div key={idx} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                    <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                      <span className="w-6 h-6 rounded-md bg-blue-50 text-blue-600 flex items-center justify-center text-xs">{idx + 1}</span>
                      {mod.module}
                    </h3>
                    <div className="space-y-2 pl-8">
                      {mod.lessons.map((les, lIdx) => (
                        <Link
                          key={lIdx}
                          href={`/learn/${courseId}/les-${(lIdx % 2) + 1}`}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-50 hover:bg-blue-50/50 border border-slate-100 hover:border-blue-200 text-xs transition-colors group"
                        >
                          <div className="flex items-center gap-2.5">
                            {les.type === "code" ? <Code2 className="w-4 h-4 text-purple-600" /> : les.type === "lab" ? <Wrench className="w-4 h-4 text-emerald-600" /> : <BookOpen className="w-4 h-4 text-blue-600" />}
                            <span className="font-semibold text-slate-800 group-hover:text-blue-600">{les.title}</span>
                          </div>
                          <span className="text-slate-500 font-medium">{les.duration}</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Final Assessment Card */}
                <div className="bg-slate-900 text-white rounded-xl border border-slate-800 p-5 shadow-lg space-y-3">
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
                  <div className="pl-8 pt-1">
                    <Link
                      href={`/learn/${courseId}/assessment`}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-lg transition-all shadow-md shadow-blue-900/30"
                    >
                      <Sparkles className="w-3.5 h-3.5" /> Take Certification Exam <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Skills & Outcomes */}
            <div className="space-y-6">
              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Skills You Will Master</h3>
                <div className="flex flex-wrap gap-1.5">
                  {course.skills.map((skill, i) => (
                    <span key={i} className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700 border border-blue-100">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm space-y-3">
                <h3 className="text-sm font-bold text-slate-900">Required Hardware Kit</h3>
                <p className="text-xs text-slate-600">This course uses real microcontrollers and sensors included in the SiksaTech Hardware Kit.</p>
                <Link href="/store" className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:underline">
                  View Kit in Hardware Store <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
