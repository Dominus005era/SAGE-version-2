import React, { useRef, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Header } from '../components/layout/Header';
import { Footer } from '../components/layout/Footer';
import { BLOG_POSTS } from '../data/blogPosts';
import { ArrowLeft, Clock, Calendar, Download, Loader2 } from 'lucide-react';
import html2pdf from 'html2pdf.js';

// Helper to convert remote images into Base64 using fetch + FileReader
const fetchImageAsBase64 = async (url: string): Promise<string> => {
  try {
    const res = await fetch(url, { mode: 'cors' });
    if (!res.ok) return '';
    const blob = await res.blob();
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = () => resolve('');
      reader.readAsDataURL(blob);
    });
  } catch (e) {
    return '';
  }
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
      // 1. Preload image as Base64 data URL to prevent canvas tainting
      let imgData = base64Image;
      if (!imgData && post.image) {
        imgData = await fetchImageAsBase64(post.image);
        if (imgData) setBase64Image(imgData);
      }

      // 2. Resolve html2pdf factory across Vite module formats
      const pdfWorker = typeof html2pdf === 'function' ? html2pdf : (html2pdf as any).default || (window as any).html2pdf;

      if (!pdfWorker) {
        console.error("PDF Worker unavailable.");
        return;
      }

      const element = pdfTemplateRef.current;

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

      // 3. Generate & Save PDF directly without window.print or DOM overlay mutations
      await pdfWorker().set(opt).from(element).save();
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
        
        <div className="mt-8 flex items-center gap-4">
          <button 
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className="flex items-center gap-2.5 px-7 py-4 rounded-2xl font-bold text-white transition-all shadow-xl hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
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
      {/* PUBLICATION-GRADE PDF TEMPLATE (Completely Isolated & Off-screen) */}
      {/* ========================================================================= */}
      <div 
        style={{ 
          position: 'absolute', 
          left: '-9999px', 
          top: '0', 
          width: '800px', 
          pointerEvents: 'none',
          backgroundColor: '#ffffff',
          color: '#0f172a'
        }}
      >
        <div 
          ref={pdfTemplateRef} 
          data-pdf-template="true"
          className="p-10 bg-white text-slate-900 font-sans"
          style={{ width: '800px', backgroundColor: '#ffffff', color: '#0f172a', fontFamily: 'Arial, sans-serif' }}
        >
          {/* SAGE Header Banner */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b-2 border-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-white font-black text-xl shadow-md">
                S
              </div>
              <div>
                <h3 className="font-black text-lg text-slate-900 tracking-tight leading-none mb-1">SAGE COGNITIVE PLATFORM</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Official Knowledge Article Export</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono font-bold text-slate-400 block">{post.date}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600">Verified Knowledge</span>
            </div>
          </div>

          {/* Article Tag & Metadata */}
          <div className="flex items-center gap-3 mb-4">
            <span data-badge="true" className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ background: post.color }}>
              {post.tag}
            </span>
            <span className="text-xs text-slate-500 font-semibold">• {post.readTime}</span>
          </div>

          {/* Article Title */}
          <h1 className="text-3xl font-black text-slate-900 mb-5 leading-tight tracking-tight">
            {post.title}
          </h1>

          {/* Excerpt Box */}
          <div className="p-4 mb-6 bg-slate-50 border-l-4 rounded-r-xl" style={{ borderColor: post.color }}>
            <p className="text-sm font-semibold text-slate-700 italic leading-relaxed">
              "{post.excerpt}"
            </p>
          </div>

          {/* Hero Image (Rendered only when Base64 Data URL is ready to guarantee 0 canvas tainting) */}
          {base64Image && base64Image.startsWith('data:image') ? (
            <div className="mb-8 rounded-2xl overflow-hidden max-h-[320px] border border-slate-200 shadow-md">
              <img 
                src={base64Image} 
                alt={post.title} 
                className="w-full h-full object-cover" 
              />
            </div>
          ) : (
            <div 
              className="mb-8 rounded-2xl p-6 border border-slate-200 shadow-sm flex items-center justify-between"
              style={{ background: `linear-gradient(135deg, ${post.color}15, #f8fafc)` }}
            >
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">SAGE Deep Cognitive Analysis</span>
                <h4 className="text-lg font-black text-slate-900 mt-1">{post.title}</h4>
              </div>
            </div>
          )}

          {/* Main Article Body Text */}
          <div 
            className="prose-pdf text-sm text-slate-800 space-y-4 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }} 
            style={{ color: '#334155', fontSize: '14px', lineHeight: '1.7' }}
          />

          {/* Footer Copyright */}
          <div className="mt-12 pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
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
          line-height: 1.8;
          margin-bottom: 1.5rem;
          font-size: 1.125rem;
        }
      `}} />

      <Footer />
    </div>
  );
}
