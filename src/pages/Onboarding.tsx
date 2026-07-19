import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore } from '../stores/themeStore';
import type { TeamTheme } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { teams } from '../mock-data';

export const Onboarding = () => {
  const [step, setStep] = useState(1);
  const [selectedTeam, setSelectedTeam] = useState<TeamTheme>('fifa-default');
  const setTheme = useThemeStore((state) => state.setTheme);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const navigate = useNavigate();

  const handleTeamSelect = (theme: TeamTheme) => {
    setSelectedTeam(theme);
    setTheme(theme);
  };

  const handleContinue = async (theme: TeamTheme) => {
    const teamObj = teams.find(t => t.theme === theme);
    const teamName = teamObj ? teamObj.name : 'fifa-default';
    await updateProfile({
      team_name: teamName,
      theme_name: theme
    });
    setStep(3);
  };

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        navigate('/dashboard');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [step, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Dynamic Background Effects */}
      <div className="absolute inset-0 opacity-30 mix-blend-screen theme-gradient-bg animate-pulse-slow" />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90" />
      
      <div className="relative z-10 w-full max-w-4xl p-6">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="text-center"
            >
              <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-6">
                Welcome to <span className="theme-text-gradient bg-clip-text text-transparent">FIFA NEXUS AI</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-12">The AI Powered Stadium Operating System</p>
              <button
                onClick={() => setStep(2)}
                className="px-8 py-4 rounded-full bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-opacity"
              >
                Start Experience
              </button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="w-full"
            >
              <h2 className="text-3xl font-bold mb-8 text-center">Select Your Team</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {teams.map((team) => (
                  <button
                    key={team.id}
                    onClick={() => handleTeamSelect(team.theme as TeamTheme)}
                    className={`p-4 rounded-2xl glass-panel transition-all hover:scale-105 border-2 ${
                      selectedTeam === team.theme ? 'border-[hsl(var(--theme-primary))]' : 'border-transparent'
                    }`}
                  >
                    <div
                      className="w-12 h-12 mx-auto rounded-full mb-3 shadow-lg"
                      style={{ backgroundColor: team.color }}
                    />
                    <p className="font-medium text-foreground">{team.name}</p>
                  </button>
                ))}
              </div>
              <div className="flex justify-between items-center mt-12">
                <button
                  onClick={() => handleContinue('fifa-default')}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  Skip for now
                </button>
                <button
                  onClick={() => handleContinue(selectedTeam)}
                  className="px-8 py-3 rounded-full bg-primary text-primary-foreground font-medium"
                >
                  Continue
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <div className="w-24 h-24 mx-auto border-4 border-muted border-t-[hsl(var(--theme-primary))] rounded-full animate-spin mb-8" />
              <h2 className="text-3xl font-bold mb-4">Generating Your Match Day Experience...</h2>
              
              <div className="space-y-4 max-w-md mx-auto text-left">
                {[
                  'Personalizing your AI assistant',
                  'Loading stadium intelligence',
                  'Configuring notifications',
                  'Preparing crowd intelligence'
                ].map((text, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 1 }}
                    className="flex items-center space-x-3 text-muted-foreground"
                  >
                    <svg className="w-5 h-5 text-[hsl(var(--theme-primary))]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{text}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
