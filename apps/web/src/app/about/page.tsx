"use client";

import { Navbar } from "@siksatech/ui";
import { Footer } from "@siksatech/ui";
import Link from "next/link";
import { Cpu, Compass, ShieldCheck, Heart } from "lucide-react";

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-primary-navy text-secondary-white">
      <Navbar />

      {/* Header Banner */}
      <section className="py-16 border-b border-border-slate/40 tech-grid-fine">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-accent-cyan uppercase">Our Roots & Vision</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-secondary-white">The SiksaTech Story</h1>
          <p className="text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
            SiksaTech unifies Indian cultural foundations of wisdom and responsibility with global scaling technical capabilities.
          </p>
        </div>
      </section>

      {/* Main Philosophy Copy */}
      <section className="py-16 flex-grow">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-secondary-white">What does \"Siksa\" mean?</h2>
            <p className="text-sm text-text-muted leading-relaxed">
              In Sanskrit, **Siksa (शिक्षा)** represents knowledge, education, and instructional discipline. Combined with **Tech**, it forms SiksaTech: the intersection of **Knowledge, Technology, Wisdom, and Responsibility**. We believe technology is not merely a tool for utility—it is a responsibility to create, optimize, and build safely.
            </p>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl font-bold tracking-tight text-secondary-white">The \"Build-First\" Mindset</h2>
            <p className="text-sm text-text-muted leading-relaxed">
              We reject the conventional "screen-only" coding centers. Understanding a system requires writing code, wiring terminals, testing signals on breadboards, and debugging compile errors. We teach students to understand technology from its foundational roots, making them creators rather than consumers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
            <div className="p-6 rounded bg-navy-light/40 border border-border-slate space-y-3">
              <div className="w-10 h-10 rounded bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                <Compass className="w-5 h-5 text-accent-cyan" />
              </div>
              <h4 className="text-sm font-bold text-secondary-white">Our Mission</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                To build true technical capability across schools and colleges in India, transitioning students from theoretical learners to practical makers.
              </p>
            </div>
            <div className="p-6 rounded bg-navy-light/40 border border-border-slate space-y-3">
              <div className="w-10 h-10 rounded bg-accent-cyan/10 border border-accent-cyan/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-accent-cyan" />
              </div>
              <h4 className="text-sm font-bold text-secondary-white">Our Values</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Integrity in curriculum design, focus on core engineering physics, and safety in physical fabrication.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="p-8 rounded-lg border border-border-slate bg-navy-dark text-center space-y-6">
            <h3 className="text-lg font-bold">Interested in joining our community?</h3>
            <p className="text-xs text-text-muted max-w-lg mx-auto leading-relaxed">
              Explore our progressive syllabus or set up a consultation call to establish a SiksaTech laboratory program at your campus.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/learn"
                className="px-6 py-3 text-xs font-bold tracking-widest bg-accent-cyan hover:bg-accent-cyan-hover text-navy-dark rounded transition-technical"
              >
                BROWSE PATHS
              </Link>
              <Link
                href="/enquiry/student"
                className="px-6 py-3 text-xs font-bold tracking-widest border border-border-slate hover:border-accent-cyan text-secondary-white rounded transition-technical"
              >
                SUBMIT ENQUIRY
              </Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
