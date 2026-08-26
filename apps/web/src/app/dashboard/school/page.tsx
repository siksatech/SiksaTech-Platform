"use client";

import { useState, useEffect, Suspense } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import { createBrowserClient, isRealSupabase, db } from "@siksatech/database";
import Link from "next/link";
import {
  School,
  Users,
  Cpu,
  BookOpen,
  Award,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Download,
  PlusCircle,
  FileCheck2,
  Phone,
} from "lucide-react";

function SchoolDashboardContent() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    async function loadData() {
      if (isRealSupabase) {
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: prof } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();
          if (prof) setProfile(prof);
        }
      } else {
        const localUser = db.getCurrentUser();
        setProfile(localUser || { name: "Dr. Rajeshwar Verma", email: "educator@siksatech.in", role: "school" });
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-purple-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 space-y-8">
        {/* School Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-900 border border-purple-800/30 shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-950 border border-purple-700/40 text-purple-400 text-xs font-mono">
              <School className="w-3.5 h-3.5" />
              <span>Institutional & ATL Lab Partner Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              {profile?.school_college_name || "Partner School Dashboard"}
            </h1>
            <p className="text-sm text-slate-400">
              Coordinator: <span className="text-slate-200 font-semibold">{profile?.full_name || "School Coordinator"}</span> • {profile?.city || "India"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/institutions"
              className="px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-purple-600/20"
            >
              <Calendar className="w-4 h-4" />
              Schedule ATL Workshop
            </Link>
            <Link
              href="/onboarding"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-all"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Institutional Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <p className="text-xs font-mono text-slate-400">Enrolled Students</p>
            <p className="text-2xl font-bold text-white">250 Active</p>
            <p className="text-xs text-purple-400 font-semibold">Classes 6 to 10 Cohorts</p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <p className="text-xs font-mono text-slate-400">ATL Lab Workstations</p>
            <p className="text-2xl font-bold text-white">24 Benches</p>
            <p className="text-xs text-emerald-400 font-semibold">100% Kit Availability</p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <p className="text-xs font-mono text-slate-400">Projects Completed</p>
            <p className="text-2xl font-bold text-white">184 Builds</p>
            <p className="text-xs text-blue-400 font-semibold">Published in Gallery</p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <p className="text-xs font-mono text-slate-400">Credentials Issued</p>
            <p className="text-2xl font-bold text-white">162 Certificates</p>
            <p className="text-xs text-amber-400 font-semibold">Verifiable on siksatech.in</p>
          </div>
        </div>

        {/* Active Cohorts & ATL Modules */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-purple-400" />
                    <span>Curriculum Cohorts & Schedule</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Assigned hands-on tracks for the academic term</p>
                </div>
                <button
                  onClick={() => alert("Cohort attendance and assessment sheet exported.")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300 font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Export Sheet
                </button>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Grade 6–7 Explorer Cohort", track: "Explorer (Electronics Basics)", students: "65 Students", progress: "Module 4 / 6", color: "text-blue-400" },
                  { name: "Grade 8–9 Builder Cohort", track: "Builder (Arduino & Sensor Telemetry)", students: "80 Students", progress: "Module 5 / 8", color: "text-purple-400" },
                  { name: "Grade 10 Creator Cohort", track: "Creator (ESP32 IoT & Smart Systems)", students: "55 Students", progress: "Module 3 / 6", color: "text-emerald-400" },
                  { name: "National Hackathon Prep Team", track: "Hardware Innovation Sprint", students: "24 Students", progress: "Prototype Stage", color: "text-amber-400" },
                ].map((cohort, i) => (
                  <div key={i} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-white">{cohort.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">{cohort.track}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold ${cohort.color} block`}>{cohort.progress}</span>
                      <span className="text-[11px] text-slate-500">{cohort.students}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Institutional Support & Kit Restock */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Cpu className="w-5 h-5 text-purple-400" />
                <span>ATL Lab Consumables</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Need extra breadboards, jumper wire spools, sensor modules, or soldering supplies for your lab?
              </p>
              <Link
                href="/store"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-purple-300 border border-purple-800/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Reorder Lab Consumables
              </Link>
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Phone className="w-5 h-5 text-blue-400" />
                <span>Institutional Account Manager</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Direct helpline for lab equipment replacements, teacher certification, and NITI Aayog ATL reporting:
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-300">
                ✉️ schools@siksatech.in<br />
                📞 +91 98101 23456
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function SchoolDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <SchoolDashboardContent />
    </Suspense>
  );
}
