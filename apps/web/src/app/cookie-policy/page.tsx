import { Navbar, Footer } from "@siksatech/ui";
import { Cookie, Shield, Lock, EyeOff, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Cookie Policy & Tracking Transparency | SiksaTech",
  description: "Detailed breakdown of cookies, session tokens, and local storage mechanisms utilized across SiksaTech learning portals.",
};

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-purple-200">
            <Cookie className="w-4 h-4 text-purple-600" /> Privacy by Design Disclosures
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Cookie &amp; Local Storage Policy
          </h1>
          <p className="text-xs text-slate-500">
            Document Version: 1.0 &bull; Effective Date: August 1, 2026 &bull; Strict Zero Third-Party Advertising Policy for Children
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Architectural Statement on Tracking</h2>
            <p>
              SiksaTech rejects intrusive commercial tracking. We do not embed third-party advertising cookies, retargeting pixels, or behavioral surveillance trackers. We employ only <strong>strictly essential session tokens</strong> and functional preferences necessary to authenticate users and persist course build progress.
            </p>
          </section>

          {/* Cookie Taxonomy */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">2. Exhaustive Taxonomy of Cookies &amp; Storage Tokens</h2>
            <div className="overflow-x-auto not-prose">
              <table className="min-w-full text-xs text-left border border-slate-200 rounded-lg bg-white">
                <thead className="bg-slate-100 text-slate-900 font-bold">
                  <tr>
                    <th className="p-3 border-b">Cookie / Key Name</th>
                    <th className="p-3 border-b">Category</th>
                    <th className="p-3 border-b">Lifespan</th>
                    <th className="p-3 border-b">Exact Technical Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-mono font-semibold">sb-auth-token</td>
                    <td className="p-3 text-blue-700 font-medium">Strictly Essential</td>
                    <td className="p-3">Session / 30 Days</td>
                    <td className="p-3">Stores encrypted JWT token issued by Supabase Auth for identity verification.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold">siksatech_user</td>
                    <td className="p-3 text-blue-700 font-medium">Strictly Essential</td>
                    <td className="p-3">Persistent LocalStorage</td>
                    <td className="p-3">Caches client-side user role and active learning pathway selection.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold">siksatech_cart</td>
                    <td className="p-3 text-emerald-700 font-medium">Functional</td>
                    <td className="p-3">Persistent LocalStorage</td>
                    <td className="p-3">Retains selected hardware kits and component bundles in the Store cart.</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-mono font-semibold">theme_mode</td>
                    <td className="p-3 text-slate-600 font-medium">Preference</td>
                    <td className="p-3">1 Year</td>
                    <td className="p-3">Stores user interface display settings (contrast, typography scale).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* Child Protection Safeguard */}
          <section className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <EyeOff className="w-5 h-5 text-emerald-600" /> 3. Strict Child Data Protection (Minors Under 18)
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              In full compliance with <strong>Section 9 of the DPDP Act 2023</strong>, when a learner account is identified as belonging to a minor:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>No cross-site tracking or commercial analytics cookies are loaded.</li>
              <li>No third-party social media tracking widgets or pixels are executed.</li>
              <li>Code editor and telemetry cookies are isolated strictly to educational evaluation.</li>
            </ul>
          </section>

          {/* Browser Management */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">4. Browser Controls &amp; Disabling Cookies</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Users may modify their browser settings (Chrome, Firefox, Safari, Edge) to block or delete cookies. However, disabling strictly essential authentication cookies will prevent you from signing in to your student dashboard or accessing interactive lesson editors.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
