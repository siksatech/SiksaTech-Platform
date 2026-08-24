"use client";

import { useState, useEffect, use } from "react";
import { Navbar } from "@siksatech/ui";
import { Footer } from "@siksatech/ui";
import Link from "next/link";
import { db, Certificate } from "@siksatech/database";
import { ShieldCheck, ShieldAlert, ArrowLeft, Search, CheckCircle } from "lucide-react";

export default function VerifyCertificate({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const initialId = resolvedParams.id;
  
  const [certId, setCertId] = useState(initialId);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [searchId, setSearchId] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (certId) {
      db.verifyCertificate(certId).then((res) => {
        setCertificate(res);
        setHasSearched(true);
      });
    }
  }, [certId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId) {
      setCertId(searchId);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-primary-navy text-secondary-white">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6">
        <div className="max-w-xl w-full border border-border-slate bg-navy-light/20 p-8 rounded-lg shadow-2xl space-y-8">
          
          {/* Header info */}
          <div className="text-center space-y-2">
            <span className="text-[10px] font-mono tracking-widest text-accent-cyan uppercase">Security Node</span>
            <h1 className="text-2xl font-bold tracking-tight">Public Certification Registry</h1>
            <p className="text-xs text-text-muted">Validate hardware build milestones and course accomplishments.</p>
          </div>

          {/* Verification Results Panel */}
          {certificate ? (
            <div className="border border-emerald-500/20 bg-emerald-500/5 p-6 rounded-lg space-y-6">
              
              {/* Verified Title bar */}
              <div className="flex items-center justify-between border-b border-emerald-500/10 pb-4">
                <div className="flex items-center gap-2 text-emerald-400">
                  <ShieldCheck className="w-5 h-5" />
                  <span className="text-xs font-bold tracking-widest uppercase">CERTIFICATE VERIFIED</span>
                </div>
                <span className="text-[10px] font-mono text-text-muted">{certificate.id}</span>
              </div>

              {/* Certificate content specs */}
              <div className="space-y-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-text-muted">Student Name:</span>
                  <span className="font-bold text-secondary-white">{certificate.studentName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Program Track:</span>
                  <span className="font-semibold text-secondary-white">{certificate.programName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-muted">Date of Issuance:</span>
                  <span className="font-mono text-secondary-white">{certificate.issuedDate}</span>
                </div>
                
                <div className="border-t border-emerald-500/10 pt-4 space-y-2">
                  <span className="text-text-muted block">Achievement Details:</span>
                  <p className="text-secondary-white leading-relaxed italic bg-navy-dark/40 p-4 border border-border-slate rounded">
                    "{certificate.achievement}"
                  </p>
                </div>

                <div className="space-y-2.5">
                  <span className="text-text-muted block">Verified Hardware & Coding Capabilities:</span>
                  <div className="flex flex-wrap gap-2">
                    {certificate.skillsVerified.map((skill, idx) => (
                      <span key={idx} className="px-3 py-1 rounded bg-emerald-500/15 border border-emerald-500/30 text-xs text-emerald-300">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          ) : (
            hasSearched && (
              <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-lg text-center space-y-4">
                <div className="w-12 h-12 bg-red-500/10 border border-red-500/25 rounded-full flex items-center justify-center mx-auto text-red-400">
                  <ShieldAlert className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-red-400 uppercase tracking-widest">ID NOT FOUND IN REGISTRY</h3>
                  <p className="text-xs text-text-muted max-w-sm mx-auto leading-relaxed">
                    The certificate identifier **{certId}** could not be verified. Verify that the spelling is exactly as written on the certificate.
                  </p>
                </div>
              </div>
            )
          )}

          {/* Search registry console */}
          <div className="border-t border-border-slate/40 pt-6 space-y-4">
            <span className="text-[10px] font-bold text-secondary-white uppercase tracking-wider block">Query Registry Database</span>
            <form onSubmit={handleSearchSubmit} className="flex gap-2">
              <input
                type="text"
                required
                value={searchId}
                onChange={(e) => setSearchId(e.target.value)}
                placeholder="e.g. ST-2026-B202"
                className="flex-grow px-4 py-3 rounded border border-border-slate bg-navy-dark text-xs text-secondary-white focus:outline-none focus:border-accent-cyan"
              />
              <button
                type="submit"
                className="px-5 py-3 bg-accent-cyan hover:bg-accent-cyan-hover text-navy-dark rounded text-xs font-bold tracking-widest transition-technical flex items-center gap-1.5"
              >
                <Search className="w-4 h-4" /> QUERY
              </button>
            </form>
          </div>

          <div className="text-center pt-2">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-xs font-bold text-accent-cyan tracking-widest hover:underline"
            >
              <ArrowLeft className="w-4 h-4" /> RETURN TO PLATFORM
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
