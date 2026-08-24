import { Navbar, Footer } from "@siksatech/ui";
import { ShieldCheck, Lock, Eye, FileText, UserCheck, AlertCircle, Scale, Database } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | SiksaTech (DPDP Act 2023 Compliant)",
  description: "Comprehensive Data Protection and Privacy Policy for SiksaTech in compliance with the Digital Personal Data Protection Act, 2023 (DPDP Act) and IT Rules.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header Badge */}
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-emerald-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-emerald-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Digital Personal Data Protection (DPDP) Act 2023 Compliant
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Privacy Policy &amp; Data Protection Charter
          </h1>
          <p className="text-xs text-slate-500">
            Document Version: 1.0 &bull; Effective Date: August 1, 2026 &bull; Classification: Public Legal Policy &bull; Jurisdiction: Republic of India
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Data Fiduciary Identity &amp; Scope</h2>
            <p>
              This Privacy Policy applies to the digital platforms, learning management systems, web applications, and services operated by <strong>SiksaTech</strong> (accessible via <code>https://siksatech.in</code> and <code>https://team.siksatech.in</code>). In terms of the <em>Digital Personal Data Protection Act, 2023</em> (&ldquo;DPDP Act&rdquo;), SiksaTech functions as a <strong>Data Fiduciary</strong> regarding the personal data of learners (&ldquo;Data Principals&rdquo;), parents, teachers, and institutional representatives.
            </p>
          </section>

          {/* Section 9 DPDP Children Protection Clause */}
          <section className="space-y-4 bg-amber-50/70 p-6 sm:p-8 rounded-2xl border border-amber-200">
            <h2 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <UserCheck className="w-5 h-5 text-amber-600" /> 2. Special Obligations Regarding Child Data (Learners Under 18)
            </h2>
            <p className="text-xs text-amber-900">
              Pursuant to <strong>Section 9 of the DPDP Act, 2023</strong>, SiksaTech implements strict institutional and technical safeguards for processing children&apos;s personal data:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-amber-900">
              <li><strong>Verifiable Parental Consent (VPC):</strong> Prior to processing any personal data of an individual under 18 years, verifiable consent must be provided by the child&apos;s parent or lawful guardian.</li>
              <li><strong>Absolute Prohibition on Detrimental Processing:</strong> SiksaTech will not undertake any processing of personal data that is likely to cause any detrimental effect on the physical or psychological well-being of a child.</li>
              <li><strong>Prohibition on Behavioral Monitoring &amp; Tracking:</strong> We strictly prohibit automated behavioral profiling, tracking of minor activity for non-educational analytics, and targeted advertising directed at children.</li>
              <li><strong>Parental Rights of Oversight:</strong> Parents retain the statutory right to review, rectify, or demand the immediate erasure of their child&apos;s account and educational telemetry.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Categories of Personal Data Collected</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-xs text-left border border-slate-200 rounded-lg">
                <thead className="bg-slate-100 text-slate-900 font-bold">
                  <tr>
                    <th className="p-3 border-b">Data Category</th>
                    <th className="p-3 border-b">Specific Fields</th>
                    <th className="p-3 border-b">Statutory Purpose</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-semibold">Account Identity</td>
                    <td className="p-3">Learner Name, Parent Name, Email, Contact Phone</td>
                    <td className="p-3">Account provisioning, authentication, emergency communication</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Academic Profile</td>
                    <td className="p-3">Grade Level (Class 5–College), School/College Name</td>
                    <td className="p-3">Tailoring age-appropriate learning pathways (Explorer/Builder/Creator/Engineer)</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Build Telemetry</td>
                    <td className="p-3">Code snippets, project schematics, video demo URLs, submission feedback</td>
                    <td className="p-3">Assessment, mentor feedback, credential issuance, student portfolio</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Logistics &amp; Hardware</td>
                    <td className="p-3">Shipping postal address, order receipts, payment confirmation tokens</td>
                    <td className="p-3">Dispatch of hardware prototyping kits, tax invoices (GST compliance)</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Legal Grounds for Processing (Section 4 &amp; 6, DPDP Act)</h2>
            <p>
              Personal data is processed strictly on the basis of <strong>specified, informed, and unambiguous consent</strong> from the Data Principal or lawful guardian, or for legitimate educational contract fulfillment (such as issuing course certificates and dispatching kits).
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Data Sharing &amp; Third-Party Processors</h2>
            <p>
              We do not sell, rent, or trade personal data. We engage only audited, ISO/IEC 27001 certified technology infrastructure partners (e.g., Supabase PostgreSQL with Row Level Security, Vercel hosting, certified payment aggregators) under strict Data Processing Agreements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">6. Statutory Rights of the Data Principal</h2>
            <p>Under Chapter III of the DPDP Act, you have the following rights:</p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Right to Access Information:</strong> Summary of personal data being processed and third-party recipients.</li>
              <li><strong>Right to Correction &amp; Erasure:</strong> Correction of inaccurate data and permanent erasure of obsolete records.</li>
              <li><strong>Right of Grievance Redressal:</strong> Right to seek redressal from our Grievance Officer within statutory timeframes.</li>
              <li><strong>Right to Nominate:</strong> Right to nominate an authorized representative in event of death or incapacity.</li>
            </ul>
          </section>

          <section className="space-y-4 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-blue-600" /> 7. Grievance Redressal Mechanism &amp; Statutory Officer
            </h2>
            <p className="text-xs text-slate-600">
              In accordance with the DPDP Act 2023 and the Information Technology (Intermediary Guidelines and Digital Media Ethics Code) Rules, 2021, the contact details of our designated Grievance Officer are:
            </p>
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200 text-xs space-y-1.5">
              <p><strong>Designation:</strong> Data Protection &amp; Grievance Redressal Officer</p>
              <p><strong>Entity:</strong> SiksaTech India Platform Operations</p>
              <p><strong>Official Email:</strong> <a href="mailto:grievance@siksatech.in" className="text-blue-600 underline font-semibold">grievance@siksatech.in</a></p>
              <p><strong>Portal Submission:</strong> <Link href="/grievance" className="text-blue-600 underline font-semibold">siksatech.in/grievance</Link></p>
              <p><strong>Statutory SLA:</strong> Acknowledgment within 48 hours; resolution within 30 days.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
