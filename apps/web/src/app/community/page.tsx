import { Navbar, Footer } from "@siksatech/ui";
import { Users, Trophy, MessageSquare, Lightbulb, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Maker Community | SiksaTech",
  description: "Join the SiksaTech STEM maker community — engineering discussions, hardware challenges, and peer collaboration.",
};

export default function CommunityPage() {
  const challenges = [
    {
      title: "Solar IoT Irrigation Challenge",
      deadline: "Oct 30, 2026",
      participants: "42 Teams",
      badge: "Active Hackathon",
      desc: "Build a low-power wireless soil sensor node transmitting data to an open API."
    },
    {
      title: "Computer Vision Speed Sorter",
      deadline: "Nov 15, 2026",
      participants: "28 Teams",
      badge: "Robotics Sprint",
      desc: "Program an edge camera to detect and separate objects moving on a conveyor."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="bg-slate-900 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="inline-block px-3 py-1 bg-blue-900/60 border border-blue-700 text-blue-400 text-xs font-bold uppercase rounded-full">
              SiksaTech Maker Ecosystem
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
              A Community of Builders, Not Just Consumers
            </h1>
            <p className="text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Connect with fellow students, discuss circuit design, share firmware snippets, and build solutions for real-world challenges.
            </p>
          </div>
        </section>

        {/* Active Challenges */}
        <section className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-slate-900">Current Maker Challenges</h2>
              <p className="text-xs text-slate-500">Participate with your school team or build individually.</p>
            </div>
            <Link href="/programs" className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1">
              View All Programs <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {challenges.map((ch, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 hover:shadow-md transition-all">
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-1 bg-purple-50 text-purple-700 font-bold text-[10px] uppercase rounded-md border border-purple-100">
                    {ch.badge}
                  </span>
                  <span className="text-xs font-medium text-slate-500">Deadline: {ch.deadline}</span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{ch.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{ch.desc}</p>
                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-slate-500 flex items-center gap-1.5"><Users className="w-3.5 h-3.5 text-blue-600" /> {ch.participants}</span>
                  <Link href="/programs" className="font-bold text-blue-600 hover:underline">Register Team →</Link>
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
