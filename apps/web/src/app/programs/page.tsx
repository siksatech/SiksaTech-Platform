"use client";

import { useState } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import {
  Trophy, Calendar, CheckCircle2,
  Cpu, Award,
  Clock, Loader2, Video, Presentation, User
} from "lucide-react";
import {
  DEMO_PROGRAMS_LIST,
  DEMO_HACKATHON,
  registerCompetitionTeam,
  createBrowserClient,
  isRealSupabase,
  ProgramItem
} from "@siksatech/database";

export default function ProgramsPage() {
  const [selectedTab, setSelectedTab] = useState<"all" | "workshop" | "webinar" | "seminar" | "fellowship">("all");
  const [showRegModal, setShowRegModal] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<ProgramItem | null>(null);
  const [selectedPs, setSelectedPs] = useState("ps1");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [eventRegSuccess, setEventRegSuccess] = useState(false);

  // Hackathon Team Registration Form
  const [regForm, setRegForm] = useState({
    teamName: "",
    leaderName: "",
    leaderEmail: "",
    leaderPhone: "",
    institutionName: "",
    member2: "",
    member3: ""
  });

  // Individual Event Registration Form
  const [eventForm, setEventForm] = useState({
    participantName: "",
    participantEmail: "",
    participantPhone: "",
    gradeOrRole: "Class 9",
    institution: ""
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setRegForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleEventFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setEventForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleRegisterTeam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regForm.teamName || !regForm.leaderName || !regForm.leaderEmail || !regForm.leaderPhone) {
      alert("Please fill in all team leader details.");
      return;
    }

    setIsSubmitting(true);
    let supabase;
    let userId: string | null = null;

    if (isRealSupabase) {
      try {
        supabase = createBrowserClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (user) userId = user.id;
      } catch (err) {
        console.error("Auth context error:", err);
      }
    }

    const members = [{ name: regForm.leaderName, email: regForm.leaderEmail, role: "Team Leader" }];
    if (regForm.member2) members.push({ name: regForm.member2, email: "", role: "Hardware Specialist" });
    if (regForm.member3) members.push({ name: regForm.member3, email: "", role: "Firmware Developer" });

    const res = await registerCompetitionTeam(supabase, {
      competition_id: DEMO_HACKATHON.id,
      team_name: regForm.teamName,
      lead_user_id: userId,
      leader_name: regForm.leaderName,
      leader_email: regForm.leaderEmail,
      leader_phone: regForm.leaderPhone,
      institution_name: regForm.institutionName,
      team_members: members,
      problem_statement_id: selectedPs
    });

    if (res.success) {
      setRegSuccess(true);
    } else {
      alert("Registration failed: " + (res.error || "Please try again"));
    }
    setIsSubmitting(false);
  };

  const handleRegisterEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.participantName || !eventForm.participantEmail) {
      alert("Please enter your name and email address.");
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setEventRegSuccess(true);
    }, 600);
  };

  const filteredPrograms = selectedTab === "all"
    ? DEMO_PROGRAMS_LIST
    : DEMO_PROGRAMS_LIST.filter((p) => p.category === selectedTab);

  const getCategoryBadge = (cat: ProgramItem["category"]) => {
    switch (cat) {
      case "workshop":
        return { label: "Hands-on Workshop", color: "bg-purple-50 text-purple-700 border-purple-200", icon: Cpu };
      case "webinar":
        return { label: "Live Masterclass Webinar", color: "bg-blue-50 text-blue-700 border-blue-200", icon: Video };
      case "seminar":
        return { label: "Institutional Seminar", color: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: Presentation };
      case "fellowship":
      default:
        return { label: "Academic Fellowship", color: "bg-amber-50 text-amber-700 border-amber-200", icon: Award };
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/40 text-blue-400 text-xs font-mono font-bold uppercase rounded-full">
              Workshops • Webinars • Seminars • Hackathons
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              STEM Workshops, Live Webinars &amp; National Sprints
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Join hands-on maker events, live architecture webinars, institutional symposiums, and national engineering hackathons.
            </p>
          </div>
        </section>

        {/* National STEM Hackathon Spotlight Banner */}
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-slate-900 via-[#0A0F1D] to-blue-950 rounded-3xl p-8 sm:p-12 border border-blue-500/30 text-white shadow-2xl space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="space-y-3 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-blue-500 text-white font-mono text-xs font-bold uppercase rounded-md shadow">
                    Active National Hackathon
                  </span>
                  <span className="text-xs font-mono text-blue-300 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Deadline: Sept 25, 2026
                  </span>
                </div>
                <h2 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight">
                  {DEMO_HACKATHON.title}
                </h2>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                  {DEMO_HACKATHON.description}
                </p>
              </div>

              {/* Prize Pool Callout */}
              <div className="p-6 rounded-2xl bg-white/5 border border-white/10 text-center space-y-2 backdrop-blur-md shrink-0">
                <span className="text-[10px] font-mono text-slate-400 uppercase font-bold">Total Prize Pool</span>
                <div className="text-3xl font-extrabold font-mono text-blue-400">
                  ₹{DEMO_HACKATHON.prize_pool_inr.toLocaleString("en-IN")}
                </div>
                <button
                  onClick={() => setShowRegModal(true)}
                  className="w-full px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-lg shadow-blue-600/30 transition-all cursor-pointer"
                >
                  Register Team &rarr;
                </button>
              </div>
            </div>

            {/* Problem Statements Cards */}
            <div className="space-y-4 pt-6 border-t border-slate-800">
              <h3 className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                Select from 3 Official Hardware Problem Statements:
              </h3>
              <div className="grid md:grid-cols-3 gap-4">
                {DEMO_HACKATHON.problem_statements.map((ps) => (
                  <div
                    key={ps.id}
                    onClick={() => {
                      setSelectedPs(ps.id);
                      setShowRegModal(true);
                    }}
                    className="p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-blue-500 cursor-pointer transition-all space-y-2"
                  >
                    <span className="text-[10px] font-mono text-blue-400 font-bold uppercase">Challenge {ps.id.toUpperCase()}</span>
                    <h4 className="text-sm font-bold text-white">{ps.title}</h4>
                    <p className="text-xs text-slate-400 leading-relaxed">{ps.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Category Tabs & Event Catalog */}
        <section className="py-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Upcoming Events &amp; Cohorts</h2>
              <p className="text-xs text-slate-500 mt-1">Discover workshops, live webinars, faculty symposiums, and masterclasses.</p>
            </div>

            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/70 rounded-xl overflow-x-auto text-xs font-semibold">
              {[
                { id: "all", label: "All Events" },
                { id: "workshop", label: "Workshops" },
                { id: "webinar", label: "Webinars" },
                { id: "seminar", label: "Seminars" },
                { id: "fellowship", label: "Fellowships" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id as any)}
                  className={`px-3.5 py-1.5 rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                    selectedTab === tab.id
                      ? "bg-white text-slate-900 shadow-sm font-bold"
                      : "text-slate-600 hover:text-slate-900"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrograms.map((prog) => {
              const badge = getCategoryBadge(prog.category);
              const BadgeIcon = badge.icon;
              return (
                <div
                  key={prog.id}
                  className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-blue-400 transition-all flex flex-col justify-between space-y-6"
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className={`inline-flex items-center gap-1.5 text-[10px] font-mono font-bold uppercase px-2.5 py-1 rounded-md border ${badge.color}`}>
                        <BadgeIcon className="w-3.5 h-3.5" />
                        {badge.label}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400 flex items-center gap-1 shrink-0">
                        <Clock className="w-3 h-3" /> {prog.duration}
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">{prog.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">{prog.subtitle}</p>

                    {prog.schedule && (
                      <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 text-[11px] font-mono text-slate-700 flex items-center gap-2">
                        <Calendar className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                        <span>{prog.schedule}</span>
                      </div>
                    )}

                    {prog.instructor && (
                      <p className="text-[11px] text-slate-500 flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5 text-slate-400" />
                        <span>Mentor: <strong className="text-slate-700">{prog.instructor}</strong></span>
                      </p>
                    )}

                    {/* Highlights */}
                    <div className="space-y-1.5 pt-1">
                      <h4 className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400">Key Highlights:</h4>
                      {prog.curriculum_highlights.slice(0, 3).map((item, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-xs text-slate-600">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                          <span className="line-clamp-1">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100">
                    <button
                      onClick={() => {
                        setSelectedEvent(prog);
                        setShowEventModal(true);
                        setEventRegSuccess(false);
                      }}
                      className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all text-center block cursor-pointer shadow-md shadow-blue-600/10"
                    >
                      Register for Event &rarr;
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Event Registration Modal */}
        {showEventModal && selectedEvent && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-md w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600">{selectedEvent.category.toUpperCase()} REGISTRATION</span>
                  <h3 className="text-lg font-bold text-slate-900 mt-0.5">{selectedEvent.title}</h3>
                </div>
                <button
                  onClick={() => setShowEventModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {eventRegSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Registration Confirmed!</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    We&apos;ve sent the calendar invite and joining details to <strong>{eventForm.participantEmail}</strong>.
                  </p>
                  <button
                    onClick={() => setShowEventModal(false)}
                    className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterEvent} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      name="participantName"
                      required
                      placeholder="e.g. Ananya Sharma"
                      value={eventForm.participantName}
                      onChange={handleEventFormChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="participantEmail"
                      required
                      placeholder="e.g. ananya@school.edu.in"
                      value={eventForm.participantEmail}
                      onChange={handleEventFormChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        name="participantPhone"
                        placeholder="+91 98765 43210"
                        value={eventForm.participantPhone}
                        onChange={handleEventFormChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                        Grade / Year
                      </label>
                      <select
                        name="gradeOrRole"
                        value={eventForm.gradeOrRole}
                        onChange={handleEventFormChange}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600 bg-white"
                      >
                        <option value="Class 5-7">Class 5–7</option>
                        <option value="Class 8-10">Class 8–10</option>
                        <option value="Class 11-12">Class 11–12</option>
                        <option value="College">College / Grad</option>
                        <option value="Educator">Educator / Coordinator</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                      School / College Name
                    </label>
                    <input
                      type="text"
                      name="institution"
                      placeholder="e.g. Modern High School / IIT Delhi"
                      value={eventForm.institution}
                      onChange={handleEventFormChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> REGISTERING...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-4 h-4" /> CONFIRM REGISTRATION
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Hackathon Team Registration Modal */}
        {showRegModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600">National Hackathon 2026</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">Register Innovation Team</h3>
                </div>
                <button
                  onClick={() => {
                    setShowRegModal(false);
                    setRegSuccess(false);
                  }}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {regSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Team Successfully Registered!</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Check <strong>{regForm.leaderEmail}</strong> for problem statement rubric and submission portal access.
                  </p>
                  <button
                    onClick={() => {
                      setShowRegModal(false);
                      setRegSuccess(false);
                    }}
                    className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              ) : (
                <form onSubmit={handleRegisterTeam} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                      Team Name *
                    </label>
                    <input
                      type="text"
                      name="teamName"
                      required
                      placeholder="e.g. Delta Circuit Makers"
                      value={regForm.teamName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                        Leader Full Name *
                      </label>
                      <input
                        type="text"
                        name="leaderName"
                        required
                        placeholder="e.g. Siddharth Verma"
                        value={regForm.leaderName}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                        Leader Phone *
                      </label>
                      <input
                        type="tel"
                        name="leaderPhone"
                        required
                        placeholder="e.g. +91 98765 43210"
                        value={regForm.leaderPhone}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                      Leader Email Address *
                    </label>
                    <input
                      type="email"
                      name="leaderEmail"
                      required
                      placeholder="e.g. leader@school.edu.in"
                      value={regForm.leaderEmail}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                      School / College Name *
                    </label>
                    <input
                      type="text"
                      name="institutionName"
                      required
                      placeholder="e.g. DPS Vasant Kunj / VIT Vellore"
                      value={regForm.institutionName}
                      onChange={handleChange}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Team Member 2 (Optional)</label>
                      <input
                        type="text"
                        name="member2"
                        placeholder="Member 2 Name"
                        value={regForm.member2}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-slate-500">Team Member 3 (Optional)</label>
                      <input
                        type="text"
                        name="member3"
                        placeholder="Member 3 Name"
                        value={regForm.member3}
                        onChange={handleChange}
                        className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" /> REGISTERING TEAM...
                      </>
                    ) : (
                      <>
                        <Trophy className="w-4 h-4" /> CONFIRM TEAM REGISTRATION
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
