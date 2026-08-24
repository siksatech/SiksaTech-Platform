import { Navbar, Footer } from "@siksatech/ui";
import { RotateCcw, Wrench, ShieldCheck, CheckCircle2, AlertTriangle, Cpu, Truck } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Returns & Hardware Component Replacements | SiksaTech Store",
  description: "Comprehensive hardware returns, Dead On Arrival (DOA) replacement warranty, and electronic diagnostic procedure for SiksaTech kits.",
};

export default function ReturnsReplacementsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-200">
            <RotateCcw className="w-4 h-4 text-emerald-600" /> 14-Day Free Component Replacement Warranty
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Hardware Returns &amp; Component Replacement Policy
          </h1>
          <p className="text-xs text-slate-500">
            Document Version: 1.0 &bull; Effective Date: August 1, 2026 &bull; Hassle-Free Prototyping Protection for Indian Learners
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-9 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Our Hardware Guarantee Philosophy</h2>
            <p>
              We understand that novice students experimenting with breadboards, jumping wires, and sensor terminals may occasionally encounter factory defects. Our policy is designed to eliminate friction so students can focus on building without worrying about non-working components.
            </p>
          </section>

          {/* Section 2: DOA Policy */}
          <section className="space-y-4 bg-emerald-50/70 p-6 sm:p-8 rounded-2xl border border-emerald-200">
            <h2 className="text-base font-bold text-emerald-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> 2. Dead On Arrival (DOA) 14-Day Free Replacement
            </h2>
            <p className="text-xs text-emerald-900 leading-relaxed">
              If any electronic sensor, microcontroller (Arduino Uno, ESP32, Raspberry Pi), OLED display, motor driver, or relay in your SiksaTech hardware kit fails to boot, flash, or respond to sample code within <strong>14 calendar days of delivery</strong>:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-emerald-900">
              <li><strong>Zero Replacement Cost:</strong> SiksaTech will ship a brand-new replacement component free of charge.</li>
              <li><strong>Zero Shipping Fees:</strong> Forward courier dispatch and return reverse pick-up (if needed) are 100% covered by SiksaTech.</li>
              <li><strong>No Need to Return Entire Kit:</strong> Only the specific defective component needs to be replaced; learners keep the rest of their kit to continue other lesson modules.</li>
            </ul>
          </section>

          {/* Section 3: Diagnostic Step-by-Step */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Wrench className="w-5 h-5 text-blue-600" /> 3. Step-by-Step Diagnostic &amp; Claim Process
            </h2>
            <div className="grid sm:grid-cols-3 gap-4 not-prose">
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-xs">1</span>
                <h3 className="text-xs font-bold text-slate-900">Test with Sample Sketch</h3>
                <p className="text-[11px] text-slate-600">Flash our verified diagnostic sketch from the course lesson to verify pinout configuration.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-xs">2</span>
                <h3 className="text-xs font-bold text-slate-900">Send Photo / Video</h3>
                <p className="text-[11px] text-slate-600">Email a short video/photo of your wiring setup and serial monitor output to support@siksatech.in.</p>
              </div>

              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold flex items-center justify-center text-xs">3</span>
                <h3 className="text-xs font-bold text-slate-900">Express Dispatch</h3>
                <p className="text-[11px] text-slate-600">Our hardware team validates the ticket within 12 hours and dispatches replacement parts via air express.</p>
              </div>
            </div>
          </section>

          {/* Section 4: Return of Complete Kits */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Complete Unopened Kit Returns (10-Day Window)</h2>
            <p>
              If an entire hardware kit is purchased and you wish to return it without opening, complete factory-sealed kits in original packaging may be returned within 10 days of delivery. Upon warehouse receipt and quality inspection, a full refund of the product purchase price (excluding outward courier cost) will be credited to your bank account within 5–7 business days under our <Link href="/refund-policy" className="text-blue-600 underline">Refund Policy</Link>.
            </p>
          </section>

          {/* Section 5: Exclusions */}
          <section className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-600" /> 5. Warranty Exclusions
            </h2>
            <p className="text-xs text-slate-600">
              The replacement warranty does not cover:
            </p>
            <ul className="list-disc pl-5 space-y-1 text-xs text-slate-600">
              <li>Physical breakage resulting from dropping boards onto hard surfaces or crushing.</li>
              <li>Damage caused by connecting microcontrollers directly to 230V AC mains electricity.</li>
              <li>Burnt copper traces caused by reverse polarity connections exceeding board ratings.</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
