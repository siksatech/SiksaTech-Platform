"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase, isRealSupabase } from "@siksatech/database";
import { SiksaTechLogo } from "@siksatech/ui";
import { ShieldCheck, Lock, Mail, ArrowRight, Loader2 } from "lucide-react";

export default function TeamLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setIsSubmitting(true);
    setErrorMsg("");

    if (isRealSupabase && supabase) {
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password
        });
        if (error) {
          setErrorMsg(error.message);
          setIsSubmitting(false);
          return;
        }

        if (data.user) {
          // Set user in local session
          localStorage.setItem("siksatech_user", JSON.stringify({
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name || "Team Member",
            role: "super_admin"
          }));
          router.push("/");
        }
      } catch (err: any) {
        setErrorMsg(err.message || "Failed to sign in");
        setIsSubmitting(false);
      }
    } else {
      // Fallback dev admin login
      localStorage.setItem("siksatech_user", JSON.stringify({
        id: "admin-local",
        email,
        name: "Admin User",
        role: "super_admin"
      }));
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    if (isRealSupabase && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) setErrorMsg(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="flex justify-center mb-6">
          <SiksaTechLogo className="h-9 sm:h-10 w-auto text-white" />
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight text-white">
          Team Operating System
        </h2>
        <p className="mt-2 text-xs text-slate-400">
          Internal operations, curriculum, events, and platform governance
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-slate-900 py-8 px-6 shadow-2xl border border-slate-800 rounded-2xl sm:px-10 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-red-900/40 border border-red-800 text-xs text-red-300">
              {errorMsg}
            </div>
          )}

          <form className="space-y-4" onSubmit={handleLogin}>
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Staff Email Address
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@siksatech.in"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Security Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full px-4 py-2.5 bg-slate-950 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs uppercase tracking-wider shadow-lg shadow-blue-600/30 transition-all disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" /> Authenticating...
                </>
              ) : (
                <>
                  Sign In to Team OS <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-800" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-slate-900 px-3 text-slate-500 font-semibold">Or SSO</span>
            </div>
          </div>

          <button
            onClick={handleGoogleLogin}
            type="button"
            className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-slate-700 bg-slate-950 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-all"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            Sign in with Google Workspace
          </button>
        </div>
      </div>
    </div>
  );
}
