import { profileService } from './profile.service';

export const themeService = {
  async getThemeForUser(userId: string) {
    const { data: profile, error } = await profileService.getProfile(userId);
    if (error || !profile) {
      return { data: 'fifa-default', error };
    }
    return { data: profile.theme_name, error: null };
  },

  async setThemeForUser(userId: string, themeName: string) {
    const { data, error } = await profileService.updateProfile(userId, {
      theme_name: themeName
    });
    return { data, error };
  }
};
