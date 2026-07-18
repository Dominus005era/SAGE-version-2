import React from 'react';
import { motion } from 'motion/react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ScrollBackground } from '../components/layout/ScrollBackground';
import { Trophy, Users, MessagesSquare, PlayCircle, Star, ArrowRight, Code, MessageCircle, Laptop } from 'lucide-react';

export function CommunityPage() {
  return (
    <div className="min-h-screen bg-[#04040a] text-white">
      <ScrollBackground images={[
        "https://images.unsplash.com/photo-1528605248644-14dd04022da1?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1555949963-aa79dcee981c?q=80&w=2000&auto=format&fit=crop"
      ]} />
      <Header />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-32 px-6 overflow-hidden border-b border-white/[0.05]">
        <div className="relative z-10 max-w-[1440px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold uppercase tracking-[3px] text-[#94a3b8] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
              Multiplayer Learning
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter">The Community</h1>
            <p className="text-xl md:text-2xl text-[#94a3b8] max-w-3xl mx-auto leading-relaxed">
              Knowledge shouldn't be acquired in isolation. Join thousands of learners worldwide in debates, study groups, and weekly challenges.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 px-6 max-w-[1440px] mx-auto py-32 space-y-40">
        
        {/* 1. Global Leaderboards */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8 lg:order-2">
            <div className="w-16 h-16 rounded-2xl bg-[#f59e0b]/10 flex items-center justify-center mb-6">
              <Trophy className="w-8 h-8 text-[#f59e0b]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">Global Leaderboards</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              Compete with the brightest minds across the globe. Our leaderboards reset weekly, giving everyone a fresh chance to claim the top spot across specialized domains like Physics, Philosophy, and Computer Science.
            </p>
            <button className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all bg-gradient-to-r from-[#f59e0b] to-[#ec4899] hover:opacity-90">
              View Current Rankings <ArrowRight className="w-4 h-4" />
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative border border-white/[0.06] bg-white/[0.02] p-8 lg:order-1">
            <div className="space-y-4">
              {[
                { name: 'Alex Chen', rank: 1, score: '14,500', tier: 'Grandmaster' },
                { name: 'Sarah Jenkins', rank: 2, score: '13,200', tier: 'Master' },
                { name: 'David Okafor', rank: 3, score: '12,850', tier: 'Master' },
                { name: 'Elena Rostova', rank: 4, score: '11,400', tier: 'Diamond' },
              ].map((user, i) => (
                <div key={i} className={`flex items-center justify-between p-4 rounded-2xl border ${i === 0 ? 'bg-gradient-to-r from-[#f59e0b]/20 to-transparent border-[#f59e0b]/30 scale-[1.02]' : 'bg-white/5 border-white/10'}`}>
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black ${i === 0 ? 'bg-[#f59e0b] text-black shadow-[0_0_15px_rgba(245,158,11,0.5)]' : 'bg-white/10'}`}>
                      {user.rank}
                    </div>
                    <div>
                      <h4 className="font-bold">{user.name}</h4>
                      <p className="text-xs text-[#94a3b8]">{user.tier}</p>
                    </div>
                  </div>
                  <div className="font-mono font-bold text-[#10b981]">{user.score} XP</div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* 2. Featured Study Groups */}
        <section>
          <div className="text-center mb-16">
            <div className="w-16 h-16 rounded-2xl bg-[#3b82f6]/10 flex items-center justify-center mx-auto mb-6">
              <Users className="w-8 h-8 text-[#3b82f6]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-6">Featured Study Groups</h2>
            <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">Join specialized cohorts dedicated to mastering niche subjects through collaborative challenges.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { title: 'Quantum Mechanics 101', members: '1.2k', active: '34 online', img: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=600&auto=format&fit=crop' },
              { title: 'Stoic Philosophy', members: '4.5k', active: '112 online', img: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?q=80&w=600&auto=format&fit=crop' },
              { title: 'Advanced Cryptography', members: '850', active: '15 online', img: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?q=80&w=600&auto=format&fit=crop' }
            ].map((group, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: i * 0.1 }} className="rounded-[24px] overflow-hidden border border-white/[0.06] bg-white/[0.02] group cursor-pointer hover:border-white/20 transition-all">
                <div className="h-40 overflow-hidden relative">
                  <img src={group.img} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={group.title} />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#04040a] to-transparent" />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{group.title}</h3>
                  <div className="flex items-center justify-between text-sm text-[#94a3b8]">
                    <span className="flex items-center gap-1"><Users className="w-4 h-4" /> {group.members} members</span>
                    <span className="flex items-center gap-1 text-[#10b981]"><span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse" /> {group.active}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 3. Live AI Debates */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative h-[500px] border border-white/[0.06] group cursor-pointer lg:order-2">
            <img src="https://images.unsplash.com/photo-1577563908411-5077b6dc7624?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" alt="Live Debate" />
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(255,255,255,0.2)]">
                <PlayCircle className="w-10 h-10 text-white" />
              </div>
            </div>
            <div className="absolute bottom-8 left-8 right-8">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-500 text-white uppercase tracking-wider animate-pulse">Live Now</span>
              </div>
              <h3 className="text-2xl font-bold text-white">Can AGI be truly aligned?</h3>
              <p className="text-[#94a3b8] text-sm mt-2">Dr. Sarah Jenkins vs. The SAGE Engine</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8 lg:order-1">
            <div className="w-16 h-16 rounded-2xl bg-[#ec4899]/10 flex items-center justify-center mb-6">
              <MessagesSquare className="w-8 h-8 text-[#ec4899]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">Live AI Debates</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              Watch top users go head-to-head against our most rigorous AI personas in live-streamed Socratic debates.
            </p>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              Analyze their arguments, vote on logic flaws in real-time, and learn how to construct bulletproof theses under pressure. The community decides who wins.
            </p>
          </motion.div>
        </section>

        {/* 4. Global Hackathons */}
        <section className="text-center max-w-5xl mx-auto">
           <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8">
             <div className="w-20 h-20 rounded-full bg-[#10b981]/10 flex items-center justify-center mx-auto mb-8 border border-[#10b981]/20">
               <Laptop className="w-10 h-10 text-[#10b981]" />
             </div>
             <h2 className="text-4xl md:text-6xl font-black leading-[1.1]">Monthly Cognitive Hackathons</h2>
             <p className="text-[#94a3b8] text-xl md:text-2xl leading-relaxed">
               Every month, we release a massive, multi-disciplinary puzzle that requires teams to combine knowledge of history, physics, and code. The first team to solve the overarching scenario gets featured on the platform and wins exclusive badges.
             </p>
           </motion.div>
        </section>

        {/* 5. Open Source / Developer Community */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8">
            <div className="w-16 h-16 rounded-2xl bg-[#3b82f6]/10 flex items-center justify-center mb-6">
              <Code className="w-8 h-8 text-[#3b82f6]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">Build With Us</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              SAGE is committed to the developer community. We open-source our scenario templates so you can build entirely new ways to learn.
            </p>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              Contribute to the GitHub repository, propose new UI components, or write custom logic evaluators.
            </p>
            <a href="https://github.com/Dominus005era/SAGE-version-2" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-black transition-all bg-white hover:bg-gray-200 mt-4">
              View on GitHub <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative h-[400px] border border-white/[0.06] bg-[#02020a] p-8 flex items-center justify-center">
            <div className="w-full h-full border border-white/10 rounded-2xl bg-[#04040a] p-6 shadow-2xl overflow-hidden relative">
               <div className="flex gap-2 mb-4">
                 <div className="w-3 h-3 rounded-full bg-white/20" />
                 <div className="w-3 h-3 rounded-full bg-white/20" />
                 <div className="w-3 h-3 rounded-full bg-white/20" />
               </div>
               <pre className="text-sm font-mono text-[#3b82f6]">
                 <code>
                   $ git clone https://github.com/Dominus005era/SAGE-version-2.git<br/>
                   <span className="text-white/50">Cloning into 'SAGE-version-2'...</span><br/>
                   $ cd SAGE-version-2<br/>
                   $ npm install<br/>
                   <span className="text-[#10b981]">✔ Packages installed successfully.</span><br/>
                   $ npm run dev<br/>
                   <span className="text-[#f59e0b]">ready in 432ms.</span>
                 </code>
               </pre>
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
