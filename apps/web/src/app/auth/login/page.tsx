"use client";

import { Suspense, useActionState } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { createBrowserClient, isRealSupabase } from "@siksatech/database";
import { loginWithEmail } from "../actions";
import { Cpu, AlertCircle, Loader2 } from "lucide-react";

function LoginForm() {
  const searchParams = useSearchParams();
  const redirectPath = searchParams.get("redirect") ?? "/dashboard";
  const errorParam = searchParams.get("error");

  const [state, formAction, isPending] = useActionState(loginWithEmail, { error: null });

  const handleGoogleLogin = async () => {
    if (!isRealSupabase) {
      alert("Authentication is not configured. Please contact support.");
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

  return (
    <div className="max-w-md w-full border border-slate-200 bg-slate-50/50 p-8 rounded-xl space-y-6 shadow-xl">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 bg-blue-50 border border-slate-200 flex items-center justify-center mx-auto rounded-lg">
          <Cpu className="w-6 h-6 text-blue-600" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Access SiksaTech Portal
        </h1>
        <p className="text-xs text-slate-500">
          Sign in to your learning dashboard and track your builds.
        </p>
      </div>

      {/* Unauthorized error from team portal redirect */}
      {errorParam === "unauthorized" && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          You don&apos;t have access to that area. Please sign in with an authorized account.
        </div>
      )}

      {/* Server action error */}
      {state.error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.error}
        </div>
      )}

      {/* Google Sign In */}
      <button
        onClick={handleGoogleLogin}
        type="button"
        className="w-full flex items-center justify-center py-3 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-lg transition-all shadow-sm cursor-pointer min-h-[44px]"
      >
        <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
          <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.104C18.28 1.844 15.49 1 12.24 1 5.92 1 12.24s4.92 11.24 11.24 11.24c6.6 0 11-4.64 11-11.24 0-.756-.08-1.334-.18-1.955H12.24z" />
        </svg>
        CONTINUE WITH GOOGLE
      </button>

      <div className="relative flex py-1 items-center">
        <div className="flex-grow border-t border-slate-200" />
        <span className="flex-shrink mx-4 text-[10px] font-mono text-slate-400 uppercase">or use email</span>
        <div className="flex-grow border-t border-slate-200" />
      </div>

      {/* Email login form — uses Server Action */}
      <form action={formAction} className="space-y-4">
        {/* Hidden redirect field */}
        <input type="hidden" name="redirect" value={redirectPath} />

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
            placeholder="e.g. aditya@gmail.com"
            className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <div className="flex items-center justify-between">
            <label htmlFor="password" className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">
              Password
            </label>
            <Link href="/auth/forgot-password" className="text-[10px] text-blue-600 hover:underline">
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
            className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 text-xs font-bold tracking-widest bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-60 shadow-md shadow-blue-100 cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              SIGNING IN...
            </>
          ) : (
            "SIGN IN WITH EMAIL"
          )}
        </button>
      </form>

      <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
        Don&apos;t have an account?{" "}
        <Link href="/auth/register" className="text-blue-600 font-semibold hover:underline">
          Create student profile
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />
      <main className="flex-grow flex items-center justify-center py-24 px-4 sm:px-6">
        <Suspense fallback={<div className="max-w-md w-full border border-slate-200 bg-slate-50 p-8 rounded-xl text-center text-xs text-slate-500">Loading...</div>}>
          <LoginForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
