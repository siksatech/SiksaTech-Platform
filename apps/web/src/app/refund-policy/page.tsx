import { Navbar, Footer } from "@siksatech/ui";
import { RefreshCw, CheckCircle2, AlertCircle, Clock, ShieldCheck, HelpCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Refund & Cancellation Policy | SiksaTech (Consumer Protection Aligned)",
  description: "Transparent refund, batch transfer, course cancellation, and hardware return policies in strict compliance with the Consumer Protection Act, 2019.",
};

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-amber-200">
            <RefreshCw className="w-4 h-4 text-amber-600" /> Consumer Protection (E-Commerce) Rules, 2020 Aligned
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Refund, Cancellation &amp; Transfer Policy
          </h1>
          <p className="text-xs text-slate-500">
            Document Version: 1.0 &bull; Transparent Educational Commercial Terms &bull; Zero Dark Patterns Policy
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Commitment to Fair Commercial Practices</h2>
            <p>
              In strict adherence to the <em>Consumer Protection Act, 2019</em> and the guidelines against misleading advertisements and dark patterns issued by the Central Consumer Protection Authority (CCPA), SiksaTech maintains transparent, upfront commercial policies without hidden deduction penalties or automatic recurring lock-ins.
            </p>
          </section>

          {/* Online Courses Matrix */}
          <section className="space-y-4 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-600" /> 2. Online Courses &amp; Cohort Mentorship Programs
            </h2>
            <div className="overflow-x-auto not-prose">
              <table className="min-w-full text-xs text-left border border-slate-200 rounded-lg bg-white">
                <thead className="bg-slate-100 text-slate-900 font-bold">
                  <tr>
                    <th className="p-3 border-b">Cancellation Window</th>
                    <th className="p-3 border-b">Eligibility Condition</th>
                    <th className="p-3 border-b">Refund Entitlement</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-semibold">Within 7 Days of Purchase</td>
                    <td className="p-3">Less than 25% course modules accessed; no certificate issued</td>
                    <td className="p-3 font-bold text-emerald-700">100% Full Refund (Zero deduction)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Day 8 to Day 14</td>
                    <td className="p-3">Less than 50% course modules accessed</td>
                    <td className="p-3 text-slate-700">50% Pro-Rata Refund or 100% Free Batch Transfer</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">After 14 Days / &gt;50% Course Complete</td>
                    <td className="p-3">Course substantially consumed or completed</td>
                    <td className="p-3 text-slate-500">Non-refundable (Lifetime archive access preserved)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Hardware Prototyping Kits */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Hardware Kits &amp; Physical Electronics Store</h2>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
              <li><strong>Dead On Arrival (DOA) / Defective Parts:</strong> Any sensor, board, or component found non-functional within 14 days of delivery will be replaced immediately at 100% zero cost to the student, including return courier charges.</li>
              <li><strong>Unopened Kit Returns:</strong> If you change your mind, complete unopened kits in factory-sealed condition may be returned within 10 days of delivery for a refund (less actual third-party courier shipping fee).</li>
              <li><strong>Missing Component Claims:</strong> Claims for missing items in a kit must be notified via photo/video within 48 hours of package unboxing.</li>
            </ul>
          </section>

          {/* School & Institutional Agreements */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Institutional STEM Lab Contracts</h2>
            <p>
              Turnkey STEM innovation lab installations, educator training cohorts, and institutional school licensing are executed under formal Master Service Agreements (MSAs). Milestone payment schedules, acceptance testing criteria, and institutional warranties are governed exclusively by the specific executed contract.
            </p>
          </section>

          {/* Refund Processing Timeline */}
          <section className="space-y-3 bg-blue-50/70 p-6 rounded-2xl border border-blue-200">
            <h2 className="text-base font-bold text-blue-950 flex items-center gap-2">
              <ShieldCheck className="w-5 h-5 text-blue-600" /> 5. Payment Gateway &amp; Refund Processing SLA
            </h2>
            <p className="text-xs text-blue-900 leading-relaxed">
              Once an eligible cancellation is approved by our billing team:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-blue-900">
              <li><strong>Approval Time:</strong> Within 24–48 business hours of ticket submission.</li>
              <li><strong>Gateway Crediting:</strong> Electronic funds reversal is initiated via our RBI-authorized payment gateway partner (Razorpay / UPI / NetBanking / Cards).</li>
              <li><strong>Bank Settlement:</strong> Funds will reflect in your original funding account within 5 to 7 banking business days, depending on your card issuer or bank.</li>
            </ul>
          </section>

          {/* Contact CTA */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">6. How to Request Cancellation or Batch Transfer</h2>
            <p className="text-xs text-slate-600">
              To submit a cancellation or batch rescheduling request, send an email to <a href="mailto:support@siksatech.in" className="text-blue-600 underline font-semibold">support@siksatech.in</a> with your registered email, Order/Enrollment ID, and registered phone number.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
