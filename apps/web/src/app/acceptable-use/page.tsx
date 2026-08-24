import { Navbar, Footer } from "@siksatech/ui";
import { ShieldAlert, XCircle, CheckCircle2, AlertTriangle, Terminal, Lock, Flame } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Acceptable Use Policy | SiksaTech (Cybersecurity & Lab Safety)",
  description: "Detailed Acceptable Use Policy covering cybersecurity standards, hardware lab safety, anti-harassment, and code execution integrity across SiksaTech platforms.",
};

export default function AcceptableUsePage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-red-200">
            <ShieldAlert className="w-4 h-4 text-red-600" /> Platform Security &amp; Safety Standard
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Acceptable Use &amp; Cybersecurity Policy
          </h1>
          <p className="text-xs text-slate-500">
            Document Version: 1.0 &bull; Enforceable under the Information Technology Act, 2000 (Sections 43, 66) &bull; Child Safety First
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-9 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Principle &amp; Objective</h2>
            <p>
              SiksaTech provides students, educators, and makers with interactive coding playgrounds, microcontroller firmware compilers, circuit simulators, and collaborative project repositories. This Policy establishes explicit boundaries to preserve platform integrity, prevent malicious exploits, and protect minor students from online harm.
            </p>
          </section>

          {/* Section 2: Prohibited Technical Activities */}
          <section className="space-y-4 not-prose">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-5 h-5 text-red-600" /> 2. Strictly Prohibited Technical &amp; Cyber Actions
            </h2>
            <div className="grid gap-3">
              {[
                { title: "Malicious Code Injection & Exploitation", desc: "Uploading, compiling, or executing viruses, keyloggers, botnet C2 payloads, cryptominers, or code designed to exploit server-side container vulnerabilities." },
                { title: "Unauthorized Penetration Testing & DoS", desc: "Executing automated vulnerability scanners, rate-limit bypassing scripts, distributed denial of service (DDoS) traffic, or packet fuzzing against SiksaTech API endpoints." },
                { title: "Firmware Tampering & Safety Bypass", desc: "Publishing project firmware intended to bypass electronic battery protection ICs, overload motor drivers intentionally, or create fire/heat hazards." },
                { title: "Credential Theft & Privilege Escalation", desc: "Attempting to harvest authentication tokens, session cookies, or escalate permissions to access internal administrative tools at team.siksatech.in." }
              ].map((item, idx) => (
                <div key={idx} className="flex items-start gap-3.5 p-4 bg-red-50/70 border border-red-200 rounded-xl">
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="text-xs font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 3: Child Safety & Zero-Tolerance Harassment */}
          <section className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-5 h-5 text-blue-600" /> 3. Child Safety &amp; Anti-Abuse Zero-Tolerance Rules
            </h2>
            <p className="text-xs text-slate-600">
              Pursuant to the <em>Protection of Children from Sexual Offences (POCSO) Act</em> and <em>IT Rules, 2021</em>, SiksaTech enforces a <strong>Zero-Tolerance Policy</strong> regarding:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Any form of cyber-bullying, stalking, trolling, or intimidation directed at student builders.</li>
              <li>Attempting to solicit personal offline contact details (phone numbers, physical addresses) from minor students in project discussion boards.</li>
              <li>Posting sexually explicit, violent, obscene, or hateful imagery in project schematics or creator bios.</li>
            </ul>
          </section>

          {/* Section 4: Hardware Lab Physical Safety */}
          <section className="space-y-3 bg-amber-50/60 p-6 rounded-2xl border border-amber-200">
            <h2 className="text-base font-bold text-amber-950 flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-600" /> 4. Physical Workshop &amp; Lab Safety Guidelines
            </h2>
            <p className="text-xs text-amber-900">
              When experimenting with hardware kits, lithium-polymer batteries, 3D printers, or soldering irons:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-amber-900">
              <li>Always disconnect battery/power supplies before altering circuit wiring.</li>
              <li>Do not puncture, overcharge, or short-circuit rechargeable Li-Ion / LiPo battery cells.</li>
              <li>Soldering iron stands and heat-resistant silicone mats must be utilized at all times.</li>
            </ul>
          </section>

          {/* Section 5: Statutory Reporting & Penalties */}
          <section className="space-y-3 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">5. Enforcement &amp; Legal Escalation</h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              Violations will result in immediate suspension of platform access, forfeiture of course certificates, and blacklisting from SiksaTech hackathons. In cases of malicious hacking or child safety breaches, SiksaTech will cooperate with Indian law enforcement agencies (Indian Computer Emergency Response Team - CERT-In, and Cyber Crime Police) in accordance with the IT Act, 2000.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
