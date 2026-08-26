"use client";

import { useState, useEffect, Suspense } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import { createBrowserClient, isRealSupabase, db } from "@siksatech/database";
import Link from "next/link";
import {
  Users,
  Award,
  Package,
  Calendar,
  CheckCircle2,
  Clock,
  Sparkles,
  PhoneCall,
  Download,
  BookOpen,
  ChevronRight,
  TrendingUp,
  Cpu,
} from "lucide-react";

function ParentDashboardContent() {
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    async function loadData() {
      if (isRealSupabase) {
        const supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          const { data: prof } = await (supabase as any)
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .maybeSingle();
          if (prof) setProfile(prof);

          const { data: ords } = await (supabase as any)
            .from("orders")
            .select("*, order_items(*, product:products(*))")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false });
          if (ords) setOrders(ords);
        }
      } else {
        const localUser: any = db.getCurrentUser();
        setProfile(localUser || { name: "Ananya Sharma", email: "parent@siksatech.in", role: "parent" });
        const prods = await db.getStoreKits();
        setOrders(prods.map(p => ({
          id: p.id,
          order_number: `ORD-2026-${p.id}`,
          status: "delivered",
          total_amount_inr: p.price,
          created_at: new Date().toISOString()
        })));
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-between selection:bg-emerald-600 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-6xl w-full mx-auto px-4 py-10 space-y-8">
        {/* Parent Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-6 rounded-2xl bg-gradient-to-r from-emerald-950/30 via-slate-900 to-slate-900 border border-emerald-800/30 shadow-xl">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 border border-emerald-700/40 text-emerald-400 text-xs font-mono">
              <Users className="w-3.5 h-3.5" />
              <span>Parent Portal Dashboard</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-white">
              Welcome, {profile?.full_name || "Parent"}
            </h1>
            <p className="text-sm text-slate-400">
              Monitoring hands-on STEM progress, kit shipments, and weekly milestones.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/store"
              className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20"
            >
              <Package className="w-4 h-4" />
              Order Next STEM Kit
            </Link>
            <Link
              href="/onboarding"
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-all"
            >
              Edit Profile
            </Link>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <p className="text-xs font-mono text-slate-400">Active Curriculum</p>
            <p className="text-xl font-bold text-white">Builder Track (Class 8–10)</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>4 Modules Completed (65%)</span>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <p className="text-xs font-mono text-slate-400">Hands-on Lab Hours</p>
            <p className="text-xl font-bold text-white">18.5 Hours</p>
            <div className="flex items-center gap-1.5 text-xs text-blue-400 font-semibold pt-1">
              <Clock className="w-3.5 h-3.5" />
              <span>+3.5 hrs this week</span>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <p className="text-xs font-mono text-slate-400">Hardware Kits</p>
            <p className="text-xl font-bold text-white">{orders.length > 0 ? `${orders.length} Delivered` : "1 Active Kit"}</p>
            <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-semibold pt-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Arduino Starter Kit</span>
            </div>
          </div>

          <div className="p-5 rounded-xl border border-slate-800 bg-slate-900/60 space-y-2">
            <p className="text-xs font-mono text-slate-400">Verified Credentials</p>
            <p className="text-xl font-bold text-white">1 Certificate Earned</p>
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-semibold pt-1">
              <Award className="w-3.5 h-3.5" />
              <span>Basic Electronics v1</span>
            </div>
          </div>
        </div>

        {/* Child Learning Milestone Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-5">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <h2 className="text-lg font-bold text-white flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-emerald-400" />
                    <span>Learning Progress & Hardware Builds</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Real-time tracking of practical experiments completed</p>
                </div>
                <button
                  onClick={() => alert("Report card downloaded.")}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs text-slate-300 font-mono flex items-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download Monthly Report
                </button>
              </div>

              <div className="space-y-4">
                {[
                  { title: "Smart Automatic Plant Watering Node", status: "Verified & Built", date: "Yesterday", score: "100%", tag: "Hardware Project" },
                  { title: "I2C 1602 LCD Telemetry Display", status: "Completed", date: "3 days ago", score: "90%", tag: "Lab Quiz" },
                  { title: "Ultrasonic Distance Radar & Buzzer", status: "Completed", date: "Aug 20", score: "95%", tag: "Lab Quiz" },
                  { title: "PWM Motor Driver Speed Tuning", status: "In Progress", date: "Current Module", score: "Pending", tag: "Firmware Coding" },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl border border-slate-800/80 bg-slate-950/40 flex items-center justify-between gap-4"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/50">
                          {item.tag}
                        </span>
                        <span className="text-xs font-mono text-slate-500">{item.date}</span>
                      </div>
                      <h4 className="font-bold text-sm text-slate-200">{item.title}</h4>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-xs font-mono font-bold text-emerald-400 block">{item.score}</span>
                      <span className="text-[11px] text-slate-500">{item.status}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Mentor Notes & Feedback */}
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
              <div className="flex items-center gap-2 text-white font-bold text-base">
                <Sparkles className="w-5 h-5 text-amber-400" />
                <h3>SiksaTech Academic Council Mentor Note</h3>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                <p>
                  &quot;Great attention to circuit safety and breadboard wire routing. Completed the ultrasonic sensor calibration with zero wiring faults. Next week we recommend starting the ESP32 IoT WiFi module.&quot;
                </p>
                <p className="text-[11px] font-mono text-slate-500">— Mentor Rajesh K., Lead STEM Facilitator</p>
              </div>
            </div>
          </div>

          {/* Sidebar: Kits & Parent Support */}
          <div className="space-y-6">
            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-4">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Package className="w-5 h-5 text-emerald-400" />
                <span>Kit Deliveries</span>
              </h3>
              {orders.length > 0 ? (
                <div className="space-y-3">
                  {orders.map((ord: any) => (
                    <div key={ord.id} className="p-3 rounded-lg bg-slate-950/50 border border-slate-800 space-y-1">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-blue-400 font-bold">{ord.order_number}</span>
                        <span className="text-emerald-400 capitalize">{ord.status}</span>
                      </div>
                      <p className="text-xs text-slate-400">Total: ₹{ord.total_amount_inr}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-slate-950/50 border border-slate-800 text-center space-y-2">
                  <Cpu className="w-8 h-8 text-slate-600 mx-auto" />
                  <p className="text-xs text-slate-400">No active kit orders.</p>
                  <Link
                    href="/store"
                    className="inline-block text-xs text-emerald-400 hover:underline font-semibold"
                  >
                    Browse Hardware Store &rarr;
                  </Link>
                </div>
              )}
            </div>

            <div className="p-6 rounded-2xl border border-slate-800 bg-slate-900/70 space-y-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <PhoneCall className="w-5 h-5 text-blue-400" />
                <span>Parent Advisory Helpline</span>
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Have questions regarding child progress, upcoming batch schedules, or kit replacement?
              </p>
              <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 font-mono text-xs text-slate-200">
                📞 +91 98101 23456 (Mon–Sat, 10 AM – 6 PM)
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function ParentDashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">Loading...</div>}>
      <ParentDashboardContent />
    </Suspense>
  );
}
