"use client";

import { useState } from "react";
import { Navbar } from "@siksatech/ui";
import { Footer } from "@siksatech/ui";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { supabase, isRealSupabase } from "@siksatech/database";
import { Cpu } from "lucide-react";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [grade, setGrade] = useState("Class 9");
  const [institution, setInstitution] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    setIsSubmitting(true);

    if (isRealSupabase && supabase) {
      try {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: name,
              grade_level: grade,
              school_college_name: institution
            }
          }
        });

        if (error) {
          alert("Registration failed: " + error.message);
          setIsSubmitting(false);
          return;
        }

        if (data.user) {
          const { error: profileError } = await supabase.from("profiles").upsert({
            id: data.user.id,
            email: email,
            full_name: name,
            role: "student",
            school_college_name: institution,
            grade_level: grade,
            created_at: new Date().toISOString()
          });

          if (profileError) {
            console.error("Profile creation error:", profileError);
          }
          
          alert("Registration successful! Please check your email for a confirmation link, then log in.");
          setIsSubmitting(false);
          router.push("/auth/login");
        }
      } catch (err: any) {
        alert("Unexpected error: " + err.message);
        setIsSubmitting(false);
      }
    } else {
      alert("Platform is not configured. Please contact support.");
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignup = async () => {
    if (isRealSupabase && supabase) {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });
      if (error) alert("Google authentication failed: " + error.message);
    } else {
      alert("Platform is not configured. Please contact support.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      <Navbar />

      <main className="flex-grow flex items-center justify-center py-24 px-4 sm:px-6">
        <div className="max-w-md w-full border border-slate-200 bg-slate-50/50 p-8 rounded-xl space-y-6 shadow-xl">
          
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-indigo-50 border border-slate-200 flex items-center justify-center mx-auto rounded-lg">
              <Cpu className="w-6 h-6 text-indigo-600" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">Create Student Profile</h1>
            <p className="text-xs text-slate-500">Register to join courses, submit projects, and build your maker portfolio.</p>
          </div>

          {/* Google Sign In/Up Button */}
          <button
            onClick={handleGoogleSignup}
            type="button"
            className="w-full flex items-center justify-center py-3 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 rounded-lg transition-technical shadow-sm cursor-pointer"
          >
            <svg className="w-4 h-4 mr-2.5" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.104C18.28 1.844 15.49 1 12.24 1 5.92 1 1 5.92 1 12.24s4.92 11.24 11.24 11.24c6.6 0 11-4.64 11-11.24 0-.756-.08-1.334-.18-1.955H12.24z"
              />
            </svg>
            SIGN UP WITH GOOGLE
          </button>

          <div className="relative flex py-1 items-center">
            <div className="flex-grow border-t border-slate-200"></div>
            <span className="flex-shrink mx-4 text-[10px] font-mono text-slate-400 uppercase">or register with email</span>
            <div className="flex-grow border-t border-slate-200"></div>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            
            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Aditya Roy"
                className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-600 transition-technical"
              />
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. aditya@gmail.com"
                className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-600 transition-technical"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">Grade / Year</label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-600 transition-technical"
                >
                  <option value="Class 5">Class 5</option>
                  <option value="Class 6">Class 6</option>
                  <option value="Class 7">Class 7</option>
                  <option value="Class 8">Class 8</option>
                  <option value="Class 9">Class 9</option>
                  <option value="Class 10">Class 10</option>
                  <option value="Class 11">Class 11</option>
                  <option value="Class 12">Class 12</option>
                  <option value="College Sem 1-4">College (Yr 1-2)</option>
                  <option value="College Sem 5-8">College (Yr 3-4)</option>
                </select>
              </div>
              <div className="flex flex-col space-y-1.5">
                <label className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">Password</label>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-600 transition-technical"
                />
              </div>
            </div>

            <div className="flex flex-col space-y-1.5">
              <label className="text-[10px] font-extrabold tracking-wider text-slate-700 uppercase">School or College</label>
              <input
                type="text"
                required
                value={institution}
                onChange={(e) => setInstitution(e.target.value)}
                placeholder="e.g. Delhi Public School, Bengaluru"
                className="px-4 py-3 rounded-lg border border-slate-200 bg-white text-xs text-slate-800 focus:outline-none focus:border-indigo-600 transition-technical"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-xs font-bold tracking-widest bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-technical disabled:opacity-60 shadow-md shadow-indigo-100 cursor-pointer"
              >
                {isSubmitting ? "COMPILING INITIAL CONFIGS..." : "INITIALIZE ACCOUNT REGISTRY"}
              </button>
            </div>
          </form>

          <div className="text-center text-xs text-slate-500 border-t border-slate-100 pt-4">
            Already have a profile?{" "}
            <Link href="/auth/login" className="text-indigo-600 font-semibold hover:underline">
              Log in instead
            </Link>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
