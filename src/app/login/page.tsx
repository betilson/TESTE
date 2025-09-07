import { SupabaseAuthUI } from '@/components/auth/supabase-auth-ui';
import { MadeWithDyad } from '@/components/made-with-dyad';

export default function LoginPage() {
  return (
    <>
      <SupabaseAuthUI />
      <MadeWithDyad />
    </>
  );
}