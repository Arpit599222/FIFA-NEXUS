import { supabase } from './supabase';

const isPlaceholder = import.meta.env.VITE_SUPABASE_URL === undefined || import.meta.env.VITE_SUPABASE_URL === '';

export const authService = {
  async signUp(email: string, password: UserPasswordType, fullName: string) {
    if (isPlaceholder) {
      // Mock signup
      const mockUser = { id: 'mock-uid-123', email, user_metadata: { full_name: fullName } };
      localStorage.setItem('fifa_mock_session', JSON.stringify({ user: mockUser }));
      return { data: { user: mockUser }, error: null };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName
        }
      }
    });
    return { data, error };
  },

  async signIn(email: string, password: UserPasswordType) {
    if (isPlaceholder) {
      // Mock signin
      const savedMockSession = localStorage.getItem('fifa_mock_session');
      if (savedMockSession) {
        const session = JSON.parse(savedMockSession);
        if (session.user.email === email) {
          return { data: session, error: null };
        }
      }
      // If not saved, create new mock session
      const mockUser = { id: 'mock-uid-123', email, user_metadata: { full_name: 'Premium Fan' } };
      const session = { user: mockUser };
      localStorage.setItem('fifa_mock_session', JSON.stringify(session));
      return { data: session, error: null };
    }
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    return { data, error };
  },

  async signOut() {
    if (isPlaceholder) {
      localStorage.removeItem('fifa_mock_session');
      return { error: null };
    }
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  async getSession() {
    if (isPlaceholder) {
      const saved = localStorage.getItem('fifa_mock_session');
      return { data: { session: saved ? JSON.parse(saved) : null }, error: null };
    }
    const { data, error } = await supabase.auth.getSession();
    return { data, error };
  },

  async resetPassword(email: string) {
    if (isPlaceholder) {
      return { data: {}, error: null };
    }
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`
    });
    return { data, error };
  }
};

type UserPasswordType = string;
