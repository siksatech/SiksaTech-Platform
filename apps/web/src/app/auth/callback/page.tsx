"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, isRealSupabase } from "@siksatech/database";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (!isRealSupabase || !supabase) {
      router.push("/auth/login?error=not_configured");
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = session.user;
        const { data: profile } = await supabase
          .from("profiles")
          .select("role")
          .eq("id", user.id)
          .single();

        if (!profile) {
          await supabase.from("profiles").upsert({
            id: user.id,
            email: user.email!,
            full_name: user.user_metadata?.full_name || user.user_metadata?.name || "Student",
            role: "student",
            school_college_name: "Google Signup",
            grade_level: "Class 9",
            created_at: new Date().toISOString()
          });
        }

        router.push("/dashboard/student");
      }
    });

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        router.push("/dashboard/student");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 text-indigo-600 animate-spin" />
      <div className="text-center space-y-1">
        <h1 className="text-sm font-bold text-slate-800 uppercase tracking-widest">Verifying Authentication</h1>
        <p className="text-xs text-slate-500">Synchronizing secure session parameters, please wait...</p>
      </div>
    </div>
  );
}
