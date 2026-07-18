import React from 'react';
import { motion } from 'motion/react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ScrollBackground } from '../components/layout/ScrollBackground';
import { Brain, Activity, Target, Layers, ArrowDownUp, ShieldCheck, BookOpen, Lightbulb, Image as ImageIcon } from 'lucide-react';

export function MethodologyPage() {
  return (
    <div className="min-h-screen bg-[#04040a] text-white">
      <ScrollBackground images={[
        "https://images.unsplash.com/photo-1507413245164-6160d8298b31?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1576086213369-97a306d36557?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?q=80&w=2000&auto=format&fit=crop"
      ]} />
      <Header />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-32 px-6 overflow-hidden border-b border-white/[0.05]">
        <div className="relative z-10 max-w-[1440px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold uppercase tracking-[3px] text-[#94a3b8] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899]" />
              Cognitive Science
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter">Our Methodology</h1>
            <p className="text-xl md:text-2xl text-[#94a3b8] max-w-3xl mx-auto leading-relaxed">
              Rooted in neuroscience, SAGE uses active recall, spaced repetition, and the Feynman technique to rewire your brain for maximum retention.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 px-6 max-w-[1440px] mx-auto py-32 space-y-40">
        
        {/* 1. The Forgetting Curve */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-[#f59e0b]/10 flex items-center justify-center mb-6">
              <Activity className="w-8 h-8 text-[#f59e0b]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">Defeating the Forgetting Curve</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              In 1885, Hermann Ebbinghaus discovered that humans forget roughly 70% of new information within 24 hours. Passive reading and highlighting do not work.
            </p>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              SAGE actively interrupts this curve. By testing your recall at precisely calculated intervals, we force your brain to strengthen the neural pathways associated with that memory.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative h-[500px] border border-white/[0.06] bg-white/[0.02] p-8 flex items-center justify-center">
            {/* Visual representation of a graph */}
            <div className="w-full h-full relative flex items-end pb-12">
              <div className="absolute left-0 bottom-12 w-full h-px bg-white/10" />
              <div className="absolute left-8 bottom-0 w-px h-full bg-white/10" />
              <svg viewBox="0 0 400 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(245,158,11,0.5)] z-10" preserveAspectRatio="none">
                <path d="M 0 0 Q 50 250 400 280" fill="none" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round" />
                <path d="M 50 100 Q 100 200 400 230" fill="none" stroke="#3b82f6" strokeWidth="4" strokeLinecap="round" />
                <path d="M 100 50 Q 200 100 400 120" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" />
              </svg>
              <div className="absolute top-8 right-8 space-y-2 text-sm font-bold">
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#f59e0b]" /> 1st Review</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#3b82f6]" /> 2nd Review</div>
                <div className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-[#10b981]" /> 3rd Review (Mastery)</div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. The Feynman Technique Module */}
        <section className="text-center max-w-5xl mx-auto">
           <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8">
             <div className="w-20 h-20 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center mx-auto mb-8 border border-[#8b5cf6]/20">
               <BookOpen className="w-10 h-10 text-[#8b5cf6]" />
             </div>
             <h2 className="text-4xl md:text-6xl font-black leading-[1.1]">The Feynman Protocol</h2>
             <p className="text-[#94a3b8] text-xl md:text-2xl leading-relaxed">
               "If you can't explain it simply, you don't understand it well enough." SAGE frequently flips the script, asking YOU to explain a complex topic back to the AI as if it were a 5-year-old. Our AI grades your explanation on clarity, accuracy, and simplicity.
             </p>
           </motion.div>
        </section>

        {/* 3. Dopamine-driven Habit Loops */}
        <section>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative border border-white/[0.06] bg-gradient-to-br from-[#ec4899]/10 to-[#8b5cf6]/10 p-12 lg:p-20 shadow-2xl">
            <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2000&auto=format&fit=crop')] opacity-10 object-cover mix-blend-screen" />
            <div className="relative z-10 text-center max-w-4xl mx-auto">
              <Brain className="w-16 h-16 text-[#ec4899] mx-auto mb-8" />
              <h2 className="text-4xl md:text-5xl font-black mb-6">Dopamine-Driven Habit Loops</h2>
              <p className="text-xl text-[#94a3b8] leading-relaxed mb-12">
                Education shouldn't feel like a chore. By providing immediate micro-rewards, XP points, and dynamic progression, we hijack the brain's dopamine pathways to build a positive addiction to learning.
              </p>
              <div className="grid sm:grid-cols-3 gap-6 text-left">
                <div className="p-8 rounded-3xl glass-strong border border-white/[0.08]">
                  <h4 className="font-bold text-white mb-3 text-xl">1. Trigger</h4>
                  <p className="text-[#94a3b8]">A customized push notification or daily challenge prompts you to engage.</p>
                </div>
                <div className="p-8 rounded-3xl glass-strong border border-white/[0.08]">
                  <h4 className="font-bold text-white mb-3 text-xl">2. Action</h4>
                  <p className="text-[#94a3b8]">You complete a short, intense active recall scenario on the platform.</p>
                </div>
                <div className="p-8 rounded-3xl glass-strong border border-white/[0.08]">
                  <h4 className="font-bold text-white mb-3 text-xl">3. Reward</h4>
                  <p className="text-[#94a3b8]">You earn XP, level up, and see your knowledge graph expand immediately.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 4. Cognitive Load Theory */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative h-[500px] border border-white/[0.06] bg-[#04040a] p-8 flex items-center justify-center lg:order-2">
            <div className="relative w-full h-full flex flex-col items-center justify-center gap-8">
               <div className="w-full flex items-center gap-4">
                  <div className="h-16 w-1/3 bg-red-500/20 border border-red-500/50 rounded-xl flex items-center justify-center font-bold text-red-500">Overload</div>
                  <p className="text-[#94a3b8] text-sm">Too hard. Panic & Burnout.</p>
               </div>
               <div className="w-full flex items-center gap-4">
                  <div className="h-20 w-1/2 bg-[#10b981]/20 border border-[#10b981]/50 rounded-xl flex items-center justify-center font-black text-xl text-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.2)] scale-110">Zone of Proximal Dev.</div>
                  <p className="text-[#10b981] font-bold text-sm">Perfect flow state.</p>
               </div>
               <div className="w-full flex items-center gap-4">
                  <div className="h-16 w-2/3 bg-blue-500/20 border border-blue-500/50 rounded-xl flex items-center justify-center font-bold text-blue-500">Boredom</div>
                  <p className="text-[#94a3b8] text-sm">Too easy. Disengagement.</p>
               </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8 lg:order-1">
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">Cognitive Load Balancing</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              If a lesson is too hard, you quit out of frustration. If it's too easy, you quit out of boredom.
            </p>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              SAGE algorithms constantly analyze your response times and accuracy to keep you in the "Zone of Proximal Development"—the exact sweet spot where learning occurs fastest without cognitive overload.
            </p>
          </motion.div>
        </section>

        {/* 5. Multimodal Learning */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">Multimodal Learning</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              The human brain evolved to process information through multiple senses. Reading a text wall is highly inefficient. SAGE generates dynamic visuals, auditory cues, and interactive logic puzzles alongside text to cement concepts across different sensory pathways in your brain.
            </p>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm font-bold"><ImageIcon className="w-4 h-4 text-[#3b82f6]"/> Visual</div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm font-bold"><Layers className="w-4 h-4 text-[#8b5cf6]"/> Spatial</div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-lg border border-white/10 text-sm font-bold"><Lightbulb className="w-4 h-4 text-[#f59e0b]"/> Logical</div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative h-[600px] border border-white/[0.06] bg-[url('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center">
            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center p-8">
               <div className="w-full max-w-sm glass-strong rounded-3xl p-6 border border-white/20">
                  <div className="h-40 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] mb-4 flex items-center justify-center shadow-inner">
                     <Target className="w-12 h-12 text-white" />
                  </div>
                  <h4 className="font-bold text-lg mb-2">Visual Scenario Analysis</h4>
                  <p className="text-sm text-[#94a3b8]">Identify the logical fallacy in the image provided.</p>
               </div>
            </div>
          </motion.div>
        </section>

        {/* 6. Active Recall Scenarios */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="grid grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="h-64 rounded-3xl bg-gradient-to-br from-[#06b6d4]/20 to-[#3b82f6]/20 border border-[#06b6d4]/30 p-8 flex flex-col justify-end hover:scale-105 transition-transform cursor-pointer">
                <Layers className="w-10 h-10 text-[#06b6d4] mb-4" />
                <h4 className="font-bold text-xl">Contextual Myths</h4>
              </div>
              <div className="h-48 rounded-3xl bg-gradient-to-br from-[#10b981]/20 to-[#3b82f6]/20 border border-[#10b981]/30 p-8 flex flex-col justify-end hover:scale-105 transition-transform cursor-pointer">
                <ShieldCheck className="w-10 h-10 text-[#10b981] mb-4" />
                <h4 className="font-bold text-xl">Logic Defense</h4>
              </div>
            </div>
            <div className="space-y-4 pt-12">
              <div className="h-48 rounded-3xl bg-gradient-to-br from-[#f59e0b]/20 to-[#ef4444]/20 border border-[#f59e0b]/30 p-8 flex flex-col justify-end hover:scale-105 transition-transform cursor-pointer">
                <ArrowDownUp className="w-10 h-10 text-[#f59e0b] mb-4" />
                <h4 className="font-bold text-xl">Socratic Debate</h4>
              </div>
              <div className="h-64 rounded-3xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#ec4899]/20 border border-[#8b5cf6]/30 p-8 flex flex-col justify-end hover:scale-105 transition-transform cursor-pointer">
                <Target className="w-10 h-10 text-white mb-4" />
                <h4 className="font-bold text-xl text-white">Interactive Quizzes</h4>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">Active Recall Scenarios</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              We never give you a block of text and ask you to simply read it. Instead, SAGE places you in the middle of a scenario where you must apply the knowledge immediately.
            </p>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              Whether you are defending a thesis against a Socratic AI, debunking a generated myth, or solving a logic puzzle, you learn by doing. This is the difference between knowing the name of a concept and truly understanding how it works.
            </p>
          </motion.div>
        </section>

      </div>
      <div className="relative z-10">
        <Footer />
      </div>
    </div>
  );
}
