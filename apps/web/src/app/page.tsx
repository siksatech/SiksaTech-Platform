"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar } from "@siksatech/ui";
import { Footer } from "@siksatech/ui";
import { db, Banner, FAQ, Competition, LearningPath, Project } from "@siksatech/database";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Terminal,
  Hammer,
  Cpu,
  Zap,
  Users,
  School,
  Trophy,
  Calendar,
  MapPin,
  Sparkles,
  GraduationCap,
  Wrench,
  Lightbulb,
  Target,
  Building2,
  FlaskConical,
  Rocket,
  Shield,
  Globe,
  CheckCircle2,
} from "lucide-react";

// =============================================
// HOMEPAGE
// =============================================
export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [activeBanner, setActiveBanner] = useState(0);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [competitions, setCompetitions] = useState<Competition[]>([]);
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  useEffect(() => {
    db.getBanners().then(setBanners);
    db.getFAQs().then(setFaqs);
    db.getCompetitions().then(setCompetitions);
    db.getLearningPaths().then(setPaths);
    db.getProjects(true).then(setProjects);
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setActiveBanner((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToBanner = useCallback((idx: number) => {
    setActiveBanner(idx);
  }, []);

  const pathIcons: Record<string, any> = {
    explorer: BookOpen,
    builder: Terminal,
    creator: Hammer,
    engineer: Cpu,
  };

  const pathColors: Record<string, { bg: string; text: string; border: string; badge: string }> = {
    explorer: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200", badge: "bg-emerald-100 text-emerald-700" },
    builder: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200", badge: "bg-blue-100 text-blue-700" },
    creator: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200", badge: "bg-purple-100 text-purple-700" },
    engineer: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200", badge: "bg-orange-100 text-orange-700" },
  };

  return (
    <>
      <Navbar />

      <main className="flex-1">
        {/* ============================
            SECTION 1: BANNER CAROUSEL
           ============================ */}
        <section className="relative overflow-hidden">
          {banners.length > 0 && (
            <div className="relative w-full" style={{ aspectRatio: "21 / 7" }}>
              {banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 w-full h-full transition-all duration-700 ease-in-out ${
                    idx === activeBanner
                      ? "opacity-100 z-10"
                      : "opacity-0 z-0"
                  }`}
                  style={{ background: banner.bgColor }}
                >
                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="max-w-2xl">
                        <h1 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-tight mb-3 lg:mb-4">
                          {banner.title}
                        </h1>
                        <p className="text-sm sm:text-base lg:text-lg text-white/80 mb-5 lg:mb-8 leading-relaxed max-w-xl">
                          {banner.subtitle}
                        </p>
                        <Link
                          href={banner.ctaLink}
                          className="inline-flex items-center gap-2 px-5 py-2.5 lg:px-6 lg:py-3 bg-white text-slate-900 font-bold text-xs lg:text-sm rounded-lg hover:bg-slate-100 transition-all shadow-lg"
                        >
                          {banner.ctaText}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Dot Indicators */}
              {banners.length > 1 && (
                <div className="absolute bottom-4 lg:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToBanner(idx)}
                      className={`rounded-full transition-all duration-300 ${
                        idx === activeBanner
                          ? "w-8 h-2.5 bg-white"
                          : "w-2.5 h-2.5 bg-white/40 hover:bg-white/60"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ============================
            SECTION 2: PATHWAY CTA
           ============================ */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
              {/* Left: Image */}
              <div className="relative">
                <div className="aspect-[4/3] rounded-2xl bg-gradient-to-br from-blue-100 via-indigo-50 to-purple-100 overflow-hidden flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-white shadow-lg flex items-center justify-center">
                      <Wrench className="w-12 h-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Hands-On STEM Learning</h3>
                    <p className="text-sm text-slate-600">From circuits to AI — learn by building real projects</p>
                  </div>
                </div>
                {/* Floating badge */}
                <div className="absolute -bottom-4 -right-4 bg-white rounded-xl shadow-xl px-4 py-3 border border-slate-100">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-emerald-100 flex items-center justify-center">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                    </div>
                    <div>
                      <p className="text-[11px] font-bold text-slate-800">4 Learning Tracks</p>
                      <p className="text-[10px] text-slate-500">Class 5 → College</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right: Text + CTAs */}
              <div className="space-y-6">
                <div>
                  <span className="inline-block text-xs font-bold tracking-widest text-blue-600 uppercase mb-3">
                    Where do you fit?
                  </span>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                    Start your technology journey today
                  </h2>
                  <p className="text-base text-slate-600 leading-relaxed">
                    Whether you&apos;re a student wanting to build your first robot, a parent seeking structured STEM education, or a school looking to upgrade your labs — SiksaTech has a path for you.
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <Link
                    href="/learn"
                    className="group relative overflow-hidden rounded-xl border-2 border-blue-200 bg-blue-50 p-6 hover:border-blue-400 hover:shadow-lg transition-all"
                  >
                    <GraduationCap className="w-8 h-8 text-blue-600 mb-3" />
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      I&apos;m a Student / Parent
                    </h3>
                    <p className="text-xs text-slate-600">
                      Explore courses, enroll in learning tracks, and build real projects.
                    </p>
                    <ChevronRight className="absolute top-6 right-4 w-5 h-5 text-blue-400 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <Link
                    href="/institutions"
                    className="group relative overflow-hidden rounded-xl border-2 border-emerald-200 bg-emerald-50 p-6 hover:border-emerald-400 hover:shadow-lg transition-all"
                  >
                    <Building2 className="w-8 h-8 text-emerald-600 mb-3" />
                    <h3 className="text-base font-bold text-slate-900 mb-1">
                      I&apos;m a School / College
                    </h3>
                    <p className="text-xs text-slate-600">
                      Set up STEM labs, train teachers, and host competitions at your campus.
                    </p>
                    <ChevronRight className="absolute top-6 right-4 w-5 h-5 text-emerald-400 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ============================
            SECTION 3: WHY STEM
           ============================ */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-block text-xs font-bold tracking-widest text-blue-600 uppercase mb-3">
                Why This Matters
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-5">
                India&apos;s education system teaches theory.<br />
                The world demands builders.
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Over 80% of Indian engineering graduates are considered unemployable by industry standards.
                The gap? Hands-on experience. Students memorize formulas but never wire a circuit, never debug
                real code, never build a system that solves a problem. SiksaTech exists to close this gap.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  icon: Lightbulb,
                  title: "Learn by Doing",
                  desc: "Every course involves building a physical prototype — not just watching videos.",
                  color: "text-amber-600",
                  bg: "bg-amber-50",
                },
                {
                  icon: Target,
                  title: "Industry-Relevant Skills",
                  desc: "Arduino, Python, ESP32, PCB design, Computer Vision — tools used by real engineers.",
                  color: "text-blue-600",
                  bg: "bg-blue-50",
                },
                {
                  icon: FlaskConical,
                  title: "Scientific Thinking",
                  desc: "Develop hypothesizing, testing, iterating — the core loop of engineering and research.",
                  color: "text-purple-600",
                  bg: "bg-purple-50",
                },
                {
                  icon: Rocket,
                  title: "Future-Ready",
                  desc: "From IoT to Generative AI — prepare for careers that don't exist yet.",
                  color: "text-emerald-600",
                  bg: "bg-emerald-50",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-lg hover:border-slate-300 transition-all group"
                >
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================
            SECTION 4: STEM PATHWAYS
           ============================ */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <span className="inline-block text-xs font-bold tracking-widest text-blue-600 uppercase mb-3">
                Structured Progression
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                Four tracks. One goal: Build.
              </h2>
              <p className="text-base text-slate-600">
                Each pathway is designed for a specific age and skill level. Start where you are, advance as you grow.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {paths.map((path) => {
                const Icon = pathIcons[path.id] || Cpu;
                const colors = pathColors[path.id] || pathColors.explorer;
                return (
                  <div
                    key={path.id}
                    className={`rounded-xl border ${colors.border} ${colors.bg} p-6 hover:shadow-lg transition-all group`}
                  >
                    <div className={`w-12 h-12 rounded-xl bg-white border ${colors.border} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
                      <Icon className={`w-6 h-6 ${colors.text}`} />
                    </div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{path.title}</h3>
                    <p className="text-xs text-slate-500 mb-3">{path.targetAges}</p>
                    <p className="text-sm text-slate-600 leading-relaxed mb-4">{path.description}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {path.skills.slice(0, 3).map((skill, i) => (
                        <span key={i} className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${colors.badge}`}>
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="text-center">
              <Link
                href="/learn"
                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-all shadow-lg shadow-blue-600/20"
              >
                Explore All Courses
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ============================
            SECTION 5: STUDENT PROJECTS
           ============================ */}
        <section className="py-16 lg:py-24 bg-slate-900 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-block text-xs font-bold tracking-widest text-blue-400 uppercase">
                  Real Projects. Real Students.
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold leading-tight">
                  Don&apos;t just learn —<br />
                  <span className="text-blue-400">build and showcase</span>
                </h2>
                <p className="text-base text-slate-400 leading-relaxed max-w-lg">
                  Every SiksaTech student creates real, working prototypes. From smart agriculture monitors
                  to autonomous sorting robots — these aren&apos;t simulations. They&apos;re functional systems
                  built with real hardware, real code, and real problem-solving.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    href="/build"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm rounded-lg transition-all"
                  >
                    View Student Projects
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/auth/register"
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 font-semibold text-sm rounded-lg transition-all"
                  >
                    Submit Your Build
                  </Link>
                </div>
              </div>

              {/* Project preview cards */}
              <div className="space-y-4">
                {projects.length === 0 ? (
                  <p className="text-slate-400 text-sm">No projects yet. Be the first to submit a build.</p>
                ) : (
                  projects.slice(0, 3).map((proj, idx) => (
                    <div
                      key={proj.id}
                      className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 hover:bg-slate-800 hover:border-slate-600 transition-all group cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="text-base font-bold text-white mb-1 group-hover:text-blue-400 transition-colors">
                            {proj.title}
                          </h4>
                          <p className="text-xs text-slate-500">{proj.creatorName} • {proj.studentLevel}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          proj.difficulty === "Hard" ? "bg-red-900/40 text-red-400" : "bg-amber-900/40 text-amber-400"
                        }`}>
                          {proj.difficulty}
                        </span>
                      </div>
                      <div className="flex gap-1.5 mt-3">
                        {proj.technologies.slice(0, 3).map((tag, i) => (
                          <span key={i} className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-slate-700 text-slate-300">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ============================
            SECTION 6: INSTITUTIONAL PARTNERSHIPS
           ============================ */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <span className="inline-block text-xs font-bold tracking-widest text-emerald-600 uppercase mb-3">
                For Schools & Colleges
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                Set up a future-ready STEM lab at your institution
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                We partner with schools and colleges to install complete STEM laboratories,
                train faculty, design curriculum, and host inter-school competitions.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
              {[
                {
                  icon: FlaskConical,
                  title: "Turnkey Lab Setup",
                  desc: "Complete hardware, workstations, tools, and curriculum — ready to teach on day one.",
                },
                {
                  icon: Users,
                  title: "Faculty Training",
                  desc: "Intensive teacher workshops on STEM pedagogy, hardware handling, and project mentorship.",
                },
                {
                  icon: Trophy,
                  title: "Competitions & Events",
                  desc: "Host hackathons, maker fairs, and science expos that put your students on the map.",
                },
                {
                  icon: Shield,
                  title: "NEP 2020 Aligned",
                  desc: "Our programs are designed to complement the National Education Policy's emphasis on experiential learning.",
                },
                {
                  icon: Globe,
                  title: "Remote & Hybrid Options",
                  desc: "Flexible delivery models for schools in tier-2 and tier-3 cities with limited infrastructure.",
                },
                {
                  icon: Zap,
                  title: "Outcome Tracking",
                  desc: "Dashboard for administrators to track student progress, project completions, and skill certifications.",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-xl p-6 border border-slate-200 hover:shadow-md hover:border-emerald-200 transition-all group"
                >
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <Link
                href="/institutions"
                className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-lg transition-all shadow-lg shadow-emerald-600/20"
              >
                Partner With Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ============================
            SECTION 7: COMPETITIONS & EVENTS
           ============================ */}
        {competitions.length > 0 && (
          <section className="py-16 lg:py-24 bg-slate-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center max-w-2xl mx-auto mb-12">
                <span className="inline-block text-xs font-bold tracking-widest text-purple-600 uppercase mb-3">
                  Competitions & Events
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight mb-4">
                  Compete. Create. Conquer.
                </h2>
                <p className="text-base text-slate-600">
                  Hackathons, maker sprints, and workshops to push your engineering skills further.
                </p>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitions.map((comp) => {
                  const typeColors: Record<string, string> = {
                    hackathon: "bg-red-100 text-red-700",
                    competition: "bg-blue-100 text-blue-700",
                    workshop: "bg-amber-100 text-amber-700",
                    event: "bg-purple-100 text-purple-700",
                  };
                  return (
                    <div
                      key={comp.id}
                      className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-lg hover:border-purple-200 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider ${typeColors[comp.type] || typeColors.event}`}>
                          {comp.type}
                        </span>
                        <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${
                          comp.status === "upcoming" ? "bg-emerald-100 text-emerald-700" :
                          comp.status === "ongoing" ? "bg-blue-100 text-blue-700" :
                          "bg-slate-100 text-slate-500"
                        }`}>
                          {comp.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mb-2">{comp.title}</h3>
                      <p className="text-sm text-slate-600 leading-relaxed mb-4">{comp.description}</p>
                      <div className="space-y-1.5 text-xs text-slate-500">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" />
                          {comp.date}{comp.endDate ? ` — ${comp.endDate}` : ""}
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-3.5 h-3.5" />
                          {comp.location}
                        </div>
                      </div>
                      {comp.registrationLink && comp.status !== "completed" && (
                        <Link
                          href={comp.registrationLink}
                          className="mt-4 inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-700 transition-colors"
                        >
                          Register Now <ArrowRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ============================
            SECTION 8: ABOUT SIKSATECH
           ============================ */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-block text-xs font-bold tracking-widest text-blue-600 uppercase mb-1">
                  About SiksaTech
                </span>
                <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 leading-tight">
                  We&apos;re building India&apos;s <br />
                  <span className="text-blue-600">Build-First</span> generation
                </h2>
                <p className="text-base text-slate-600 leading-relaxed">
                  SiksaTech is not another edtech startup selling recorded videos. We are a technology
                  education ecosystem that believes understanding comes from building. Our students
                  don&apos;t just learn what a capacitor does — they solder it onto a PCB and measure
                  its discharge curve with an oscilloscope.
                </p>
                <p className="text-base text-slate-600 leading-relaxed">
                  Founded with the mission to make practical STEM education accessible across India,
                  we combine curated hardware kits, mentor-guided projects, and verifiable certifications
                  to create engineers who can actually build.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Learning Tracks", value: "4" },
                    { label: "Hardware Projects", value: "50+" },
                    { label: "Cities Targeted", value: "Tier 1–3" },
                    { label: "Skill Modules", value: "30+" },
                  ].map((stat, idx) => (
                    <div key={idx} className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                      <p className="text-2xl font-extrabold text-blue-600">{stat.value}</p>
                      <p className="text-xs font-medium text-slate-500 mt-1">{stat.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                {[
                  {
                    icon: CheckCircle2,
                    title: "Not just videos — real hardware kits shipped to your door",
                    color: "text-emerald-600",
                  },
                  {
                    icon: CheckCircle2,
                    title: "Mentor-reviewed project submissions with feedback",
                    color: "text-emerald-600",
                  },
                  {
                    icon: CheckCircle2,
                    title: "Verifiable digital certificates for every completed track",
                    color: "text-emerald-600",
                  },
                  {
                    icon: CheckCircle2,
                    title: "NEP 2020 aligned curriculum for institutional adoption",
                    color: "text-emerald-600",
                  },
                  {
                    icon: CheckCircle2,
                    title: "Competitions and hackathons for student portfolio building",
                    color: "text-emerald-600",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-start gap-3 bg-slate-50 border border-slate-200 rounded-xl p-4 hover:border-blue-200 transition-all"
                  >
                    <item.icon className={`w-5 h-5 ${item.color} mt-0.5 flex-shrink-0`} />
                    <p className="text-sm font-medium text-slate-700">{item.title}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ============================
            SECTION 9: FAQ
           ============================ */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="inline-block text-xs font-bold tracking-widest text-blue-600 uppercase mb-3">
                Questions?
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => (
                <div
                  key={faq.id}
                  className="bg-white rounded-xl border border-slate-200 overflow-hidden transition-all hover:border-slate-300"
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === faq.id ? null : faq.id)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-sm font-semibold text-slate-900 pr-4">{faq.question}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-200 ${
                        openFaq === faq.id ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <div
                    className={`transition-all duration-300 ease-in-out ${
                      openFaq === faq.id ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    } overflow-hidden`}
                  >
                    <div className="px-5 pb-5 pt-0">
                      <p className="text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================
            SECTION 10: FINAL CTA
           ============================ */}
        <section className="py-16 lg:py-20 bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight mb-4">
              Ready to build something real?
            </h2>
            <p className="text-base text-blue-200 mb-8 max-w-2xl mx-auto">
              Join SiksaTech and start your journey from understanding circuits to deploying AI systems.
              No prerequisites. Just curiosity.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/auth/register"
                className="px-8 py-3.5 bg-white text-blue-700 font-bold text-sm rounded-lg hover:bg-slate-100 transition-all shadow-lg"
              >
                Start Learning Today
              </Link>
              <Link
                href="/institutions"
                className="px-8 py-3.5 border-2 border-white/30 text-white font-semibold text-sm rounded-lg hover:bg-white/10 transition-all"
              >
                Partner With Us
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
