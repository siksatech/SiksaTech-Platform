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
  CheckCircle2,
  Lightbulb,
  Code,
  Microscope,
  Network,
  Wrench,
  Users
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
    }, 7000);
    return () => clearInterval(timer);
  }, [banners.length]);

  const goToBanner = useCallback((idx: number) => {
    setActiveBanner(idx);
  }, []);

  const pathIcons: Record<string, React.ComponentType<{ className?: string }>> = {
    explorer: Microscope,
    builder: Code,
    creator: Hammer,
    engineer: Cpu,
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900 selection:bg-blue-100">
      <Navbar />

      <main className="flex-1">
        
        {/* ============================
            1. ELEGANT HERO SECTION
           ============================ */}
        <section className="relative w-full min-h-[80vh] flex items-center overflow-hidden bg-slate-50 border-b border-slate-200">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(37,99,235,0.05)_0%,transparent_50%)]" />
          
          <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-0">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
              {/* Hero Content */}
              <div className="space-y-8 max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 border border-blue-100">
                  <span className="flex h-2 w-2 rounded-full bg-blue-600"></span>
                  <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider">
                    Empowering Next-Gen Innovators
                  </span>
                </div>
                
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.15] tracking-tight">
                  <span className="font-rostex block mb-2">SIKSATECH</span>
                  Learn, Build, and Apply Engineering.
                </h1>
                
                <p className="text-lg sm:text-xl text-slate-600 leading-relaxed">
                  A trusted platform providing schools and students with industrial-grade STEM kits, structured curricula, and a supportive maker ecosystem. From Class 5 through college.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 pt-4">
                  <Link
                    href="/learn"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-base rounded-xl transition-all shadow-sm hover:shadow-md"
                  >
                    Start Learning
                    <ArrowRight className="w-5 h-5" />
                  </Link>
                  <Link
                    href="/institutions"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold text-base rounded-xl transition-all"
                  >
                    For Schools & Institutions
                  </Link>
                </div>
              </div>

              {/* Hero Visual / Carousel */}
              <div className="relative h-[400px] sm:h-[500px] w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 bg-slate-900">
                {banners.length > 0 ? (
                  banners.map((banner, idx) => (
                    <div
                      key={banner.id}
                      className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                        idx === activeBanner ? "opacity-100 z-10" : "opacity-0 z-0 pointer-events-none"
                      }`}
                      style={{
                        background: banner.bgColor || "#0F172A",
                      }}
                    >
                      <div className="absolute inset-0 flex flex-col justify-end p-8 sm:p-12 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent">
                        <span className="text-blue-400 font-mono text-xs uppercase tracking-widest mb-3">Featured Showcase</span>
                        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">{banner.title}</h2>
                        <p className="text-sm sm:text-base text-slate-300 mb-6 max-w-md">{banner.subtitle}</p>
                        <Link href={banner.ctaLink} className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-blue-400 transition-colors">
                          {banner.ctaText} <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-500">Loading Showcase...</div>
                )}
                
                {/* Carousel Indicators */}
                <div className="absolute top-6 right-6 z-20 flex gap-2">
                  {banners.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => goToBanner(idx)}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeBanner ? "w-8 bg-blue-500" : "w-4 bg-white/30 hover:bg-white/60"
                      }`}
                      aria-label={`Showcase slide ${idx + 1}`}
                    />
                  ))}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================
            2. TRUST & CREDIBILITY
           ============================ */}
        <section className="py-12 bg-white border-b border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <p className="text-center text-sm font-medium text-slate-500 uppercase tracking-widest mb-8">
              Trusted by Educators and Institutions Nationwide
            </p>
            <div className="flex flex-wrap justify-center items-center gap-8 sm:gap-16 opacity-60 grayscale">
               {/* Placeholders for partner logos */}
               <div className="flex items-center gap-2 font-bold text-xl text-slate-700"><Building2 className="w-6 h-6"/> EduTech Alliance</div>
               <div className="flex items-center gap-2 font-bold text-xl text-slate-700"><Users className="w-6 h-6"/> STEM Foundation</div>
               <div className="flex items-center gap-2 font-bold text-xl text-slate-700"><GraduationCap className="w-6 h-6"/> National Schools</div>
               <div className="flex items-center gap-2 font-bold text-xl text-slate-700"><BookOpen className="w-6 h-6"/> Innovation Labs</div>
            </div>
          </div>
        </section>

        {/* ============================
            3. AUDIENCE PATHWAYS (Elegant Cards)
           ============================ */}
        <section className="py-20 sm:py-28 bg-[#F8FAFC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                Designed for Every Step of the Journey
              </h2>
              <p className="text-base sm:text-lg text-slate-600">
                Whether you are a student exploring robotics at home, or a school aiming to implement NEP 2020 aligned innovation labs, we have a structured path for you.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              
              <Link
                href="/learn"
                className="group flex flex-col bg-white rounded-2xl border border-slate-200 p-8 sm:p-10 hover:shadow-xl hover:border-blue-300 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 mb-6">
                  <Lightbulb className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-3">For Students & Parents</h3>
                <p className="text-slate-600 mb-8 flex-1 leading-relaxed">
                  Access hands-on project kits, step-by-step curricula, and a community of young makers. Turn theoretical physics and math into functional engineering projects.
                </p>
                <div className="flex items-center gap-2 font-semibold text-blue-600 group-hover:translate-x-1 transition-transform">
                  Explore Learning Tracks <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

              <Link
                href="/institutions"
                className="group flex flex-col bg-slate-900 rounded-2xl border border-slate-800 p-8 sm:p-10 hover:shadow-xl hover:border-blue-500 transition-all"
              >
                <div className="w-14 h-14 rounded-xl bg-slate-800 flex items-center justify-center text-white mb-6">
                  <Building2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">For Schools & Educators</h3>
                <p className="text-slate-400 mb-8 flex-1 leading-relaxed">
                  Deploy complete turnkey STEM innovation labs. We provide the hardware, the pedagogy, and the faculty training needed to bring 21st-century skills to your classrooms.
                </p>
                <div className="flex items-center gap-2 font-semibold text-white group-hover:translate-x-1 transition-transform">
                  View Institutional Plans <ArrowRight className="w-4 h-4" />
                </div>
              </Link>

            </div>
          </div>
        </section>

        {/* ============================
            4. OUR PRODUCTS / HARDWARE
           ============================ */}
        <section className="py-20 sm:py-28 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Image / Graphic */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-square sm:aspect-[4/3] flex items-center justify-center border border-slate-200">
                 <div className="absolute inset-0 bg-[url('/stem_lab_setup.jpg')] bg-cover bg-center opacity-90" />
                 <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
                 <div className="absolute bottom-6 left-6 text-white">
                    <p className="font-semibold text-lg">Industrial-Grade Hardware</p>
                    <p className="text-sm opacity-80">Safe, modular, and built for learning.</p>
                 </div>
              </div>

              {/* Content */}
              <div className="space-y-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-4">
                    Hardware Engineered for Education
                  </h2>
                  <p className="text-lg text-slate-600 leading-relaxed">
                    We replace fragile toys with real-world technology. Our kits feature robust, custom-designed PCBs utilizing Arduino, ESP32, and Raspberry Pi architectures—ensuring a seamless transition from the classroom to industry.
                  </p>
                </div>
                
                <ul className="space-y-6">
                  {[
                    { icon: Wrench, title: "Modular & Scalable", desc: "Start with snap-fit basics, progress to complex breadboard prototyping." },
                    { icon: CheckCircle2, title: "Safety First", desc: "Short-circuit protected boards designed specifically for student use." },
                    { icon: BookOpen, title: "Integrated Pedagogy", desc: "Hardware that perfectly aligns with our structured, step-by-step curriculum." }
                  ].map((feature, fIdx) => (
                    <li key={fIdx} className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0 text-blue-600">
                        <feature.icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 text-lg">{feature.title}</h4>
                        <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
                      </div>
                    </li>
                  ))}
                </ul>
                
                <div className="pt-2">
                  <Link href="/store" className="inline-flex items-center gap-2 px-6 py-3 bg-white border-2 border-slate-900 text-slate-900 hover:bg-slate-900 hover:text-white font-semibold rounded-xl transition-colors">
                    Browse Educational Kits
                  </Link>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ============================
            5. CURRICULUM PROGRESSION
           ============================ */}
        <section className="py-20 sm:py-28 bg-[#0A0F1D] text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                A Structured Path to Mastery
              </h2>
              <p className="text-lg text-slate-400">
                Our curriculum isn't random projects. It's a carefully engineered progression that builds foundational knowledge before introducing complex systems.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {paths.map((p, idx) => {
                const Icon = pathIcons[p.id] || BookOpen;
                return (
                  <div key={p.id} className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 flex flex-col hover:bg-slate-800 transition-colors">
                    <div className="w-12 h-12 rounded-xl bg-slate-700 flex items-center justify-center text-white mb-6">
                      <Icon className="w-6 h-6" />
                    </div>
                    <div className="flex-1 space-y-3">
                      <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Level 0{idx + 1}</span>
                      <h3 className="text-xl font-bold text-white">{p.title}</h3>
                      <p className="text-sm text-slate-400 leading-relaxed">{p.description}</p>
                    </div>
                    <div className="mt-6 pt-6 border-t border-slate-700">
                      <Link href={`/learn?path=${p.id}`} className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-blue-400 transition-colors">
                        View Curriculum <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ============================
            6. METHODOLOGY (8-STAGE)
           ============================ */}
        <section className="py-20 bg-slate-50 border-t border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
             <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-16 shadow-sm text-center space-y-12">
                <div className="max-w-3xl mx-auto space-y-4">
                  <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight font-rostex">
                    THE EXPERIENTIAL LOOP
                  </h2>
                  <p className="text-lg text-slate-600">
                    We believe in learning by doing. Every SiksaTech lesson follows an authentic 8-stage engineering process, ensuring students don't just consume information, but actively apply it.
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-6 relative">
                  {[
                    { stage: "01", name: "Discover" },
                    { stage: "02", name: "Understand" },
                    { stage: "03", name: "Experiment" },
                    { stage: "04", name: "Build" },
                    { stage: "05", name: "Test" },
                    { stage: "06", name: "Improve" },
                    { stage: "07", name: "Solve" },
                    { stage: "08", name: "Innovate" },
                  ].map((step, idx) => (
                    <div key={idx} className="flex flex-col items-center">
                      <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 font-semibold flex items-center justify-center mb-3">
                        {step.stage}
                      </div>
                      <h4 className="font-semibold text-sm text-slate-900">{step.name}</h4>
                    </div>
                  ))}
                </div>
             </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}
