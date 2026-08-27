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
    <div className="bg-white border border-slate-200 rounded-2xl p-7 space-y-5 shadow-sm">
      {/* Unauthorized error */}
      {errorParam === "unauthorized" && (
        <div className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
          <span>Access denied. This portal is restricted to authorized SiksaTech team members only.</span>
        </div>
      )}

      {/* Server action error */}
      {state.error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {state.error}
        </div>
      )}

      {/* Email login form */}
      <form action={formAction} className="space-y-4">
        <div className="flex flex-col space-y-1.5">
          <label htmlFor="team-email" className="text-[10px] font-extrabold tracking-wider text-slate-600 uppercase">
            Work Email
          </label>
          <input
            id="team-email"
            type="email"
            name="email"
            required
            autoComplete="email"
            placeholder="name@siksatech.in"
            className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>

        <div className="flex flex-col space-y-1.5">
          <label htmlFor="team-password" className="text-[10px] font-extrabold tracking-wider text-slate-600 uppercase">
            Password
          </label>
          <input
            id="team-password"
            type="password"
            name="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
            className="px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:bg-white transition-all"
          />
        </div>

        <button
          type="submit"
          disabled={isPending}
          className="w-full py-3.5 text-xs font-bold tracking-wider uppercase bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-md transition-all disabled:opacity-60 cursor-pointer min-h-[44px] flex items-center justify-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              SIGNING IN...
            </>
          ) : (
            "Sign In to Team Portal"
          )}
        </button>
      </form>
    </div>
  );
}

export default function TeamLoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="max-w-sm w-full">
        {/* Logo + Brand */}
        <div className="text-center mb-8 space-y-3">
          <div className="flex items-center justify-center">
            <SiksaTechLogo className="text-3xl" />
          </div>
          <div>
            <p className="text-[10px] font-mono text-blue-600 uppercase tracking-widest font-bold">
              Staff Portal
            </p>
            <h1 className="text-lg font-bold text-slate-900 mt-1">
              Internal Operations Hub
            </h1>
          </div>
        </div>

        <Suspense fallback={<div className="bg-white border border-slate-200 rounded-2xl p-7 text-center text-xs text-slate-500 shadow-sm">Loading...</div>}>
          <TeamLoginForm />
        </Suspense>

        <div className="text-center mt-6 space-y-4">
          <p className="text-[11px] text-slate-500">
            Restricted access. Authorized personnel only.
          </p>
          <div className="pt-4 border-t border-slate-200">
            <p className="text-xs text-slate-600">
              Are you a student?{" "}
              <a 
                href={process.env.NEXT_PUBLIC_WEB_URL ? `${process.env.NEXT_PUBLIC_WEB_URL}/auth/login` : "https://siksatech.in/auth/login"} 
                className="text-blue-600 hover:underline font-semibold"
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
