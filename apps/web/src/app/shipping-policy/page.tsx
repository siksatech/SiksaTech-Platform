import { Navbar, Footer } from "@siksatech/ui";
import { Truck, Package, Clock, ShieldCheck, MapPin, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const metadata = {
  title: "Shipping & Delivery Policy | SiksaTech Hardware Store",
  description: "Comprehensive Shipping and Delivery Policy for SiksaTech educational hardware kits, microcontrollers, and electronic component bundles across India.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-blue-200">
            <Truck className="w-4 h-4 text-blue-600" /> Pan-India Express Logistics
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Shipping &amp; Hardware Delivery Policy
          </h1>
          <p className="text-xs text-slate-500">
            Document Version: 1.0 &bull; Effective Date: August 1, 2026 &bull; Compliant with Consumer Protection (E-Commerce) Rules, 2020
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Delivery Scope &amp; Serviceable Pin Codes</h2>
            <p>
              SiksaTech ships educational prototyping hardware kits (Explorer Kit, Builder Kit, Creator Kit, Engineer Kit, and individual component modules) across all states and Union Territories in India via certified courier partners (Bluedart, Delhivery, DTDC, and India Post Speed Post for remote pin codes).
            </p>
          </section>

          {/* Delivery Matrix */}
          <section className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">2. Dispatch &amp; Estimated Delivery Timeframes</h2>
            <div className="overflow-x-auto not-prose">
              <table className="min-w-full text-xs text-left border border-slate-200 rounded-lg bg-white">
                <thead className="bg-slate-100 text-slate-900 font-bold">
                  <tr>
                    <th className="p-3 border-b">Destination Region</th>
                    <th className="p-3 border-b">Dispatch SLA</th>
                    <th className="p-3 border-b">Transit &amp; Delivery SLA</th>
                    <th className="p-3 border-b">Shipping Mode</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  <tr>
                    <td className="p-3 font-semibold">Metro Cities (Delhi NCR, Mumbai, Bengaluru, Chennai, Hyderabad, Kolkata, Pune)</td>
                    <td className="p-3">Within 24 Hours</td>
                    <td className="p-3 text-emerald-700 font-bold">2 to 3 Business Days</td>
                    <td className="p-3">Air Express Courier</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Tier 2 &amp; Tier 3 State Capitals &amp; Urban Centers</td>
                    <td className="p-3">Within 24–48 Hours</td>
                    <td className="p-3">3 to 5 Business Days</td>
                    <td className="p-3">Priority Surface Express</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold">Remote, North-East &amp; Island Territories</td>
                    <td className="p-3">Within 48 Hours</td>
                    <td className="p-3">5 to 8 Business Days</td>
                    <td className="p-3">Speed Post / Surface</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">3. Packaging &amp; Electrostatic Discharge (ESD) Protection</h2>
            <p>
              All sensitive microcontrollers (Arduino Uno, ESP32, Raspberry Pi) and semiconductor sensors are vacuum-sealed in anti-static ESD shielding bags with desiccants and high-density foam casing to prevent transit shocks or moisture contamination.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">4. Tracking &amp; In-Transit Notifications</h2>
            <p>
              Once your order is handed over to the courier partner, an automated tracking link and AWB number are dispatched via email and SMS. Learners and parents can track consignment movement in real-time.
            </p>
          </section>

          <section className="space-y-3 bg-slate-50 p-6 rounded-2xl border border-slate-200">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-amber-600" /> 5. Transit Damage &amp; Package Inspection Protocol
            </h2>
            <p className="text-xs text-slate-600 leading-relaxed">
              If the outer cardboard parcel appears visibly crushed, wet, or tampered with upon delivery:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-xs text-slate-600">
              <li>Record a short video or photo while unboxing the parcel.</li>
              <li>Report any damaged or missing component to <a href="mailto:support@siksatech.in" className="text-blue-600 underline">support@siksatech.in</a> within 48 hours.</li>
              <li>We will immediately dispatch a priority replacement parcel at zero cost under our <Link href="/returns-replacements" className="text-blue-600 underline">DOA Component Warranty</Link>.</li>
            </ul>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
