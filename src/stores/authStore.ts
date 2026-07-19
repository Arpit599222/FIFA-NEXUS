import { create } from 'zustand';
import { authService } from '../services/auth.service';
import { profileService, type Profile, type UserPreferences } from '../services/profile.service';

interface AuthState {
  user: any | null;
  profile: Profile | null;
  preferences: UserPreferences | null;
  loading: boolean;
  initialized: boolean;
  login: (email: string, password: UserPasswordType) => Promise<{ success: boolean; error: any }>;
  signUp: (email: string, password: UserPasswordType, fullName: string) => Promise<{ success: boolean; error: any }>;
  signOut: () => Promise<void>;
  updateProfile: (profileData: Partial<Profile>) => Promise<boolean>;
  updatePreferences: (prefsData: Partial<UserPreferences>) => Promise<boolean>;
  initializeSession: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  profile: null,
  preferences: null,
  loading: false,
  initialized: false,

  login: async (email, password) => {
    set({ loading: true });
    try {
      const { data, error } = await authService.signIn(email, password);
      if (error || !data || !data.user) {
        return { success: false, error: error || new Error('Login failed') };
      }
      
      const user = data.user;
      const { data: profile } = await profileService.getProfile(user.id);
      const { data: preferences } = await profileService.getPreferences(user.id);

      set({ user, profile, preferences, loading: false });
      return { success: true, error: null };
    } catch (err: any) {
      set({ loading: false });
      return { success: false, error: err };
    }
  },

  signUp: async (email, password, fullName) => {
    set({ loading: true });
    try {
      const { data, error } = await authService.signUp(email, password, fullName);
      if (error || !data || !data.user) {
        return { success: false, error: error || new Error('Registration failed') };
      }
      
      const user = data.user;
      
      // Initialize Profile in db
      const { data: profile } = await profileService.updateProfile(user.id, {
        full_name: fullName,
        email: email,
        team_name: 'fifa-default',
        theme_name: 'fifa-default'
      });

      // Initialize Preferences in db
      const { data: preferences } = await profileService.updatePreferences(user.id, {
        language: 'English',
        notifications: true,
        accessibility: 'None',
        match_notifications: true
      });

      set({ user, profile, preferences, loading: false });
      return { success: true, error: null };
    } catch (err: any) {
      set({ loading: false });
      return { success: false, error: err };
    }
  },

  signOut: async () => {
    set({ loading: true });
    await authService.signOut();
    set({ user: null, profile: null, preferences: null, loading: false });
  },

  updateProfile: async (profileData) => {
    const { user } = get();
    if (!user) return false;
    
    const { data, error } = await profileService.updateProfile(user.id, profileData);
    if (!error && data) {
      set({ profile: data });
      return true;
    }
    return false;
  },

  updatePreferences: async (prefsData) => {
    const { user } = get();
    if (!user) return false;

    const { data, error } = await profileService.updatePreferences(user.id, prefsData);
    if (!error && data) {
      set({ preferences: data });
      return true;
    }
    return false;
  },

  initializeSession: async () => {
    if (get().initialized) return;
    set({ loading: true });
    try {
      const { data } = await authService.getSession();
      if (data?.session?.user) {
        const user = data.session.user;
        const { data: profile } = await profileService.getProfile(user.id);
        const { data: preferences } = await profileService.getPreferences(user.id);
        set({ user, profile, preferences });
      }
    } catch (e) {
      console.error('Error restoring session:', e);
    } finally {
      set({ initialized: true, loading: false });
    }
  }
}));

type UserPasswordType = string;
