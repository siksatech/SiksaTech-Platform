"use client";

import { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Link from "next/link";
import { db } from "@/lib/db";
import {
  ArrowRight, CheckCircle2, FlaskConical, Users, Trophy, Shield,
  Globe, Zap, Building2, BookOpen, GraduationCap, Brain,
  MessageSquare, Phone, Mail, Send
} from "lucide-react";

export default function InstitutionsPage() {
  const [formData, setFormData] = useState({
    institutionName: "",
    contactPerson: "",
    email: "",
    phone: "",
    type: "school",
    message: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await db.submitLead(
      formData.type === "school" ? "school" : "college",
      formData.contactPerson,
      formData.email,
      formData.phone,
      {
        institutionName: formData.institutionName,
        type: formData.type,
        message: formData.message,
      }
    );
    setSubmitted(true);
    setLoading(false);
  };

  return (
    <>
      <Navbar />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl">
              <span className="inline-block text-xs font-bold tracking-widest text-emerald-300 uppercase mb-4">
                For Schools & Colleges
              </span>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight mb-5">
                Equip your institution with future-ready STEM infrastructure
              </h1>
              <p className="text-base text-emerald-200/80 leading-relaxed mb-8 max-w-2xl">
                India&apos;s NEP 2020 mandates experiential, skills-based learning. But most schools lack
                the labs, curriculum, and trained faculty to deliver it. SiksaTech bridges this gap
                with turnkey STEM lab setups, structured project-based courses, and comprehensive teacher training.
              </p>
              <a
                href="#inquiry"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-emerald-800 font-bold text-sm rounded-lg hover:bg-emerald-50 transition-all shadow-lg"
              >
                Request a Partnership
                <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Why This Matters */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-14">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-5">
                Why practical STEM matters for your students
              </h2>
              <p className="text-base text-slate-600 leading-relaxed">
                Research consistently shows that students who engage in hands-on, project-based learning
                demonstrate significantly higher retention, deeper understanding, and stronger critical
                thinking skills compared to lecture-only methods.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  stat: "85%",
                  label: "Higher retention through experiential learning vs. lecture-based methods",
                  source: "National Training Laboratories",
                },
                {
                  stat: "3×",
                  label: "Improvement in problem-solving ability in STEM-active students",
                  source: "CBSE Academic Report 2024",
                },
                {
                  stat: "70%",
                  label: "Of future jobs will require STEM literacy that current curricula don't address",
                  source: "World Economic Forum",
                },
              ].map((item, idx) => (
                <div key={idx} className="text-center p-6 rounded-xl bg-slate-50 border border-slate-200">
                  <p className="text-4xl font-extrabold text-emerald-600 mb-2">{item.stat}</p>
                  <p className="text-sm text-slate-700 font-medium mb-2">{item.label}</p>
                  <p className="text-[11px] text-slate-400 italic">— {item.source}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Offer */}
        <section className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-4">
                What your institution gets
              </h2>
              <p className="text-base text-slate-600">
                End-to-end partnership — from lab infrastructure to student outcomes.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                {
                  icon: FlaskConical,
                  title: "Complete Lab Setup",
                  desc: "Workstations, hardware kits, tools, safety equipment, and organized storage — installed and configured by our team.",
                },
                {
                  icon: BookOpen,
                  title: "Structured Curriculum",
                  desc: "Age-appropriate, project-based courses aligned with CBSE/ICSE syllabi and NEP 2020 competencies.",
                },
                {
                  icon: Users,
                  title: "Teacher Training",
                  desc: "Intensive 2-day faculty workshops covering STEM pedagogy, hardware handling, and guided project mentorship techniques.",
                },
                {
                  icon: Trophy,
                  title: "Events & Competitions",
                  desc: "Inter-school hackathons, maker fairs, and science exhibitions organized at your campus or regionally.",
                },
                {
                  icon: GraduationCap,
                  title: "Student Certifications",
                  desc: "Verifiable digital certificates for students who complete project tracks — valuable for college applications.",
                },
                {
                  icon: Brain,
                  title: "Ongoing Support",
                  desc: "Dedicated account manager, quarterly curriculum updates, and helpdesk support for hardware troubleshooting.",
                },
              ].map((item, idx) => (
                <div key={idx} className="bg-white rounded-xl p-6 border border-slate-200 hover:shadow-md hover:border-emerald-200 transition-all group">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <item.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-16 lg:py-24 bg-white">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-extrabold text-slate-900 text-center mb-14">
              How the partnership works
            </h2>

            <div className="space-y-8">
              {[
                {
                  step: "01",
                  title: "Inquiry & Assessment",
                  desc: "Submit your interest. Our team evaluates your existing infrastructure, student demographics, and learning goals.",
                },
                {
                  step: "02",
                  title: "Custom Program Design",
                  desc: "We design a tailored STEM curriculum matching your board affiliation, available space, and budget requirements.",
                },
                {
                  step: "03",
                  title: "Lab Installation & Training",
                  desc: "Our engineers set up the lab hardware and conduct a hands-on faculty training workshop at your campus.",
                },
                {
                  step: "04",
                  title: "Launch & Ongoing Support",
                  desc: "Students begin guided project work. We provide ongoing mentorship, quarterly reviews, and curriculum updates.",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex gap-5">
                  <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
                    <span className="text-lg font-extrabold text-emerald-700">{item.step}</span>
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-slate-900 mb-1">{item.title}</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Inquiry Form */}
        <section id="inquiry" className="py-16 lg:py-24 bg-slate-50">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <h2 className="text-3xl font-extrabold text-slate-900 mb-3">
                Start a conversation
              </h2>
              <p className="text-base text-slate-600">
                Tell us about your institution and we&apos;ll get back within 48 hours.
              </p>
            </div>

            {submitted ? (
              <div className="bg-white rounded-2xl border border-emerald-200 p-8 text-center">
                <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">Thank you!</h3>
                <p className="text-sm text-slate-600">
                  We&apos;ve received your inquiry. Our partnerships team will reach out within 48 hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Institution Name</label>
                    <input
                      type="text"
                      required
                      value={formData.institutionName}
                      onChange={(e) => setFormData({ ...formData, institutionName: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Delhi Public School"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Contact Person</label>
                    <input
                      type="text"
                      required
                      value={formData.contactPerson}
                      onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="Dr. Arun Sharma"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="principal@school.edu"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1.5">Phone</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Institution Type</label>
                  <div className="flex gap-3">
                    {["school", "college"].map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type })}
                        className={`flex-1 py-2.5 rounded-lg text-sm font-semibold border-2 transition-all ${
                          formData.type === type
                            ? "border-emerald-500 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 text-slate-500 hover:border-slate-300"
                        }`}
                      >
                        {type === "school" ? "School (K–12)" : "College / University"}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">Message (Optional)</label>
                  <textarea
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-lg border border-slate-300 text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all resize-none"
                    placeholder="Tell us about your current STEM infrastructure, number of students, etc."
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/20"
                >
                  {loading ? "Sending..." : "Submit Inquiry"}
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
