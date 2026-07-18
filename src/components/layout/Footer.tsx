import React from 'react';
import { Link } from 'react-router-dom';
import { Twitter, Github, Linkedin, ArrowRight } from 'lucide-react';

const COLUMNS = [
  {
    title: 'Platform',
    links: ['Features', 'Methodology', 'Mission', 'Blog', 'Pricing'],
  },
  {
    title: 'Company',
    links: ['About', 'Careers', 'Contact', 'Privacy', 'Terms', 'Security'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'API Reference', 'FAQ', 'Guides', 'Changelog', 'Status'],
  },
];

export function Footer() {
  return (
    <footer className="relative bg-[#02020a] border-t border-white/[0.06] pt-24 pb-10 overflow-hidden transition-colors duration-300">

      {/* Background Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px bg-gradient-to-r from-transparent via-[#3b82f6]/50 to-transparent" />
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#3b82f6]/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[#8b5cf6]/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-6 lg:px-10 relative z-10">

        {/* Newsletter Banner */}
        <div className="relative rounded-3xl overflow-hidden mb-20 border border-white/[0.06] footer-card transition-all">
          <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/10 via-[#8b5cf6]/10 to-[#06b6d4]/10" />
          <div className="absolute inset-0 grid-bg-fine opacity-50 pointer-events-none" />
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-10 lg:p-14">
            <div>
              <h3 className="text-3xl font-bold text-white mb-2 footer-heading">Stay ahead with SAGE.</h3>
              <p className="text-[#94a3b8] text-lg footer-text">Weekly AI education insights, new categories, and learning science research.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-72 px-5 py-3.5 bg-white/[0.06] border border-white/10 rounded-xl text-white placeholder-[#475569] focus:outline-none focus:border-[#3b82f6]/50 text-sm transition-all"
              />
              <button className="px-6 py-3.5 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white font-bold rounded-xl text-sm flex items-center gap-2 whitespace-nowrap hover:shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:scale-105 active:scale-95 transition-all">
                Subscribe <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">

          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6 group w-fit">
              <div className="relative w-12 h-12 flex items-center justify-center rounded-full overflow-hidden border border-white/20 bg-[#04040a] shadow-md">
                <img 
                  src="/sage-logo.png" 
                  alt="SAGE Logo" 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-extrabold text-xl tracking-tight text-white footer-heading">SAGE</span>
                <span className="text-[9px] font-semibold tracking-[3px] text-[#94a3b8] uppercase mt-0.5 footer-subtext">AI Learning Engine</span>
              </div>
            </Link>

            <p className="text-[#94a3b8] text-sm leading-relaxed max-w-xs mb-8 footer-text">
              The world's most advanced AI-powered micro-learning platform. Learn, discover, think, and grow with personalized knowledge generated in seconds by Gemini AI.
            </p>

            <div className="flex items-center gap-3">
              {[Twitter, Github, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href={i === 1 ? "https://github.com/Dominus005era/SAGE-version-2" : "#"}
                  target={i === 1 ? "_blank" : undefined}
                  rel={i === 1 ? "noopener noreferrer" : undefined}
                  className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-[#94a3b8] hover:text-white hover:bg-white/[0.08] hover:border-white/[0.12] transition-all footer-icon"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link Columns */}
          {COLUMNS.map((col) => (
            <div key={col.title}>
              <h4 className="text-white font-semibold text-sm mb-6 tracking-wide footer-heading">{col.title}</h4>
              <ul className="space-y-3.5">
                {col.links.map((link) => (
                  <li key={link}>
                    <Link to={`/${link.toLowerCase().replace(' ', '-')}`} className="text-[#94a3b8] hover:text-white text-sm transition-colors footer-link">
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/[0.06] flex flex-col md:flex-row items-center justify-between gap-4 footer-border">
          <p className="text-[#475569] text-xs footer-copyright">© {new Date().getFullYear()} SAGE AI Learning Engine. All rights reserved.</p>
          <div className="flex items-center gap-6">
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((t) => (
              <Link key={t} to="#" className="text-[#475569] hover:text-[#94a3b8] text-xs transition-colors footer-copyright-link">{t}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
