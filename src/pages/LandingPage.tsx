import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform, useInView, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import {
  Brain, Globe, BookOpen, Rocket, Atom, Zap, Lightbulb,
  ShieldQuestion, PenTool, LayoutTemplate, MessageSquare,
  Activity, PlayCircle, ArrowRight, CheckCircle, Star,
  Users, TrendingUp, Award, ChevronDown, ChevronUp,
  FlaskConical, Cpu, Microscope, Dna, Satellite, Code,
  BarChart3, Clock, Lock, Heart, RefreshCw, Wifi, X
} from 'lucide-react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ScrollBackground } from '../components/layout/ScrollBackground';

// ─────────────────────────────────────────────────────────────
// ANIMATED COUNTER
// ─────────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─────────────────────────────────────────────────────────────
// FLOATING VISUAL (DOMAINS)
// ─────────────────────────────────────────────────────────────
function FloatingVisual({ img, x, y, delay, size = 64 }: any) {
  return (
    <motion.div
      className="absolute pointer-events-none z-0"
      style={{ left: `${x}%`, top: `${y}%` }}
      animate={{ y: [-15, 15, -15], x: [-5, 5, -5], rotate: [-5, 5, -5] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      <div 
        className="rounded-[24px] glass overflow-hidden border border-white/20 shadow-2xl backdrop-blur-md flex items-center justify-center p-[2px]"
        style={{ width: size, height: size, background: 'rgba(255,255,255,0.05)' }}
      >
        <img src={img} alt="domain visual" className="w-full h-full object-cover rounded-[20px] opacity-90" />
      </div>
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// MAGNETIC BUTTON
// ─────────────────────────────────────────────────────────────
function MagneticButton({ children, className, onClick }: any) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left - rect.width / 2) * 0.3);
    y.set((e.clientY - rect.top - rect.height / 2) * 0.3);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} style={{ x: sx, y: sy }} onMouseMove={handleMove} onMouseLeave={reset} className={className} onClick={onClick}>
      {children}
    </motion.div>
  );
}

