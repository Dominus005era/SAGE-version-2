import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, AnimatePresence } from 'motion/react';
import { Search, Globe2, Moon, Sun, Sparkles, Menu, X } from 'lucide-react';
import { cn } from '../../lib/cn';

const NAV_LINKS = ['Home', 'Platform', 'Methodology', 'Mission', 'Features', 'Blog'];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const { scrollY } = useScroll();
  const location = useLocation();

  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('sage_theme') as 'dark' | 'light') || 'dark';
  });

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    localStorage.setItem('sage_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  useEffect(() => {
    return scrollY.on('change', (v) => setIsScrolled(v > 60));
  }, [scrollY]);

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] transition-all duration-500',
        isScrolled
          ? 'bg-[#04040a]/80 backdrop-blur-2xl border-b border-white/[0.06] shadow-[0_1px_0_rgba(255,255,255,0.04),0_8px_40px_rgba(0,0,0,0.5)] py-3'
          : 'bg-transparent border-b border-transparent py-5'
      )}
    >
      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 flex items-center justify-between">

        {/* ── Logo ─────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-3 group flex-shrink-0">
          <div className="relative w-14 h-14 flex items-center justify-center rounded-full overflow-hidden border border-white/20 bg-[#04040a]">
            {/* Display the custom logo, scale it to fit well */}
            <img 
              src="/sage-logo.png" 
              alt="SAGE Logo" 
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          </div>
        </Link>

        {/* ── Center Nav ───────────────────────────────── */}
        <nav className="hidden lg:flex items-center gap-1">
          {NAV_LINKS.map((item) => {
            const path = item === 'Home' ? '/' : `/${item.toLowerCase()}`;
            const isActive = location.pathname === path || (item === 'Home' && location.pathname === '/');
            return (
              <Link
                key={item}
                to={path}
                className={cn(
                  'relative px-5 py-2 text-[15px] font-bold tracking-wide rounded-lg transition-all duration-200',
                  isActive
                    ? 'text-white bg-white/[0.08]'
                    : 'text-[#94a3b8] hover:text-white hover:bg-white/[0.05]'
                )}
              >
                {item}
                {isActive && (
                  <motion.div layoutId="nav-pill" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* ── Right ────────────────────────────────────── */}
        <div className="flex items-center gap-2">
          <div className="hidden md:flex items-center gap-1">
            <button className="w-10 h-10 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-all" title="Search">
              <Search className="w-4.5 h-4.5" />
            </button>
            <button className="w-10 h-10 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-all" title="Language">
              <Globe2 className="w-4.5 h-4.5" />
            </button>
            <button 
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="w-10 h-10 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-all"
            >
              {theme === 'dark' ? <Sun className="w-4.5 h-4.5 text-amber-400" /> : <Moon className="w-4.5 h-4.5 text-indigo-500" />}
            </button>
            <div className="w-px h-5 bg-white/10 mx-2" />
          </div>

          <Link to="/login" className="hidden sm:block px-4 py-2 text-[15px] font-bold text-[#94a3b8] hover:text-white transition-colors rounded-lg hover:bg-white/[0.04]">
            Login
          </Link>
          <Link to="/app">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="relative px-6 py-3 text-[15px] font-black text-white rounded-xl overflow-hidden group tracking-wide"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] transition-opacity" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] opacity-0 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-0 shadow-[0_0_20px_rgba(59,130,246,0.5)] opacity-0 group-hover:opacity-100 transition-opacity" />
              <span className="relative z-10">Get Started</span>
            </motion.button>
          </Link>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden ml-2 w-9 h-9 flex items-center justify-center rounded-lg text-[#94a3b8] hover:text-white hover:bg-white/[0.06] transition-all"
          >
            {isMobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* ── Mobile Menu ──────────────────────────────── */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden bg-[#04040a]/95 backdrop-blur-2xl border-t border-white/[0.06]"
          >
            <nav className="flex flex-col gap-1 px-6 py-4">
              {NAV_LINKS.map((item) => (
                <Link
                  key={item}
                  to={item === 'Home' ? '/' : `/${item.toLowerCase()}`}
                  onClick={() => setIsMobileOpen(false)}
                  className="px-4 py-3 text-sm font-medium text-[#94a3b8] hover:text-white hover:bg-white/[0.04] rounded-lg transition-all"
                >
                  {item}
                </Link>
              ))}
              <div className="border-t border-white/[0.06] mt-3 pt-3 flex flex-col gap-2">
                <Link to="/login" onClick={() => setIsMobileOpen(false)} className="px-4 py-3 text-sm font-medium text-[#94a3b8] hover:text-white rounded-lg transition-all">Login</Link>
                <Link to="/app" onClick={() => setIsMobileOpen(false)} className="px-4 py-3 text-sm font-bold text-white bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-xl text-center">Get Started</Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
