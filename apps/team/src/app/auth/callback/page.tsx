"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, isRealSupabase } from "@siksatech/database";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    if (!isRealSupabase || !supabase) {
      router.push("/");
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        localStorage.setItem("siksatech_user", JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "Team Member",
          role: "super_admin"
        }));
        router.push("/");
      }
    });

    // Check existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        localStorage.setItem("siksatech_user", JSON.stringify({
          id: session.user.id,
          email: session.user.email,
          name: session.user.user_metadata?.full_name || session.user.user_metadata?.name || "Team Member",
          role: "super_admin"
        }));
        router.push("/");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      <div className="text-center space-y-1">
        <h1 className="text-sm font-bold uppercase tracking-widest text-slate-200">Verifying Team Credentials</h1>
        <p className="text-xs text-slate-400">Authenticating access to SiksaTech Operating Portal...</p>
      </div>
    </div>
  );
}
