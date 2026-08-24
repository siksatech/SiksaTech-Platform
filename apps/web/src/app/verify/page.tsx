"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Navbar, Footer } from "@siksatech/ui";
import { db, Certificate } from "@siksatech/database";
import { ShieldCheck, ShieldAlert, Search } from "lucide-react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const initialId = searchParams.get("id") || "";
  
  const [certId, setCertId] = useState(initialId);
  const [certificate, setCertificate] = useState<Certificate | null>(null);
  const [searchId, setSearchId] = useState(initialId);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (certId) {
      setLoading(true);
      db.verifyCertificate(certId).then((res) => {
        setCertificate(res);
        setHasSearched(true);
        setLoading(false);
      });
    }
  }, [certId]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchId.trim()) {
      setCertId(searchId.trim());
    }
  };

  return (
    <main className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6">
      <div className="max-w-xl w-full border border-border-slate bg-navy-light/20 p-8 rounded-lg shadow-2xl space-y-8">
        
        {/* Header info */}
        <div className="text-center space-y-2">
          <span className="text-[10px] font-mono tracking-widest text-blue-500 uppercase">Security Node</span>
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
                  &quot;{certificate.achievement}&quot;
                </p>
              </div>

              <div className="space-y-2.5">
                <span className="text-text-muted block">Verified Hardware &amp; Coding Capabilities:</span>
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
          hasSearched && !loading && (
            <div className="border border-red-500/20 bg-red-500/5 p-6 rounded-lg text-center space-y-4">
              <div className="w-12 h-12 bg-red-500/10 border border-red-500/25 rounded-full flex items-center justify-center mx-auto text-red-400">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-red-400 uppercase tracking-wide">Registry Record Not Found</h3>
                <p className="text-xs text-text-muted">
                  No verifiable credential matched ID: <span className="font-mono text-secondary-white">&quot;{certId}&quot;</span>.
                </p>
              </div>
            </div>
          )
        )}

        {/* Verification Form Search Bar */}
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          <div className="relative">
            <input 
              type="text" 
              placeholder="e.g. ST-2026-ARD1" 
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
              className="w-full bg-navy-dark border border-border-slate py-2.5 pl-4 pr-10 text-xs text-secondary-white rounded-lg focus:outline-none focus:border-blue-500 font-mono uppercase"
            />
            <button 
              type="submit" 
              className="absolute right-2 top-2 p-1 text-text-muted hover:text-blue-400 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          </div>
          <button 
            type="submit" 
            disabled={loading}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-lg shadow-sm transition-all"
          >
            {loading ? "Verifying..." : "Verify Registry Credential"}
          </button>
        </form>

      </div>
    </main>
  );
}

export default function VerifyPage() {
  return (
    <div className="flex flex-col min-h-screen bg-primary-navy text-secondary-white">
      <Navbar />
      <Suspense fallback={<div className="flex-grow flex items-center justify-center text-sm text-text-muted">Loading registry...</div>}>
        <VerifyContent />
      </Suspense>
      <Footer />
    </div>
  );
}
