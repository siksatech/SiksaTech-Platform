import { Navbar, Footer } from "@siksatech/ui";
import { Shield, BookOpen, Award, CheckCircle, Scale, AlertTriangle, FileText, Lock } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Terms of Service | SiksaTech (Indian Law & IT Act Compliant)",
  description: "Comprehensive Terms of Service for SiksaTech platform, defining learner rights, student IP ownership, parental obligations, liability caps, and dispute resolution in India.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-200">
            <Scale className="w-4 h-4 text-blue-600" /> Governed by the Laws of the Republic of India
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Terms of Service &amp; User Agreement
          </h1>
          <p className="text-xs text-slate-500">
            Document Version: 1.0 &bull; Effective Date: August 1, 2026 &bull; Compliant with Information Technology Act, 2000 &amp; Consumer Protection (E-Commerce) Rules, 2020
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-9 text-sm leading-relaxed text-slate-700">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Agreement &amp; Contracting Parties</h2>
            <p>
              This User Agreement (&ldquo;Terms&rdquo;) constitutes a legally binding electronic contract between you (&ldquo;User&rdquo;, &ldquo;Learner&rdquo;, &ldquo;Parent/Guardian&rdquo;, or &ldquo;Institution&rdquo;) and <strong>SiksaTech</strong>, governing your access to and use of <code>siksatech.in</code>, <code>team.siksatech.in</code>, mobile portals, learning applications, and physical hardware kits (collectively, the &ldquo;Platform&rdquo;).
            </p>
            <p>
              By clicking &ldquo;I Agree&rdquo;, creating an account, enrolling in a course, or submitting project telemetry, you acknowledge that you have read, understood, and agreed to be bound by these Terms and our <Link href="/privacy-policy" className="text-blue-600 underline">Privacy Policy</Link>.
            </p>
          </section>

          {/* Section 2: Minor Learners & Parent Liability */}
          <section className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" /> 2. Eligibility &amp; Minor Learners (Under 18 Years)
            </h2>
            <p className="text-xs text-slate-600">
              Pursuant to the <em>Indian Contract Act, 1872</em> and the <em>Digital Personal Data Protection Act, 2023</em>:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-slate-600">
              <li><strong>Parental Consent Obligation:</strong> If the learner is under 18 years of age (Class 5 through Class 12), account creation and program registration must be undertaken solely with the express verifiable consent and supervision of a parent or lawful guardian.</li>
              <li><strong>Parental Responsibility:</strong> The consenting parent/guardian agrees to supervise the minor&apos;s educational activities, online interactions, and physical hardware lab experiments, and accepts financial responsibility for all purchases made under the account.</li>
              <li><strong>Institutional Batches:</strong> Where enrollment is initiated by a recognized school, college, or educational institution, the institution represents that it has secured appropriate institutional parental consent under applicable educational guidelines.</li>
            </ul>
          </section>

          {/* Section 3: Student Intellectual Property Protection */}
          <section className="space-y-3 bg-emerald-50/70 p-6 rounded-2xl border border-emerald-200">
            <h2 className="text-base font-bold text-emerald-950 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" /> 3. Student Intellectual Property Rights (Build-First Protection)
            </h2>
            <p className="text-xs text-emerald-900">
              SiksaTech is founded on the principle that students learn by building. We fiercely respect and legally safeguard learner intellectual property:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-xs text-emerald-900">
              <li><strong>100% Student Ownership:</strong> Students retain exclusive intellectual property ownership of all original circuit diagrams, firmware code (C++/Python), CAD 3D models, and written project documentation created during their coursework or submitted to the Build Showcase.</li>
              <li><strong>SiksaTech Educational Content:</strong> SiksaTech retains all copyright, trademark, and proprietary rights in our course syllabi, video lectures, starter firmware libraries, lab workbooks, and branding.</li>
              <li><strong>Non-Exclusive Showcase License:</strong> By publishing a project to the public Build Showcase, the learner grants SiksaTech a royalty-free, non-exclusive license solely to display the project for student portfolio demonstration and educational recognition.</li>
            </ul>
          </section>

          {/* Section 4: Hardware Prototyping & Lab Safety Disclaimers */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Hardware Kits, Prototyping &amp; Laboratory Safety</h2>
            <p>
              SiksaTech curriculum involves physical hardware assembly, DC power connections, breadboard wiring, soldering stations, motor drivers, and microcontroller flashing. Users explicitly agree to the following safety protocols:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Low-Voltage Standard:</strong> Prototyping kits are designed for safe DC operating voltages (&le; 12V DC). Connecting SiksaTech educational components directly to raw 230V AC mains electricity without certified isolated power supplies is strictly prohibited.</li>
              <li><strong>Adult Supervision for Soldering:</strong> Use of soldering irons, rotary tools, 3D printers, and mechanical actuators must always be conducted under adult or faculty supervision with proper eye protection and ventilation.</li>
              <li><strong>Safe Assembly Disclaimer:</strong> SiksaTech disclaims liability for equipment damage or personal injury resulting from improper wiring, short circuits, incorrect voltage polarity, or failure to follow provided component manuals.</li>
            </ul>
          </section>

          {/* Section 5: Anti-Plagiarism & Acceptable Use */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Academic Integrity &amp; Code of Conduct</h2>
            <p>
              Learners agree not to engage in academic dishonesty, reverse-engineer proprietary firmware, deploy denial-of-service attacks against the platform, or submit plagiarized hardware builds. Verified plagiarism will result in disqualification from competitions and revocation of certificates.
            </p>
          </section>

          {/* Section 6: Limitation of Liability & Warranty Disclaimer */}
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">6. Limitation of Liability &amp; Warranty Disclaimer</h2>
            <p>
              To the maximum extent permitted by applicable Indian law, SiksaTech provides all digital materials, starter libraries, and course platforms on an &ldquo;AS IS&rdquo; and &ldquo;AS AVAILABLE&rdquo; basis. SiksaTech&apos;s aggregate financial liability arising out of or related to any course enrollment or hardware purchase shall not exceed the actual total fees paid by the user for the specific program or product giving rise to the claim.
            </p>
          </section>

          {/* Section 7: Jurisdiction & Dispute Resolution */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">7. Governing Law, Arbitration &amp; Exclusive Jurisdiction</h2>
            <p>
              These Terms shall be construed in accordance with and governed by the laws of India. Any dispute, claim, or controversy arising out of or relating to this Agreement shall first be resolved through good-faith mediation via our Grievance Redressal Mechanism. If unresolved within 30 days, disputes shall be settled through arbitration under the <em>Arbitration and Conciliation Act, 1996</em>, and the competent courts in India shall have exclusive jurisdiction.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
