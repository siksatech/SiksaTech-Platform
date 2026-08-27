"use client";

import { useState } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import {
  Users, Trophy, MessageSquare, Lightbulb, ArrowRight, Sparkles,
  BookOpen, Clock, Tag, User, ChevronRight, HelpCircle, Code2, Wrench,
  Plus, CheckCircle2, ThumbsUp, MessageCircle
} from "lucide-react";
import Link from "next/link";
import { DEMO_BLOGS } from "@siksatech/database";

interface DiscussionThread {
  id: string;
  category: string;
  title: string;
  author: string;
  authorGrade: string;
  content: string;
  repliesCount: number;
  upvotes: number;
  timeAgo: string;
}

const INITIAL_THREADS: DiscussionThread[] = [
  {
    id: "thread-1",
    category: "ESP32 Firmware",
    title: "How to prevent WiFi dropouts on ESP32 deep sleep wake cycles?",
    author: "Rohan K.",
    authorGrade: "Class 11 (Creator)",
    content: "When waking from deep sleep, my ESP32 occasionally fails to reconnect to the router without a full hardware reset. Any recommended retry loop backoff?",
    repliesCount: 6,
    upvotes: 14,
    timeAgo: "2 hours ago"
  },
  {
    id: "thread-2",
    category: "Sensors & Circuits",
    title: "Calibrating capacitive soil moisture sensor in saline water",
    author: "Sneha Patel",
    authorGrade: "Class 9 (Builder)",
    content: "Standard analog readings shift significantly when testing fertilized soil vs tap water. How do you normalize the ADC voltage levels?",
    repliesCount: 4,
    upvotes: 9,
    timeAgo: "5 hours ago"
  },
  {
    id: "thread-3",
    category: "Computer Vision",
    title: "OpenCV Haar cascade vs MobileNet SSD latency on Raspberry Pi 4",
    author: "Arjun N.",
    authorGrade: "College (Engineer)",
    content: "Benchmarked both on a 720p 30fps webcam feed. MobileNet SSD runs at ~12 FPS with quantized tflite models. Here are my memory profiling graphs.",
    repliesCount: 11,
    upvotes: 23,
    timeAgo: "1 day ago"
  }
];

export default function CommunityPage() {
  const [threads, setThreads] = useState<DiscussionThread[]>(INITIAL_THREADS);
  const [showPostModal, setShowPostModal] = useState(false);
  const [postSuccess, setPostSuccess] = useState(false);

  const [newPost, setNewPost] = useState({
    title: "",
    category: "ESP32 Firmware",
    author: "",
    authorGrade: "Class 9 (Builder)",
    content: ""
  });

  const handlePostSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.title || !newPost.content || !newPost.author) {
      alert("Please fill in the title, your name, and question description.");
      return;
    }

    const created: DiscussionThread = {
      id: `thread-${Date.now()}`,
      category: newPost.category,
      title: newPost.title,
      author: newPost.author,
      authorGrade: newPost.authorGrade,
      content: newPost.content,
      repliesCount: 0,
      upvotes: 1,
      timeAgo: "Just now"
    };

    setThreads([created, ...threads]);
    setPostSuccess(true);
  };

  const handleUpvote = (id: string) => {
    setThreads(threads.map((t) => (t.id === id ? { ...t, upvotes: t.upvotes + 1 } : t)));
  };

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

        {/* Live Q&A and Discussions Hub */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Live STEM Q&amp;A &amp; Discussions</h2>
              <p className="text-xs text-slate-500 mt-1">Ask questions, share breadboard schematics, and troubleshoot firmware with peers.</p>
            </div>
            <button
              onClick={() => {
                setShowPostModal(true);
                setPostSuccess(false);
              }}
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer shrink-0"
            >
              <Plus className="w-4 h-4" /> Start Discussion
            </button>
          </div>

          {/* Threads List */}
          <div className="space-y-4">
            {threads.map((thread) => (
              <div
                key={thread.id}
                className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm hover:border-blue-400 transition-all space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-mono font-bold uppercase text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full">
                        {thread.category}
                      </span>
                      <span className="text-[11px] font-mono text-slate-400">{thread.timeAgo}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{thread.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{thread.content}</p>
                  </div>
                  <button
                    onClick={() => handleUpvote(thread.id)}
                    className="flex flex-col items-center justify-center px-3 py-2 rounded-xl bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-600 transition-all cursor-pointer shrink-0"
                  >
                    <ThumbsUp className="w-4 h-4" />
                    <span className="text-xs font-bold font-mono mt-1">{thread.upvotes}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-[10px]">
                      {thread.author[0]}
                    </div>
                    <span className="font-semibold text-slate-800">{thread.author}</span>
                    <span className="text-slate-400 text-[11px]">• {thread.authorGrade}</span>
                  </div>

                  <div className="flex items-center gap-1 font-mono text-[11px] text-slate-500">
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{thread.repliesCount} replies</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Technical Tutorials & Engineering Blogs */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 border-t border-slate-200">
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

        {/* Start Discussion Modal */}
        {showPostModal && (
          <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-6 relative max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono font-bold uppercase text-blue-600">COMMUNITY FORUM</span>
                  <h3 className="text-xl font-bold text-slate-900 mt-1">Start a New Discussion</h3>
                </div>
                <button
                  onClick={() => setShowPostModal(false)}
                  className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1 cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {postSuccess ? (
                <div className="text-center py-6 space-y-4">
                  <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900">Discussion Posted!</h4>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Your question is now live in the community forum. You will be notified when members reply.
                  </p>
                  <button
                    onClick={() => setShowPostModal(false)}
                    className="px-6 py-2.5 bg-blue-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-md cursor-pointer"
                  >
                    View Discussion
                  </button>
                </div>
              ) : (
                <form onSubmit={handlePostSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                      Topic Title *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. How to read analog values from ultrasonic sensor on Arduino?"
                      value={newPost.title}
                      onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                        Category
                      </label>
                      <select
                        value={newPost.category}
                        onChange={(e) => setNewPost({ ...newPost, category: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600 bg-white"
                      >
                        <option value="ESP32 Firmware">ESP32 Firmware</option>
                        <option value="Sensors & Circuits">Sensors &amp; Circuits</option>
                        <option value="Computer Vision">Computer Vision</option>
                        <option value="Robotics & Drones">Robotics &amp; Drones</option>
                        <option value="3D Design & CAD">3D Design &amp; CAD</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Neha Sharma"
                        value={newPost.author}
                        onChange={(e) => setNewPost({ ...newPost, author: e.target.value })}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-extrabold uppercase tracking-wider text-slate-700">
                      Problem Details / Code / Question *
                    </label>
                    <textarea
                      required
                      rows={4}
                      placeholder="Describe what you are trying to build, what error you are seeing, and what you have already tried..."
                      value={newPost.content}
                      onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer mt-4"
                  >
                    <Plus className="w-4 h-4" /> POST TO COMMUNITY
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
