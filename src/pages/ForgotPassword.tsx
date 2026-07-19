import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email');
      return;
    }
    
    setSent(true);
    toast.success('Reset link dispatched to your email!');
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-background">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(67,161,213,0.1),transparent_60%)]" />
      <div className="absolute inset-0 bg-cover bg-center opacity-10 bg-no-repeat" style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=1200")' }} />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md p-8 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl space-y-6 mx-4"
      >
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-[#43A1D5] to-[#F36C21] p-[2px] shadow-lg">
            <div className="w-full h-full bg-background rounded-2xl flex items-center justify-center font-bold text-xl text-foreground">
              🔑
            </div>
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight mt-4 text-foreground">
            Reset Password
          </h2>
          <p className="text-sm text-muted-foreground">
            Enter your email to receive a password reset link
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="fan@worldcup.com"
                className="w-full px-4 py-3 rounded-xl border border-white/10 bg-white/5 text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[#43A1D5]/50 transition"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-4 rounded-xl bg-gradient-to-r from-[#43A1D5] to-[#43A1D5]/80 hover:from-[#43A1D5]/90 hover:to-[#43A1D5]/70 text-white font-bold text-sm tracking-wide shadow-lg shadow-[#43A1D5]/20 hover:scale-[1.01] active:scale-[0.99] transition"
            >
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="text-center space-y-4 p-4 border border-green-500/20 bg-green-500/5 rounded-2xl">
            <p className="text-sm text-green-400 font-medium">
              We've sent a link to reset your password. Please check your inbox.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-xs text-[#43A1D5] hover:underline"
            >
              Didn't get it? Try again
            </button>
          </div>
        )}

        <div className="text-center text-xs text-muted-foreground">
          <Link to="/login" className="text-[#43A1D5] font-semibold hover:underline">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
