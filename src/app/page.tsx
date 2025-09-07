"use client";

import { MadeWithDyad } from "@/components/made-with-dyad";
import { useSession } from "@/components/session-context-provider";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useRouter } from "next/navigation";

export default function Home() {
  const { user, isLoading } = useSession();
  const router = useRouter();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/login');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  if (!user) {
    // This case should ideally be handled by the SessionContextProvider redirect
    // but as a fallback, we can redirect here too.
    router.push('/login');
    return null;
  }

  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start">
        <h1 className="text-4xl font-bold">Welcome to your Library Dashboard, {user.email}!</h1>
        <p className="text-lg">Your role: {user.user_metadata?.role || 'reader'}</p>
        <Button onClick={handleLogout}>Logout</Button>
      </main>
      <MadeWithDyad />
    </div>
  );
}