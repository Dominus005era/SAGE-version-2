import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  auth, 
  loginEmail, 
  registerEmail, 
  signInWithGoogle 
} from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { 
  Mail, Lock, User, Eye, EyeOff, ArrowRight, Sparkles, 
  ShieldCheck, Loader2, AlertCircle, CheckCircle2 
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register';
}

export function AuthPage({ initialMode }: AuthPageProps) {
  const navigate = useNavigate();
  const location = useLocation();

  // Mode state: 'login' vs 'register'
  const [mode, setMode] = useState<'login' | 'register'>(() => {
    if (initialMode) return initialMode;
    return location.pathname === '/register' ? 'register' : 'login';
  });

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  
  // Loading & notification states
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auto-redirect to platform if authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/app');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Format Firebase error codes into friendly messages
  const getFriendlyErrorMessage = (code: string, message: string): string => {
    if (code.includes('invalid-credential') || code.includes('wrong-password') || code.includes('user-not-found')) {
      return 'Invalid email or password. Please check your credentials.';
    }
    if (code.includes('email-already-in-use')) {
      return 'An account with this email address already exists. Try logging in.';
    }
    if (code.includes('weak-password')) {
      return 'Password should be at least 6 characters long.';
    }
    if (code.includes('invalid-email')) {
      return 'Please enter a valid email address.';
    }
    if (code.includes('popup-closed-by-user')) {
      return 'Google sign-in was cancelled.';
    }
    return message || 'Authentication failed. Please try again.';
  };

  // Handle Email & Password Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    if (mode === 'register' && !name.trim()) {
      setErrorMessage('Full Name is required for registration.');
      return;
    }

    if (password.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setLoading(true);

    try {
      if (mode === 'register') {
        await registerEmail(email.trim(), password, name.trim());
        setSuccessMessage('Account created successfully! Redirecting to SAGE Portal...');
      } else {
        await loginEmail(email.trim(), password);
        setSuccessMessage('Authenticated successfully! Redirecting to SAGE Portal...');
      }
      setTimeout(() => navigate('/app'), 800);
    } catch (err: any) {
      console.error("Firebase Auth Error:", err);
      setErrorMessage(getFriendlyErrorMessage(err?.code || '', err?.message || ''));
    } finally {
      setLoading(false);
    }
  };

  // Handle Google Sign In
  const handleGoogleAuth = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      setSuccessMessage('Google Authentication verified! Entering SAGE Portal...');
      setTimeout(() => navigate('/app'), 800);
    } catch (err: any) {
      console.error("Google Auth Error:", err);
      setErrorMessage(getFriendlyErrorMessage(err?.code || '', err?.message || ''));
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04040a] text-white flex flex-col justify-between relative overflow-hidden">
      <Header />

      {/* Cosmic background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#3b82f6]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-[#8b5cf6]/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Auth Card Container */}
      <div className="pt-32 pb-20 px-6 flex items-center justify-center flex-1 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-[#080816]/80 border border-white/[0.08] rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden"
        >
          {/* Top SAGE Logo Emblem */}
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] rounded-2xl flex items-center justify-center shadow-lg border border-white/20 overflow-hidden">
              <img src="/sage-logo.png" alt="SAGE Logo" className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Title Header */}
          <div className="text-center mb-6">
            <h1 className="text-3xl font-black tracking-tight text-white mb-2 italic uppercase">
              {mode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h1>
            <p className="text-xs text-[#94a3b8] font-medium leading-relaxed">
              {mode === 'login' 
                ? 'Sign in with your email & password or Google to enter SAGE' 
                : 'Register your operative account to access SAGE Portal'}
            </p>
          </div>

          {/* Mode Switcher Tabs */}
          <div className="grid grid-cols-2 p-1 bg-black/40 border border-white/[0.06] rounded-2xl mb-6">
            <button
              onClick={() => {
                setMode('login');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'login'
                  ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white shadow-md'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Sign In
            </button>

            <button
              onClick={() => {
                setMode('register');
                setErrorMessage('');
                setSuccessMessage('');
              }}
              className={`py-2.5 rounded-xl text-xs font-bold transition-all ${
                mode === 'register'
                  ? 'bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white shadow-md'
                  : 'text-[#94a3b8] hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Alert Banners */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-start gap-2.5"
              >
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
            
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-start gap-2.5"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Form for Email & Password */}
          <form onSubmit={handleSubmit} className="space-y-4 mb-6">
            {/* Full Name (Register Mode Only) */}
            {mode === 'register' && (
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#475569] block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#475569] absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Alex Mercer"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-semibold text-white placeholder-[#475569] focus:outline-none focus:border-[#3b82f6] transition-colors"
                  />
                </div>
              </div>
            )}

            {/* Email Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#475569] block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#475569] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="operative@sage.net"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-4 py-3.5 text-xs font-semibold text-white placeholder-[#475569] focus:outline-none focus:border-[#3b82f6] transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#475569] block">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#475569] absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/[0.03] border border-white/10 rounded-2xl pl-11 pr-12 py-3.5 text-xs font-semibold text-white placeholder-[#475569] focus:outline-none focus:border-[#3b82f6] transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#475569] hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Email/Password Action Button */}
            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full mt-2 py-4 px-6 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-xl disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin text-white" />
              ) : (
                <>
                  {mode === 'login' ? 'Sign In with Email' : 'Create Account'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="h-px bg-white/10 flex-1" />
            <span className="text-[10px] font-bold text-[#475569] uppercase tracking-widest">or sign in with</span>
            <div className="h-px bg-white/10 flex-1" />
          </div>

          {/* Google Sign In Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading || loading}
            className="w-full py-3.5 px-4 bg-white hover:bg-zinc-100 text-slate-900 rounded-2xl text-xs font-bold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-lg border border-white/20"
          >
            {googleLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-slate-900" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.26v3.15C3.25 21.3 7.31 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.26C.46 8.17 0 9.99 0 12s.46 3.83 1.26 5.42l4.02-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.25 2.7 1.26 6.58l4.02 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            Sign in with Google
          </button>

          {/* Footer Security Badge */}
          <div className="mt-8 pt-6 border-t border-white/[0.06] flex items-center justify-center gap-2 text-[11px] font-bold text-[#475569]">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            256-bit Firebase Encrypted Connection
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
