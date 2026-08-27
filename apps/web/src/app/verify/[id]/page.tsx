"use client";

import { useState, useEffect, use } from "react";
import { Navbar, Footer, SiksaTechLogo } from "@siksatech/ui";
import Link from "next/link";
import {
  verifyCertificate,
  createBrowserClient,
  isRealSupabase,
  type VerifiableCertificate
} from "@siksatech/database";
import {
  ShieldCheck, ShieldAlert, ArrowLeft, Search, Printer, Share2,
  Check, Award, Sparkles, CheckCircle2, Lock, ExternalLink
} from "lucide-react";

export default function VerifyCertificatePage({
  params
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const initialId = resolvedParams.id;

  const [certId, setCertId] = useState(initialId);
  const [certificate, setCertificate] = useState<VerifiableCertificate | null>(null);
  const [searchId, setSearchId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (certId) {
      setLoading(true);
      const supabase = isRealSupabase ? createBrowserClient() : undefined;
      verifyCertificate(supabase, certId).then((res) => {
        setCertificate(res);
        setHasSearched(true);
        setLoading(false);
      });
    }
  }, [certId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setCertId(searchId.trim().toUpperCase());
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 font-sans">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-3xl w-full space-y-8">

          {/* Navigation & Actions Topbar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Pathways
            </Link>

            {certificate && (
              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={handleShare}
                  className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 hover:border-slate-300 text-xs font-bold text-slate-700 hover:text-slate-900 transition-all flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copied ? "Link Copied" : "Share"}
                </button>
                <button
                  onClick={handlePrint}
                  className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-xs font-bold text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
              </div>
            )}
          </div>

          {/* Certificate View Card */}
          {loading ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-12 text-center text-slate-500 text-sm shadow-sm">
              Verifying cryptographic hash in registry...
            </div>
          ) : certificate ? (
            <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-xl border-4 border-slate-200 relative overflow-hidden print:border-2 print:p-8">
              {/* Background watermark badge */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-1 pointer-events-none" />

              {/* Verified Ribbon Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-slate-100 pb-6 mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <SiksaTechLogo className="text-2xl" variant="dark" />
                </div>

                <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-mono font-bold">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>OFFICIALLY VERIFIED CREDENTIAL</span>
                </div>
              </div>

              {/* Certificate Body */}
              <div className="space-y-6 text-center my-6">
                <p className="text-xs font-mono uppercase tracking-widest text-slate-400 font-bold">
                  This Certificate of STEM Competence is Proudly Awarded to
                </p>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
                  {certificate.studentName}
                </h1>

                <p className="text-xs text-slate-500 max-w-lg mx-auto leading-relaxed">
                  for successfully completing all practical hardware laboratory requirements, circuit benchmarks, and passing the comprehensive examination in:
                </p>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 max-w-xl mx-auto">
                  <h2 className="text-lg sm:text-xl font-extrabold text-blue-600">
                    {certificate.programName}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">
                    {certificate.achievement}
                  </p>
                </div>
              </div>

              {/* Verified Competencies */}
              {certificate.skillsVerified && certificate.skillsVerified.length > 0 && (
                <div className="my-8 pt-6 border-t border-slate-100">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold text-center mb-3">
                    Demonstrated Technical Competencies
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {certificate.skillsVerified.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg"
                      >
                        ✓ {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Cryptographic Proof & Signature Footer */}
              <div className="mt-10 pt-6 border-t-2 border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-6 text-left">
                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Certificate ID</span>
                  <span className="text-xs font-bold font-mono text-slate-900">{certificate.id}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Date Issued</span>
                  <span className="text-xs font-bold text-slate-900">{certificate.issuedDate}</span>
                </div>

                <div className="space-y-1 sm:text-right">
                  <span className="text-[10px] text-slate-400 font-mono uppercase block">Issuing Authority</span>
                  <span className="text-xs font-bold text-slate-900">{certificate.issuerName || "SiksaTech Academic Council"}</span>
                </div>
              </div>

              {certificate.verificationHash && (
                <div className="mt-4 pt-3 border-t border-slate-100 text-[10px] font-mono text-slate-400 truncate">
                  SHA-256 Signature: {certificate.verificationHash}
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-rose-200 rounded-3xl p-12 text-center space-y-4 shadow-sm">
              <ShieldAlert className="w-12 h-12 text-rose-500 mx-auto" />
              <div className="space-y-1">
                <h2 className="text-lg font-bold text-slate-900">Certificate Not Found</h2>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  No certificate matching ID <code className="text-rose-600 font-mono font-bold">&quot;{certId}&quot;</code> was found in our cryptographic registry.
                </p>
              </div>
            </div>
          )}

          {/* Search Other Certificate */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm print:hidden">
            <h3 className="text-xs font-bold text-slate-900 mb-3 flex items-center gap-2">
              <Search className="w-4 h-4 text-blue-600" />
              Verify Another SiksaTech Credential
            </h3>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="Enter Certificate ID (e.g. ST-2026-A101)"
                className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-mono focus:outline-none focus:border-blue-600"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-all"
              >
                Verify
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
