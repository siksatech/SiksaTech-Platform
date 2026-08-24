import { Navbar, Footer } from "@siksatech/ui";
import { RefreshCw, CheckCircle2, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Refund & Cancellation Policy | SiksaTech",
  description: "SiksaTech transparent cancellation, course transfer, and hardware return policies.",
};

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <RefreshCw className="w-4 h-4" /> Transparent Commercial Terms
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Refund & Cancellation Policy
          </h1>
          <p className="text-sm text-slate-500">
            Version 1.0 • Consumer Protection (E-Commerce) Rules Aligned
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Online Courses & Mentorship Programs</h2>
            <p>
              We want every learner to have a positive educational experience. For all self-paced and cohort-based courses:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>7-Day Trial Window:</strong> A 100% full refund is available within 7 calendar days of course enrollment, provided less than 25% of the curriculum has been accessed.</li>
              <li><strong>Batch Rescheduling:</strong> Students facing academic scheduling conflicts may request a free transfer to an upcoming batch rather than cancelling.</li>
              <li><strong>Processing Time:</strong> Approved refunds are credited back to the original payment source within 5–7 business days via our payment gateway.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Hardware Kits & Physical Components</h2>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Defective or Damaged Components:</strong> If any electronic sensor, microcontroller, or component arrives defective or damaged, we provide immediate free replacement within 14 days of delivery.</li>
              <li><strong>Unopened Kit Returns:</strong> Complete, unopened hardware kits may be returned within 10 days of receipt in original packaging for a refund less standard shipping costs.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Institutional Partnership Agreements</h2>
            <p>
              Cancellation and refund terms for turnkey school STEM lab setups, custom curriculum licensing, and faculty development workshops are governed by the specific Service Level Agreement (SLA) executed between SiksaTech and the educational institution.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">4. How to Request a Refund</h2>
            <p>
              To initiate a cancellation or refund request, email <a href="mailto:support@siksatech.in" className="text-blue-600 underline">support@siksatech.in</a> with your Order ID, registered email, and reason for cancellation.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
