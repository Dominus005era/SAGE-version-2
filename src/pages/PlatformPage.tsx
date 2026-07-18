import React from 'react';
import { motion } from 'motion/react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { ScrollBackground } from '../components/layout/ScrollBackground';
import { Cpu, Zap, Database, Globe, Lock, Code2, Network, Server, ArrowRight, Layers, Workflow, ShieldCheck, TerminalSquare } from 'lucide-react';

export function PlatformPage() {
  return (
    <div className="min-h-screen bg-[#04040a] text-white">
      <ScrollBackground images={[
        "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=2000&auto=format&fit=crop",
        "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=2000&auto=format&fit=crop"
      ]} />
      <Header />
      
      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-32 px-6 overflow-hidden border-b border-white/[0.05]">
        <div className="relative z-10 max-w-[1440px] mx-auto text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold uppercase tracking-[3px] text-[#94a3b8] mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3b82f6]" />
              Infrastructure
            </div>
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 tracking-tighter">The Platform</h1>
            <p className="text-xl md:text-2xl text-[#94a3b8] max-w-3xl mx-auto leading-relaxed">
              Built on a cutting-edge architecture, SAGE processes knowledge in real-time to create adaptive, highly personalized learning experiences at global scale.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="relative z-10 px-6 max-w-[1440px] mx-auto py-32 space-y-40">
        
        {/* 1. The Architecture */}
        <section>
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black mb-6">The SAGE Engine Architecture</h2>
            <p className="text-[#94a3b8] text-lg max-w-2xl mx-auto">A robust three-tier system designed for speed, context-awareness, and dynamic content generation.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Cpu className="text-[#3b82f6]" />, title: 'Neural Generation', desc: 'Dynamically structures learning paths, adapting to your specific cognitive load in real-time.' },
              { icon: <Database className="text-[#8b5cf6]" />, title: 'Knowledge Graph', desc: 'A vast, interconnected web of concepts that maps out the underlying structure of human knowledge.' },
              { icon: <Network className="text-[#06b6d4]" />, title: 'Edge Delivery', desc: 'Content is compiled and served at the edge, ensuring sub-second latency no matter where you are.' }
            ].map((feature, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} transition={{ delay: i * 0.1 }} className="p-8 rounded-[32px] border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/[0.02] rounded-full blur-2xl group-hover:bg-white/[0.04] transition-colors" />
                <div className="w-16 h-16 rounded-2xl bg-white/[0.05] flex items-center justify-center mb-6 [&>svg]:w-8 [&>svg]:h-8">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{feature.title}</h3>
                <p className="text-[#94a3b8] leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* 2. The LLM Core */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8 lg:order-2">
            <div className="w-16 h-16 rounded-2xl bg-[#8b5cf6]/10 flex items-center justify-center mb-6 border border-[#8b5cf6]/20">
              <Workflow className="w-8 h-8 text-[#8b5cf6]" />
            </div>
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">The LLM Core</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              At the heart of SAGE is a fine-tuned orchestration of Large Language Models. We don't just pass prompts; we use a multi-agent system to verify, structure, and format knowledge before it reaches your screen.
            </p>
            <ul className="space-y-6">
              {[
                { title: 'Semantic Verification', desc: 'Every fact generated is cross-referenced against a trusted vector database to prevent hallucinations.' },
                { title: 'Sub-second Latency', desc: 'Streaming responses ensure you never wait for your next logic puzzle.' }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#8b5cf6]/10 flex items-center justify-center flex-shrink-0 border border-[#8b5cf6]/20 text-[#8b5cf6] font-bold">
                    {i + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white mb-1">{item.title}</h4>
                    <p className="text-[#94a3b8]">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative h-[600px] border border-white/[0.06] bg-[#06060e] p-8 flex items-center justify-center lg:order-1">
             <div className="absolute inset-0 grid-bg opacity-30" />
             <div className="relative w-full max-w-md space-y-4 font-mono text-sm">
                <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-[#94a3b8]">
                  <span className="text-[#3b82f6]">const</span> response = <span className="text-[#8b5cf6]">await</span> SAGEEngine.generate({'{'}
                  <br/>&nbsp;&nbsp;topic: <span className="text-[#10b981]">'Quantum Computing'</span>,
                  <br/>&nbsp;&nbsp;cognitiveLoad: <span className="text-[#f59e0b]">0.75</span>,
                  <br/>&nbsp;&nbsp;format: <span className="text-[#10b981]">'logic_puzzle'</span>
                  <br/>{'}'});
                </div>
                <div className="flex justify-center py-2">
                  <ArrowRight className="w-6 h-6 text-[#94a3b8] rotate-90" />
                </div>
                <div className="p-4 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] shadow-[0_0_30px_rgba(16,185,129,0.15)]">
                  // Milliseconds later: Custom React Component generated and rendered via edge functions.
                </div>
             </div>
          </motion.div>
        </section>

        {/* 3. Real-time Data Processing */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative h-[600px] border border-white/[0.06]">
            <img src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1200&auto=format&fit=crop" className="absolute inset-0 w-full h-full object-cover" alt="Data processing" />
            <div className="absolute inset-0 bg-gradient-to-tr from-[#3b82f6]/20 to-transparent mix-blend-overlay" />
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">Real-time Data Processing</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              Every interaction you have with the platform—every quiz answer, every second spent reading, every logic challenge solved—feeds back into the engine.
            </p>
            <ul className="space-y-6">
              {[
                { title: 'Micro-adjustments', desc: 'The difficulty of the next question is adjusted within 50 milliseconds.' },
                { title: 'Concept Mapping', desc: 'Your personal knowledge graph is updated to show mastery levels.' },
                { title: 'Predictive Forgetting', desc: 'The system schedules a review just before you are statistically likely to forget it.' }
              ].map((item, i) => (
                <li key={i} className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-[#3b82f6]/10 flex items-center justify-center flex-shrink-0 border border-[#3b82f6]/20">
                    <Zap className="w-5 h-5 text-[#3b82f6]" />
                  </div>
                  <div>
                    <h4 className="font-bold text-lg text-white mb-1">{item.title}</h4>
                    <p className="text-[#94a3b8]">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </section>

        {/* 4. Dynamic UI Generation */}
        <section className="text-center max-w-5xl mx-auto">
           <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8">
             <div className="w-20 h-20 rounded-full bg-[#ec4899]/10 flex items-center justify-center mx-auto mb-8 border border-[#ec4899]/20">
               <Layers className="w-10 h-10 text-[#ec4899]" />
             </div>
             <h2 className="text-4xl md:text-6xl font-black leading-[1.1]">Dynamic UI Generation</h2>
             <p className="text-[#94a3b8] text-xl md:text-2xl leading-relaxed">
               SAGE doesn't use static templates. Based on the subject matter, the AI instructs the frontend on how to render the layout. Learning geography? The UI shifts to an interactive map component. Learning coding? A built-in terminal appears.
             </p>
           </motion.div>
        </section>

        {/* 5. API Integration */}
        <section className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-black leading-[1.1]">Extensible via API</h2>
            <p className="text-[#94a3b8] text-xl leading-relaxed">
              We are building the foundational intelligence layer for global education. Soon, developers will be able to plug into the SAGE engine to power their own educational apps, VR environments, and corporate training systems.
            </p>
            <button className="px-8 py-4 bg-white/5 border border-white/10 hover:bg-white/10 transition-colors rounded-xl font-bold flex items-center gap-3 text-white">
               <TerminalSquare className="w-5 h-5" /> Read API Documentation
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative border border-white/[0.06] bg-[#02020a] p-8 lg:p-12 shadow-2xl">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <div className="w-3 h-3 rounded-full bg-yellow-500" />
              <div className="w-3 h-3 rounded-full bg-green-500" />
            </div>
            <pre className="text-sm font-mono text-[#94a3b8] overflow-x-auto">
              <code>
                <span className="text-[#ec4899]">import</span> {'{'} SageClient {'}'} <span className="text-[#ec4899]">from</span> <span className="text-[#10b981]">'@sage/sdk'</span>;<br/><br/>
                <span className="text-[#3b82f6]">const</span> client = <span className="text-[#ec4899]">new</span> SageClient(API_KEY);<br/><br/>
                <span className="text-white/50">// Generate a dynamic assessment</span><br/>
                <span className="text-[#3b82f6]">const</span> assessment = <span className="text-[#8b5cf6]">await</span> client.assessments.create({'{'}<br/>
                &nbsp;&nbsp;userId: <span className="text-[#10b981]">'user_89f21'</span>,<br/>
                &nbsp;&nbsp;domain: <span className="text-[#10b981]">'Astrophysics'</span>,<br/>
                &nbsp;&nbsp;difficulty: <span className="text-[#10b981]">'adaptive'</span><br/>
                {'}'});<br/><br/>
                console.log(assessment.components);
              </code>
            </pre>
          </motion.div>
        </section>

        {/* 6. Security & Scale */}
        <section>
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-100px' }} className="rounded-[40px] overflow-hidden relative bg-white/[0.02] border border-white/[0.06] p-12 lg:p-24 text-center shadow-[0_0_100px_rgba(16,185,129,0.05)]">
            <ShieldCheck className="w-20 h-20 text-[#10b981] mx-auto mb-10" />
            <h2 className="text-4xl lg:text-6xl font-black mb-8">Global Scale. Local Privacy.</h2>
            <p className="text-xl md:text-2xl text-[#94a3b8] mb-16 max-w-4xl mx-auto leading-relaxed">
              SAGE is built on serverless infrastructure, allowing it to scale infinitely while ensuring that your personal cognitive data remains securely encrypted and private. We don't sell your brain data.
            </p>
            <div className="grid md:grid-cols-3 gap-8 text-left">
              <div className="p-8 rounded-3xl bg-[#04040a] border border-white/[0.04] hover:border-[#f59e0b]/50 transition-colors">
                <Server className="w-10 h-10 text-[#f59e0b] mb-6" />
                <h4 className="text-xl font-bold mb-3">99.99% Uptime</h4>
                <p className="text-[#94a3b8] leading-relaxed">Distributed across multi-region clusters ensuring you can learn without interruption.</p>
              </div>
              <div className="p-8 rounded-3xl bg-[#04040a] border border-white/[0.04] hover:border-[#ec4899]/50 transition-colors">
                <Lock className="w-10 h-10 text-[#ec4899] mb-6" />
                <h4 className="text-xl font-bold mb-3">End-to-End Encryption</h4>
                <p className="text-[#94a3b8] leading-relaxed">Your learning metrics, cognitive weaknesses, and personal data are mathematically secured.</p>
              </div>
              <div className="p-8 rounded-3xl bg-[#04040a] border border-white/[0.04] hover:border-[#8b5cf6]/50 transition-colors">
                <Globe className="w-10 h-10 text-[#8b5cf6] mb-6" />
                <h4 className="text-xl font-bold mb-3">Edge Deployed</h4>
                <p className="text-[#94a3b8] leading-relaxed">Content is served from the CDN node closest to you, guaranteeing lightning-fast rendering.</p>
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
