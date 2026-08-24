import { Navbar, Footer } from "@siksatech/ui";
import { RotateCcw, Wrench, ShieldCheck, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Returns & Replacements | SiksaTech",
  description: "SiksaTech hardware component replacement, DOA warranty, and return procedures.",
};

export default function ReturnsReplacementsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <RotateCcw className="w-4 h-4" /> Component Warranty
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Returns & Hardware Replacement
          </h1>
          <p className="text-sm text-slate-500">
            Hassle-free replacement for defective sensors, microcontrollers, and electronic components.
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Dead on Arrival (DOA) Warranty</h2>
            <p>
              Every electronic component in our STEM kits undergoes quality testing. If any sensor, board (Arduino/ESP32), motor, or display is non-functional upon arrival, we ship an immediate free replacement part within 14 days of delivery.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. How to Claim a Component Replacement</h2>
            <p>
              Email <a href="mailto:support@siksatech.in" className="text-blue-600 underline">support@siksatech.in</a> with a short video or photo of your wiring setup demonstrating the issue. Our hardware engineering team will diagnose the issue and dispatch replacement parts immediately.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