// ─────────────────────────────────────────────────────────────
// SECTION HEADER
// ─────────────────────────────────────────────────────────────
function SectionLabel({ label }: { label: string }) {
  return (
    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold uppercase tracking-[3px] text-[#94a3b8] mb-6">
      <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
      {label}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// FAQ DATA
// ─────────────────────────────────────────────────────────────
const FAQS = [
  { q: 'How does SAGE generate personalized content?', a: 'SAGE uses Google Gemini AI to analyze your selected categories, domains, and difficulty preferences, then synthesizes unique, high-quality educational content tailored specifically to you — in milliseconds.' },
  { q: 'What types of content can SAGE generate?', a: 'Facts, Logic Challenges, Quizzes, Myths, Stories, Case Studies, Scenarios, and AI Discussions across 150+ domains — from Quantum Physics to Behavioral Economics.' },
  { q: 'Does SAGE remember my learning progress?', a: 'Yes! SAGE uses Firebase to sync your XP, streaks, bookmarks, and performance analytics across all devices in real-time.' },
  { q: 'Is SAGE suitable for children?', a: 'Absolutely. SAGE\'s adaptive difficulty and family-friendly content moderation make it perfect for ages 8 and above, all the way to lifelong learners.' },
  { q: 'How many languages does SAGE support?', a: 'SAGE supports 40+ languages for content generation. Simply select your preferred language in settings, and all AI-generated content will be delivered in that language.' },
];

// ─────────────────────────────────────────────────────────────
// TESTIMONIAL DATA
// ─────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: 'Sarah Chen', role: 'PhD Student, MIT', avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b1e0?w=100&h=100&fit=crop', text: 'SAGE completely changed how I study. The AI logic challenges push my thinking in ways textbooks never could.', stars: 5 },
  { name: 'Marcus Johnson', role: 'Product Manager, Google', avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop', text: 'I use SAGE every morning. 15 minutes of logic challenges beats an hour of reading. My team productivity improved 30%.', stars: 5 },
  { name: 'Priya Sharma', role: 'High School Teacher', avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop', text: 'My students are addicted to SAGE in the best way possible. The gamification keeps them engaged for hours.', stars: 5 },
  { name: 'Diego Ramirez', role: 'Software Engineer, Meta', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop', text: 'The Case Study format is unreal. I\'ve learned more about system design through SAGE scenarios than 2 years of YouTube videos.', stars: 5 },
];

// ─────────────────────────────────────────────────────────────
// BLOG POSTS
// ─────────────────────────────────────────────────────────────
const BLOG_POSTS = [
  {
    title: 'How AI is Rewriting the Rules of Education',
    excerpt: 'Generative AI isn\'t just automating tasks — it\'s creating entirely new learning paradigms that adapt to individual cognition.',
    category: 'AI & Education',
    readTime: '6 min read',
    image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop',
    date: 'Jul 14, 2026',
  },
  {
    title: 'The Science Behind Spaced Repetition and Why SAGE Uses It',
    excerpt: 'Your brain forgets 70% of new information within 24 hours. Here\'s the neuroscience behind why SAGE\'s approach works.',
    category: 'Learning Science',
    readTime: '8 min read',
    image: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?q=80&w=600&auto=format&fit=crop',
    date: 'Jul 10, 2026',
  },
  {
    title: 'From Zero to Expert: Learning Any Skill with Micro-Content',
    excerpt: 'Case studies of 12 professionals who used SAGE to master new domains in 90 days or less.',
    category: 'Case Study',
    readTime: '10 min read',
    image: 'https://images.unsplash.com/photo-1516321165247-4aa89a48be28?q=80&w=600&auto=format&fit=crop',
    date: 'Jul 6, 2026',
  },
];

// ─────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────
// Category popup data
const ALL_FORMATS = [
  {
    title: 'Fact',
    icon: <BookOpen className="w-6 h-6" />,
    color: '#10b981',
    img: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'Bite-sized insights',
    fullDesc: 'Get precise, high-yield facts on any topic distilled by AI. Perfect for rapid knowledge building in 60 seconds or less.',
    xp: '+10 XP',
    time: '~1 min',
  },
  {
    title: 'Quiz',
    icon: <ShieldQuestion className="w-6 h-6" />,
    color: '#ec4899',
    img: 'https://images.unsplash.com/photo-1606326608606-aa0b62935f2b?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'Test your recall',
    fullDesc: 'AI-generated multiple choice and open-ended quizzes that adapt to your knowledge level in real-time.',
    xp: '+20 XP',
    time: '~3 min',
  },
  {
    title: 'Myth',
    icon: <Lightbulb className="w-6 h-6" />,
    color: '#f59e0b',
    img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'Debunk misconceptions',
    fullDesc: 'Explore widely held beliefs and uncover the truth behind them. Great for critical thinking and intellectual curiosity.',
    xp: '+15 XP',
    time: '~2 min',
  },
  {
    title: 'Story',
    icon: <PenTool className="w-6 h-6" />,
    color: '#f97316',
    img: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'Narrative-driven learning',
    fullDesc: 'Experience knowledge through compelling AI-written narratives. Concepts stick better when wrapped in a human story.',
    xp: '+15 XP',
    time: '~4 min',
  },
  {
    title: 'Case Study',
    icon: <LayoutTemplate className="w-6 h-6" />,
    color: '#3b82f6',
    img: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'Real-world analysis',
    fullDesc: 'Deep situational analysis of real events, decisions, and outcomes. Ideal for professionals and strategic thinkers.',
    xp: '+30 XP',
    time: '~6 min',
  },
  {
    title: 'Scenario',
    icon: <Activity className="w-6 h-6" />,
    color: '#06b6d4',
    img: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'Applied logic tests',
    fullDesc: 'You are placed in a specific situation. Make decisions, evaluate consequences, and learn from outcomes — like a simulation.',
    xp: '+25 XP',
    time: '~5 min',
  },
  {
    title: 'Logic Challenge',
    icon: <Brain className="w-6 h-6" />,
    color: '#8b5cf6',
    img: 'https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'Sharpen your reasoning',
    fullDesc: 'AI-crafted brain teasers, puzzles, and reasoning exercises designed to expand how you think — not just what you know.',
    xp: '+25 XP',
    time: '~4 min',
  },
  {
    title: 'AI Discussion',
    icon: <MessageSquare className="w-6 h-6" />,
    color: '#6366f1',
    img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=600&auto=format&fit=crop',
    shortDesc: 'Debate with SAGE',
    fullDesc: 'Have a structured intellectual debate with the AI on any topic. Challenge assumptions and defend your own ideas.',
    xp: '+35 XP',
    time: '~8 min',
  },
];

// FormatCard now treats all cards as image cards
function FormatCard({ fmt, index }: { fmt: typeof ALL_FORMATS[0], index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: index * 0.07, duration: 0.5 }}
        whileHover={{ y: -8 }}
        onClick={() => setOpen(true)}
        className="relative cursor-pointer border border-white/[0.06] overflow-hidden group h-72 rounded-2xl shadow-lg transition-all"
      >
        <img src={fmt.img} alt={fmt.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/20" />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{ background: `linear-gradient(to top, ${fmt.color}50, transparent)` }}
        />
        <div
          className="absolute top-4 left-4 w-9 h-9 rounded-xl backdrop-blur-md flex items-center justify-center border border-white/20 text-white"
          style={{ background: `${fmt.color}40` }}
        >
          {fmt.icon}
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-5 transform translate-y-2 group-hover:translate-y-0 transition-transform">
          <h3 className="text-lg font-bold text-white mb-1">{fmt.title}</h3>
          <p className="text-[#94a3b8] text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">{fmt.shortDesc}</p>
          <p className="text-[10px] text-white/50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-500">Click to explore</p>
        </div>
      </motion.div>

      {/* Popup Modal */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[200]"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[201] w-[90vw] max-w-md"
            >
              <div className="rounded-3xl overflow-hidden border border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.7)]" style={{ background: '#0c0c1a' }}>
                {/* Image header */}
                <div className="relative h-44 overflow-hidden">
                  <img src={fmt.img} alt={fmt.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0c0c1a] via-[#0c0c1a]/40 to-transparent" />
                  <button
                    onClick={() => setOpen(false)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                  <div
                    className="absolute bottom-4 left-4 w-10 h-10 rounded-xl flex items-center justify-center text-white border border-white/20"
                    style={{ background: `${fmt.color}40`, backdropFilter: 'blur(10px)' }}
                  >
                    {fmt.icon}
                  </div>
                </div>

                <div className="p-7">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-2xl font-bold text-white">{fmt.title}</h3>
                    <span
                      className="px-3 py-1 rounded-full text-xs font-bold border"
                      style={{ background: `${fmt.color}15`, color: fmt.color, borderColor: `${fmt.color}30` }}
                    >
                      {fmt.xp}
                    </span>
                  </div>

                  <p className="text-[#94a3b8] text-sm leading-relaxed mb-6">{fmt.fullDesc}</p>

                  <div className="flex items-center gap-4 mb-6 text-xs text-[#94a3b8]">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" style={{ color: fmt.color }} />
                      <span>Avg. {fmt.time}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Zap className="w-3.5 h-3.5" style={{ color: fmt.color }} />
                      <span>AI Generated</span>
                    </div>
                  </div>

                  <Link to="/app" onClick={() => setOpen(false)}>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.97 }}
                      className="w-full py-3.5 rounded-2xl font-bold text-white text-sm flex items-center justify-center gap-2"
                      style={{ background: `linear-gradient(135deg, ${fmt.color}, ${fmt.color}99)` }}
                    >
                      <Zap className="w-4 h-4" /> Start {fmt.title} Mode
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export function LandingPage() {
  const { scrollY } = useScroll();
  const heroParallax = useTransform(scrollY, [0, 600], [0, -120]);
  const heroBgY = useTransform(scrollY, [0, 600], [0, 80]);
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [activeDomain, setActiveDomain] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-[#04040a] text-white overflow-x-hidden" style={{ fontFamily: "'Space Grotesk', 'Inter', sans-serif" }}>
      <ScrollBackground images={[
        "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2000&auto=format&fit=crop", // Space
        "https://images.unsplash.com/photo-1559757175-5700dde675bc?q=80&w=2000&auto=format&fit=crop", // Neuroscience
        "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2000&auto=format&fit=crop", // Math
        "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2000&auto=format&fit=crop"  // Tech
      ]} />
      <Header />

      {/* ═══════════════════════════════════════════════ */}
      {/*  SECTION 1 — HERO                              */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">

        {/* Hero Content - Centered */}
        <motion.div style={{ y: heroParallax }} className="relative z-10 max-w-[1440px] mx-auto px-6 lg:px-10 w-full flex flex-col items-center text-center justify-center min-h-screen pt-20">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="flex flex-col items-center"
          >
            <div className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md mb-8">
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#3b82f6] opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#3b82f6]" />
              </span>
              <span className="text-sm font-bold tracking-wider text-white/90 uppercase">
                Scenario-based Applied General Education
              </span>
            </div>

            <h1 className="text-[clamp(2.5rem,5vw,5rem)] font-black tracking-tighter leading-[1.05] mb-6 max-w-5xl">
              <div className="text-white whitespace-nowrap">Understand Beyond</div>
              <div
                className="animate-gradient whitespace-nowrap"
                style={{
                  background: 'linear-gradient(135deg, #60a5fa, #8b5cf6, #06b6d4, #60a5fa)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                Traditional Education
              </div>
            </h1>

            <p className="text-[#94a3b8] text-xl md:text-2xl leading-relaxed mb-12 max-w-2xl mx-auto font-medium">
              Scenarios teach you more than textbooks ever could. Experience a new era of cognitive development.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-6">
              <MagneticButton className="relative">
                <Link to="/app">
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.97 }}
                    className="relative px-10 py-5 rounded-[20px] text-lg font-bold text-white overflow-hidden group cursor-pointer shadow-[0_0_40px_rgba(59,130,246,0.3)]"
                  >
                    <div
                      className="absolute inset-0 animate-gradient"
                      style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)', backgroundSize: '300% 300%' }}
                    />
                    <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 flex items-center gap-2">
                      Start Your Journey <ArrowRight className="w-5 h-5" />
                    </span>
                  </motion.div>
                </Link>
              </MagneticButton>
            </div>
          </motion.div>
        </motion.div>

        {/* Scroll hint */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 text-[#475569]"
        >
          <span className="text-[10px] uppercase tracking-widest">Scroll</span>
          <ChevronDown className="w-4 h-4" />
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*  SECTION 2 — STATISTICS                        */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-16 border-y border-white/[0.04]">
        <div className="absolute inset-0 bg-white/[0.01]" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { num: 500, suffix: 'K+', label: 'Knowledge Sessions', icon: <BookOpen className="w-5 h-5" />, color: '#3b82f6' },
              { num: 150, suffix: '+',  label: 'Learning Domains',    icon: <Globe className="w-5 h-5" />,    color: '#8b5cf6' },
              { num: 98,  suffix: '%',  label: 'Retention Rate',      icon: <Brain className="w-5 h-5" />,    color: '#10b981' },
              { num: 40,  suffix: '+',  label: 'Languages',           icon: <Zap className="w-5 h-5" />,      color: '#f59e0b' },
            ].map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="text-center group"
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 transition-transform group-hover:scale-110"
                  style={{ background: `${s.color}20`, color: s.color, border: `1px solid ${s.color}30` }}
                >
                  {s.icon}
                </div>
                <div className="text-4xl md:text-5xl font-black tracking-tight text-white mb-2">
                  <AnimatedCounter target={s.num} suffix={s.suffix} />
                </div>
                <p className="text-[#94a3b8] text-xs font-semibold uppercase tracking-widest">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*  SECTION 3 — HOW IT WORKS (Visual Story)       */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#8b5cf6]/8 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="text-center mb-20">
            <SectionLabel label="How It Works" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
              Three steps to <span style={{ background: 'linear-gradient(135deg, #60a5fa, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>mastery.</span>
            </h2>
            <p className="text-[#94a3b8] text-xl max-w-2xl mx-auto">
              We combined neuroscience and generative AI to create the most powerful educational loop ever designed.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                img: 'https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=800&auto=format&fit=crop',
                num: '01', title: 'Personalize',
                desc: 'Tell SAGE what you want to learn. The AI synthesizes a curriculum uniquely tailored to your brain in milliseconds.',
                icon: <Atom className="w-5 h-5" />, color: '#3b82f6',
                tags: ['Your Topics', 'Your Pace', 'Your Language'],
              },
              {
                img: 'https://images.unsplash.com/photo-1456406644174-8ddd4cd52a06?q=80&w=800&auto=format&fit=crop',
                num: '02', title: 'Interact',
                desc: 'Don\'t just read. Debate the AI, solve scenarios, answer quizzes, and challenge your assumptions.',
                icon: <Activity className="w-5 h-5" />, color: '#8b5cf6',
                tags: ['Quizzes', 'AI Debate', 'Scenarios'],
              },
              {
                img: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=800&auto=format&fit=crop',
                num: '03', title: 'Retain',
                desc: 'Gamified spaced repetition, XP systems, and streak mechanics ensure you never forget what you\'ve mastered.',
                icon: <Brain className="w-5 h-5" />, color: '#10b981',
                tags: ['XP System', 'Streaks', 'Heatmaps'],
              },
            ].map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="group rounded-3xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 cursor-pointer"
              >
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors z-10" />
                  <img
                    src={step.img}
                    alt={step.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                  />
                  <div className="absolute top-4 left-4 z-20 text-6xl font-black opacity-20 text-white">{step.num}</div>
                  <div
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-xl flex items-center justify-center text-white border border-white/20"
                    style={{ background: `${step.color}30`, backdropFilter: 'blur(10px)' }}
                  >
                    {step.icon}
                  </div>
                </div>
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-white mb-3">{step.title}</h3>
                  <p className="text-[#94a3b8] leading-relaxed mb-6">{step.desc}</p>
                  <div className="flex flex-wrap gap-2">
                    {step.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 rounded-full text-xs font-semibold border"
                        style={{ background: `${step.color}15`, color: step.color, borderColor: `${step.color}30` }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*  SECTION 4 — CATEGORY SELECTION                */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-32 border-y border-white/[0.04] overflow-hidden">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#3b82f6]/8 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute right-0 top-0 w-[300px] h-[300px] bg-[#ec4899]/5 rounded-full blur-[100px] pointer-events-none" />
        {/* Decorative top line accent */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-[#3b82f6]/50 to-transparent" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <SectionLabel label="8 Content Formats" />
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-4">
                Choose your format.
              </h2>
              <p className="text-[#94a3b8] text-xl max-w-xl">
                Information delivered exactly how your brain absorbs it best. Click any card to learn more.
              </p>
            </div>
            <Link to="/app">
              <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-sm transition-all">
                Try All Formats <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>

          {/* ROW 1: Image cards — Fact, Quiz, Myth, Story */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-5">
            {ALL_FORMATS.slice(0, 4).map((fmt, i) => (
              <FormatCard key={fmt.title} fmt={fmt} index={i} />
            ))}
          </div>

          {/* ROW 2: Icon cards — Case Study, Scenario, Logic Challenge, AI Discussion */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {ALL_FORMATS.slice(4, 8).map((fmt, i) => (
              <FormatCard key={fmt.title} fmt={fmt} index={i + 4} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*  SECTION 5 — KNOWLEDGE DOMAINS                 */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute right-0 top-0 w-[600px] h-[600px] bg-[#06b6d4]/6 rounded-full blur-[150px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">
            <div>
              <SectionLabel label="150+ Domains" />
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
                Explore any domain. <br />
                <span style={{ background: 'linear-gradient(135deg, #60a5fa, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  Master everything.
                </span>
              </h2>
              <p className="text-[#94a3b8] text-xl mb-10 leading-relaxed">
                From quantum physics to behavioral economics, SAGE covers the full breadth of human knowledge. Even let you create your own custom topic.
              </p>
              <Link to="/app">
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] transition-all">
                  Explore All Domains <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>

            <div className="flex flex-wrap gap-3">
              {[
                { d: 'Science',                color: '#3b82f6' },
                { d: 'Artificial Intelligence', color: '#8b5cf6' },
                { d: 'Medicine',               color: '#ec4899' },
                { d: 'Technology',             color: '#06b6d4' },
                { d: 'Philosophy',             color: '#f59e0b' },
                { d: 'Psychology',             color: '#10b981' },
                { d: 'Engineering',            color: '#6366f1' },
                { d: 'Economics',              color: '#f97316' },
                { d: 'Mathematics',            color: '#3b82f6' },
                { d: 'Astronomy',              color: '#8b5cf6' },
                { d: 'Programming',            color: '#06b6d4' },
                { d: 'History',                color: '#f59e0b' },
                { d: 'Business',               color: '#10b981' },
                { d: 'Art & Culture',          color: '#ec4899' },
                { d: 'Geography',              color: '#6366f1' },
                { d: 'Environment',            color: '#10b981' },
                { d: 'Politics',               color: '#f43f5e' },
                { d: 'Finance',                color: '#f97316' },
                { d: 'Music',                  color: '#8b5cf6' },
                { d: '+ Custom Topic',         color: '#94a3b8', custom: true },
              ].map((item, i) => (
                <motion.button
                  key={item.d}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.04 }}
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={() => setActiveDomain(item.d)}
                  className="px-5 py-2.5 rounded-full text-sm font-bold transition-all border"
                  style={{
                    background: activeDomain === item.d ? `${item.color}40` : `${item.color}15`,
                    borderColor: activeDomain === item.d ? `${item.color}` : `${item.color}40`,
                    color: activeDomain === item.d ? '#ffffff' : '#cbd5e1',
                    boxShadow: activeDomain === item.d 
                      ? `0 0 35px ${item.color}70, inset 0 0 15px ${item.color}35` 
                      : `0 0 15px ${item.color}20`,
                  }}
                >
                  {item.d}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*  SECTION 6 — AI PROMPT BUILDER WIZARD          */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-32 border-y border-white/[0.04] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#8b5cf6]/8 rounded-full blur-[180px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Wizard UI */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/[0.08] bg-[#08081a] shadow-[0_40px_80px_rgba(0,0,0,0.5)]">
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-6 py-4 border-b border-white/[0.06] bg-white/[0.02]">
                  <div className="w-3 h-3 rounded-full bg-[#f43f5e]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#f59e0b]/80" />
                  <div className="w-3 h-3 rounded-full bg-[#10b981]/80" />
                  <span className="ml-4 text-[#475569] text-xs font-mono">SAGE Generation Wizard</span>
                </div>

                <div className="p-8">
                  {/* Steps */}
                  {[
                    { step: '01', label: 'Select Format', value: 'Logic Challenge', active: true },
                    { step: '02', label: 'Choose Domain', value: 'Artificial Intelligence', active: false },
                    { step: '03', label: 'Set Difficulty', value: 'Advanced', active: false },
                    { step: '04', label: 'Language', value: 'English', active: false },
                  ].map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.1 }}
                      className={`flex items-center gap-5 p-4 rounded-xl mb-3 border transition-all ${
                        s.active
                          ? 'bg-[#3b82f6]/10 border-[#3b82f6]/30'
                          : 'bg-white/[0.02] border-white/[0.05]'
                      }`}
                    >
                      <span className="text-xs font-mono font-bold text-[#3b82f6] w-6">{s.step}</span>
                      <div className="flex-1">
                        <p className="text-[#94a3b8] text-xs mb-0.5">{s.label}</p>
                        <p className="text-white font-semibold text-sm">{s.value}</p>
                      </div>
                      {s.active && (
                        <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-pulse" />
                      )}
                    </motion.div>
                  ))}

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full mt-6 py-4 rounded-2xl text-white font-bold text-sm relative overflow-hidden group"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb] to-[#7c3aed] opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 flex items-center justify-center gap-2">
                      <Zap className="w-4 h-4" /> Initialize SAGE
                    </span>
                  </motion.button>
                </div>
              </div>
            </motion.div>

            {/* Text */}
            <div>
              <SectionLabel label="AI Prompt Builder" />
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
                Precision-built <br />
                <span style={{ background: 'linear-gradient(135deg, #a78bfa, #ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  for your brain.
                </span>
              </h2>
              <p className="text-[#94a3b8] text-xl mb-10 leading-relaxed">
                The SAGE AI pipeline doesn't just retrieve information — it synthesizes it precisely to your parameters in real-time. Adjust format, domain, difficulty, and language in seconds.
              </p>

              <div className="space-y-5">
                {[
                  { num: '01', title: 'Select Format', desc: '8 distinct content types to choose from.' },
                  { num: '02', title: 'Define Domain', desc: 'Pick from 150+ domains or type any custom topic.' },
                  { num: '03', title: 'Set Difficulty', desc: 'Beginner, Intermediate, or Advanced content.' },
                  { num: '04', title: 'Choose Language', desc: '40+ languages supported for global learning.' },
                ].map((f) => (
                  <div key={f.num} className="flex gap-5 items-start group cursor-pointer">
                    <span className="text-[#3b82f6] font-mono font-black text-lg mt-0.5 group-hover:text-[#60a5fa] transition-colors">{f.num}</span>
                    <div>
                      <h4 className="font-bold text-white mb-0.5 group-hover:text-[#60a5fa] transition-colors">{f.title}</h4>
                      <p className="text-sm text-[#94a3b8]">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*  SECTION 7 — FEATURES                          */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#04040a] to-[#06060e]" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="text-center mb-20">
            <SectionLabel label="Platform Features" />
            <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
              Everything you need <br /> to learn at peak performance.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: <Cpu className="w-6 h-6" />,       title: 'AI-Generated Learning',    desc: 'Every piece of content is freshly generated by Gemini AI — never recycled, always unique.',                color: '#3b82f6', img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?q=80&w=600&auto=format&fit=crop' },
              { icon: <Award className="w-6 h-6" />,      title: 'Gamification Engine',      desc: 'XP, levels, streaks, achievements, and leaderboards keep you coming back every single day.',              color: '#f59e0b', img: 'https://images.unsplash.com/photo-1614680376573-df3480f0c6ff?q=80&w=600&auto=format&fit=crop' },
              { icon: <BarChart3 className="w-6 h-6" />,  title: 'Advanced Analytics',       desc: 'Track your mastery score, category distribution, learning heatmaps, and daily activity.',                 color: '#10b981', img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop' },
              { icon: <Globe className="w-6 h-6" />,      title: 'Global Localization',      desc: '40+ languages. Learn anything in your native tongue or challenge yourself with a new language.',          color: '#06b6d4', img: null },
              { icon: <RefreshCw className="w-6 h-6" />,  title: 'Spaced Repetition',        desc: 'SAGE\'s memory engine resurfaces forgotten content at the optimal moment for maximum retention.',        color: '#8b5cf6', img: null },
              { icon: <Wifi className="w-6 h-6" />,       title: 'Cloud Sync',               desc: 'All your progress, bookmarks, and achievements sync instantly across every device via Firebase.',         color: '#ec4899', img: null },
              { icon: <Heart className="w-6 h-6" />,      title: 'Personal Vault',           desc: 'Bookmark your favourite knowledge cards and return to them anytime for review.',                          color: '#f43f5e', img: null },
              { icon: <Clock className="w-6 h-6" />,      title: 'Adaptive Pacing',          desc: 'SAGE learns your daily habits and schedules micro-learning sessions that fit your lifestyle.',            color: '#f97316', img: null },
              { icon: <Lock className="w-6 h-6" />,       title: 'Privacy First',            desc: 'Your data stays yours. No ads, no tracking, no data selling. Ever.',                                     color: '#94a3b8', img: null },
            ].map((feat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.07 }}
                whileHover={{ y: -6 }}
                className="group rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all overflow-hidden cursor-pointer"
              >
                {feat.img && (
                  <div className="h-44 overflow-hidden relative">
                    <img src={feat.img} alt={feat.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-70 group-hover:opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#08080f] to-transparent" />
                  </div>
                )}
                <div className="p-7">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-transform group-hover:scale-110"
                    style={{ background: `${feat.color}15`, color: feat.color, border: `1px solid ${feat.color}30` }}
                  >
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">{feat.title}</h3>
                  <p className="text-sm text-[#94a3b8] leading-relaxed">{feat.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*  SECTION 8 — TESTIMONIALS                      */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-32 bg-[#06060e] border-y border-white/[0.04] overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ec4899]/6 rounded-full blur-[120px] pointer-events-none" />
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="text-center mb-16">
            <SectionLabel label="Testimonials" />
            <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-4">
              Loved by learners worldwide.
            </h2>
            <p className="text-[#94a3b8] text-xl">From students to senior engineers — SAGE changes how people think.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -8 }}
                className="group p-6 rounded-2xl border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer"
              >
                <div className="flex gap-1 mb-4">
                  {Array(t.stars).fill(0).map((_, j) => (
                    <Star key={j} className="w-4 h-4 fill-[#f59e0b] text-[#f59e0b]" />
                  ))}
                </div>
                <p className="text-[#94a3b8] text-sm leading-relaxed mb-6">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-white/10" />
                  <div>
                    <p className="text-white font-bold text-sm">{t.name}</p>
                    <p className="text-[#475569] text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*  SECTION 9 — COMMUNITY PREVIEW                 */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionLabel label="Community" />
              <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6">
                Learn with <br />
                <span style={{ background: 'linear-gradient(135deg, #10b981, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  500,000+
                </span>
                <br />curious minds.
              </h2>
              <p className="text-[#94a3b8] text-xl mb-10">Compete on leaderboards, join learning clubs, tackle daily challenges, and connect with people who love to think.</p>
              <Link to="/community">
                <motion.button whileHover={{ scale: 1.03 }} className="flex items-center gap-2 px-8 py-4 rounded-2xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white font-bold transition-all">
                  Join the Community <ArrowRight className="w-4 h-4" />
                </motion.button>
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-5">
              {[
                { img: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=400&auto=format&fit=crop', label: 'Study Groups',   stat: '12K+ Groups' },
                { img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?q=80&w=400&auto=format&fit=crop', label: 'Leaderboards',   stat: 'Weekly Ranked' },
                { img: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?q=80&w=400&auto=format&fit=crop', label: 'Daily Challenges',stat: 'New Every Day' },
                { img: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?q=80&w=400&auto=format&fit=crop', label: 'Live Events',     stat: '50+ Per Month' },
              ].map((card, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="relative h-44 rounded-2xl overflow-hidden group border border-white/[0.06] cursor-pointer"
                >
                  <img src={card.img} alt={card.label} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <p className="text-white font-bold text-sm">{card.label}</p>
                    <p className="text-[#94a3b8] text-xs">{card.stat}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*  SECTION 10 — BLOG PREVIEW                     */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-32 bg-[#06060e] border-y border-white/[0.04] overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
            <div>
              <SectionLabel label="From the Blog" />
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white">
                Learning science. <br /> AI research. Deep reads.
              </h2>
            </div>
            <Link to="/blog">
              <motion.button whileHover={{ scale: 1.03 }} className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white font-semibold text-sm transition-all whitespace-nowrap">
                View All Posts <ArrowRight className="w-4 h-4" />
              </motion.button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {BLOG_POSTS.map((post, i) => (
              <motion.article
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -8 }}
                className="group rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer"
              >
                <div className="h-52 overflow-hidden relative">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#08080f]/80 to-transparent" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-[#3b82f6]/20 border border-[#3b82f6]/30 text-[#60a5fa] text-xs font-bold">
                    {post.category}
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-3 text-[#475569] text-xs mb-3">
                    <Clock className="w-3.5 h-3.5" /> {post.readTime}
                    <span>•</span>
                    <span>{post.date}</span>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2 leading-snug group-hover:text-[#60a5fa] transition-colors">{post.title}</h3>
                  <p className="text-[#94a3b8] text-sm leading-relaxed">{post.excerpt}</p>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*  SECTION 11 — FAQ                              */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <SectionLabel label="FAQ" />
              <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white mb-6">
                Got questions? <br />
                <span style={{ background: 'linear-gradient(135deg, #a78bfa, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                  We've got answers.
                </span>
              </h2>
              <p className="text-[#94a3b8] text-xl leading-relaxed">Everything you need to know about SAGE, our AI pipeline, and what makes us different.</p>
            </div>

            <div className="space-y-3">
              {FAQS.map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  className="rounded-2xl border border-white/[0.06] bg-white/[0.02] overflow-hidden"
                >
                  <button
                    onClick={() => setActiveFaq(activeFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-6 text-left hover:bg-white/[0.03] transition-colors"
                  >
                    <span className="text-white font-semibold pr-6 text-sm">{faq.q}</span>
                    <motion.div animate={{ rotate: activeFaq === i ? 180 : 0 }} transition={{ duration: 0.3 }}>
                      <ChevronDown className="w-5 h-5 text-[#94a3b8] flex-shrink-0" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {activeFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 text-[#94a3b8] text-sm leading-relaxed border-t border-white/[0.04] pt-4">
                          {faq.a}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════ */}
      {/*  SECTION 12 — FINAL CTA                        */}
      {/* ═══════════════════════════════════════════════ */}
      <section className="relative py-40 bg-[#06060e] border-t border-white/[0.04] overflow-hidden">
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-[#3b82f6]/10 rounded-full blur-[150px] pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-[#8b5cf6]/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold uppercase tracking-[3px] text-[#94a3b8] mb-8">
              <Users className="w-3.5 h-3.5" /> Join 500,000+ Learners
            </div>
            <h2 className="text-5xl md:text-7xl font-black tracking-tight text-white mb-8 leading-[1.05]">
              Your curiosity deserves <br />
              <span
                className="animate-gradient"
                style={{
                  background: 'linear-gradient(135deg, #60a5fa, #8b5cf6, #06b6d4, #60a5fa)',
                  backgroundSize: '300% 300%',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                }}
              >
                better fuel.
              </span>
            </h2>
            <p className="text-[#94a3b8] text-xl mb-12 max-w-2xl mx-auto leading-relaxed">
              Start learning smarter today. No credit card required. Cancel anytime.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
              <Link to="/app">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="relative px-10 py-5 rounded-2xl text-[17px] font-bold text-white overflow-hidden group"
                >
                  <div className="absolute inset-0 animate-gradient" style={{ background: 'linear-gradient(135deg, #3b82f6, #8b5cf6, #06b6d4)', backgroundSize: '300% 300%' }} />
                  <div className="absolute inset-0 shadow-[0_0_60px_rgba(59,130,246,0.6)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span className="relative z-10 flex items-center gap-2">
                    Start Learning for Free <ArrowRight className="w-5 h-5" />
                  </span>
                </motion.button>
              </Link>
              <Link to="/platform">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  className="px-10 py-5 rounded-2xl text-[17px] font-bold text-white border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] transition-all"
                >
                  Explore Platform
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
