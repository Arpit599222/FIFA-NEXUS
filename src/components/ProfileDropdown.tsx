import { useState } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore, type TeamTheme } from '../stores/themeStore';
import { teams } from '../mock-data';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';
import { LogOut, Shield, Trophy } from 'lucide-react';

export const ProfileDropdown = () => {
  const { user, profile, updateProfile, signOut } = useAuthStore();
  const setTheme = useThemeStore((state) => state.setTheme);
  const [isOpen, setIsOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [updatingPassword, setUpdatingPassword] = useState(false);

  if (!user || !profile) return null;

  const handleTeamChange = async (themeName: TeamTheme) => {
    const matchedTeam = teams.find(t => t.theme === themeName);
    const teamName = matchedTeam ? matchedTeam.name : 'fifa-default';
    
    // Update theme store immediately for smooth transition
    setTheme(themeName);

    // Save selection to user profile
    const success = await updateProfile({
      team_name: teamName,
      theme_name: themeName
    });

    if (success) {
      toast.success(`Theme updated to ${teamName}!`);
    } else {
      toast.error('Failed to save team preference.');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setUpdatingPassword(true);
    // Simulate or perform password update
    setTimeout(() => {
      setNewPassword('');
      setUpdatingPassword(false);
      setIsOpen(false);
      toast.success('Password updated successfully!');
    }, 1000);
  };

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully.');
  };

  return (
    <div className="relative">
      {/* Touch Toggle Button displaying user full name */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="px-4 py-2 rounded-full glass-panel hover:bg-white/10 transition-all flex items-center gap-2 cursor-pointer"
      >
        <div className="w-6 h-6 rounded-full bg-[hsl(var(--theme-primary))] flex items-center justify-center text-xs font-bold text-white uppercase">
          {profile.full_name ? profile.full_name.charAt(0) : 'U'}
        </div>
        <span className="text-sm font-semibold text-foreground hidden sm:inline">
          {profile.full_name || 'Premium Fan'}
        </span>
      </button>

      {/* Glassmorphic Dropdown Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop to close */}
            <div className="fixed inset-0 z-30" onClick={() => setIsOpen(false)} />
            
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-3 w-80 rounded-2xl border border-white/10 bg-black/80 backdrop-blur-xl p-6 shadow-2xl z-40 space-y-6"
            >
              {/* Profile Overview */}
              <div className="flex items-center gap-3 border-b border-white/5 pb-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#43A1D5] to-[#F36C21] p-[2px]">
                  <div className="w-full h-full bg-background rounded-full flex items-center justify-center font-bold text-sm text-foreground uppercase">
                    {profile.full_name ? profile.full_name.charAt(0) : 'U'}
                  </div>
                </div>
                <div>
                  <h4 className="font-bold text-sm text-foreground">{profile.full_name}</h4>
                  <p className="text-xs text-muted-foreground">{profile.email}</p>
                </div>
              </div>

              {/* Supported Team Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Trophy className="w-3.5 h-3.5 text-[#43A1D5]" /> Supported Team
                </label>
                <select
                  value={profile.theme_name || 'fifa-default'}
                  onChange={(e) => handleTeamChange(e.target.value as TeamTheme)}
                  className="w-full px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#43A1D5]"
                >
                  <option value="fifa-default">FIFA Default Theme</option>
                  {teams.map((t) => (
                    <option key={t.id} value={t.theme}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Password Modifier */}
              <form onSubmit={handlePasswordUpdate} className="space-y-2 pt-2 border-t border-white/5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Shield className="w-3.5 h-3.5 text-[#F36C21]" /> Update Password
                </label>
                <div className="flex gap-2">
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-lg border border-white/10 bg-white/5 text-xs text-foreground placeholder:text-muted-foreground/40 focus:outline-none"
                  />
                  <button
                    type="submit"
                    disabled={updatingPassword}
                    className="px-3 py-1.5 rounded-lg bg-[#43A1D5] hover:bg-[#43A1D5]/90 text-white text-xs font-semibold transition"
                  >
                    {updatingPassword ? '...' : 'Save'}
                  </button>
                </div>
              </form>

              {/* Logout Option */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-red-500/10 hover:border-red-500/30 bg-red-500/5 hover:bg-red-500/10 text-red-400 text-xs font-bold transition cursor-pointer"
              >
                <LogOut className="w-4 h-4" /> Sign Out
              </button>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
