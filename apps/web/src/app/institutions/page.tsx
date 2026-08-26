"use client";

import { useState } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import {
  submitInstitutionInquiry,
  createBrowserClient,
  isRealSupabase,
  db
} from "@siksatech/database";
import {
  Building2, CheckCircle2, FlaskConical, Users, Trophy, Shield,
  ArrowRight, Phone, Mail, Send, Sparkles, Clock, Check, Download,
  Layers, School, Award, ChevronRight
} from "lucide-react";

export default function InstitutionsPage() {
  const [formData, setFormData] = useState({
    institutionName: "",
    contactPerson: "",
    email: "",
    phone: "",
    city: "",
    type: "k12_school" as "k12_school" | "college" | "university" | "polytechnic" | "tinkering_lab",
    studentCount: 300,
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const supabase = isRealSupabase ? createBrowserClient() : undefined;

    await submitInstitutionInquiry(supabase, {
      institution_name: formData.institutionName,
      institution_type: formData.type,
      city: formData.city,
      state: "India",
      contact_name: formData.contactPerson,
      contact_email: formData.email,
      contact_phone: formData.phone,
      student_count: Number(formData.studentCount) || 200,
      target_programs: ["Maker Lab", "Hardware Kits", "Teacher Pedagogy Training"],
      message: formData.message
    });

    setSubmitted(true);
    setLoading(false);
  };

  const labTiers = [
    {
      name: "Starter Maker Nook",
      target: "Primary & Middle Schools (Class 5–8)",
      kitCount: "15 Shared Prototyping Stations",
      highlights: ["Breadboards & Circuit Blocks", "Block Coding & Sensor Kits", "Teacher Pedagogy Training (10 Hrs)", "NEP 2020 Experiential Mapping"],
      badge: "Fastest Setup"
    },
    {
      name: "Flagship STEM Innovation Lab",
      target: "K-12 Schools (Class 5–12)",
      kitCount: "30 Dedicated Hardware Stations",
      highlights: ["Arduino + ESP32 IoT Nodes", "3D Printing & Soldering Station", "Faculty Certification & LMS", "Annual Inter-School Hackathon"],
      badge: "Most Popular",
      popular: true
    },
    {
      name: "Advanced Robotics & AI Center",
      target: "Engineering Colleges & Polytechnic",
      kitCount: "50 Pro Hardware Workstations",
      highlights: ["Computer Vision & ROS Robots", "Edge AI Accelerators & Drones", "Industry Capstone Mentorship", "Placement Portfolio & Patents"],
      badge: "Higher Ed"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* Business Hero */}
        <section className="bg-[#0A0F1D] text-white py-16 sm:py-24 border-b border-slate-800 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px] opacity-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid lg:grid-cols-12 gap-12 items-center">
              <div className="lg:col-span-7 space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/40 text-blue-400 text-xs font-mono font-bold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5" /> Turnkey STEM &amp; Tinkering Infrastructure
                </div>
                <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
                  Turn Your Campus Into a Regional Innovation Hub
                </h1>
                <p className="text-sm sm:text-base text-slate-300 max-w-xl leading-relaxed">
                  Equip your school or college with turnkey hardware labs, NEP 2020 aligned experiential curricula, faculty upskilling, and verifiable student maker portfolios.
                </p>

                <div className="grid grid-cols-3 gap-4 pt-2">
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
                    <p className="text-lg sm:text-2xl font-extrabold text-blue-400">100%</p>
                    <p className="text-[11px] text-slate-400">NEP 2020 Aligned</p>
                  </div>
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
                    <p className="text-lg sm:text-2xl font-extrabold text-white">48 Hrs</p>
                    <p className="text-[11px] text-slate-400">Proposal SLA</p>
                  </div>
                  <div className="p-3 bg-slate-900/90 border border-slate-800 rounded-xl">
                    <p className="text-lg sm:text-2xl font-extrabold text-emerald-400">Turnkey</p>
                    <p className="text-[11px] text-slate-400">Kits + Teacher Training</p>
                  </div>
                </div>
              </div>

              {/* Lead Capture Box */}
              <div className="lg:col-span-5 bg-white text-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-2xl space-y-4">
                {submitted ? (
                  <div className="text-center py-8 space-y-3">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h3 className="text-lg font-bold text-slate-900">Institutional Inquiry Received</h3>
                    <p className="text-xs text-slate-600">
                      Our Academic Partnership Director will send a tailored lab blueprint and budget proposal to your email within 24 business hours.
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-3.5">
                    <div className="border-b border-slate-100 pb-2">
                      <h3 className="text-base font-bold text-slate-900">Request Institutional Proposal</h3>
                      <p className="text-xs text-slate-500">Includes complete lab equipment list, sample syllabus, and budget estimates.</p>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-700 mb-1">School / College Name</label>
                      <input
                        type="text"
                        required
                        value={formData.institutionName}
                        onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                        placeholder="e.g. St. Xavier's Senior Secondary"
                        className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Contact Person</label>
                        <input
                          type="text"
                          required
                          value={formData.contactPerson}
                          onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                          placeholder="Principal / HOD"
                          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Phone Number</label>
                        <input
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          placeholder="+91 98765 43210"
                          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          placeholder="admin@school.edu.in"
                          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-slate-700 mb-1">Institution Type</label>
                        <select
                          value={formData.type}
                          onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                          className="w-full px-3.5 py-2 border border-slate-300 rounded-lg text-xs outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                        >
                          <option value="k12_school">K-12 School (CBSE/ICSE/State)</option>
                          <option value="college">Engineering / Science College</option>
                          <option value="university">University / Campus</option>
                          <option value="tinkering_lab">Atal Tinkering Lab / STEM Lab</option>
                        </select>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                    >
                      <Send className="w-3.5 h-3.5" /> {loading ? "Generating Proposal..." : "Get Free Lab Blueprint & Quotation"}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Turnkey Lab Blueprints */}
        <section className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-[11px] font-mono font-bold tracking-widest text-blue-600 uppercase">
              Modular Lab Packages
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
              Choose the Right STEM Lab Setup for Your Students
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Each package includes hardware stations, teacher lesson plans, safety compliance, and annual competition access.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {labTiers.map((tier, idx) => (
              <div
                key={idx}
                className={`bg-white rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6 transition-all ${
                  tier.popular
                    ? "border-2 border-blue-600 shadow-xl shadow-blue-600/10 relative"
                    : "border border-slate-200 shadow-sm hover:shadow-md"
                }`}
              >
                {tier.popular && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-blue-600 text-white font-mono text-[10px] font-bold uppercase rounded-full tracking-wider shadow">
                    Most Recommended
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <span className="font-mono text-[10px] font-bold px-2 py-0.5 bg-slate-100 text-slate-700 rounded uppercase">
                      {tier.badge}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900 mt-2">{tier.name}</h3>
                    <p className="text-xs text-slate-500">{tier.target}</p>
                  </div>

                  <p className="text-xs font-bold text-blue-600 pb-2 border-b border-slate-100">
                    {tier.kitCount}
                  </p>

                  <ul className="space-y-2 text-xs text-slate-700">
                    {tier.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href="#contact"
                  className={`block text-center py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                    tier.popular
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-800"
                  }`}
                >
                  Request Blueprint &rarr;
                </a>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
