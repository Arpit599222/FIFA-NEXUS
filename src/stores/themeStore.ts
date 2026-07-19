import { create } from 'zustand';

export type TeamTheme = 'fifa-default' | 'argentina' | 'brazil' | 'france' | 'germany' | 'england' | 'spain' | 'portugal' | 'croatia' | 'morocco' | 'mexico' | 'japan' | 'netherlands' | 'usa';

interface ThemeState {
  currentTheme: TeamTheme;
  isMatchDay: boolean;
  setTheme: (theme: TeamTheme) => void;
  setMatchDay: (isMatchDay: boolean) => void;
}

export const useThemeStore = create<ThemeState>((set) => ({
  currentTheme: 'fifa-default',
  isMatchDay: false,
  setTheme: (theme) => set({ currentTheme: theme }),
  setMatchDay: (isMatchDay) => set({ isMatchDay }),
}));
