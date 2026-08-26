"use client";

import { useState, useEffect, Suspense } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import { createBrowserClient, isRealSupabase, db } from "@siksatech/database";
import Link from "next/link";
import {
  Building2,
  Trophy,
  Cpu,
  FolderGit2,
  Sparkles,
  Users,
  Code2,
  ArrowRight,
  Plus,
  Terminal,
} from "lucide-react";

function CollegeDashboardContent() {
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
        setProfile(localUser || { name: "Prof. K. Sundaram", email: "college@siksatech.in", role: "college" });
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-amber-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 space-y-8">
        {/* College Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900 border border-amber-800/30 shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950 border border-amber-700/40 text-amber-400 text-xs font-mono">
              <Building2 className="w-3.5 h-3.5" />
              <span>College & Robotics Society Portal</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              {profile?.school_college_name || "College Engineering Hub"}
            </h1>
            <p className="text-sm text-slate-400">
              Lead: <span className="text-slate-200 font-semibold">{profile?.full_name || "Technical Coordinator"}</span> • {profile?.city || "India"}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/programs"
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-amber-600/20"
            >
              <Trophy className="w-4 h-4" />
              Register Hackathon Team
            </Link>
            <Link
              href="/onboarding"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-all"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <p className="text-xs font-mono text-slate-400">Active Hackathon Teams</p>
            <p className="text-2xl font-bold text-white">3 Teams</p>
            <p className="text-xs text-amber-400 font-semibold">National STEM Sprint 2026</p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <p className="text-xs font-mono text-slate-400">Capstone Builds</p>
            <p className="text-2xl font-bold text-white">8 Prototypes</p>
            <p className="text-xs text-blue-400 font-semibold">OpenCV & ESP32 Micro-nodes</p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <p className="text-xs font-mono text-slate-400">Engineering Kits</p>
            <p className="text-2xl font-bold text-white">Autonomous Rovers</p>
            <p className="text-xs text-emerald-400 font-semibold">Python Edge Computing</p>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <p className="text-xs font-mono text-slate-400">Verified Developers</p>
            <p className="text-2xl font-bold text-white">45 Students</p>
            <p className="text-xs text-purple-400 font-semibold">Embedded Systems Certified</p>
          </div>
        </div>

        {/* Hackathon Squads & Technical Projects */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <Trophy className="w-5 h-5 text-amber-400" />
                    <span>Active Hackathon Squads</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">National STEM Innovation Hackathon 2026</p>
                </div>
                <Link
                  href="/programs"
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-amber-400 font-mono flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Team
                </Link>
              </div>

              <div className="space-y-3">
                {[
                  { name: "Team Cyber-Rover", track: "Autonomous Medical Delivery Bot", members: "4 Members (B.Tech ECE)", status: "Hardware Testing", color: "text-amber-400" },
                  { name: "Team Agri-Sense", track: "Solar IoT Soil Telemetry Node", members: "3 Members (B.Tech CSE)", status: "Firmware Optimization", color: "text-emerald-400" },
                  { name: "Team Grid-Guard", track: "Smart Home Non-Invasive Energy Node", members: "4 Members (B.Tech EEE)", status: "Code Review", color: "text-blue-400" },
                ].map((team, idx) => (
                  <div key={idx} className="p-4 rounded-xl bg-slate-950/40 border border-slate-800 flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-sm text-white">{team.name}</h4>
                      <p className="text-xs text-slate-400 font-mono">{team.track}</p>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-mono font-bold ${team.color} block`}>{team.status}</span>
                      <span className="text-[11px] text-slate-500">{team.members}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Capstone Project Submissions */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-white font-bold text-base">
                  <FolderGit2 className="w-5 h-5 text-blue-400" />
                  <h3>Published Hardware Capstone Projects</h3>
                </div>
                <Link href="/build/submit" className="text-xs text-blue-400 hover:underline font-mono">
                  + Submit New Build
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-200">Autonomous Color-Sorting Rover</h4>
                  <p className="text-xs text-slate-400">OpenCV + Raspberry Pi 4 + L298N Motor Shield</p>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 inline-block">
                    Approved & Featured
                  </span>
                </div>
                <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-1.5">
                  <h4 className="font-bold text-sm text-slate-200">ESP32 True RMS Energy Auditor</h4>
                  <p className="text-xs text-slate-400">Current Transformer + Embedded Web Dashboard</p>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50 inline-block">
                    Approved & Featured
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Terminal className="w-5 h-5 text-amber-400" />
                <span>Engineer Track Kits</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Advanced autonomous rovers with camera modules, ESP32 dual-core boards, and motor drivers for final year engineering capstones.
              </p>
              <Link
                href="/store"
                className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-800/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2"
              >
                <Cpu className="w-4 h-4" />
                Explore Engineering Kits
              </Link>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function CollegeDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <CollegeDashboardContent />
    </Suspense>
  );
}
