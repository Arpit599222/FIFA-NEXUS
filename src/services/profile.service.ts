import { supabase } from './supabase';

const isPlaceholder = import.meta.env.VITE_SUPABASE_URL === undefined || import.meta.env.VITE_SUPABASE_URL === '';

export interface Profile {
  id: string;
  full_name: string;
  email: string;
  team_name: string;
  theme_name: string;
  created_at?: string;
}

export interface UserPreferences {
  profile_id: string;
  language: string;
  notifications: boolean;
  accessibility: string;
  match_notifications: boolean;
}

export const profileService = {
  async getProfile(userId: string) {
    if (isPlaceholder) {
      const cached = localStorage.getItem(`profile_${userId}`);
      if (cached) return { data: JSON.parse(cached) as Profile, error: null };
      const defaultProfile: Profile = {
        id: userId,
        full_name: 'Premium Fan',
        email: 'fan@fifa.com',
        team_name: 'fifa-default',
        theme_name: 'fifa-default'
      };
      return { data: defaultProfile, error: null };
    }

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data: data as Profile, error };
  },

  async updateProfile(userId: string, profile: Partial<Profile>) {
    if (isPlaceholder) {
      const current = (await this.getProfile(userId)).data;
      const updated = { ...current, ...profile };
      localStorage.setItem(`profile_${userId}`, JSON.stringify(updated));
      return { data: updated, error: null };
    }

    const { data, error } = await supabase
      .from('profiles')
      .upsert({ id: userId, ...profile })
      .select()
      .single();

    return { data, error };
  },

  async getPreferences(userId: string) {
    if (isPlaceholder) {
      const cached = localStorage.getItem(`prefs_${userId}`);
      if (cached) return { data: JSON.parse(cached) as UserPreferences, error: null };
      const defaultPrefs: UserPreferences = {
        profile_id: userId,
        language: 'English',
        notifications: true,
        accessibility: 'None',
        match_notifications: true
      };
      return { data: defaultPrefs, error: null };
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .select('*')
      .eq('profile_id', userId)
      .single();

    return { data: data as UserPreferences, error };
  },

  async updatePreferences(userId: string, prefs: Partial<UserPreferences>) {
    if (isPlaceholder) {
      const current = (await this.getPreferences(userId)).data;
      const updated = { ...current, ...prefs };
      localStorage.setItem(`prefs_${userId}`, JSON.stringify(updated));
      return { data: updated, error: null };
    }

    const { data, error } = await supabase
      .from('user_preferences')
      .upsert({ profile_id: userId, ...prefs })
      .select()
      .single();

    return { data, error };
  }
};
