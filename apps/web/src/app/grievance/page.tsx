"use client";

import { useState } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import { ShieldCheck, Mail, Send, CheckCircle2, Scale, Clock, AlertCircle, FileText, Phone } from "lucide-react";
import { db } from "@siksatech/database";

export default function GrievancePage() {
  const [submitted, setSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    category: "dpdp_data_privacy",
    subject: "",
    message: "",
    userType: "parent"
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const generatedId = `GRV-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    await db.submitLead("student", formData.name, formData.email, formData.phone, {
      type: "grievance_ticket",
      ticketId: generatedId,
      userType: formData.userType,
      category: formData.category,
      subject: formData.subject,
      message: formData.message,
      submittedAt: new Date().toISOString()
    });
    setTicketId(generatedId);
    setSubmitted(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        {/* Header */}
        <div className="border-b border-slate-200 pb-8 mb-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-red-700 rounded-full text-xs font-semibold uppercase tracking-wider mb-4 border border-red-200">
            <Scale className="w-4 h-4 text-red-600" /> DPDP Act 2023 &amp; IT Rules 2021 Statutory Mechanism
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 mb-3">
            Statutory Grievance Redressal Mechanism
          </h1>
          <p className="text-xs text-slate-500 max-w-2xl mx-auto">
            Formal channel for exercising Data Principal rights, parental consent modifications, child data protection inquiries, and commercial disputes.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Statutory Officer Card */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-200 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" /> Statutory Compliance Officer
              </h3>
              <div className="text-xs text-slate-600 space-y-2">
                <p><strong>Designation:</strong> Data Protection &amp; Grievance Officer</p>
                <p><strong>Entity:</strong> SiksaTech India Platform Operations</p>
                <p><strong>Email:</strong> <a href="mailto:grievance@siksatech.in" className="text-blue-600 underline">grievance@siksatech.in</a></p>
                <p><strong>Secondary Support:</strong> <a href="mailto:support@siksatech.in" className="text-blue-600 underline">support@siksatech.in</a></p>
              </div>
            </div>

            <div className="bg-blue-50/70 p-6 rounded-2xl border border-blue-200 space-y-3 text-xs text-blue-950">
              <h4 className="font-bold flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" /> Statutory Timelines
              </h4>
              <ul className="space-y-1.5 list-disc pl-4 text-blue-900">
                <li><strong>Acknowledgment:</strong> Within 48 hours with unique Ticket ID.</li>
                <li><strong>Data Erasure:</strong> Within 72 hours upon verified parental request.</li>
                <li><strong>Final Resolution:</strong> Within 30 days maximum.</li>
              </ul>
            </div>
          </div>

          {/* Form / Confirmation */}
          <div className="lg:col-span-2">
            {submitted ? (
              <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-4 shadow-sm">
                <CheckCircle2 className="w-14 h-14 text-emerald-600 mx-auto" />
                <h2 className="text-xl font-bold text-slate-900">Grievance Ticket Registered Successfully</h2>
                <div className="inline-block px-4 py-2 bg-white rounded-lg border border-emerald-200 font-mono text-sm font-bold text-emerald-800">
                  Ticket ID: {ticketId}
                </div>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  Your formal grievance has been entered into the SiksaTech Statutory Registry. A signed acknowledgment has been recorded, and our Data Protection Officer will contact you within 48 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="text-xs font-bold text-blue-600 hover:underline pt-2"
                >
                  &larr; Submit another inquiry
                </button>
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
                      placeholder="e.g. Ramesh Chandra"
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
                      placeholder="ramesh@example.com"
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Contact Phone Number</label>
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
                    <label className="block text-xs font-bold text-slate-700 mb-1">I am a:</label>
                    <select
                      value={formData.userType}
                      onChange={(e) => setFormData({ ...formData, userType: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="parent">Parent / Legal Guardian</option>
                      <option value="student">Student / Learner</option>
                      <option value="teacher">School / College Educator</option>
                      <option value="institution">Institutional Administrator</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Grievance Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 font-medium"
                  >
                    <option value="dpdp_data_privacy">DPDP Act: Data Access, Correction or Permanent Erasure</option>
                    <option value="parental_consent_withdrawal">Parental Consent Withdrawal / Minor Profile Restriction</option>
                    <option value="commercial_refund_dispute">Consumer Protection: Refund / Billing / Kit Dispute</option>
                    <option value="safety_harassment">Online Safety, Content Flag, or Harassment Report</option>
                    <option value="copyright_ip_dispute">Intellectual Property / Student Project Attribution Claim</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief description of the grievance"
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Detailed Facts &amp; Description</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Please include dates, account emails, order numbers, and exact circumstances to expedite formal legal review..."
                    className="w-full px-3.5 py-2.5 bg-white border border-slate-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs uppercase tracking-wider rounded-lg shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Send className="w-4 h-4" /> Register Statutory Grievance Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
