import { Navbar, Footer } from "@siksatech/ui";
import { Cpu, Compass, ShieldCheck, Heart, Award, Sparkles, BookOpen, Layers, Lightbulb, Users } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "About SiksaTech | India's Hands-On STEM Engineering Platform",
  description: "Learn about SiksaTech — our Sanskrit roots, Build-First educational philosophy, NEP 2020 alignment, and mission to foster practical technology creators.",
};

export default function About() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1">
        {/* Header Hero */}
        <section className="bg-white text-slate-900 py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-slate-200 shadow-xs">
          <div className="max-w-4xl mx-auto text-center space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-xs font-bold uppercase tracking-widest font-mono">
              Roots &bull; Philosophy &bull; Engineering Vision
            </span>
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight text-slate-900">
              Technology is Better Understood When You Build It
            </h1>
            <p className="text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
              SiksaTech bridges the gap between rote theoretical schooling and real-world engineering through physical prototyping, embedded electronics, and practical computer science.
            </p>
          </div>
        </section>

        {/* Brand Meaning & Cultural Foundation */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto space-y-16">
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-4">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">The Brand Ethos</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                What does &ldquo;Siksa&rdquo; mean?
              </h2>
              <p className="text-sm text-slate-700 leading-relaxed">
                In classical Sanskrit, <strong>Siksa (शिक्षा)</strong> represents the science of learning, instructional discipline, and the pursuit of foundational wisdom. Combined with <strong>Tech</strong>, it embodies our sacred promise: <em>Knowledge + Technology + Responsibility</em>.
              </p>
              <p className="text-sm text-slate-700 leading-relaxed">
                We believe engineering is not merely an economic trade; it is a civic duty to solve genuine physical problems—clean water, energy conservation, agriculture, and intelligent automation.
              </p>
            </div>

            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-200 space-y-4 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" /> Our 5 Core Pillars
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-700">
                <li className="flex items-start gap-2"><strong>1. Nobility:</strong> Respect for learners, educators, and the dignity of engineering labor.</li>
                <li className="flex items-start gap-2"><strong>2. Real Hardware:</strong> Physical breadboards, real ICs, and microcontrollers over screen simulations.</li>
                <li className="flex items-start gap-2"><strong>3. Verifiable Competence:</strong> Skills measured by working builds rather than multiple-choice exams.</li>
                <li className="flex items-start gap-2"><strong>4. Child Data Privacy:</strong> Complete architectural compliance with India&apos;s DPDP Act 2023.</li>
                <li className="flex items-start gap-2"><strong>5. NEP 2020 Alignment:</strong> Experiential learning, vocational skills, and cross-disciplinary inquiry.</li>
              </ul>
            </div>
          </div>

          {/* Educational Progression */}
          <div className="border-t border-slate-200 pt-14 space-y-8">
            <div className="text-center max-w-2xl mx-auto space-y-2">
              <span className="text-xs font-bold text-blue-600 uppercase tracking-wider">The 8-Stage Pathway</span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Our Experiential Learning Framework</h2>
              <p className="text-xs text-slate-600">Every SiksaTech lesson guides students through an authentic engineering loop:</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
              {[
                { stage: "01", name: "Discover", desc: "Identify real-world challenges & physics principles" },
                { stage: "02", name: "Understand", desc: "Deconstruct circuits & logic architecture" },
                { stage: "03", name: "Experiment", desc: "Test sensory inputs & breadboard wiring" },
                { stage: "04", name: "Build", desc: "Assemble working physical prototypes" },
                { stage: "05", name: "Test", desc: "Debug firmware loops & signal noise" },
                { stage: "06", name: "Improve", desc: "Optimize power consumption & CAD chassis" },
                { stage: "07", name: "Solve", desc: "Deploy in community or campus environments" },
                { stage: "08", name: "Innovate", desc: "Showcase in Maker Sprints & hackathons" }
              ].map((step, idx) => (
                <div key={idx} className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1">
                  <span className="text-xs font-mono font-bold text-blue-600">{step.stage}</span>
                  <h4 className="text-sm font-bold text-slate-900">{step.name}</h4>
                  <p className="text-[11px] text-slate-500 leading-snug">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
