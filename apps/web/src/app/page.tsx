"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Navbar, Footer } from "@siksatech/ui";
import {
  db, Banner, FAQ, LearningPath, Project,
  DEMO_BANNERS, DEMO_FAQS, DEMO_PATHS, DEMO_PROJECTS
} from "@siksatech/database";
import {
  ArrowRight,
  ChevronDown,
  ChevronRight,
  BookOpen,
  Terminal,
  Hammer,
  Cpu,
  GraduationCap,
  Building2,
} from "lucide-react";

export default function HomePage() {
  const [banners, setBanners] = useState<Banner[]>(DEMO_BANNERS);
  const [activeBanner, setActiveBanner] = useState(0);
  const [faqs, setFaqs] = useState<FAQ[]>(DEMO_FAQS);
  const [openFaq, setOpenFaq] = useState<string | null>(null);
  const [paths, setPaths] = useState<LearningPath[]>(DEMO_PATHS);
  const [projects, setProjects] = useState<Project[]>(DEMO_PROJECTS);

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
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToBanner = useCallback((idx: number) => {
    setActiveBanner(idx);
  }, []);

  const pathIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    explorer: BookOpen,
    builder: Terminal,
    creator: Hammer,
    engineer: Cpu,
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* ============================
            SECTION 1: BANNER CAROUSEL (Responsive 21:7 / 16:9)
           ============================ */}
        <section className="relative overflow-hidden bg-[#0A0F1D]">
          {banners.length > 0 && (
            <div className="relative w-full h-[400px] sm:h-[440px] md:h-[480px] lg:h-[500px]">
              {banners.map((banner, idx) => (
                <div
                  key={banner.id}
                  className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
                    idx === activeBanner ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                  }`}
                  style={{
                    background: banner.bgColor || "linear-gradient(135deg, #0A0F1D 0%, #0F172A 50%, #1E293B 100%)",
                  }}
                >
                  <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

                  <div className="absolute inset-0 flex items-center">
                    <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                      <div className="max-w-2xl space-y-3 sm:space-y-4">
                        <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/40 text-blue-400 text-[10px] sm:text-xs font-mono font-bold tracking-widest uppercase rounded-full">
                          Featured Learning Track
                        </span>
                        <h1 className="text-xl sm:text-3xl lg:text-5xl font-extrabold text-white leading-tight tracking-tight">
                          {banner.title}
                        </h1>
                        <p className="text-xs sm:text-base lg:text-lg text-slate-300 line-clamp-2 sm:line-clamp-3 leading-relaxed max-w-xl">
                          {banner.subtitle}
                        </p>
                        <div className="pt-2">
                          <Link
                            href={banner.ctaLink}
                            className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-6 sm:py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-blue-600/30 hover:scale-[1.02]"
                          >
                            {banner.ctaText}
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Dot Indicators */}
              {banners.length > 1 && (
                <div className="absolute bottom-3 sm:bottom-6 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 bg-black/40 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToBanner(idx)}
                      className={`rounded-full transition-all duration-300 ${
                        idx === activeBanner ? "w-6 h-2 bg-blue-500" : "w-2 h-2 bg-white/40 hover:bg-white/70"
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
            SECTION 2: DUAL AUDIENCE SELECTOR
           ============================ */}
        <section className="py-16 sm:py-24 bg-[#F8FAFC] border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
              <span className="text-[11px] font-mono font-bold tracking-widest text-blue-600 uppercase">
                Tailored STEM Pathways
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Where Do You Fit in the SiksaTech Ecosystem?
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Choose your learning gateway to discover customized curricula, hardware kits, and turnkey institutional programs.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
              <Link
                href="/learn"
                className="group p-6 sm:p-8 bg-white border border-slate-200 hover:border-blue-500 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all space-y-4 relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 group-hover:scale-110 transition-transform">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-blue-600 uppercase">For Learners</span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">I&apos;m a Student / Parent</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Explore hands-on coding, robotics, and circuit kits tailored for Class 5 up to College engineering.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  Explore Learning Tracks <ChevronRight className="w-4 h-4" />
                </div>
              </Link>

              <Link
                href="/institutions"
                className="group p-6 sm:p-8 bg-white border border-slate-200 hover:border-blue-500 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all space-y-4 relative overflow-hidden"
              >
                <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-900 group-hover:scale-110 transition-transform">
                  <Building2 className="w-6 h-6" />
                </div>
                <div className="space-y-1.5">
                  <span className="font-mono text-[10px] font-bold tracking-wider text-slate-500 uppercase">For Educators</span>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">I&apos;m a School / College</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    Set up turnkey STEM innovation labs, train faculty, and align curriculum with NEP 2020 experiential standards.
                  </p>
                </div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                  Institutional Lab Blueprints <ChevronRight className="w-4 h-4" />
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* ============================
            SECTION 3: 4 LEARNING PATHWAYS
           ============================ */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-widest text-blue-600 uppercase">Structured Pedagogy</span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              4 Progressive Engineering Tracks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Moving learners systematically from graphical logic to embedded microcontroller hardware and AI systems.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {paths.map((p) => {
              const Icon = pathIcons[p.id] || BookOpen;
              return (
                <div
                  key={p.id}
                  className="bg-white border border-slate-200 hover:border-blue-500 p-6 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all flex flex-col justify-between space-y-5"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200 uppercase">
                        {p.targetAges}
                      </span>
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{p.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{p.description}</p>
                  </div>

                  <div className="space-y-3 pt-3 border-t border-slate-100">
                    <div className="flex flex-wrap gap-1">
                      {p.skills.slice(0, 3).map((skill: string, tIdx: number) => (
                        <span key={tIdx} className="text-[10px] font-mono px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100">
                          {skill}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={`/learn?path=${p.id}`}
                      className="block text-center py-2.5 bg-slate-900 hover:bg-blue-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all"
                    >
                      View Syllabus &rarr;
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ============================
            SECTION 4: 8-STAGE EXPERIENTIAL FRAMEWORK
           ============================ */}
        <section className="py-16 sm:py-24 bg-[#0A0F1D] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="text-[11px] font-mono font-bold tracking-widest text-blue-400 uppercase">
                The Build-First Methodology
              </span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                Our 8-Stage Experiential Learning Loop
              </h2>
              <p className="text-xs sm:text-sm text-slate-400">
                Every SiksaTech lesson is structured around authentic engineering iteration:
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { stage: "01", name: "Discover", desc: "Identify real physics & engineering problems" },
                { stage: "02", name: "Understand", desc: "Deconstruct schematics and signal paths" },
                { stage: "03", name: "Experiment", desc: "Test sensory telemetry on breadboards" },
                { stage: "04", name: "Build", desc: "Assemble functional physical prototypes" },
                { stage: "05", name: "Test", desc: "Debug firmware loops & voltage drops" },
                { stage: "06", name: "Improve", desc: "Optimize battery draw & structural CAD" },
                { stage: "07", name: "Solve", desc: "Deploy working solutions in the real world" },
                { stage: "08", name: "Innovate", desc: "Present builds at Maker Sprints" },
              ].map((step, idx) => (
                <div key={idx} className="p-5 bg-slate-900/80 border border-slate-800 rounded-xl space-y-2 hover:border-blue-500/50 transition-all">
                  <span className="font-mono text-xs font-bold text-blue-400">{step.stage}</span>
                  <h4 className="text-sm font-bold text-white">{step.name}</h4>
                  <p className="text-[11px] text-slate-400 leading-snug">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ============================
            SECTION 5: STUDENT BUILD SHOWCASE
           ============================ */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-[11px] font-mono font-bold tracking-widest text-blue-600 uppercase">Student Inventions</span>
              <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                What SiksaTech Makers Are Building
              </h2>
            </div>
            <Link href="/build" className="inline-flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
              View All Showcase Projects <ChevronRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((proj) => (
              <div key={proj.id} className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-lg transition-all space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 rounded border border-blue-100 uppercase">
                      {proj.studentLevel}
                    </span>
                    <span className="text-xs font-bold text-slate-400">{proj.difficulty}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900">{proj.title}</h3>
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{proj.problemStatement}</p>
                </div>

                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <p className="text-[11px] text-slate-500 font-medium">By {proj.creatorName} &bull; {proj.creatorSchool || "Maker"}</p>
                  <Link href={`/build`} className="block text-center py-2 bg-slate-50 hover:bg-blue-50 text-blue-600 font-bold text-xs rounded-lg border border-slate-200 hover:border-blue-200 transition-all">
                    View Project Schematics &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ============================
            SECTION 6: FAQS & COMMUNITY
           ============================ */}
        <section className="py-16 sm:py-24 bg-[#F8FAFC] border-t border-slate-200">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div className="text-center space-y-2">
              <span className="text-[11px] font-mono font-bold tracking-widest text-blue-600 uppercase">Clear Answers</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="space-y-3">
              {faqs.map((faq) => {
                const isOpen = openFaq === faq.id;
                return (
                  <div key={faq.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                    <button
                      onClick={() => setOpenFaq(isOpen ? null : faq.id)}
                      className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-slate-900 hover:text-blue-600 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`} />
                    </button>
                    {isOpen && (
                      <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-slate-600 border-t border-slate-100 pt-3 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
