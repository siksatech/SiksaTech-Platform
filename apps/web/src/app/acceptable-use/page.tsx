import { Navbar, Footer } from "@siksatech/ui";
import { CheckCircle2, XCircle, AlertTriangle, ShieldCheck } from "lucide-react";

export const metadata = {
  title: "Acceptable Use Policy | SiksaTech",
  description: "SiksaTech guidelines for safe, respectful, and ethical platform usage.",
};

export default function AcceptableUsePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" /> Platform Safety & Ethics
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Acceptable Use Policy
          </h1>
          <p className="text-sm text-slate-500">
            Version 1.0 • Ensuring a Safe Learning Environment for All Students
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Purpose of This Policy</h2>
            <p>
              SiksaTech is an educational environment dedicated to hands-on STEM learning. All students, mentors, teachers, and administrators are expected to act ethically, responsibly, and collaboratively.
            </p>
          </section>

          <section className="space-y-4 not-prose">
            <h2 className="text-lg font-bold text-slate-900">2. Prohibited Behaviors</h2>
            <div className="space-y-3">
              {[
                { title: "Harassment & Bullying", desc: "No abusive, threatening, discriminatory, or inappropriate communication towards fellow students or instructors." },
                { title: "Malicious Code & Exploits", desc: "Prohibits uploading viruses, trojans, firmware exploits, or attempting unauthorized penetration testing on SiksaTech servers." },
                { title: "Plagiarism & Misrepresentation", desc: "Copying another student's hardware project or submission without attribution is strictly prohibited." },
                { title: "Account Sharing & Impersonation", desc: "Using another user's credentials or attempting to escalate unauthorized administrative permissions." }
              ].map((item, idx) => (
                <div key={idx} className="flex gap-3 p-4 bg-red-50/60 border border-red-200 rounded-lg">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 mt-0.5">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Enforcement & Account Suspension</h2>
            <p>
              Violations of this policy may result in submission rejection, temporary suspension of platform access, or permanent account termination in severe cases.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
