import { MadeWithDyad } from "@/components/made-with-dyad";
import { supabase } from "@/integrations/supabase/client";
import { redirect } from "next/navigation";

export default async function Home() {
  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="grid grid-rows-[1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-1 items-center sm:items-start">
        <h1 className="text-3xl font-bold">Bem-vindo(a) à Biblioteca Online!</h1>
        <p className="text-lg">Você está logado como: {session.user.email}</p>
        <p className="text-lg">Seu ID de usuário: {session.user.id}</p>
      </main>
      <MadeWithDyad />
    </div>
  );
}