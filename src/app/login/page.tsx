"use client";

import { Auth } from '@supabase/auth-ui-react';
import { ThemeSupa } from '@supabase/auth-ui-shared';
import { supabase } from '@/integrations/supabase/client';
import { Toaster } from 'sonner';

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-8 space-y-6 bg-card rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold text-center text-foreground">Welcome to Library SaaS</h2>
        <Auth
          supabaseClient={supabase}
          providers={[]} // Only email/password for now
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
          theme="light" // Use light theme, adjust if dark mode is preferred
          redirectTo={process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000/'}
        />
      </div>
      <Toaster />
    </div>
  );
}