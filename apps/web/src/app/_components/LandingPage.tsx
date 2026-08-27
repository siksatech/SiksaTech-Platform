"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar, Footer } from "@siksatech/ui";
import {
  db, Banner, FAQ, LearningPath, Project,
  DEMO_BANNERS, DEMO_FAQS, DEMO_PATHS, DEMO_PROJECTS,
} from "@siksatech/database";
import {
  ArrowRight,
  ChevronDown,
  BookOpen,
  Hammer,
  Cpu,
  GraduationCap,
  Building2,
  CheckCircle2,
  Lightbulb,
  Code,
  Microscope,
  Wrench,
  Users,
  Star,
  PhoneCall,
  Sparkles,
  Award,
  Trophy,
  Video,
  ShieldCheck,
  Package,
  Clock,
  Check,
  HelpCircle,
  TrendingUp,
  MessageSquare
} from "lucide-react";

export default function LandingPage() {
  const [banners, setBanners] = useState<Banner[]>(DEMO_BANNERS);
  const [activeBanner, setActiveBanner] = useState(0);
  const [faqs, setFaqs] = useState<FAQ[]>(DEMO_FAQS);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [paths, setPaths] = useState<LearningPath[]>(DEMO_PATHS);
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS);
  const [selectedCohort, setSelectedCohort] = useState<"all" | "explorer" | "builder" | "creator" | "engineer">("all");

  useEffect(() => {
    db.getBanners().then((b) => { if (b && b.length > 0) setBanners(b); });
    db.getFAQs().then((f) => { if (f && f.length > 0) setFaqs(f); });
    db.getLearningPaths().then((p) => { if (p && p.length > 0) setPaths(p); });
    db.getProjects(true).then((prj) => { if (prj && prj.length > 0) setProjects(prj); });
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 7000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToBanner = useCallback((idx: number) => {
    setActiveBanner(idx);
  }, []);

  // Indian EdTech PW-style Popular Batches Data
  const featuredBatches = [
    {
      id: "batch-1",
      pathId: "explorer",
      title: "Explorer STEM & Visual Logic Batch 2026",
      tagline: "Class 5–7 • Foundations of Electronics & Block Coding",
      badge: "⭐ MOST POPULAR FOR JUNIORS",
      badgeColor: "bg-emerald-50 text-emerald-700 border-emerald-200",
      classes: "Class 5, 6, 7",
      language: "Hinglish + English",
      duration: "8 Weeks Live Cohort",
      kitIncluded: "Explorer Electronics Kit (Included)",
      mrp: 4999,
      price: 1999,
      discount: "60% OFF",
      features: [
        "Live interactive weekend practical labs",
        "Home delivery of safe 5V circuit breadboard kit",
        "Daily practice exercises & logic games",
        "24x7 hardware doubt engine support",
        "NEP 2020 Aligned Junior Maker Certificate"
      ],
      link: "/learn?path=explorer"
    },
    {
      id: "batch-2",
      pathId: "builder",
      title: "Builder Arduino & Python IoT Pro Batch",
      tagline: "Class 8–10 • Microcontrollers, Sensors & Smart Devices",
      badge: "🔥 BESTSELLER BATCH",
      badgeColor: "bg-blue-50 text-blue-700 border-blue-200",
      classes: "Class 8, 9, 10",
      language: "Hinglish + English",
      duration: "12 Weeks Live Cohort",
      kitIncluded: "Arduino Uno + 16 Sensor Lab Kit",
      mrp: 7999,
      price: 2999,
      discount: "62% OFF",
      features: [
        "Build 8 working IoT & automation prototypes",
        "Physical Arduino hardware kit delivered home",
        "Python & C++ firmware coding masterclasses",
        "1-on-1 circuit troubleshooting by mentors",
        "National Hackathon entry pass included"
      ],
      link: "/learn?path=builder"
    },
    {
      id: "batch-3",
      pathId: "creator",
      title: "Creator ESP32, GenAI & Drones Super Batch",
      tagline: "Class 11–12 • Advanced IoT, Edge Firmware & Robotics",
      badge: "🚀 ADVANCED HARDWARE",
      badgeColor: "bg-purple-50 text-purple-700 border-purple-200",
      classes: "Class 11, 12",
      language: "Hinglish + English",
      duration: "12 Weeks Intensive",
      kitIncluded: "ESP32 WiFi/BLE + Drone Motors Kit",
      mrp: 9999,
      price: 3499,
      discount: "65% OFF",
      features: [
        "FreeRTOS multi-tasking & WiFi cloud telemetry",
        "Generative AI commands for embedded devices",
        "PCB schematic design & Gerber file exporting",
        "Verified STEM fellowship credentials",
        "Portfolio mentorship for engineering admissions"
      ],
      link: "/learn?path=creator"
    },
    {
      id: "batch-4",
      pathId: "engineer",
      title: "Engineer Computer Vision & ROS Robotics Hub",
      tagline: "College & B.Tech • OpenCV, Edge AI & Autonomous Rovers",
      badge: "⚡ COLLEGE & INDUSTRY READY",
      badgeColor: "bg-amber-50 text-amber-700 border-amber-200",
      classes: "Engineering / College / Poly",
      language: "English",
      duration: "14 Weeks Advanced",
      kitIncluded: "Autonomous Rover + OpenCV Camera Kit",
      mrp: 12999,
      price: 4999,
      discount: "61% OFF",
      features: [
        "OpenCV computer vision on Raspberry Pi / Edge nodes",
        "Differential drive kinematics & PID motor tuning",
        "Live capstone project & GitHub portfolio review",
        "Direct startup placement referrals & patents guidance",
        "Industry-grade robotics certification"
      ],
      link: "/learn?path=engineer"
    }
  ];

  const filteredBatches = selectedCohort === "all"
    ? featuredBatches
    : featuredBatches.filter((b) => b.pathId === selectedCohort);

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 selection:bg-blue-100 font-sans">
      <Navbar />

      <main className="flex-1">

        {/* =========================================================
            1. PW-STYLE HERO SECTION WITH STATS & TRUST INDICATORS
           ========================================================= */}
        <section className="relative bg-gradient-to-b from-white via-slate-50 to-blue-50/30 pt-10 sm:pt-16 pb-16 border-b border-slate-200 overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-8 items-center">
              
              {/* Left Column: Mission & Main CTAs */}
              <div className="lg:col-span-7 space-y-6">
                
                {/* Indian EdTech Trust Pill */}
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 border border-blue-200 shadow-xs">
                  <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="text-xs font-bold text-blue-900 uppercase tracking-wide">
                    🇮🇳 Bharat&apos;s Most Trusted Hands-On STEM Platform
                  </span>
                </div>
                
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                  Ab Har Student Banega <br className="hidden sm:block" />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
                    Real Hardware &amp; AI Innovator!
                  </span>
                </h1>
                
                <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
                  Class 5 se lekar College tak — real microcontrollers, robotics kits, aur structured coding ke saath seekho engineering bilkul affordable fee mein. Real Hardware Kits delivered to your home!
                </p>

                {/* Primary Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3.5 pt-2">
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-base rounded-2xl transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-600/40 cursor-pointer text-center"
                  >
                    <span>Explore All STEM Batches</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/institutions"
                    className="inline-flex items-center justify-center gap-2 px-7 py-4 bg-white hover:bg-slate-50 border-2 border-slate-300 hover:border-slate-400 text-slate-800 font-bold text-base rounded-2xl transition-all shadow-xs text-center"
                  >
                    <Building2 className="w-5 h-5 text-blue-600" />
                    <span>For Schools &amp; ATL Labs</span>
                  </Link>
                </div>

                {/* Relatable Trust Metrics Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200">
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                    <p className="text-xl sm:text-2xl font-extrabold text-blue-600 font-mono">50,000+</p>
                    <p className="text-[11px] font-semibold text-slate-600">Active Students</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                    <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 font-mono">200+ Labs</p>
                    <p className="text-[11px] font-semibold text-slate-600">School Partners</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                    <p className="text-xl sm:text-2xl font-extrabold text-purple-600 font-mono">1,200+</p>
                    <p className="text-[11px] font-semibold text-slate-600">Hardware Builds</p>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-xs">
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <span className="text-xl sm:text-2xl font-mono text-slate-900">4.9</span>
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    </div>
                    <p className="text-[11px] font-semibold text-slate-600">Student Rating</p>
                  </div>
                </div>
              </div>

              {/* Right Column: Hero Visual Showcase Carousel */}
              <div className="lg:col-span-5">
                <div className="relative h-[380px] sm:h-[440px] w-full rounded-3xl overflow-hidden shadow-2xl border-2 border-slate-800/20 bg-slate-950">
                  {banners.length > 0 ? (
                    banners.map((banner, idx) => (
                      <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                          idx === activeBanner ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                        }`}
                        style={{ background: banner.bgColor || "#0F172A" }}
                      >
                        <div className="absolute inset-0 flex flex-col justify-end p-6 sm:p-8 bg-gradient-to-t from-slate-950 via-slate-900/60 to-transparent">
                          <span className="inline-block w-fit px-2.5 py-0.5 rounded bg-blue-500 text-white font-mono text-[10px] uppercase font-bold tracking-wider mb-2">
                            Featured Batch
                          </span>
                          <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 leading-snug">{banner.title}</h2>
                          <p className="text-xs text-slate-300 mb-4 line-clamp-2">{banner.subtitle}</p>
                          <Link
                            href={banner.ctaLink}
                            className="inline-flex items-center gap-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 px-4 py-2.5 rounded-xl transition-all shadow-md w-fit"
                          >
                            {banner.ctaText} <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-slate-500">Loading Showcase...</div>
                  )}
                  
                  {/* Carousel Indicators */}
                  <div className="absolute top-5 right-5 z-20 flex gap-1.5">
                    {banners.map((_, idx) => (
                      <button
                        key={idx}
                        onClick={() => goToBanner(idx)}
                        className={`h-1.5 rounded-full transition-all duration-300 ${
                          idx === activeBanner ? "w-6 bg-blue-500" : "w-2.5 bg-white/40"
                        }`}
                        aria-label={`Slide ${idx + 1}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================
            2. PW-STYLE COHORT SELECTOR & POPULAR BATCHES SECTION
           ========================================================= */}
        <section className="py-14 sm:py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="text-center space-y-3 max-w-3xl mx-auto">
            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 text-blue-800 text-xs font-mono font-bold uppercase">
              Affordable • Practical • NEP 2020 Aligned
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Choose Your Class &amp; Start Building
            </h2>
            <p className="text-sm sm:text-base text-slate-600">
              Select your academic stage to view tailored live batches with physical hardware kits delivered to your doorstep.
            </p>
          </div>

          {/* PW-Style Horizontal Pill Cohort Selector */}
          <div className="flex items-center justify-start sm:justify-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {[
              { id: "all", label: "🌟 All Batches" },
              { id: "explorer", label: "Class 5–7 (Explorer)" },
              { id: "builder", label: "Class 8–10 (Builder)" },
              { id: "creator", label: "Class 11–12 (Creator)" },
              { id: "engineer", label: "College / B.Tech (Engineer)" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedCohort(tab.id as any)}
                className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer border ${
                  selectedCohort === tab.id
                    ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-100/60"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Batch Cards Grid */}
          <div className="grid md:grid-cols-2 gap-6 lg:gap-8 pt-4">
            {filteredBatches.map((batch) => (
              <div
                key={batch.id}
                className="bg-white border-2 border-slate-200 hover:border-blue-500 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6 relative overflow-hidden"
              >
                {/* Card Top Pill Badge */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <span className={`px-2.5 py-1 rounded-lg border text-[10px] font-mono font-extrabold uppercase ${batch.badgeColor}`}>
                      {batch.badge}
                    </span>
                    <span className="text-[11px] font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded-md">
                      {batch.language}
                    </span>
                  </div>

                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
                    {batch.title}
                  </h3>
                  <p className="text-xs text-slate-600 font-medium">{batch.tagline}</p>

                  {/* Highlights Pill Badges */}
                  <div className="grid grid-cols-2 gap-2 pt-2 text-[11px] font-semibold text-slate-700">
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
                      <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                      <span>{batch.duration}</span>
                    </div>
                    <div className="flex items-center gap-1.5 p-2 rounded-xl bg-emerald-50/70 border border-emerald-100 text-emerald-800">
                      <Package className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="truncate">{batch.kitIncluded}</span>
                    </div>
                  </div>

                  {/* Key Features List */}
                  <div className="space-y-2 pt-2 border-t border-slate-100">
                    {batch.features.map((feat, idx) => (
                      <div key={idx} className="flex items-start gap-2 text-xs text-slate-700">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Price & Action Footer */}
                <div className="pt-4 border-t border-slate-100 space-y-4">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-extrabold font-mono text-slate-900">
                          ₹{batch.price.toLocaleString("en-IN")}
                        </span>
                        <span className="text-sm font-mono text-slate-400 line-through">
                          ₹{batch.mrp.toLocaleString("en-IN")}
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          {batch.discount}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-mono mt-0.5">Includes full hardware kit &amp; GST</p>
                    </div>

                    <Link
                      href={batch.link}
                      className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all inline-flex items-center gap-1.5"
                    >
                      <span>Enroll Batch</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </section>

        {/* =========================================================
            3. "SIKSATECH KI PEHCHAN" — WHY WE ARE DIFFERENT
           ========================================================= */}
        <section className="py-16 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3 max-w-3xl mx-auto">
              <span className="text-xs font-mono font-bold text-blue-600 uppercase tracking-wider">
                Why Lakhs of Students &amp; Parents Trust SiksaTech
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Not Just Videos — Real Hardware Education
              </h2>
              <p className="text-sm sm:text-base text-slate-600">
                We replace pure screen addiction with hands-on maker skills. Build tangible electronic prototypes that work in the real world.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: Package,
                  color: "bg-blue-50 text-blue-600 border-blue-200",
                  title: "Hardware Kits at Your Doorstep",
                  desc: "Every enrolled student receives an industrial-grade electronics & robotics kit delivered directly home with safe 5V boards."
                },
                {
                  icon: Video,
                  color: "bg-purple-50 text-purple-600 border-purple-200",
                  title: "Live Interactive Practical Labs",
                  desc: "Learn from tier-1 robotics researchers & systems engineers. Write firmware, debug circuits live, and test sensors step-by-step."
                },
                {
                  icon: MessageSquare,
                  color: "bg-emerald-50 text-emerald-600 border-emerald-200",
                  title: "24x7 Hardware Doubt Engine",
                  desc: "Stuck on a breadboard circuit or C++ compiler error? Upload your schematic photo and get direct answers from engineering mentors."
                },
                {
                  icon: Trophy,
                  color: "bg-amber-50 text-amber-600 border-amber-200",
                  title: "National STEM Hackathons",
                  desc: "Compete for ₹1,00,000+ national prize pools. Present your prototype to college innovation hubs and incubation centers."
                },
                {
                  icon: ShieldCheck,
                  color: "bg-indigo-50 text-indigo-600 border-indigo-200",
                  title: "Govt & NEP 2020 Aligned",
                  desc: "Curriculum mapped directly to CBSE/ICSE experiential learning guidelines, making it the perfect foundation for future engineers."
                },
                {
                  icon: TrendingUp,
                  color: "bg-rose-50 text-rose-600 border-rose-200",
                  title: "Verifiable Maker Portfolio",
                  desc: "Every project you assemble gets published in your verified digital portfolio, proving practical ability beyond textbook marks."
                }
              ].map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-3">
                    <div className={`w-12 h-12 rounded-xl border flex items-center justify-center ${feat.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{feat.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* =========================================================
            4. ROLE SEGMENTATION (STUDENTS, PARENTS, SCHOOLS)
           ========================================================= */}
        <section className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-3xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Designed Specifically For You
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Personalized dashboards, targeted workflows, and distinct features for every persona.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            
            {/* Student */}
            <Link
              href="/auth/register?role=student"
              className="group bg-white rounded-3xl border-2 border-slate-200 hover:border-blue-500 p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[10px] font-mono font-bold uppercase">
                  For Students
                </span>
                <h3 className="text-xl font-bold text-slate-900">Student Learner Portal</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Join interactive cohorts, access code playgrounds, submit hardware builds, and track verified certificates.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                <span>Start Learning &rarr;</span>
              </div>
            </Link>

            {/* Parent */}
            <Link
              href="/auth/register?role=parent"
              className="group bg-white rounded-3xl border-2 border-slate-200 hover:border-emerald-500 p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <Users className="w-6 h-6" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-mono font-bold uppercase">
                  For Parents
                </span>
                <h3 className="text-xl font-bold text-slate-900">Parent Monitoring Hub</h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Link your child using Siksa ID, monitor weekly course progress, track kit shipments, and view achievements.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-emerald-600">
                <span>Open Parent Portal &rarr;</span>
              </div>
            </Link>

            {/* Institutions */}
            <Link
              href="/institutions"
              className="group bg-slate-900 rounded-3xl border-2 border-slate-800 hover:border-purple-500 p-7 shadow-sm hover:shadow-xl transition-all flex flex-col justify-between space-y-6 text-white"
            >
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-800 text-purple-400 flex items-center justify-center">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-mono font-bold uppercase">
                  For Schools &amp; Colleges
                </span>
                <h3 className="text-xl font-bold text-white">ATL &amp; STEM Lab Setup</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Deploy turnkey hardware labs, experiential curricula, teacher training, and institutional competitions.
                </p>
              </div>
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs font-bold text-purple-400">
                <span>View Lab Solutions &rarr;</span>
              </div>
            </Link>

          </div>
        </section>

        {/* =========================================================
            5. SUCCESS STORIES & STUDENT PROJECTS SHOWCASE
           ========================================================= */}
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono font-bold text-blue-600 uppercase">Real Maker Proof</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">What SiksaTech Students Build</h2>
              </div>
              <Link href="/build" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
                Explore Full Showcase Gallery ({projects.length} Builds) <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {projects.slice(0, 3).map((proj) => (
                <div
                  key={proj.id}
                  className="bg-slate-50 border border-slate-200 rounded-2xl p-6 space-y-4 hover:border-slate-300 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        {proj.studentLevel}
                      </span>
                      <span className="text-[10px] font-mono font-bold text-slate-500">
                        {proj.difficulty} Level
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">{proj.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">{proj.description}</p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {proj.technologies.slice(0, 3).map((tech, idx) => (
                        <span key={idx} className="text-[10px] font-mono px-2 py-0.5 bg-white border border-slate-200 rounded text-slate-600">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-slate-800">{proj.creatorName}</span>
                    <span className="text-[11px] text-slate-400">{proj.creatorGrade}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* =========================================================
            6. FREE ACADEMIC COUNSELLING / HELPLINE BANNER
           ========================================================= */}
        <section className="py-12 bg-gradient-to-r from-blue-900 via-indigo-950 to-slate-950 text-white border-y border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8 p-6 sm:p-10 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-md">
              <div className="space-y-2 max-w-2xl text-center lg:text-left">
                <span className="inline-block px-3 py-1 bg-amber-400 text-slate-950 text-xs font-mono font-bold uppercase rounded-full">
                  FREE 1-on-1 STEM Guidance
                </span>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white">
                  Confused which STEM Batch or Kit is right for your child?
                </h3>
                <p className="text-xs sm:text-sm text-slate-300">
                  Talk to our senior academic counselors. We will guide you through age-appropriate curriculum mapping, ATL kit recommendations, and scholarship tests.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
                <a
                  href="tel:18008907836"
                  className="px-6 py-3.5 bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg flex items-center gap-2"
                >
                  <PhoneCall className="w-4 h-4 text-blue-600" />
                  <span>Call Toll-Free: 1800-890-7836</span>
                </a>
                <Link
                  href="/enquiry"
                  className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg text-center"
                >
                  Request Callback &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* =========================================================
            7. FAQ SECTION
           ========================================================= */}
        <section className="py-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="text-center space-y-2">
            <span className="text-xs font-mono font-bold text-blue-600 uppercase">Frequently Asked Questions</span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Got Questions? We Have Answers.</h2>
          </div>

          <div className="space-y-3">
            {faqs.map((faq) => {
              const isOpen = openFaq === faq.id;
              return (
                <div
                  key={faq.id}
                  className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all shadow-xs"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 font-bold text-slate-900 text-sm sm:text-base hover:bg-slate-50 transition-colors cursor-pointer"
                  >
                    <span>{faq.question}</span>
                    <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3 bg-slate-50/50">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
