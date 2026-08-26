"use client";

import { useState } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createBrowserClient, isRealSupabase } from "@siksatech/database";
import { ShieldCheck, CheckCircle2, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError(null);

    if (!isRealSupabase) {
      setTimeout(() => {
        setSuccess(true);
        setLoading(false);
      }, 500);
      return;
    }

    const supabase = createBrowserClient();
    const { error: updateError } = await supabase.auth.updateUser({
      password: password,
    });

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
    } else {
      setSuccess(true);
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
              <ShieldCheck className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Create New Password
            </h1>
            <p className="text-xs text-slate-500">
              Please enter your new strong password below.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {error}
            </div>
          )}

          {!success ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="new-password" className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">
                  New Password (min. 8 characters)
                </label>
                <input
                  id="new-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <div className="flex flex-col space-y-1.5">
                <label htmlFor="confirm-new-password" className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">
                  Confirm New Password
                </label>
                <input
                  id="confirm-new-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
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
                    UPDATING PASSWORD...
                  </>
                ) : (
                  "UPDATE PASSWORD"
                )}
              </button>
            </form>
          ) : (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-emerald-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Password Successfully Updated!</span>
                </div>
                <p>
                  Your account password has been updated. You can now access your learning tracks and project builds.
                </p>
              </div>

              <Link
                href="/dashboard"
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-blue-600/20 flex items-center justify-center gap-2"
              >
                <span>CONTINUE TO DASHBOARD</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
