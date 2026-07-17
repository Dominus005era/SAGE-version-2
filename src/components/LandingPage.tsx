import React from "react";
import { motion } from "motion/react";
import { Sparkles, Brain, Zap, Globe2, Rocket, ArrowRight, ShieldCheck, UserPlus } from "lucide-react";

interface Props {
  onStart: () => void;
}

export const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-[#0a0b1e] text-white selection:bg-accent-purple/30 overflow-x-hidden">
      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-accent-purple/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-accent-blue/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.03),transparent_70%)]" />
      </div>

      {/* Navigation */}
      <nav className="relative z-20 h-24 flex items-center justify-between px-10 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-accent-purple to-accent-blue rounded-xl flex items-center justify-center shadow-lg">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-black tracking-tighter italic uppercase">SAGE</span>
        </div>
        <button 
          onClick={onStart}
          className="px-6 py-2.5 bg-white/5 backdrop-blur-md border border-white/10 rounded-xl font-bold text-sm hover:bg-white/10 transition-all"
        >
          Access Portal
        </button>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-10 max-w-7xl mx-auto text-center">
        <motion.div
           initial={{ opacity: 0, y: 30 }}
           animate={{ opacity: 1, y: 0 }}
           transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-blue/10 border border-accent-blue/20 rounded-full text-accent-blue text-xs font-bold uppercase tracking-widest mb-8">
            <Zap className="w-3 h-3 fill-accent-blue" />
            V0.4 Live Deployment
          </div>
          <h1 className="text-7xl md:text-8xl font-black tracking-tightest mb-8 leading-[0.9] uppercase italic">
            Logic Over <br />
            <span className="bg-gradient-to-r from-accent-purple via-accent-blue to-accent-green bg-clip-text text-transparent">Syllabus.</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-white/50 font-light leading-relaxed mb-12">
            The world's first AI-driven knowledge game designed to sharpen applied intelligence. 
            Master Space, Science, and human cognition in 30-second logic simulations.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
            <button 
              onClick={onStart}
              className="px-10 py-5 bg-white text-black rounded-2xl font-black text-lg flex items-center gap-4 hover:scale-105 active:scale-95 transition-all shadow-[0_20px_50px_rgba(255,255,255,0.2)]"
            >
              Initiate Simulation <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex -space-x-4">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-bg-main bg-zinc-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://picsum.photos/seed/user${i}/100/100`} alt="user" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </div>
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-bg-main bg-accent-purple flex items-center justify-center text-[10px] font-bold">
                12k+
              </div>
            </div>
            <p className="text-xs text-white/30 font-mono">Active Sages Online</p>
          </div>
        </motion.div>
      </section>

      {/* Features Grid */}
      <section className="relative z-10 py-32 px-10 max-w-7xl mx-auto border-t border-white/5">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard 
            icon={<Brain className="w-8 h-8 text-accent-purple" />}
            title="Logic Correction"
            desc="AI analyzes your decision-making flaws in real-time and provides surgical explanations to rewire your thinking."
          />
          <FeatureCard 
            icon={<Rocket className="w-8 h-8 text-accent-blue" />}
            title="Scenario Based"
            desc="Forget academic facts. SAGE drops you into applied scenarios where you must solve problems using general intelligence."
          />
          <FeatureCard 
            icon={<ShieldCheck className="w-8 h-8 text-accent-green" />}
            title="Personal Vault"
            desc="Construct your persistent memory core. Save critical insights and mistakes to an encrypted personal vault."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 border-t border-white/5 text-center">
        <p className="text-[10px] text-white/20 font-bold uppercase tracking-[4px]">
          &copy; 2026 SAGE Protocol • Global Decentralized Education
        </p>
      </footer>
    </div>
  );
};

const FeatureCard = ({ icon, title, desc }: any) => (
  <motion.div 
    whileHover={{ y: -10 }}
    className="p-10 bg-white/5 backdrop-blur-xl border border-white/10 rounded-[40px] transition-all hover:bg-white/10"
  >
    <div className="mb-6">{icon}</div>
    <h3 className="text-2xl font-bold mb-4 italic uppercase tracking-tighter">{title}</h3>
    <p className="text-white/40 font-light leading-relaxed text-sm">
      {desc}
    </p>
  </motion.div>
);
