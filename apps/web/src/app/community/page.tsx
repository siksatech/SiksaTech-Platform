import { Navbar, Footer } from "@siksatech/ui";
import {
  Users, Trophy, MessageSquare, Lightbulb, ArrowRight, Sparkles,
  BookOpen, Clock, Tag, User, ChevronRight, HelpCircle, Code2, Wrench
} from "lucide-react";
import Link from "next/link";
import { DEMO_BLOGS } from "@siksatech/database";

export const metadata = {
  title: "Maker Community & Tutorials | SiksaTech",
  description: "Join the SiksaTech STEM maker community — engineering discussions, hardware challenges, and peer collaboration.",
};

export default function CommunityPage() {
  const challenges = [
    {
      title: "Solar IoT Irrigation Challenge",
      deadline: "Oct 30, 2026",
      participants: "42 Teams",
      badge: "Active Hackathon",
      desc: "Build a low-power wireless soil sensor node transmitting data to an open telemetry API."
    },
    {
      title: "Computer Vision Speed Sorter",
      deadline: "Nov 15, 2026",
      participants: "28 Teams",
      badge: "Robotics Sprint",
      desc: "Program an edge camera to detect and separate objects moving on a conveyor track."
    }
  ];

  const forums = [
    {
      title: "ESP32 & Microcontroller Firmware",
      desc: "FreeRTOS tasks, Wi-Fi reconnection routines, ADC calibration, and pin configurations.",
      threadsCount: 142,
      icon: Code2
    },
    {
      title: "Circuit Schematics & Hardware Troubleshooting",
      desc: "Debouncing pushbuttons, decoupling power rails, and preventing voltage drops.",
      threadsCount: 98,
      icon: Wrench
    },
    {
      title: "Project Showcase & Peer Feedback",
      desc: "Share early breadboard prototypes and get architectural feedback from mentors.",
      threadsCount: 215,
      icon: Sparkles
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <Navbar />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="bg-slate-950 text-white py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-800">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="inline-block px-3 py-1 bg-blue-500/20 border border-blue-400/40 text-blue-400 text-xs font-mono font-bold uppercase rounded-full">
              SiksaTech Maker Ecosystem
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white">
              A Community of Builders, Not Just Consumers
            </h1>
            <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect with thousands of student engineers across India. Read deep-dive firmware tutorials, solve hardware bugs, and collaborate on challenges.
            </p>
          </div>
        </section>

        {/* Technical Tutorials & Engineering Blogs */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Engineering Tutorials &amp; Guides</h2>
              <p className="text-xs text-slate-500 mt-1">Deep-dive technical guides authored by SiksaTech systems architects.</p>
            </div>
            <span className="text-xs font-mono font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-200">
              {DEMO_BLOGS.length} Published Articles
            </span>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {DEMO_BLOGS.map((blog) => (
              <div
                key={blog.id}
                className="bg-white border border-slate-200 hover:border-blue-500 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-blue-600/5 transition-all flex flex-col justify-between space-y-6"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                      {blog.category}
                    </span>
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                      <Clock className="w-3.5 h-3.5" /> {blog.read_time_mins} min read
                    </span>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    {blog.excerpt}
                  </p>

                  <div className="flex flex-wrap gap-1.5 pt-2">
                    {blog.tags.map((tag, idx) => (
                      <span key={idx} className="text-[10px] font-mono font-bold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-xs">
                      {blog.author_name[0]}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{blog.author_name}</p>
                      <p className="text-[10px] text-slate-400">{blog.author_role}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Community Discussion Hubs */}
        <section className="py-14 bg-white border-y border-slate-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Technical Discussion Hubs</h2>
              <p className="text-xs text-slate-500 mt-1">Get fast answers to circuit errors, firmware compile bugs, and sensor noise.</p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {forums.map((f, idx) => {
                const Icon = f.icon;
                return (
                  <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all space-y-4">
                    <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-sm font-bold text-slate-900">{f.title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{f.desc}</p>
                    </div>
                    <div className="pt-2 text-[11px] font-mono text-slate-400">
                      {f.threadsCount} Active Threads
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Active Maker Challenges */}
        <section className="py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Active Maker Challenges</h2>
              <p className="text-xs text-slate-500 mt-1">Build real prototypes and compete for institution grants.</p>
            </div>
            <Link href="/build/submit" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              Submit a Build <ChevronRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((c, idx) => (
              <div key={idx} className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white border border-slate-800 shadow-xl flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-mono font-bold uppercase px-2.5 py-0.5 rounded bg-blue-600 text-white">
                      {c.badge}
                    </span>
                    <span className="text-xs font-mono text-slate-400">
                      Deadline: {c.deadline}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{c.title}</h3>
                  <p className="text-xs text-slate-300 leading-relaxed">{c.desc}</p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-800">
                  <span className="text-xs text-slate-400 flex items-center gap-1.5 font-mono">
                    <Users className="w-4 h-4 text-blue-400" /> {c.participants} Registered
                  </span>
                  <Link
                    href="/build/submit"
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-blue-900/30"
                  >
                    Enter Sprint &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
