"use client";

import { Navbar, Footer } from "@siksatech/ui";
import Link from "next/link";
import { Cpu, Award, Users, GraduationCap, School } from "lucide-react";

export default function Programs() {
  const schoolWorkshops = [
    { title: "Circuit Foundations", duration: "2 Days", details: "Basic logic gates, breadboard wiring, and sensor variables." },
    { title: "IoT Weather Nodes", duration: "3 Days", details: "Constructing connected nodes that post data online." },
    { title: "Robotics Kinematics", duration: "5 Days", details: "Calibrating servos, obstacle detection, and steering loops." }
  ];

  const collegeWorkshops = [
    { title: "Double-Layer PCB Design", duration: "3 Days", details: "Schematic routing in KiCad, creating footprints, and export steps." },
    { title: "Computer Vision Nodes", duration: "5 Days", details: "Calibrating OpenCV filters on Raspberry Pi for object sorting." },
    { title: "Autonomous Flight Logic", duration: "1 Week", details: "Calibrating flight logs, PID motor control, and navigation." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-primary-navy text-secondary-white">
      <Navbar />

      {/* Header Banner */}
      <section className="py-16 border-b border-border-slate/40 tech-grid-fine">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="text-[10px] font-mono tracking-widest text-accent-cyan uppercase">SiksaTech Engagements</span>
          <h1 className="text-4xl font-extrabold tracking-tight text-secondary-white">STEM Workshops & Programs</h1>
          <p className="text-sm text-text-muted max-w-xl mx-auto leading-relaxed">
            We deliver highly intense, hands-on workshops and training modules directly to school campuses and college departments.
          </p>
        </div>
      </section>

      {/* Workshops Grid */}
      <section className="py-16 flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          
          {/* Schools Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-border-slate/60 pb-4">
              <div className="p-2.5 rounded bg-accent-cyan/10 border border-accent-cyan/20">
                <School className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-secondary-white">School STEM Engagements</h2>
                <p className="text-xs text-text-muted">Targeting Class 5 to Class 12</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {schoolWorkshops.map((program, idx) => (
                <div key={idx} className="p-6 rounded-lg border border-border-slate bg-navy-light/20 space-y-4 hover:border-accent-cyan/40 transition-technical">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-accent-cyan bg-accent-cyan/5 border border-accent-cyan/20 px-2 py-0.5 rounded">
                      {program.duration}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">Class 8–12</span>
                  </div>
                  <h3 className="text-lg font-bold text-secondary-white">{program.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{program.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Colleges Section */}
          <div className="space-y-8">
            <div className="flex items-center gap-3 border-b border-border-slate/60 pb-4">
              <div className="p-2.5 rounded bg-accent-cyan/10 border border-accent-cyan/20">
                <GraduationCap className="w-5 h-5 text-accent-cyan" />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight text-secondary-white">College Technical Programs</h2>
                <p className="text-xs text-text-muted">For Engineering & Sciences Students</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {collegeWorkshops.map((program, idx) => (
                <div key={idx} className="p-6 rounded-lg border border-border-slate bg-navy-light/20 space-y-4 hover:border-accent-cyan/40 transition-technical">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-mono text-accent-cyan bg-accent-cyan/5 border border-accent-cyan/20 px-2 py-0.5 rounded">
                      {program.duration}
                    </span>
                    <span className="text-[10px] font-mono text-text-muted">Semesters 1–8</span>
                  </div>
                  <h3 className="text-lg font-bold text-secondary-white">{program.title}</h3>
                  <p className="text-xs text-text-muted leading-relaxed">{program.details}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Other Programs features */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-border-slate/40 pt-16">
            <div className="space-y-3">
              <Award className="w-8 h-8 text-accent-cyan" />
              <h4 className="text-sm font-bold text-secondary-white">Dual Verification</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                All certificates issued contain micro-hashed serials allowing immediate validation by external organizations or schools.
              </p>
            </div>
            <div className="space-y-3">
              <Users className="w-8 h-8 text-accent-cyan" />
              <h4 className="text-sm font-bold text-secondary-white">Maker Networks</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                Workshop participants gain membership to local SiksaTech community challenges and hackathons.
              </p>
            </div>
            <div className="space-y-3">
              <Cpu className="w-8 h-8 text-accent-cyan" />
              <h4 className="text-sm font-bold text-secondary-white">Custom Kits</h4>
              <p className="text-xs text-text-muted leading-relaxed">
                We design and supply components, breadboards, and custom micro-controllers mapped to each session.
              </p>
            </div>
          </div>

          {/* CTA Box */}
          <div className="p-8 rounded-lg border border-border-slate bg-navy-dark text-center space-y-6">
            <h3 className="text-lg font-bold">Conduct a workshop at your campus</h3>
            <p className="text-xs text-text-muted max-w-lg mx-auto leading-relaxed">
              Contact our program management team to customize syllabus objectives, coordinate dates, and align hardware kit logistics.
            </p>
            <div className="flex justify-center gap-4">
              <Link
                href="/enquiry/school"
                className="px-6 py-3 text-xs font-bold tracking-widest bg-accent-cyan hover:bg-accent-cyan-hover text-navy-dark rounded transition-technical"
              >
                SCHOOL PARTNERSHIPS
              </Link>
              <Link
                href="/enquiry/college"
                className="px-6 py-3 text-xs font-bold tracking-widest border border-border-slate hover:border-accent-cyan text-secondary-white rounded transition-technical"
              >
                COLLEGE ENQUIRIES
              </Link>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
