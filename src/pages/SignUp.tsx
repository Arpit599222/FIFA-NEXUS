import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../stores/authStore';
import { useThemeStore, type TeamTheme } from '../stores/themeStore';
import { teams } from '../mock-data';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const SignUp = () => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedTeam, setSelectedTeam] = useState<TeamTheme>('fifa-default');
  const { signUp, updateProfile, loading } = useAuthStore();
  const setTheme = useThemeStore((state) => state.setTheme);
  const navigate = useNavigate();

  const handleTeamChange = (themeName: TeamTheme) => {
    setSelectedTeam(themeName);
    setTheme(themeName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      toast.error('All fields are required');
      return;
    }

    const { success, error } = await signUp(email, password, fullName);
    if (success) {
      const matchedTeam = teams.find(t => t.theme === selectedTeam);
      const teamName = matchedTeam ? matchedTeam.name : 'fifa-default';
      await updateProfile({
        team_name: teamName,
        theme_name: selectedTeam
      });

      toast.success('Ticket claimed successfully!');
      navigate('/dashboard');
    } else {
      toast.error(error?.message || 'Failed to sign up.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(243,108,33,0.12),transparent_60%)]" />
      <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-no-repeat" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200")' }} />
      <div className="absolute inset-0 bg-gradient-to-tr from-background/90 via-background/40 to-background/90" />

      {/* Pitch markings */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] border border-white/5 rounded-full pointer-events-none" />

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
            className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#F36C21] to-[#FFDC02] p-[2px] shadow-lg shadow-[#F36C21]/20"
          >
            <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center font-bold text-xl tracking-wider text-foreground">
              🎫
            </div>
          </motion.div>
          <h2 className="text-3xl font-extrabold tracking-tight mt-4 text-foreground">
            Claim Ticket
          </h2>
          <p className="text-sm text-muted-foreground">
            Create your account to unlock the World Cup Fan Hub
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Diego Maradona"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#F36C21]/50 transition"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="diego@worldcup.com"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#F36C21]/50 transition"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#F36C21]/50 transition"
              required
            />
          </div>

          {/* Support Team Dropdown Selector */}
          <div className="space-y-1">
            <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Support Team</label>
            <select
              value={selectedTeam}
              onChange={(e) => handleTeamChange(e.target.value as TeamTheme)}
              className="w-full px-4 py-3 rounded-xl border border-white/10 bg-[#000000]/60 text-foreground focus:outline-none focus:ring-2 focus:ring-[#F36C21]/50 transition"
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
            className="w-full py-4 rounded-xl bg-gradient-to-r from-[#F36C21] to-[#F36C21]/80 hover:from-[#F36C21]/90 hover:to-[#F36C21]/70 text-white font-bold text-sm tracking-wide shadow-lg shadow-[#F36C21]/20 hover:scale-[1.01] active:scale-[0.99] transition disabled:opacity-50"
          >
            {loading ? 'Securing Seat...' : 'Claim Ticket'}
          </button>
        </form>

        <div className="text-center text-xs text-muted-foreground">
          Already have a ticket?{' '}
          <Link to="/login" className="text-[#F36C21] font-semibold hover:underline">
            Login here
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
