import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useThemeStore, type TeamTheme } from '../stores/themeStore';
import { useAuthStore } from '../stores/authStore';
import { notifications, teams } from '../mock-data';
import { Bell, Map, Mic, ShieldAlert, Sparkles, Navigation, Bot, LogOut, User, Trophy, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProfileDropdown } from '../components/ProfileDropdown';
import { toast } from 'sonner';

export const Dashboard = () => {
  const currentTheme = useThemeStore((state) => state.currentTheme);
  const setTheme = useThemeStore((state) => state.setTheme);
  const { user, profile, updateProfile, signOut } = useAuthStore();
  const [activeTab, setActiveTab] = useState<'experience' | 'profile'>('experience');
  
  // Profile edit states
  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [newPassword, setNewPassword] = useState('');
  const [updatingProfile, setUpdatingProfile] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);

  const isMatchDay = true; // Simulated

  const handleLogout = async () => {
    await signOut();
    toast.success('Logged out successfully.');
  };

  const handleTeamChange = async (themeName: TeamTheme) => {
    const matchedTeam = teams.find(t => t.theme === themeName);
    const teamName = matchedTeam ? matchedTeam.name : 'fifa-default';
    
    // Update theme store immediately
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

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      toast.error('Name cannot be empty');
      return;
    }

    setUpdatingProfile(true);
    const success = await updateProfile({
      full_name: fullName
    });
    setUpdatingProfile(false);

    if (success) {
      toast.success('Profile updated successfully!');
    } else {
      toast.error('Failed to update profile.');
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    setUpdatingPassword(true);
    setTimeout(() => {
      setNewPassword('');
      setUpdatingPassword(false);
      toast.success('Password updated successfully!');
    }, 1000);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen p-6 md:p-12 relative overflow-hidden bg-background">
      {/* Background Gradient */}
      <div className="absolute top-0 right-0 w-1/2 h-1/2 opacity-20 blur-3xl rounded-full theme-gradient-bg -z-10" />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-8"
      >
        {/* Header */}
        <header className="flex justify-between items-end">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-2">Good Evening.</h1>
            <p className="text-xl text-muted-foreground">Your {currentTheme.replace('-', ' ').toUpperCase()} match day experience.</p>
          </div>
          <div className="flex gap-4">
            <button className="p-3 rounded-full glass-panel hover:bg-white/10 transition-colors relative">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive" />
            </button>
            <ProfileDropdown />
            <button
              onClick={handleLogout}
              className="p-3 rounded-full glass-panel hover:bg-red-500/10 hover:text-red-400 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-6 h-6" />
            </button>
          </div>
        </header>

        {/* Tab Switcher */}
        <div className="flex border-b border-white/10 gap-6 pb-2">
          <button
            onClick={() => setActiveTab('experience')}
            className={`text-lg font-semibold pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'experience' ? 'border-[#43A1D5] text-[#43A1D5]' : 'border-transparent text-muted-foreground'
            }`}
          >
            Match Day Experience
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`text-lg font-semibold pb-2 border-b-2 transition-all cursor-pointer ${
              activeTab === 'profile' ? 'border-[#43A1D5] text-[#43A1D5]' : 'border-transparent text-muted-foreground'
            }`}
          >
            My FIFA Profile
          </button>
        </div>

        {/* Conditional Tab Rendering */}
        <AnimatePresence mode="wait">
          {activeTab === 'experience' ? (
            <motion.div
              key="experience-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-8"
            >
              {/* Match Day Banner */}
              {isMatchDay && (
                <motion.div variants={itemVariants} className="w-full glass-panel rounded-3xl p-8 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-20 theme-gradient-bg" />
                  <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div>
                      <span className="px-3 py-1 text-xs font-semibold uppercase tracking-wider rounded-full bg-primary/20 text-[hsl(var(--theme-primary))] mb-4 inline-block">
                        Live Match
                      </span>
                      <h2 className="text-3xl font-bold mb-2">Argentina vs USA</h2>
                      <p className="text-muted-foreground flex items-center gap-2">
                        <Map className="w-4 h-4" /> MetLife Stadium
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-5xl font-bold tracking-tighter mb-2">03:45:22</div>
                      <p className="text-muted-foreground">until kickoff</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Quick Actions */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <QuickAction to="/concierge" icon={Mic} title="AI Concierge" desc="Ask anything" />
                <QuickAction to="/ai-playground" icon={Bot} title="API Playground" desc="Test NVIDIA NIM" />
                <QuickAction to="/stadium" icon={Map} title="Digital Twin" desc="3D Stadium" />
                <QuickAction to="/navigation" icon={Navigation} title="Navigation" desc="Smart routing" />
                <QuickAction to="/safety" icon={ShieldAlert} title="Safety Copilot" desc="Emergency" />
              </div>

              {/* Latest Updates */}
              <motion.div variants={itemVariants} className="space-y-4">
                <h3 className="text-xl font-semibold">Latest Updates</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  {notifications.map(note => (
                    <div key={note.id} className="glass-panel p-4 rounded-2xl flex items-start gap-4 hover:scale-[1.02] transition-transform cursor-pointer">
                      <div className="p-2 rounded-full bg-[hsl(var(--theme-primary))]/20 text-[hsl(var(--theme-primary))]">
                        <Sparkles className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-semibold">{note.title}</h4>
                        <p className="text-sm text-muted-foreground">{note.message}</p>
                        <span className="text-xs text-muted-foreground mt-2 block">{note.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="profile-tab"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="max-w-2xl mx-auto glass-panel p-8 rounded-3xl space-y-6 relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10 theme-gradient-bg -z-10" />

              <h2 className="text-2xl font-bold flex items-center gap-2 text-foreground">
                <User className="w-6 h-6 text-[#43A1D5]" /> My FIFA Profile
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Account Details Form */}
                <form onSubmit={handleProfileUpdate} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
                    <input
                      type="text"
                      value={user?.email || ''}
                      disabled
                      className="w-full px-4 py-2.5 rounded-xl border border-white/5 bg-white/5 text-muted-foreground/60 cursor-not-allowed"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
                    <input
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#000000]/40 text-foreground focus:outline-none focus:ring-1 focus:ring-[#43A1D5]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={updatingProfile}
                    className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#43A1D5] to-[#43A1D5]/80 hover:scale-[1.01] transition text-white font-semibold text-xs tracking-wider"
                  >
                    {updatingProfile ? 'Saving...' : 'Update Details'}
                  </button>
                </form>

                {/* Theme & Password Control Panel */}
                <div className="space-y-6">
                  {/* Supported Team Selector */}
                  <div className="space-y-2">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Trophy className="w-4 h-4 text-[#43A1D5]" /> Supported Team
                    </label>
                    <select
                      value={profile?.theme_name || 'fifa-default'}
                      onChange={(e) => handleTeamChange(e.target.value as TeamTheme)}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#000000]/40 text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-[#43A1D5]"
                    >
                      <option value="fifa-default">FIFA Default Theme</option>
                      {teams.map((t) => (
                        <option key={t.id} value={t.theme}>
                          {t.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Password Updater */}
                  <form onSubmit={handlePasswordUpdate} className="space-y-2 pt-4 border-t border-white/5">
                    <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                      <Shield className="w-4 h-4 text-[#F36C21]" /> Change Password
                    </label>
                    <input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-white/10 bg-[#000000]/40 text-xs text-foreground focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={updatingPassword}
                      className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F36C21] to-[#F36C21]/80 text-white font-semibold text-xs tracking-wider transition hover:scale-[1.01]"
                    >
                      {updatingPassword ? 'Updating...' : 'Update Password'}
                    </button>
                  </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const QuickAction = ({ to, icon: Icon, title, desc }: { to: string, icon: any, title: string, desc: string }) => (
  <Link to={to} className="block">
    <motion.div 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="glass-panel p-6 rounded-3xl h-full border border-transparent hover:border-[hsl(var(--theme-primary))]/50 transition-colors"
    >
      <div className="text-[hsl(var(--theme-primary))] mb-4">
        <Icon className="w-8 h-8" />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-sm text-muted-foreground">{desc}</p>
    </motion.div>
  </Link>
);
