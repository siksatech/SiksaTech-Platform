import { Navbar, Footer } from "@siksatech/ui";
import { Users, HeartHandshake, Sparkles, MessageSquare } from "lucide-react";

export const metadata = {
  title: "Community Guidelines | SiksaTech",
  description: "SiksaTech community ethos, peer review etiquette, and maker values.",
};

export default function CommunityGuidelinesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <HeartHandshake className="w-4 h-4" /> Maker Ethos & Collaboration
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Community Guidelines
          </h1>
          <p className="text-sm text-slate-500">
            Fostering Curiosity, Peer Learning, and Constructive Engineering Feedback
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. The SiksaTech Maker Spirit</h2>
            <p>
              Engineering is an iterative journey. Every circuit that fails, every bug that crashes, and every prototype that melts is an opportunity to learn. We treat all fellow learners with encouragement, patience, and respect.
            </p>
          </section>

          <section className="grid sm:grid-cols-2 gap-4 not-prose">
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" /> Constructive Feedback
              </h3>
              <p className="text-xs text-slate-600">
                When reviewing peer projects, celebrate what works and suggest concrete circuit or code improvements kindly.
              </p>
            </div>

            <div className="p-5 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-500" /> Inclusivity & Respect
              </h3>
              <p className="text-xs text-slate-600">
                Welcome builders of all backgrounds, whether they are writing their first line of block code or designing 4-layer PCBs.
              </p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
