import React from 'react';
import { motion } from 'motion/react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ScrollBackground } from '../components/layout/ScrollBackground';
import { Gamepad2, Settings, Share2, Award, BarChart3, Smartphone, Zap, Mic, Download, Compass, Moon } from 'lucide-react';

export function FeaturesPage() {
  const features = [
    { icon: <Gamepad2 className="text-[#ec4899]" />, title: 'Gamification Engine', desc: 'Earn XP, unlock achievements, and maintain daily streaks to stay motivated.' },
    { icon: <Settings className="text-[#06b6d4]" />, title: 'Adaptive Difficulty', desc: 'The engine adjusts the complexity of the material based on your performance in real-time.' },
    { icon: <Share2 className="text-[#10b981]" />, title: 'Knowledge Mapping', desc: 'Visualize how concepts connect to each other across different domains via 3D graphs.' },
    { icon: <Award className="text-[#f59e0b]" />, title: 'Certification Tracking', desc: 'Prove your mastery and export learning records for your professional portfolio.' },
    { icon: <BarChart3 className="text-[#8b5cf6]" />, title: 'Deep Analytics', desc: 'Heatmaps and retention metrics show exactly where your cognitive weak points are.' },
    { icon: <Smartphone className="text-[#3b82f6]" />, title: 'Cross-Device Sync', desc: 'Start a session on your phone and finish the debate on your desktop seamlessly.' }
  ];

  return (
    <div className="min-h-screen bg-[#04040a] text-white">
      <ScrollBackground images={[
        "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=2000&auto=format&fit=crop"
      ]} />
      <Header />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-32 px-6 overflow-hidden border-b border-white/[0.05]">
        <div className="relative z-10 max-w-[1440px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold uppercase tracking-[3px] text-[#94a3b8] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#06b6d4]" />
              Platform Capabilities
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter">Features</h1>
            <p className="text-xl md:text-2xl text-[#94a3b8] max-w-3xl mx-auto leading-relaxed">
              A comprehensive suite of cognitive tools designed to accelerate your learning speed and maximize your retention.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 px-6 max-w-[1440px] mx-auto py-32 space-y-40">
        
        {/* 1. Features Grid */}
        <section>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: i * 0.1 }} className="p-8 rounded-[32px] border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all group">
                <div className="w-16 h-16 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-6 [&>svg]:w-8 [&>svg]:h-8 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="text-2xl font-bold mb-3">{f.title}</h3>
                <p className="text-[#94a3b8] leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 2. Voice-to-Voice Debates */}
        <section className="text-center max-w-5xl mx-auto">
           <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8">
             <div className="w-20 h-20 rounded-full bg-[#f59e0b]/10 flex items-center justify-center mx-auto mb-8 border border-[#f59e0b]/20 relative">
               <div className="absolute inset-0 rounded-full border border-[#f59e0b]/50 animate-ping" />
               <Mic className="w-10 h-10 text-[#f59e0b]" />
             </div>
             <h2 className="text-4xl md:text-6xl font-black leading-[1.1]">Real-time Voice Debates</h2>
             <p className="text-[#94a3b8] text-xl md:text-2xl leading-relaxed">
               Typing is too slow for true intellectual sparring. Put on your headphones and verbally debate historical figures, physicists, and philosophers recreated by SAGE's vocal engine. The AI listens, pauses, and responds with devastating logical counter-arguments.
             </p>
           </motion.div>
        </section>

        {/* 3. Deep Dive into Analytics */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative h-[600px] border border-white/[0.06] p-8 flex items-center justify-center bg-gradient-to-br from-[#3b82f6]/10 to-[#8b5cf6]/10">
            {/* Mock Dashboard UI */}
            <div className="w-full h-full rounded-2xl bg-[#04040a]/80 backdrop-blur-xl border border-white/10 p-6 flex flex-col gap-6 shadow-2xl">
              <div className="flex justify-between items-center pb-4 border-b border-white/10">
                <h4 className="font-bold text-lg">Cognitive Heatmap</h4>
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </div>
              <div className="flex-1 grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, i) => (
                  <div key={i} className={`rounded-md ${Math.random() > 0.5 ? 'bg-[#10b981]' : Math.random() > 0.5 ? 'bg-[#10b981]/50' : 'bg-white/5'}`} />
                ))}
              </div>
              <div className="h-32 rounded-xl bg-white/5 border border-white/10 p-4 flex items-center gap-4">
                <div className="flex-1 space-y-2">
                  <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full w-[85%] bg-[#3b82f6] rounded-full" />
                  </div>
                  <div className="text-xs text-[#94a3b8]">Neuroscience Mastery: 85%</div>
                </div>
                <div className="text-3xl font-black text-[#3b82f6]">A</div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-[#3b82f6]/10 flex items-center justify-center mb-6">
              <BarChart3 className="w-8 h-8 text-[#3b82f6]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">Deep Analytics & Heatmaps</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              Stop guessing what you know. SAGE tracks every interaction to build a comprehensive map of your cognitive strengths and weaknesses.
            </p>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              Our dashboard visualizes your learning velocity, predicts when you will forget specific concepts, and highlights exactly where you need to focus your review sessions before an exam or project.
            </p>
          </motion.div>
        </section>

        {/* 4. Custom Domain Generation */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8 lg:order-2">
            <div className="w-16 h-16 rounded-2xl bg-[#10b981]/10 flex items-center justify-center mb-6">
              <Compass className="w-8 h-8 text-[#10b981]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">Infinite Curriculum</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              Not limited by pre-written courses. Type *anything* into SAGE, and it will instantly generate a full, structured curriculum complete with logic puzzles, myths, and facts.
            </p>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              Want to learn "15th Century Japanese Pottery"? Or "The Physics of Black Holes"? SAGE builds the entire course for you in 3 seconds.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative h-[500px] border border-white/[0.06] bg-[#02020a] p-8 flex items-center justify-center lg:order-1">
             <div className="w-full max-w-md space-y-6">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-4 shadow-xl">
                   <div className="flex-1 text-[#94a3b8]">I want to learn about...</div>
                   <div className="px-4 py-2 bg-[#10b981] text-black font-bold rounded-xl">Generate</div>
                </div>
                <motion.div initial={{ height: 0, opacity: 0 }} whileInView={{ height: 'auto', opacity: 1 }} transition={{ delay: 0.5, duration: 1 }} className="space-y-4">
                   <div className="h-16 rounded-xl bg-gradient-to-r from-[#10b981]/20 to-transparent border border-[#10b981]/30 flex items-center px-6">
                      <span className="text-[#10b981] font-bold">Module 1: Origins & History</span>
                   </div>
                   <div className="h-16 rounded-xl bg-gradient-to-r from-[#10b981]/10 to-transparent border border-white/10 flex items-center px-6">
                      <span className="text-white font-bold">Module 2: Core Mechanics</span>
                   </div>
                   <div className="h-16 rounded-xl bg-gradient-to-r from-[#10b981]/5 to-transparent border border-white/10 flex items-center px-6 opacity-50">
                      <span className="text-white font-bold">Module 3: Advanced Application</span>
                   </div>
                </motion.div>
             </div>
          </motion.div>
        </section>

        {/* 5. The Reward System Mechanics */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-[#ec4899]/10 flex items-center justify-center mb-6">
              <Zap className="w-8 h-8 text-[#ec4899]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">Reward System Mechanics</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              Consistency is the key to mastery. We designed a gamified progression system that rewards daily effort over sheer talent.
            </p>
            <ul className="space-y-6">
              <li className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-[#f59e0b]/10 flex items-center justify-center text-xl font-bold text-[#f59e0b]">XP</div>
                <p className="text-[#94a3b8]">Earn Experience Points for every challenge solved correctly.</p>
              </li>
              <li className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-[#10b981]/10 flex items-center justify-center text-xl font-bold text-[#10b981]">🔥</div>
                <p className="text-[#94a3b8]">Maintain streaks to unlock XP multipliers and exclusive badges.</p>
              </li>
              <li className="flex gap-4 items-center">
                <div className="w-12 h-12 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center text-xl font-bold text-[#8b5cf6]">🏆</div>
                <p className="text-[#94a3b8]">Climb the global leaderboards and showcase your expertise.</p>
              </li>
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative h-[600px] border border-white/[0.06]">
            <img src="https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Gamification" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04040a] via-[#04040a]/60 to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
               <div className="glass-strong rounded-3xl p-8 border border-white/20 text-center animate-bounce-slow">
                 <div className="text-6xl mb-4">🏆</div>
                 <h4 className="text-2xl font-black text-white">Level Up!</h4>
                 <p className="text-[#f59e0b] font-bold">+500 XP Earned</p>
               </div>
            </div>
          </motion.div>
        </section>

      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
