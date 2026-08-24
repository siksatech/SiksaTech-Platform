import { Navbar, Footer } from "@siksatech/ui";
import { Cookie, Shield } from "lucide-react";

export const metadata = {
  title: "Cookie Policy | SiksaTech",
  description: "SiksaTech transparent cookie and tracking disclosure.",
};

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <Cookie className="w-4 h-4" /> Cookie Disclosures
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Cookie Policy
          </h1>
          <p className="text-sm text-slate-500">
            Version 1.0 • Privacy by Design
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. What Are Cookies?</h2>
            <p>
              Cookies are small text files placed on your device to ensure secure authentication, remember preferences, and analyze platform performance. SiksaTech uses minimal, privacy-respecting cookies.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">2. Categories of Cookies We Use</h2>
            <div className="space-y-3 not-prose">
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="text-xs font-bold text-slate-900 uppercase mb-1">Strictly Essential Cookies</h3>
                <p className="text-xs text-slate-600">Required for Supabase user authentication, session security, and maintaining login state between pages.</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="text-xs font-bold text-slate-900 uppercase mb-1">Functional & Preference Cookies</h3>
                <p className="text-xs text-slate-600">Stores learner preferences like theme selection, intake grade choices, and code editor font sizing.</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="text-xs font-bold text-slate-900 uppercase mb-1">Performance & Analytics</h3>
                <p className="text-xs text-slate-600">Anonymous aggregated telemetry to measure page load speeds and identify broken links without tracking individual minors.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Managing Your Cookie Preferences</h2>
            <p>
              You can control or disable non-essential cookies through your browser settings. Note that disabling strictly essential cookies may prevent login authentication.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
