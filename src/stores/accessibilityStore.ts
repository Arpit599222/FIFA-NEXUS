import { create } from 'zustand';

interface AccessibilityState {
  largeText: boolean;
  highContrast: boolean;
  voiceAssistance: boolean;
  toggleLargeText: () => void;
  toggleHighContrast: () => void;
  toggleVoiceAssistance: () => void;
}

export const useAccessibilityStore = create<AccessibilityState>((set) => ({
  largeText: false,
  highContrast: false,
  voiceAssistance: false,
  toggleLargeText: () => set((state) => {
    const next = !state.largeText;
    if (next) {
      document.body.classList.add('accessibility-large-text');
    } else {
      document.body.classList.remove('accessibility-large-text');
    }
    return { largeText: next };
  }),
  toggleHighContrast: () => set((state) => {
    const next = !state.highContrast;
    if (next) {
      document.body.classList.add('accessibility-high-contrast');
    } else {
      document.body.classList.remove('accessibility-high-contrast');
    }
    return { highContrast: next };
  }),
  toggleVoiceAssistance: () => set((state) => ({ voiceAssistance: !state.voiceAssistance }))
}));
