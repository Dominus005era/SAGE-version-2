import React, { useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BLOG_POSTS } from '../data/blogPosts';
import { ArrowLeft, Clock, Calendar, Download } from 'lucide-react';
import html2pdf from 'html2pdf.js';

export function BlogPostPage() {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === id);
  const contentRef = useRef<HTMLDivElement>(null);

  if (!post) {
    return (
      <div className="min-h-screen bg-[#04040a] text-white flex items-center justify-center flex-col gap-6">
        <h1 className="text-4xl font-bold">Post not found</h1>
        <Link to="/blog" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition">Back to Blog</Link>
      </div>
    );
  }

  const handleDownloadPDF = () => {
    if (!contentRef.current) return;
    const element = contentRef.current;
    
    // Configure html2pdf options
    const opt = {
      margin:       1,
      filename:     `${post.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2, useCORS: true, backgroundColor: '#04040a' },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();
  };

  return (
    <div className="min-h-screen bg-[#04040a] text-white">
      <Header />
      
      {/* Hero Header */}
      <div className="relative pt-32 pb-20 px-6 max-w-[900px] mx-auto z-10">
        <Link to="/blog" className="inline-flex items-center gap-2 text-[#94a3b8] hover:text-white transition-colors mb-8 font-semibold text-sm">
          <ArrowLeft className="w-4 h-4" /> Back to all articles
        </Link>
        
        <div className="flex items-center gap-3 mb-6">
          <span className="px-3 py-1 rounded-full text-xs font-bold border border-white/20" style={{ background: `${post.color}30`, color: post.color }}>
            {post.tag}
          </span>
          <span className="text-[#94a3b8] text-sm flex items-center gap-1.5 font-semibold"><Calendar className="w-4 h-4" /> {post.date}</span>
          <span className="w-1 h-1 rounded-full bg-white/20" />
          <span className="text-[#94a3b8] text-sm flex items-center gap-1.5 font-semibold"><Clock className="w-4 h-4" /> {post.readTime}</span>
        </div>
        
        <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1]">{post.title}</h1>
        <p className="text-xl text-[#94a3b8] leading-relaxed border-l-4 pl-6" style={{ borderColor: post.color }}>{post.excerpt}</p>
        
        <button 
          onClick={handleDownloadPDF}
          className="mt-8 flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all shadow-lg hover:shadow-xl"
          style={{ background: post.color }}
        >
          <Download className="w-4 h-4" /> Export as PDF
        </button>
      </div>

      <div className="max-w-[1200px] mx-auto px-6 mb-12">
        <div className="rounded-[32px] overflow-hidden h-[400px] md:h-[500px] relative border border-white/[0.06] shadow-2xl">
          <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" crossOrigin="anonymous" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Content Area (Target for PDF) */}
      <div className="max-w-[800px] mx-auto px-6 pb-32">
        <div 
          ref={contentRef}
          className="prose prose-invert prose-lg max-w-none text-[#d1d5db]"
          // PDF specific styling wrapped in a div so html2pdf can render it cleanly
        >
          <div className="html2pdf-container" style={{ color: '#d1d5db', fontFamily: 'sans-serif' }}>
            <h1 className="text-3xl font-bold text-white mb-6 hidden pdf-only">{post.title}</h1>
            <div dangerouslySetInnerHTML={{ __html: post.content }} />
          </div>
        </div>
      </div>
      
      {/* Minimal CSS for formatting the HTML content properly */}
      <style dangerouslySetInnerHTML={{__html: `
        .prose h2 {
          color: white;
          font-size: 2rem;
          font-weight: 800;
          margin-top: 2rem;
          margin-bottom: 1rem;
        }
        .prose p {
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-size: 1.125rem;
        }
        .pdf-only {
          display: none;
        }
      `}} />

      <Footer />
    </div>
  );
}
