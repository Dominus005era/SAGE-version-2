import React from 'react';
import { motion } from 'motion/react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ScrollBackground } from '../components/layout/ScrollBackground';
import { Sparkles, Users, Globe2, Lightbulb, Target, Compass, SearchCode, Cpu } from 'lucide-react';

export function MissionPage() {
  return (
    <div className="min-h-screen bg-[#04040a] text-white">
      <ScrollBackground images={[
        "https://images.unsplash.com/photo-1493612276216-ee3925520721?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1501504905252-473c47e087f8?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=2000&auto=format&fit=crop"
      ]} />
      <Header />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-32 px-6 overflow-hidden border-b border-white/[0.05]">
        <div className="relative z-10 max-w-[1440px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold uppercase tracking-[3px] text-[#94a3b8] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#f59e0b]" />
              The Vision
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter">Our Mission</h1>
            <p className="text-xl md:text-2xl text-[#94a3b8] max-w-3xl mx-auto leading-relaxed">
              To democratize deep learning by making complex, advanced topics accessible, engaging, and unforgettable for everyone, everywhere.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 px-6 max-w-[1440px] mx-auto py-32 space-y-40">
        
        {/* 1. The Problem with Modern Education */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">The Crisis of Passive Learning</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              For over a century, the educational model has remained largely the same: a teacher speaks to a room of 30 students, hoping the pace fits the average. The result? The gifted are bored, the struggling are left behind, and nobody retains the information past the final exam.
            </p>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              Textbooks are static. Video lectures are one-way streets. Modern education is built for compliance, not comprehension. SAGE was built to shatter this paradigm.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative h-[500px] border border-white/[0.06]">
            <img src="https://images.unsplash.com/photo-1577896851231-70ef18881754?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover grayscale opacity-50" alt="Old Classroom" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04040a] to-transparent" />
            <div className="absolute bottom-8 left-8 p-6 bg-red-500/10 border border-red-500/30 rounded-2xl backdrop-blur-md">
               <h4 className="text-red-500 font-bold mb-2">The Factory Model</h4>
               <p className="text-sm text-white/70">Standardized, slow, and uninspired.</p>
            </div>
          </motion.div>
        </section>

        {/* 2. Our Core Values */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">Our Core Values</h2>
            <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">The principles that guide every feature we build and every line of code we write.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: <Sparkles className="text-[#f59e0b]" />, title: 'Empower Curiosity', desc: 'We build systems that reward asking "why" and diving deeper into the unknown.' },
              { icon: <Users className="text-[#3b82f6]" />, title: 'Universal Access', desc: 'Elite education should not be locked behind geography or socio-economic status.' },
              { icon: <Lightbulb className="text-[#10b981]" />, title: 'Clarity over Jargon', desc: 'We explain the hardest concepts simply, without dumbing down the underlying science.' },
              { icon: <Globe2 className="text-[#ec4899]" />, title: 'Global Community', desc: 'Learning is a multiplayer game. We connect minds across the planet.' }
            ].map((value, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: i * 0.1 }} className="p-8 rounded-[24px] border border-white/[0.06] bg-white/[0.02] text-center hover:bg-white/[0.04] transition-colors">
                <div className="w-16 h-16 rounded-full bg-white/[0.05] flex items-center justify-center mx-auto mb-6 [&>svg]:w-8 [&>svg]:h-8">
                  {value.icon}
                </div>
                <h3 className="text-xl font-bold mb-4">{value.title}</h3>
                <p className="text-[#94a3b8] text-sm leading-relaxed">{value.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. Meet the Architecture */}
        <section className="text-center max-w-5xl mx-auto">
           <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8">
             <div className="w-20 h-20 rounded-full bg-[#3b82f6]/10 flex items-center justify-center mx-auto mb-8 border border-[#3b82f6]/20">
               <Cpu className="w-10 h-10 text-[#3b82f6]" />
             </div>
             <h2 className="text-4xl md:text-6xl font-black leading-[1.1]">Built for the AI Era</h2>
             <p className="text-[#94a3b8] text-xl md:text-2xl leading-relaxed">
               We didn't just slap a chatbot onto a textbook. SAGE is a ground-up reconstruction of how software should teach. Our proprietary multi-agent framework ensures that the curriculum adapts not just to what you know, but *how* you learn best.
             </p>
           </motion.div>
        </section>

        {/* 4. Roadmap to AGI Education */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8 lg:order-2">
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">The Roadmap to AGI-Tutors</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              We are on a trajectory to provide every human on earth with a personalized, universally knowledgeable tutor.
            </p>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/20 before:to-transparent">
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/50 bg-[#04040a] text-white shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow-[0_0_20px_rgba(255,255,255,0.2)]">
                  1
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-[20px] border border-white/10 bg-white/[0.02]">
                  <h4 className="font-bold text-lg mb-1 text-[#3b82f6]">Phase 1: Generative Formats</h4>
                  <p className="text-sm text-[#94a3b8]">Replacing static textbooks with dynamically generated quizzes, myths, and stories.</p>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#04040a] text-[#94a3b8] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  2
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-[20px] border border-white/10 bg-white/[0.02]">
                  <h4 className="font-bold text-lg mb-1 text-[#8b5cf6]">Phase 2: Voice & Vision</h4>
                  <p className="text-sm text-[#94a3b8]">Real-time multimodal conversations where the AI can see what you are studying and guide you verbally.</p>
                </div>
              </div>
              <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white/20 bg-[#04040a] text-[#94a3b8] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2">
                  3
                </div>
                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-[20px] border border-white/10 bg-white/[0.02]">
                  <h4 className="font-bold text-lg mb-1 text-[#10b981]">Phase 3: Omniscient Tutors</h4>
                  <p className="text-sm text-[#94a3b8]">AGI-level comprehension capable of teaching PhD-level physics or elementary arithmetic with equal mastery.</p>
                </div>
              </div>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative h-[700px] border border-white/[0.06] lg:order-1">
            <img src="https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Future of AI" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#04040a] via-[#04040a]/40 to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 text-center">
              <h3 className="text-3xl font-bold mb-4">The Future is Here</h3>
              <p className="text-[#94a3b8]">We are closer to Phase 3 than anyone realizes.</p>
            </div>
          </motion.div>
        </section>

        {/* 5. Impact Statistics */}
        <section>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative border border-white/[0.06] bg-white/[0.02] p-12 lg:p-20 text-center">
            <h2 className="text-4xl md:text-5xl font-black mb-16">The Impact We Seek</h2>
            <div className="grid md:grid-cols-3 gap-12">
              <div>
                <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] mb-4">1B+</div>
                <h4 className="text-xl font-bold mb-2">Minds Reached</h4>
                <p className="text-[#94a3b8]">Our goal is to impact one billion learners globally over the next decade.</p>
              </div>
              <div>
                <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#10b981] to-[#06b6d4] mb-4">5x</div>
                <h4 className="text-xl font-bold mb-2">Faster Mastery</h4>
                <p className="text-[#94a3b8]">By using active recall, students learn 5 times faster than traditional passive reading.</p>
              </div>
              <div>
                <div className="text-6xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-[#f59e0b] to-[#ec4899] mb-4">98%</div>
                <h4 className="text-xl font-bold mb-2">Long-term Retention</h4>
                <p className="text-[#94a3b8]">Spaced repetition ensures knowledge stays locked in your long-term memory permanently.</p>
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
