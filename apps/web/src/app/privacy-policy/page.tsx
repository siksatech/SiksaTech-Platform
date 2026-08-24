import { Navbar, Footer } from "@siksatech/ui";
import { ShieldCheck, Lock, Eye, FileText, UserCheck, AlertCircle } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | SiksaTech",
  description: "SiksaTech Data Protection and Privacy Policy in compliance with the Digital Personal Data Protection (DPDP) Act, 2023.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" /> DPDP Act 2023 Compliant
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Privacy & Data Protection Policy
          </h1>
          <p className="text-sm text-slate-500">
            Version 1.0 • Effective Date: August 1, 2026 • Last Reviewed: August 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Introduction & Scope</h2>
            <p>
              SiksaTech (&ldquo;we&rdquo;, &ldquo;our&rdquo;, &ldquo;platform&rdquo;) operates educational and technology platforms for learners from Class 5 through college. We are committed to protecting the privacy and personal data of our learners, parents, educators, and institutional partners in strict adherence to the Digital Personal Data Protection (DPDP) Act, 2023 and the Information Technology Act, 2000.
            </p>
          </section>

          <section className="space-y-3 bg-slate-50 p-6 rounded-xl border border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-blue-600" /> 2. Special Protection for Minor Learners (Children Under 18)
            </h2>
            <p>
              Because SiksaTech serves students starting from Class 5 (approx. age 10), child data protection is our highest architectural priority:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Verifiable Parental Consent:</strong> For all learners under 18 years of age, registration and enrollment require verifiable consent from a parent or legal guardian.</li>
              <li><strong>No Targeted Behavioral Advertising:</strong> We strictly prohibit behavioral tracking or targeted advertising directed at children.</li>
              <li><strong>No Harmful Processing:</strong> We do not engage in any automated processing of children&apos;s data that could adversely affect their well-being.</li>
              <li><strong>Parental Access:</strong> Parents retain full rights to inspect, correct, and request the deletion of their child&apos;s educational records.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Information We Collect</h2>
            <div className="grid sm:grid-cols-2 gap-4 not-prose">
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Essential Profile Data</h3>
                <p className="text-xs text-slate-600">Learner name, parent email address, phone number, school/institution affiliation, and academic grade level.</p>
              </div>
              <div className="p-4 border border-slate-200 rounded-lg">
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">Educational Telemetry</h3>
                <p className="text-xs text-slate-600">Course progress, completed modules, hardware build submissions, code snippets, and verified certificate records.</p>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Purpose of Data Processing</h2>
            <p>
              We process personal data solely for providing structured STEM education, tracking learning milestones, evaluating hardware projects, issuing verified certificates, and providing customer support.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Data Retention & Erasure</h2>
            <p>
              We retain personal data only for as long as necessary to fulfill the educational purpose or comply with statutory requirements. Learners and parents may request complete account erasure at any time.
            </p>
          </section>

          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">6. Grievance Officer & Contact Information</h2>
            <p>
              In accordance with the DPDP Act and IT Rules, if you have any questions, concerns, or requests regarding your personal data:
            </p>
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 text-xs space-y-1">
              <p><strong>Grievance Officer:</strong> SiksaTech Data Protection Office</p>
              <p><strong>Email:</strong> <a href="mailto:grievance@siksatech.in" className="text-blue-600 underline">grievance@siksatech.in</a></p>
              <p><strong>Response Timeline:</strong> Within 48 hours for acknowledgment; resolution within statutory timelines.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
