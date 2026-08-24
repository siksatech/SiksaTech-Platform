"use client";

import { useState } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import { ShieldCheck, Mail, Send, CheckCircle2 } from "lucide-react";
import { db } from "@siksatech/database";

export default function GrievancePage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "data_privacy",
    subject: "",
    message: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await db.submitLead("student", formData.name, formData.email, formData.phone, {
      type: "grievance",
      category: formData.category,
      subject: formData.subject,
      message: formData.message
    });
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto">
        <div className="border-b border-slate-200 pb-8 mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4">
            <ShieldCheck className="w-4 h-4" /> Statutory Grievance Redressal
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 mb-2">
            Grievance Redressal Mechanism
          </h1>
          <p className="text-sm text-slate-500">
            Dedicated officer for data rights, parental requests, and platform disputes.
          </p>
        </div>

        {submitted ? (
          <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
            <h2 className="text-lg font-bold text-slate-900">Grievance Ticket Registered</h2>
            <p className="text-xs text-slate-600 max-w-md mx-auto">
              Your grievance has been formally assigned to our Grievance Officer. An acknowledgment email and ticket ID have been dispatched to your email address.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4 bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Your Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Rahul Verma"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="rahul@example.com"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="data_privacy">DPDP Data Privacy / Erasure</option>
                  <option value="parental_consent">Parental Consent Modification</option>
                  <option value="billing_refund">Billing / Refund Dispute</option>
                  <option value="safety_conduct">Safety / Conduct Violation</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
              <input
                type="text"
                required
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                placeholder="Brief summary of your grievance"
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Description</label>
              <textarea
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Provide complete facts, dates, and relevant details..."
                className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" /> Submit Official Grievance Ticket
            </button>
          </form>
        )}
      </main>

      <Footer />
    </div>
  );
}
