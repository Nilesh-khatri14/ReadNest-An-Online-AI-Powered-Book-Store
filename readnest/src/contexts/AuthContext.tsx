import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Session, User as SupabaseUser } from '@supabase/supabase-js'; // Import Session

type User = {
  id: string;
  name: string;
  email: string;
  isPublisher: boolean;
  // avatar_url?: string; // Keep if you added this in a previous step
};

type AuthContextType = {
  user: User | null;
  session: Session | null; // Add session here
  isAuthenticated: boolean;
  authLoading: boolean; // Add authLoading here
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null); // Add session state
  const [authLoading, setAuthLoading] = useState(true); // Add authLoading state

  useEffect(() => {
    setAuthLoading(true);
    // Check if user is logged in from localStorage and Supabase session
    const checkUserSession = async () => {
      // Check local storage first for quick rendering
      const storedUser = localStorage.getItem('readnest-user');
      const storedSession = localStorage.getItem('readnest-session');

      if (storedUser && storedSession) {
        setUser(JSON.parse(storedUser));
        setSession(JSON.parse(storedSession));
      }

      // Then verify with Supabase
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      setSession(currentSession); // Set session from Supabase

      if (currentSession?.user) {
        const userData: User = {
          id: currentSession.user.id,
          name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || 'User',
          email: currentSession.user.email || '',
          isPublisher: false, // You can modify this based on your requirements
          // avatar_url: currentSession.user.user_metadata?.avatar_url, // Keep if using avatar
        };
        setUser(userData);
        localStorage.setItem('readnest-user', JSON.stringify(userData));
        localStorage.setItem('readnest-session', JSON.stringify(currentSession));
      } else if (!currentSession?.user && (storedUser || storedSession)) {
        // If no session but we had a stored user/session, clear it
        localStorage.removeItem('readnest-user');
        localStorage.removeItem('readnest-session');
        setUser(null);
        setSession(null);
      }
      setAuthLoading(false);
    };

    checkUserSession();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, currentSession) => {
        setAuthLoading(true);
        setSession(currentSession); // Update session on auth state change
        if (currentSession?.user) {
          const userData: User = {
            id: currentSession.user.id,
            name: currentSession.user.user_metadata?.name || currentSession.user.email?.split('@')[0] || 'User',
            email: currentSession.user.email || '',
            isPublisher: false, // You can modify this based on your requirements
            // avatar_url: currentSession.user.user_metadata?.avatar_url, // Keep if using avatar
          };
          setUser(userData);
          localStorage.setItem('readnest-user', JSON.stringify(userData));
          localStorage.setItem('readnest-session', JSON.stringify(currentSession));
        } else {
          setUser(null);
          localStorage.removeItem('readnest-user');
          localStorage.removeItem('readnest-session');
        }
        setAuthLoading(false);
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Directly proceed with Supabase authentication without calling the login_attempt function first
      // This ensures we get proper error handling from Supabase
      const { data: { session, user: authUser }, error } = await supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        // Log the attempt after we know the result
        await supabase.rpc('handle_login_attempt', {
          login_email: email,
          login_password: password
        });
        
        // Show the actual error from Supabase
        toast.error(error.message);
        console.error('Login error:', error);
        return;
      }

      if (authUser) {
        const userData: User = {
          id: authUser.id,
          name: authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'User',
          email: authUser.email || '',
          isPublisher: false,
        };
        setUser(userData);
        localStorage.setItem('readnest-user', JSON.stringify(userData));
        toast.success('Login successful!');
        
        // Log successful attempt
        await supabase.rpc('handle_login_attempt', {
          login_email: email,
          login_password: password
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('An unexpected error occurred during login.');
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      // For registration, set emailConfirm to false for easier testing
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
          // Don't require email confirmation for development purposes
          emailRedirectTo: window.location.origin
        }
      });

      if (error) {
        toast.error(error.message);
        console.error('Registration error:', error);
        return;
      }

      // Check if email confirmation is enabled
      if (data?.user && !data?.session) {
        // Email confirmation is enabled
        toast.success('Registration successful! Please check your email to confirm your account.');
        toast.info('Note: You may need to disable email confirmation in Supabase for easier testing.');
      } else if (data?.user && data?.session) {
        // Email confirmation is disabled, user is automatically logged in
        const userData: User = {
          id: data.user.id,
          name: data.user.user_metadata?.name || data.user.email?.split('@')[0] || 'User',
          email: data.user.email || '',
          isPublisher: false,
        };
        setUser(userData);
        localStorage.setItem('readnest-user', JSON.stringify(userData));
        toast.success('Registration and login successful!');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error('An unexpected error occurred during registration.');
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        toast.error('Error logging out');
        throw error;
      }
      toast.success('Logged out successfully');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session, // Provide session
        isAuthenticated: !!user,
        authLoading, // Provide authLoading
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
