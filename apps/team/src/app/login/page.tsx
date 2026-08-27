"use client";

/**
 * Team Portal Login — team.siksatech.in/login
 *
 * Staff-only login. After successful authentication, middleware
 * checks for an internal role before granting access.
 */

import { Suspense, useActionState } from "react";
import { SiksaTechLogo } from "@siksatech/ui";
import { useSearchParams } from "next/navigation";
import { AlertCircle, Loader2, ShieldAlert } from "lucide-react";
import { teamLogin } from "./actions";

function TeamLoginForm() {
  const searchParams = useSearchParams();
  const errorParam = searchParams.get("error");
  const [state, formAction, isPending] = useActionState(teamLogin, { error: null });

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-7 space-y-5">
      {/* Unauthorized error */}
      {errorParam === "unauthorized" && (
        <div className="flex items-start gap-2.5 p-3 rounded-lg bg-red-950/50 border border-red-800/60 text-red-400 text-xs">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Access denied. This portal is restricted to authorized SiksaTech team members only.</span>
        </div>
      )}

      {/* Server action error */}
      {state.error && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/50 border border-red-800/60 text-red-400 text-xs">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.error}
        </div>
      )}

      {/* Email login form */}
      <form action={formAction} className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="team-email" className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
            Work Email
          </label>
          <input
            id="team-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="name@siksatech.in"
            className="px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <label htmlFor="team-password" className="text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
            Password
          </label>
          <input
            id="team-password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="px-4 py-3 rounded-lg border border-slate-700 bg-slate-800 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-4 text-xs font-bold tracking-widest bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all disabled:opacity-60 cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              SIGNING IN...
            </>
          ) : (
            "SIGN IN"
          )}
        </button>
      </form>
    </div>
  );
}

export default function TeamLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4">
      <div className="max-w-sm w-full">
        {/* Logo + Brand */}
        <div className="text-center mb-8 space-y-3">
          <div className="flex items-center justify-center">
            <SiksaTechLogo className="text-3xl" variant="light" />
          </div>
          <div>
            <p className="text-xs font-mono text-slate-500 uppercase tracking-widest">
              Team Portal
            </p>
            <h1 className="text-lg font-bold text-white mt-1">
              Internal Operations
            </h1>
          </div>
        </div>

        <Suspense fallback={<div className="bg-slate-900 border border-slate-800 rounded-xl p-7 text-center text-xs text-slate-500">Loading...</div>}>
          <TeamLoginForm />
        </Suspense>

        <div className="text-center mt-6 space-y-4">
          <p className="text-[10px] text-slate-700">
            Restricted access. Unauthorized use is prohibited.
          </p>
          <div className="pt-4 border-t border-slate-900">
            <p className="text-xs text-slate-500">
              Are you a student?{" "}
              <a 
                href={process.env.NEXT_PUBLIC_WEB_URL ? `${process.env.NEXT_PUBLIC_WEB_URL}/auth/login` : "https://siksatech.in/auth/login"} 
                className="text-blue-500 hover:underline font-semibold"
              >
                Go to Student Portal &rarr;
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
