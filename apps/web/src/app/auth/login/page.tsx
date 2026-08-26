"use client";

import { useState, Suspense, useActionState } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { createBrowserClient, isRealSupabase, db } from "@siksatech/database";
import { loginWithEmail } from "../actions";
import { Cpu, AlertCircle, Loader2, KeyRound, Mail, Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") ?? "/dashboard";
  const errorParam = searchParams.get("error");

  const [authMode, setAuthMode] = useState<"password" | "otp">("password");
  const [state, formAction, isPending] = useActionState(loginWithEmail, { error: null });

  // OTP Login state
  const [otpEmail, setOtpEmail] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpLoading, setOtpLoading] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    if (!isRealSupabase) {
      await db.login("student@siksatech.in", "student");
      window.location.href = redirectPath;
      return;
    }
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
      },
    });
    if (error) alert("Google authentication failed: " + error.message);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpEmail.trim()) {
      setOtpError("Please enter your email address.");
      return;
    }
    setOtpLoading(true);
    setOtpError(null);

    if (!isRealSupabase) {
      setTimeout(() => {
        setOtpSent(true);
        setOtpLoading(false);
      }, 500);
      return;
    }

    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({
      email: otpEmail.trim(),
      options: {
        shouldCreateUser: true,
        emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectPath)}`,
      },
    });

    if (error) {
      setOtpError(error.message);
    } else {
      setOtpSent(true);
    }
    setOtpLoading(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otpCode.trim()) {
      setOtpError("Please enter the 6-digit code sent to your email.");
      return;
    }
    setOtpLoading(true);
    setOtpError(null);

    if (!isRealSupabase) {
      await db.login(otpEmail, "student");
      window.location.href = redirectPath;
      return;
    }

    const supabase = createBrowserClient();
    const { error } = await supabase.auth.verifyOtp({
      email: otpEmail.trim(),
      token: otpCode.trim(),
      type: "email",
    });

    if (error) {
      setOtpError(error.message);
      setOtpLoading(false);
    } else {
      window.location.href = redirectPath;
    }
  };

  return (
    <div className="max-w-md w-full border border-slate-200 bg-slate-50/70 p-8 rounded-2xl space-y-6 shadow-xl backdrop-blur-sm">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto rounded-xl shadow-inner">
          <Cpu className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
          Access SiksaTech Portal
        </h1>
        <p className="text-xs text-slate-500">
          Sign in to your hands-on STEM dashboard & verified credentials.
        </p>
      </div>

      {/* Unauthorized error from team portal redirect */}
      {errorParam === "unauthorized" && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          You don&apos;t have access to that area. Please sign in with an authorized account.
        </div>
      )}

      {/* Google Sign In */}
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full flex items-center justify-center py-3 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl transition-all shadow-sm cursor-pointer min-h-[44px]"
      >
        <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.104C18.28 1.844 15.49 1 12.24 1 5.92 1 12.24s4.92 11.24 11.24 11.24c6.6 0 11-4.64 11-11.24 0-.756-.08-1.334-.18-1.955H12.24z" />
        </svg>
        CONTINUE WITH GOOGLE
      </button>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-slate-200" />
        <span className="flex-shrink mx-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest">or email access</span>
        <div className="flex-grow border-t border-slate-200" />
      </div>

      {/* Auth Mode Toggle Tabs (Password vs OTP) */}
      <div className="grid grid-cols-2 p-1 bg-slate-200/80 rounded-xl text-xs font-bold">
        <button
          type="button"
          onClick={() => { setAuthMode("password"); setOtpError(null); }}
          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            authMode === "password" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <KeyRound className="w-3.5 h-3.5" />
          <span>Password</span>
        </button>
        <button
          type="button"
          onClick={() => { setAuthMode("otp"); setOtpError(null); }}
          className={`py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            authMode === "otp" ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-900"
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>OTP Code</span>
        </button>
      </div>

      {/* ─── OPTION 1: PASSWORD LOGIN ───────────────────────────────────────── */}
      {authMode === "password" && (
        <form action={formAction} className="space-y-4">
          <input type="hidden" name="redirect" value={redirectPath} />

          {state.error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {state.error}
            </div>
          )}

          <div className="flex flex-col space-y-1.5">
            <label htmlFor="email" className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              required
              autoComplete="email"
              placeholder="e.g. rahul@gmail.com"
              className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <label htmlFor="password" className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">
                Password
              </label>
              <Link href="/auth/forgot-password" className="text-[11px] text-blue-600 hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <input
              id="password"
              type="password"
              name="password"
              required
              autoComplete="current-password"
              placeholder="••••••••"
              className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="w-full py-3.5 text-xs font-bold tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-blue-600/20 cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                SIGNING IN...
              </>
            ) : (
              "SIGN IN WITH PASSWORD"
            )}
          </button>
        </form>
      )}

      {/* ─── OPTION 2: OTP / MAGIC CODE LOGIN ────────────────────────────────── */}
      {authMode === "otp" && (
        <div className="space-y-4">
          {otpError && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {otpError}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="flex flex-col space-y-1.5">
                <label htmlFor="otp-email" className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">
                  Your Email Address
                </label>
                <input
                  id="otp-email"
                  type="email"
                  value={otpEmail}
                  onChange={(e) => setOtpEmail(e.target.value)}
                  required
                  placeholder="e.g. rahul@gmail.com"
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
                <p className="text-[11px] text-slate-500">
                  We will send a 6-digit secure login code directly to your email inbox.
                </p>
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full py-3.5 text-xs font-bold tracking-wider bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-blue-600/20 cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    SENDING CODE...
                  </>
                ) : (
                  <>
                    <span>SEND 6-DIGIT CODE</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Verification code sent to <b>{otpEmail}</b></span>
              </div>

              <div className="flex flex-col space-y-1.5">
                <label htmlFor="otp-code" className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">
                  Enter 6-Digit Code
                </label>
                <input
                  id="otp-code"
                  type="text"
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  required
                  placeholder="123456"
                  className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-center font-mono text-lg tracking-widest text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
                />
              </div>

              <button
                type="submit"
                disabled={otpLoading}
                className="w-full py-3.5 text-xs font-bold tracking-wider bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all disabled:opacity-60 shadow-lg shadow-emerald-600/20 cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
              >
                {otpLoading ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    VERIFYING...
                  </>
                ) : (
                  "VERIFY & ENTER PORTAL"
                )}
              </button>

              <button
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full text-center text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                Wrong email or didn&apos;t receive code? Try again
              </button>
            </form>
          )}
        </div>
      )}

      <div className="text-center text-xs text-slate-500 border-t border-slate-200/80 pt-4">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-blue-600 font-bold hover:underline">
          Create profile
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-20 px-4 sm:px-6">
        <Suspense fallback={<div className="max-w-md w-full border border-slate-200 bg-slate-50 p-8 rounded-xl text-center text-xs text-slate-500">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
