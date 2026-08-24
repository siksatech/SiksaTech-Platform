import { Navbar, Footer } from "@siksatech/ui";
import { Truck, Package, Clock, Shield } from "lucide-react";

export const metadata = {
  title: "Shipping Policy | SiksaTech Store",
  description: "SiksaTech hardware kits delivery timelines, pan-India logistics, and dispatch details.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <Truck className="w-4 h-4" /> Pan-India Logistics
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Shipping & Delivery Policy
          </h1>
          <p className="text-sm text-slate-500">
            Hardware kit logistics for students, educators, and institutional STEM labs.
          </p>
        </div>

        <div className="prose prose-slate max-w-none space-y-8 text-sm leading-relaxed text-slate-700">
          <section className="space-y-3">
            <h2 className="text-lg font-bold text-slate-900">1. Serviceable Areas</h2>
            <p>
              SiksaTech ships hardware kits (Explorer, Builder, Creator, Engineer) and electronic components to all postal pin codes across Tier 1, Tier 2, and Tier 3 cities across India.
            </p>
          </section>

          <section className="grid sm:grid-cols-2 gap-4 not-prose">
            <div className="p-4 border border-slate-200 rounded-xl space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" /> Metro Cities
              </h3>
              <p className="text-xs text-slate-600">Dispatched within 24 hours. Delivered in 2–4 business days with full SMS tracking.</p>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl space-y-1.5">
              <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-4 h-4 text-emerald-600" /> Regional & Tier 2/3 Locations
              </h3>
              <p className="text-xs text-slate-600">Delivered within 4–7 business days via reliable surface and air express couriers.</p>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
