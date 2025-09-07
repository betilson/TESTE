"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface SessionContextType {
  session: Session | null;
  user: User | null;
  isLoading: boolean;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export const SessionContextProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, currentSession) => {
        if (currentSession) {
          setSession(currentSession);
          setUser(currentSession.user);
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') {
            router.push('/'); // Redirect to dashboard on sign-in/update
            toast.success('Successfully logged in!');
          }
        } else {
          setSession(null);
          setUser(null);
          if (event === 'SIGNED_OUT') {
            router.push('/login'); // Redirect to login on sign-out
            toast.info('You have been logged out.');
          } else if (event === 'INITIAL_SESSION' && window.location.pathname !== '/login') {
            router.push('/login'); // Redirect to login if no session initially and not on login page
          }
        }
        setIsLoading(false);
      }
    );

    // Fetch initial session
    supabase.auth.getSession().then(({ data: { session: initialSession } }) => {
      if (initialSession) {
        setSession(initialSession);
        setUser(initialSession.user);
      } else if (window.location.pathname !== '/login') {
        router.push('/login');
      }
      setIsLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [router]);

  return (
    <SessionContext.Provider value={{ session, user, isLoading }}>
      {children}
    </SessionContext.Provider>
  );
};

export const useSession = () => {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within a SessionContextProvider');
  }
  return context;
};