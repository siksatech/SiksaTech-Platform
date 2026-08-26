"use client";

import { useState } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import Link from "next/link";
import { createBrowserClient, isRealSupabase } from "@siksatech/database";
import { KeyRound, Mail, ArrowLeft, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setLoading(true);
    setError(null);

    if (!isRealSupabase) {
      setTimeout(() => {
        setSubmitted(true);
        setLoading(false);
      }, 600);
      return;
    }

    const supabase = createBrowserClient();
    const siteUrl = window.location.origin;
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${siteUrl}/auth/callback?redirect=/auth/reset-password`,
    });

    if (resetError) {
      setError(resetError.message);
      setLoading(false);
    } else {
      setSubmitted(true);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6">
        <div className="max-w-md w-full border border-slate-200 bg-slate-50/70 p-8 rounded-2xl space-y-6 shadow-xl backdrop-blur-sm">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto rounded-xl shadow-inner">
              <KeyRound className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Reset Your Password
            </h1>
            <p className="text-xs text-slate-500">
              Enter your email and we will send you a secure recovery link.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="reset-email" className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">
                  Registered Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="e.g. aditya@gmail.com"
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 text-xs font-bold tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-blue-600/20 cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    SENDING LINK...
                  </>
                ) : (
                  "SEND RESET LINK"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Password Reset Email Sent</span>
                </div>
                <p className="leading-relaxed">
                  We have dispatched a password reset link to <b>{email}</b> from <b>support@siksatech.in</b>.
                </p>
                <p className="text-[11px] text-emerald-700">
                  Please check your inbox (and spam/promotions folder) and click the link to configure your new password.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSubmitted(false)}
                className="w-full py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                Send to a different email
              </button>
            </div>
          )}

          <div className="text-center text-xs border-t border-slate-200/80 pt-4">
            <Link href="/auth/login" className="text-blue-600 hover:underline font-bold inline-flex items-center gap-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Login
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
