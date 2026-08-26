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
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100 font-sans">
      <Navbar />

      <main className="flex-grow flex flex-col items-center justify-center py-12 px-4 sm:px-6">
        <div className="max-w-3xl w-full space-y-8">

          {/* Navigation & Actions Topbar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <Link
              href="/learn"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Pathways
            </Link>

            {certificate && (
              <div className="flex items-center gap-2 print:hidden">
                <button
                  onClick={handleShare}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 hover:border-slate-700 text-xs font-medium text-slate-300 hover:text-white transition-all flex items-center gap-1.5 min-h-[36px]"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Share2 className="w-3.5 h-3.5" />}
                  {copied ? "Link Copied" : "Share"}
                </button>
                <button
                  onClick={handlePrint}
                  className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-bold text-white transition-all shadow-md shadow-blue-900/30 flex items-center gap-1.5 min-h-[36px]"
                >
                  <Printer className="w-3.5 h-3.5" /> Print / Save PDF
                </button>
              </div>
            )}
          </div>

          {/* Certificate View Card */}
          {loading ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-12 text-center text-slate-500 text-sm">
              Verifying cryptographic hash in registry...
            </div>
          ) : certificate ? (
            <div className="bg-white text-slate-900 rounded-3xl p-8 sm:p-12 shadow-2xl border-4 border-slate-200 relative overflow-hidden print:border-2 print:p-8">
              {/* Background watermark badge */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-blue-50/50 rounded-full blur-3xl -z-1 pointer-events-none" />

              {/* Decorative Corner Accents */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-blue-600" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-blue-600" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-blue-600" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-blue-600" />

              {/* Verified Ribbon Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b-2 border-slate-100 pb-6 mb-8 gap-4">
                <div className="flex items-center gap-3">
                  <SiksaTechLogo className="h-8 w-auto" />
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  Verified Credential
                </div>
              </div>

              {/* Certificate Main Body */}
              <div className="text-center space-y-6 max-w-2xl mx-auto">
                <p className="text-xs font-bold font-mono tracking-widest text-blue-600 uppercase">
                  Certificate of Technical Achievement
                </p>

                <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-950 font-serif tracking-tight">
                  {certificate.studentName}
                </h1>

                <p className="text-xs text-slate-600 leading-relaxed max-w-lg mx-auto">
                  has successfully built and verified all physical circuit milestones and firmware requirements for the program:
                </p>

                <h2 className="text-lg sm:text-xl font-bold text-blue-700 font-mono tracking-wide">
                  {certificate.programName}
                </h2>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-700 italic leading-relaxed">
                  &quot;{certificate.achievement}&quot;
                </div>

                {/* Skills Verified Badges */}
                <div className="pt-2">
                  <span className="text-[11px] font-mono font-bold uppercase text-slate-500 block mb-3">
                    Demonstrated Capabilities
                  </span>
                  <div className="flex flex-wrap items-center justify-center gap-2">
                    {certificate.skillsVerified.map((skill, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 text-xs font-bold"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Certificate Footer / Signature & Hash */}
              <div className="mt-12 pt-8 border-t-2 border-slate-100 grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs text-slate-600 items-end">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Issued by</span>
                  <p className="font-bold text-slate-900">{certificate.issuerName || "SiksaTech Academic Council"}</p>
                  <p className="text-slate-500 font-mono text-[11px]">Issued on: {certificate.issuedDate}</p>
                </div>

                <div className="sm:text-right space-y-1">
                  <span className="text-[10px] font-mono text-slate-400 block uppercase">Registry Identifier</span>
                  <p className="font-mono font-bold text-slate-900 text-sm tracking-wider">{certificate.id}</p>
                  <p className="font-mono text-[9px] text-slate-400 truncate max-w-xs sm:ml-auto">
                    {certificate.verificationHash || `ST-HASH-${certificate.id}`}
                  </p>
                </div>
              </div>
            </div>
          ) : (
            hasSearched && (
              <div className="bg-slate-900 border border-rose-800/50 rounded-2xl p-8 text-center space-y-4">
                <div className="w-12 h-12 bg-rose-500/10 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto text-rose-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-white uppercase tracking-wider">
                    Certificate ID Not Found
                  </h2>
                  <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto leading-relaxed">
                    The identifier <strong className="text-white font-mono">{certId}</strong> does not match any issued record. Ensure you entered the exact ID printed on the certificate.
                  </p>
                </div>
              </div>
            )
          )}

          {/* Search Query Registry Box */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4 print:hidden shadow-xl">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider block">
              Verify Another Certificate Identifier
            </span>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                required
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g. ST-2026-A101"
                className="flex-grow px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-blue-500 font-mono uppercase"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold tracking-wider transition-all flex items-center gap-2 shadow-md shadow-blue-900/30 shrink-0"
              >
                <Search className="w-4 h-4" /> VERIFY
              </button>
            </form>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
