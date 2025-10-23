import { createContext, useContext, useEffect, useState } from 'react';
import { User, AuthError } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Database } from '../lib/database.types';

type Employer = Database['public']['Tables']['employers']['Row'];

interface AuthContextType {
  user: User | null;
  employer: Employer | null;
  loading: boolean;
  signUp: (email: string, password: string, companyData: {
    company_name: string;
    contact_email: string;
    contact_phone?: string;
    role?: 'admin' | 'recruiter' | 'viewer';
  }) => Promise<{ error: AuthError | null }>;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [employer, setEmployer] = useState<Employer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession()
      .then(({ data: { session } }) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadEmployerProfile(session.user.id);
        } else {
          setLoading(false);
        }
      })
      .catch((error) => {
        console.error('Error getting session:', error);
        setLoading(false);
      });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (() => {
        setUser(session?.user ?? null);
        if (session?.user) {
          loadEmployerProfile(session.user.id);
        } else {
          setEmployer(null);
          setLoading(false);
        }
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  async function loadEmployerProfile(userId: string) {
    try {
      const { data, error } = await supabase
        .from('employers')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      setEmployer(data);
    } catch (error) {
      console.error('Error loading employer profile:', error);
    } finally {
      setLoading(false);
    }
  }

  const signUp = async (email: string, password: string, companyData: {
    company_name: string;
    contact_email: string;
    contact_phone?: string;
    role?: 'admin' | 'recruiter' | 'viewer';
  }) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) return { error };
      if (!data.user) return { error: new Error('User creation failed') as AuthError };

      const { error: profileError } = await supabase
        .from('employers')
        .insert({
          user_id: data.user.id,
          company_name: companyData.company_name,
          contact_email: companyData.contact_email,
          contact_phone: companyData.contact_phone || null,
          role: companyData.role || 'recruiter',
        });

      if (profileError) {
        await supabase.auth.signOut();
        return { error: profileError as AuthError };
      }

      return { error: null };
    } catch (error) {
      return { error: error as AuthError };
    }
  };

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { error };
  };

  const signOut = async () => {
    await supabase.auth.signOut();
    setEmployer(null);
  };

  return (
    <AuthContext.Provider value={{ user, employer, loading, signUp, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
