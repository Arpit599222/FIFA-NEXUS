import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore, type TeamTheme } from '../stores/themeStore';
import { teams } from '../mock-data';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamTheme>('fifa-default');
  const { login, updateProfile, loading } = useAuthStore();
  const setTheme = useThemeStore((state) => state.setTheme);
  const navigate = useNavigate();

  const handleTeamChange = (themeName: TeamTheme) => {
    setSelectedTeam(themeName);
    setTheme(themeName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }

    const { success, error } = await login(email, password);
    if (success) {
      // Save their chosen team to profile
      const matchedTeam = teams.find(t => t.theme === selectedTeam);
      const teamName = matchedTeam ? matchedTeam.name : 'fifa-default';
      await updateProfile({
        team_name: teamName,
        theme_name: selectedTeam
      });

      toast.success('Successfully logged in!');
      navigate('/dashboard');
    } else {
      toast.error(error?.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      {/* Immersive Stadium inspired abstract background overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(67,161,213,0.15),transparent_60%)]" />
      <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-no-repeat" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200")' }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-background/40 to-background/90" />

      {/* Animated soccer pitch line accents */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border border-white/5 rounded-full pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40vw] h-[40vw] border border-white/5 rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl space-y-6 mx-4"
      >
        <div className="text-center space-y-2">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#43A1D5] to-[#F36C21] p-[2px] shadow-lg shadow-[#43A1D5]/20"
          >
            <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center font-bold text-xl tracking-wider text-foreground">
              🏆
            </div>
          </motion.div>
          <h2 className="text-3xl font-extrabold tracking-tight mt-4 text-foreground">
            FIFA <span className="text-[#43A1D5]">NEXUS</span>
          </h2>
          <p className="text-sm text-muted-foreground">
            You are joining the FIFA World Cup Experience
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@worldcup.com"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#43A1D5]/50 transition"
              required
            />
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
              <Link to="/forgot-password" className="text-xs text-[#43A1D5] hover:underline">Forgot?</Link>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#43A1D5]/50 transition"
              required
            />
          </div>

          {/* Support Team Dropdown Selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Support Team</label>
            <select
              value={selectedTeam}
              onChange={(e) => handleTeamChange(e.target.value as TeamTheme)}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#000000]/60 text-foreground focus:outline-none focus:ring-2 focus:ring-[#43A1D5]/50 transition"
            >
              <option value="fifa-default">FIFA Default Theme</option>
              {teams.map((t) => (
                <option key={t.id} value={t.theme}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#43A1D5] to-[#43A1D5]/80 hover:from-[#43A1D5]/90 hover:to-[#43A1D5]/70 text-white font-bold text-sm tracking-wide shadow-lg shadow-[#43A1D5]/20 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50"
          >
            {loading ? 'Entering Stadium...' : 'Enter Experience'}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          New to the Cup?{' '}
          <Link to="/signup" className="text-[#43A1D5] font-semibold hover:underline">
            Claim Your Ticket (Sign Up)
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
