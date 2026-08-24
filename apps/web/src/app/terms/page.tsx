import { Navbar, Footer } from "@siksatech/ui";
import { Shield, BookOpen, Award, CheckCircle } from "lucide-react";

export const metadata = {
  title: "Terms of Service | SiksaTech",
  description: "SiksaTech Terms of Service, learner rights, intellectual property, and acceptable use guidelines.",
};

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <Shield className="w-4 h-4" /> Official Platform Agreement
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Terms of Service
          </h1>
          <p className="text-sm text-slate-500">
            Version 1.0 • Effective Date: August 1, 2026
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Acceptance of Terms</h2>
            <p>
              By accessing or using the SiksaTech platform (`siksatech.in` and `team.siksatech.in`), you agree to be bound by these Terms of Service. If you are under 18 years of age, you confirm that your parent or legal guardian has reviewed and consented to these Terms on your behalf.
            </p>
          </section>

          <section className="space-y-3 bg-blue-50 p-6 rounded-xl border border-blue-200">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-blue-600" /> 2. Student Intellectual Property Rights
            </h2>
            <p>
              At SiksaTech, we believe in the Build-First philosophy. We recognize and protect learner ownership:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li><strong>Ownership:</strong> Students retain 100% intellectual property ownership of the original circuits, firmware code, CAD designs, and project documentation they create.</li>
              <li><strong>Showcase License:</strong> By submitting a project to the public showcase, learners grant SiksaTech a non-exclusive license to display the build for educational portfolio purposes.</li>
              <li><strong>Plagiarism Prohibited:</strong> Submissions must be original work or clearly cite open-source inspirations.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Educational Platform Use</h2>
            <p>
              SiksaTech provides curriculum, starter code, hardware assembly blueprints, and mentorship tools for non-commercial educational purposes. Unauthorized commercial redistribution of course materials is prohibited.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Hardware Kits & Prototyping Safety</h2>
            <p>
              Hardware kits distributed through the SiksaTech Store or school labs involve electronic components, low-voltage DC power, and soldering equipment. Learners must follow provided safety manuals and operate under appropriate adult supervision where indicated.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">5. Governing Law & Dispute Resolution</h2>
            <p>
              These Terms are governed by and construed in accordance with the laws of the Republic of India. Any legal disputes arising out of the platform shall be subject to the exclusive jurisdiction of the competent courts in India.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
