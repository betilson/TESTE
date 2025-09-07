"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { toast } from 'sonner';

export function SupabaseAuthUI() {
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN') {
        toast.success('Login realizado com sucesso!');
        router.push('/'); // Redireciona para a página inicial após o login
      } else if (event === 'SIGNED_OUT') {
        toast.info('Você foi desconectado.');
        router.push('/login'); // Redireciona para a página de login após o logout
      }
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-foreground">Bem-vindo(a) à Biblioteca Online</h2>
        <Auth
          supabaseClient={supabase}
          providers={[]}
          appearance={{
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: 'hsl(var(--primary))',
                  brandAccent: 'hsl(var(--primary-foreground))',
                },
              },
            },
          }}
          theme="light"
          redirectTo={process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}
        />
      </div>
    </div>
  );
}