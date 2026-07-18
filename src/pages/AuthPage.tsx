import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { auth, signInWithGoogle } from '../lib/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { 
  Sparkles, ShieldCheck, Loader2, AlertCircle, CheckCircle2, Lock 
} from 'lucide-react';

export function AuthPage() {
  const navigate = useNavigate();
  const [googleLoading, setGoogleLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Auto-redirect if already authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate('/app');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  // Format Firebase error codes into clear user messages
  const getFriendlyErrorMessage = (code: string, message: string): string => {
    if (code.includes('popup-closed-by-user')) {
      return 'Google sign-in was cancelled. Click below to try again.';
    }
    if (code.includes('popup-blocked')) {
      return 'Sign-in popup was blocked by your browser. Please allow popups for SAGE.';
    }
    return message || 'Google Authentication failed. Please try again.';
  };

  // One-Click Google Authentication Handler
  const handleGoogleAuth = async () => {
    setErrorMessage('');
    setSuccessMessage('');
    setGoogleLoading(true);

    try {
      await signInWithGoogle();
      setSuccessMessage('Google Account verified! Redirecting to SAGE Portal...');
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
          className="w-full max-w-md bg-[#080816]/80 border border-white/[0.08] rounded-3xl p-8 md:p-10 shadow-2xl backdrop-blur-2xl relative overflow-hidden text-center"
        >
          {/* Top SAGE Logo Emblem */}
          <div className="w-20 h-20 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] rounded-[24px] mx-auto flex items-center justify-center shadow-[0_10px_40px_rgba(59,130,246,0.3)] mb-6 border border-white/20 overflow-hidden">
            <img src="/sage-logo.png" alt="SAGE Logo" className="w-full h-full object-cover" />
          </div>

          {/* Decorative Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold uppercase tracking-[2px] text-[#3b82f6] mb-4">
            <Sparkles className="w-3.5 h-3.5 text-[#3b82f6]" />
            SAGE Cloud Authentication
          </div>

          {/* Title & Subtitle */}
          <h1 className="text-3xl font-black tracking-tight text-white mb-2 italic uppercase">
            Access SAGE Portal
          </h1>
          <p className="text-xs text-[#94a3b8] font-medium leading-relaxed mb-8 max-w-xs mx-auto">
            One-click secure sign-in with your Google account to sync cognitive stats, routines, and AI learning progress.
          </p>

          {/* Error & Success Alert Boxes */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold flex items-start gap-2.5 text-left"
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
                className="mb-6 p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-semibold flex items-start gap-2.5 text-left"
              >
                <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{successMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Single Google Authentication Button */}
          <button
            type="button"
            onClick={handleGoogleAuth}
            disabled={googleLoading}
            className="w-full py-4 px-6 bg-white hover:bg-zinc-100 text-slate-900 rounded-2xl text-sm font-extrabold flex items-center justify-center gap-3 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 shadow-xl border border-white/20"
          >
            {googleLoading ? (
              <Loader2 className="w-5 h-5 animate-spin text-slate-900" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            Protected by Firebase Encrypted Authentication
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  );
}
