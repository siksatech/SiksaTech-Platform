import { Navbar, Footer } from "@siksatech/ui";
import { Users, HeartHandshake, Sparkles, MessageSquare, ShieldCheck, Flag, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Community Guidelines & Maker Code | SiksaTech",
  description: "Peer review etiquette, open-source attribution, and safe maker collaboration rules across the SiksaTech community.",
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-200">
            <HeartHandshake className="w-4 h-4 text-emerald-600" /> SiksaTech Maker Culture Charter
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Community Guidelines &amp; Peer Etiquette
          </h1>
          <p className="text-xs text-slate-500">
            Document Version: 1.0 &bull; Fostering Constructive Engineering, Open-Source Attribution, and Safe Peer Learning
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. The SiksaTech Maker Spirit</h2>
            <p>
              The SiksaTech community connects Class 5 school students, college engineering innovators, teachers, and industry hardware mentors. We celebrate practical curiosity, shared knowledge, and honest debugging. We believe that true engineering excellence thrives in an atmosphere of mutual encouragement and intellectual humility.
            </p>
          </section>

          {/* Core Guidelines */}
          <section className="grid sm:grid-cols-2 gap-4 not-prose">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> 1. Constructive Code &amp; Circuit Reviews
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                When reviewing a peer&apos;s project, highlight what works well before suggesting improvements. Provide specific pinout corrections or code optimization tips rather than dismissive criticism.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-500" /> 2. Honest Open-Source Attribution
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If your build is inspired by an open-source Arduino library, GitHub repository, or YouTube tutorial, give full credit to the original creators in your project documentation.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-emerald-500" /> 3. Welcoming Novice Builders
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Remember that every expert was once a beginner struggling with their first LED blink sketch. Patiently answer questions from junior Class 5–7 Explorer students.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Flag className="w-4 h-4 text-red-500" /> 4. Proactive Content Moderation
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                If you encounter spam, plagiarized projects, or unsafe electrical advice, use the flag button or notify our moderation team immediately.
              </p>
            </div>
          </section>

          {/* Reporting Mechanism */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">2. Moderation &amp; Escalation Process</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Our moderation team reviews flagged submissions and discussion threads within 24 hours. For serious community disputes or child safety reports, visit our <Link href="/grievance" className="text-blue-600 underline font-semibold">Grievance Redressal Portal</Link>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
