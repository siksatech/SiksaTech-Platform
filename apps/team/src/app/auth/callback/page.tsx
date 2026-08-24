"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase, isRealSupabase } from "@siksatech/database";
import { Loader2 } from "lucide-react";

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      if (isRealSupabase && supabase) {
        try {
          const { data: { session }, error } = await supabase.auth.getSession();

          if (error) {
            console.error("Auth callback error:", error.message);
            router.push("/auth/login?error=" + encodeURIComponent(error.message));
            return;
          }

          if (session?.user) {
            router.push("/");
          } else {
            router.push("/auth/login");
          }
        } catch (err) {
          console.error("Unexpected error in OAuth callback:", err);
          router.push("/auth/login");
        }
      } else {
        router.push("/auth/login?error=not_configured");
      }
    };

    handleAuthCallback();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center space-y-4">
      <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
      <div className="text-center space-y-1">
        <h1 className="text-sm font-bold uppercase tracking-widest text-slate-200">Verifying Team Credentials</h1>
        <p className="text-xs text-slate-400">Authenticating access to SiksaTech Operating Portal...</p>
      </div>
    </div>
  );
}
