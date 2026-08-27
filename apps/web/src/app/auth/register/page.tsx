"use client";

import { useState, useActionState } from "react";
import { Navbar, Footer } from "@siksatech/ui";
import Link from "next/link";
import { createBrowserClient, isRealSupabase } from "@siksatech/database";
import { registerWithEmail } from "../actions";
import { Cpu, AlertCircle, CheckCircle2, Loader2, GraduationCap, Users, School, Building2 } from "lucide-react";

type RoleOption = {
  id: "student" | "parent" | "school" | "college";
  label: string;
  sublabel: string;
  icon: React.ComponentType<{ className?: string }>;
};

const ROLE_OPTIONS: RoleOption[] = [
  {
    id: "student",
    label: "Student",
    sublabel: "Learn STEM tracks & build projects",
    icon: GraduationCap,
  },
  {
    id: "parent",
    label: "Parent / Guardian",
    sublabel: "Track child progress & STEM kits",
    icon: Users,
  },
  {
    id: "school",
    label: "School / ATL Coordinator",
    sublabel: "Manage ATL lab, batches & workshops",
    icon: School,
  },
  {
    id: "college",
    label: "College / Club Lead",
    sublabel: "Advanced robotics & hardware society",
    icon: Building2,
  },
];

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<"student" | "parent" | "school" | "college">("student");
  const [state, formAction, isPending] = useActionState(registerWithEmail, {
    error: null,
    success: false,
  });

  const handleGoogleSignup = async () => {
    if (!isRealSupabase) {
      alert("Authentication is not configured. Please contact support.");
      return;
    }
    const supabase = createBrowserClient();
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?redirect=/dashboard`,
      },
    });
    if (error) alert("Google authentication failed: " + error.message);
  };

  if (state.success) {
    return (
      <div className="flex flex-col min-h-screen bg-white text-slate-900">
        <Navbar />
        <main className="flex-grow flex items-center justify-center py-24 px-4">
          <div className="max-w-md w-full border border-slate-200 bg-slate-50/50 p-8 rounded-2xl space-y-4 shadow-xl text-center">
            <div className="w-12 h-12 bg-green-50 border border-green-200 flex items-center justify-center mx-auto rounded-xl">
              <CheckCircle2 className="w-6 h-6 text-green-600" />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Check Your Email</h1>
            <p className="text-sm text-slate-600">
              We&apos;ve sent an activation link to your email. Click it to enter your personalized dashboard and start learning.
            </p>
            <Link
              href="/auth/login"
              className="inline-block mt-4 px-6 py-3 text-xs font-bold tracking-widest bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all shadow-md shadow-blue-600/20"
            >
              BACK TO LOGIN
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-16 px-4 sm:px-6">
        <div className="max-w-xl w-full border border-slate-200 bg-slate-50/70 p-8 rounded-2xl space-y-6 shadow-xl backdrop-blur-sm">

          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-50 border border-blue-100 flex items-center justify-center mx-auto rounded-xl shadow-inner">
              <Cpu className="w-6 h-6 text-blue-600" />
            </div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
              Create Your SiksaTech Profile
            </h1>
            <p className="text-xs text-slate-500">
              Join students, parents, and educators building the next generation of engineers.
            </p>
          </div>

          {state.error && (
            <div className="flex items-center gap-2 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0" />
              {state.error}
            </div>
          )}

          {/* Role Persona Selection Cards */}
          <div className="space-y-2">
            <label className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase block">
              I am registering as a:
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {ROLE_OPTIONS.map((opt) => {
                const Icon = opt.icon;
                const isSelected = selectedRole === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setSelectedRole(opt.id)}
                    className={`flex items-start gap-3 p-3.5 rounded-xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? "border-blue-600 bg-blue-50/80 shadow-sm ring-2 ring-blue-600/20"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50/60"
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? "bg-blue-600 text-white shadow-sm" : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold ${isSelected ? "text-blue-900" : "text-slate-900"}`}>
                        {opt.label}
                      </p>
                      <p className="text-[10px] text-slate-500 line-clamp-1 leading-normal">
                        {opt.sublabel}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Google Sign Up */}
          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full flex items-center justify-center py-3 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-xl transition-all shadow-sm cursor-pointer min-h-[44px]"
          >
            <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.104C18.28 1.844 15.49 1 12.24 1 5.92 1 1 5.92 1 12.24s4.92 11.24 11.24 11.24c6.6 0 11-4.64 11-11.24 0-.756-.08-1.334-.18-1.955H12.24z" />
            </svg>
            SIGN UP WITH GOOGLE
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200" />
            <span className="flex-shrink mx-4 text-[10px] font-mono text-slate-400 uppercase tracking-widest">or create with email</span>
            <div className="flex-grow border-t border-slate-200" />
          </div>

          {/* Registration form — uses Server Action */}
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="role" value={selectedRole} />

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="full_name" className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">
                {selectedRole === "parent" ? "Parent / Guardian Name" : selectedRole === "school" ? "Coordinator / Educator Name" : "Full Name"}
              </label>
              <input
                id="full_name"
                type="text"
                name="full_name"
                required
                autoComplete="name"
                placeholder={selectedRole === "parent" ? "e.g. Ananya Sharma" : selectedRole === "school" ? "e.g. Dr. Rajeshwar Verma" : "e.g. Aditya Sharma"}
                className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="reg-email" className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">
                Email Address
              </label>
              <input
                id="reg-email"
                type="email"
                name="email"
                required
                autoComplete="email"
                placeholder="e.g. user@example.com"
                className="px-4 py-3 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label htmlFor="reg-password" className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">
                Password
              </label>
              <input
                id="reg-password"
                type="password"
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Min. 8 characters"
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
                  CREATING {selectedRole.toUpperCase()} PROFILE...
                </>
              ) : (
                `CREATE ${selectedRole.toUpperCase()} ACCOUNT`
              )}
            </button>
          </form>

          <p className="text-[10px] text-slate-400 text-center">
            By creating an account, you agree to our{" "}
            <Link href="/terms" className="text-blue-600 hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</Link>.
          </p>

          <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-blue-600 font-semibold hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
