import React from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BLOG_POSTS } from '../data/blogPosts';
import { ArrowRight, Clock } from 'lucide-react';

export function BlogPage() {
  return (
    <div className="min-h-screen bg-[#04040a] text-white">
      <Header />
      <div className="pt-32 pb-20 px-6 max-w-[1440px] mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/[0.04] border border-white/[0.08] text-[11px] font-bold uppercase tracking-[3px] text-[#94a3b8] mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ec4899]" />
            SAGE Knowledge Base
          </div>
          <h1 className="text-5xl md:text-7xl font-black mb-6">The Blog</h1>
          <p className="text-xl text-[#94a3b8] max-w-2xl mx-auto">Deep dives into AI, Education, Science, and the future of human cognition.</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {BLOG_POSTS.map((post, i) => (
            <Link key={post.id} to={`/blog/${post.id}`}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                whileHover={{ y: -8 }}
                className="group h-full flex flex-col rounded-[24px] overflow-hidden border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-all cursor-pointer shadow-lg"
              >
                <div className="relative h-56 overflow-hidden">
                  <img src={post.image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
                  <div className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold backdrop-blur-md border border-white/20" style={{ background: `${post.color}80`, color: '#fff' }}>
                    {post.tag}
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex items-center gap-4 text-xs text-[#94a3b8] mb-3 font-semibold uppercase tracking-wider">
                    <span>{post.date}</span>
                    <span className="w-1 h-1 rounded-full bg-white/20" />
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {post.readTime}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3 group-hover:text-white transition-colors line-clamp-2 leading-tight">{post.title}</h3>
                  <p className="text-[#94a3b8] text-sm leading-relaxed mb-6 line-clamp-3">{post.excerpt}</p>
                  
                  <div className="mt-auto flex items-center gap-2 text-sm font-bold" style={{ color: post.color }}>
                    Read Article <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}
