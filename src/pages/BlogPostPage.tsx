import React, { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BLOG_POSTS } from '../data/blogPosts';
import { ArrowLeft, Clock, Calendar, Download, Loader2, Sun, Lightbulb } from 'lucide-react';
import html2pdf from 'html2pdf.js';

// Helper to convert remote images into Base64 so html2canvas renders them with 0 CORS issues
const fetchImageAsBase64 = (url: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth || 800;
        canvas.height = img.naturalHeight || 500;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0);
          resolve(canvas.toDataURL('image/jpeg', 0.95));
        } else {
          resolve(url);
        }
      } catch (e) {
        resolve(url);
      }
    };
    img.onerror = () => resolve(url);
    img.src = url;
  });
};

export function BlogPostPage() {
  const { id } = useParams();
  const post = BLOG_POSTS.find(p => p.id === id);
  const pdfTemplateRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [base64Image, setBase64Image] = useState<string>('');

  if (!post) {
    return (
      <div className="min-h-screen bg-[#04040a] text-white flex items-center justify-center flex-col gap-6">
        <h1 className="text-4xl font-bold">Post not found</h1>
        <Link to="/blog" className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 transition">Back to Blog</Link>
      </div>
    );
  }

  const handleDownloadPDF = async () => {
    if (!pdfTemplateRef.current) return;
    setIsExporting(true);

    try {
      // Preload image as Base64 data URL to eliminate CORS canvas tainting
      let imgData = base64Image;
      if (!imgData && post.image) {
        imgData = await fetchImageAsBase64(post.image);
        setBase64Image(imgData);
      }

      const element = pdfTemplateRef.current;

      // Configure html2pdf options for high-definition print quality on white paper
      const opt = {
        margin: [0.4, 0.4, 0.4, 0.4],
        filename: `SAGE_${post.id}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2, 
          useCORS: true, 
          allowTaint: true,
          backgroundColor: '#ffffff',
          logging: false
        },
        jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' },
        pagebreak: { mode: ['avoid-all', 'css'] }
      };

      await html2pdf().set(opt).from(element).save();
    } catch (err) {
      console.error("PDF Generation error:", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#04040a] text-white">
      <Header />
      
      {/* Hero Header */}
      <div className="relative pt-32 pb-16 px-6 max-w-[900px] mx-auto z-10">
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
        
        <h1 className="text-4xl md:text-6xl font-black mb-8 leading-[1.1] text-white">{post.title}</h1>
        <p className="text-xl text-[#94a3b8] leading-relaxed border-l-4 pl-6" style={{ borderColor: post.color }}>{post.excerpt}</p>
        
        {/* Action Button & Light Mode Recommendation Notice */}
        <div className="mt-8 space-y-4">
          <button 
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2 px-8 py-4 rounded-2xl font-bold text-white transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed text-base"
            style={{ background: post.color }}
          >
            {isExporting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Compiling High-Res PDF...
              </>
            ) : (
              <>
                <Download className="w-5 h-5" /> Export Article as PDF
              </>
            )}
          </button>

          {/* Explicit Light Mode Export Recommendation Notice */}
          <div className="flex items-start gap-2.5 px-5 py-3.5 bg-amber-500/10 border border-amber-500/20 rounded-2xl text-xs font-medium text-amber-200/90 max-w-xl">
            <Lightbulb className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <span>
              <strong>Export Tip:</strong> For the crispest layout and high-contrast paper formatting, please export the blog article in <strong>Light Mode</strong> (toggle using the Sun icon <Sun className="w-3.5 h-3.5 inline text-amber-400" /> in the top header).
            </span>
          </div>
        </div>
      </div>

      {/* Featured Main Image */}
      <div className="max-w-[1200px] mx-auto px-6 mb-12">
        <div className="rounded-[32px] overflow-hidden h-[400px] md:h-[500px] relative border border-white/[0.06] shadow-2xl">
          <img src={post.image} alt={post.title} className="absolute inset-0 w-full h-full object-cover" crossOrigin="anonymous" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
        </div>
      </div>

      {/* Article Body Content */}
      <div className="max-w-[800px] mx-auto px-6 pb-32">
        <div className="prose prose-invert prose-lg max-w-none text-[#d1d5db]">
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PUBLICATION-GRADE PDF TEMPLATE (Strictly White Paper Off-screen Container) */}
      {/* ========================================================================= */}
      <div 
        style={{ 
          position: 'fixed', 
          left: '-9999px', 
          top: '0', 
          width: '800px', 
          zIndex: -9999, 
          backgroundColor: '#ffffff',
          color: '#0f172a'
        }}
      >
        <div 
          ref={pdfTemplateRef} 
          className="p-10 font-sans"
          style={{ width: '800px', backgroundColor: '#ffffff', color: '#0f172a', fontFamily: 'Arial, sans-serif' }}
        >
          {/* SAGE Header Banner */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b-2 border-slate-200" style={{ borderColor: '#e2e8f0' }}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-xl shadow-md" style={{ background: 'linear-gradient(to top right, #2563eb, #9333ea)', color: '#ffffff' }}>
                S
              </div>
              <div>
                <h3 className="font-black text-lg tracking-tight leading-none mb-1" style={{ color: '#0f172a' }}>SAGE COGNITIVE PLATFORM</h3>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#64748b' }}>Official Knowledge Article Export</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold block" style={{ color: '#94a3b8' }}>{post.date}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: '#9333ea' }}>Verified Knowledge</span>
            </div>
          </div>

          {/* Article Tag & Metadata */}
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 rounded-full text-xs font-bold" style={{ background: post.color, color: '#ffffff' }}>
              {post.tag}
            </span>
            <span className="text-xs font-semibold" style={{ color: '#64748b' }}>• {post.readTime}</span>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl font-black mb-5 leading-tight tracking-tight" style={{ color: '#0f172a' }}>
            {post.title}
          </h1>

          {/* Excerpt Box */}
          <div className="p-4 mb-6 border-l-4 rounded-r-xl" style={{ backgroundColor: '#f8fafc', borderColor: post.color }}>
            <p className="text-sm font-semibold italic leading-relaxed" style={{ color: '#334155' }}>
              "{post.excerpt}"
            </p>
          </div>

          {/* Hero Image */}
          {post.image && (
            <div className="mb-8 rounded-2xl overflow-hidden max-h-[340px] border shadow-md" style={{ borderColor: '#e2e8f0' }}>
              <img 
                src={base64Image || post.image} 
                alt={post.title} 
                className="w-full h-full object-cover" 
                crossOrigin="anonymous" 
              />
            </div>
          )}

          {/* Main Article Body Text */}
          <div 
            className="prose-pdf text-sm space-y-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }} 
            style={{ color: '#334155', fontSize: '14px', lineHeight: '1.7' }}
          />

          {/* Footer Copyright */}
          <div className="mt-12 pt-6 border-t flex items-center justify-between text-xs" style={{ borderColor: '#e2e8f0', color: '#94a3b8' }}>
            <span className="font-semibold">SAGE Cognitive Network &copy; {new Date().getFullYear()}</span>
            <span className="font-mono text-[11px]">https://sage-learning.net/blog/{post.id}</span>
          </div>
        </div>
      </div>
      
      {/* CSS Styles for article body in browser */}
      <style dangerouslySetInnerHTML={{__html: `
        .prose h2 {
          color: white;
          font-size: 2rem;
          font-weight: 800;
          margin-top: 2.5rem;
          margin-bottom: 1rem;
        }
        .prose p {
          color: #d1d5db;
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-size: 1.125rem;
        }

        /* Pristine high-contrast text rules when viewing blog post in Light Mode */
        .light-mode .prose h1,
        .light-mode .prose h2,
        .light-mode .prose h3,
        .light-mode .prose h4 {
          color: #0f172a !important;
        }
        .light-mode .prose p,
        .light-mode .prose span,
        .light-mode .prose div,
        .light-mode .prose li,
        .light-mode .prose-invert p {
          color: #334155 !important;
        }

        .prose-pdf h2 {
          color: #0f172a !important;
          font-size: 1.5rem !important;
          font-weight: 800 !important;
          margin-top: 1.5rem !important;
          margin-bottom: 0.75rem !important;
        }
        .prose-pdf p {
          color: #334155 !important;
          font-size: 14px !important;
          line-height: 1.7 !important;
          margin-bottom: 1rem !important;
        }
      `}} />

      <Footer />
    </div>
  );
}
