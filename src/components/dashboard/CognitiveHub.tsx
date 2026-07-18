import React, { useState } from "react";
import { motion } from "motion/react";
import { 
  BookOpen, Brain, Lightbulb, PenTool, LayoutTemplate, Activity, 
  Award, MessageSquare, Sparkles, Zap 
} from "lucide-react";
import { Category } from "../../types";

interface CognitiveHubProps {
  activeDomains: string[];
  initialFormat?: string | null;
  onStartSynthesis: (format: string, domain: string) => void;
}

export function CognitiveHub({ activeDomains, initialFormat, onStartSynthesis }: CognitiveHubProps) {
  const [selectedFormat, setSelectedFormat] = useState<string | null>(initialFormat || null);
  const [selectedDomain, setSelectedDomain] = useState<string | null>(null);

  const formats = [
    { id: "fact", label: "Fact Mode", desc: "Mind-bending 30s logic facts", icon: <BookOpen className="w-5 h-5" />, color: "#10b981" },
    { id: "quiz", label: "Quiz Mode", desc: "Scenario-based active recall questions", icon: <Brain className="w-5 h-5" />, color: "#ec4899" },
    { id: "myth", label: "Myth Debunker", desc: "Debunk popular misconceptions", icon: <Lightbulb className="w-5 h-5" />, color: "#f59e0b" },
    { id: "story", label: "Storyteller", desc: "Pivotal history lessons wrapped in narrative", icon: <PenTool className="w-5 h-5" />, color: "#f97316" },
    { id: "case_study", label: "Case Study", desc: "Real-world engineering failure analyses", icon: <LayoutTemplate className="w-5 h-5" />, color: "#3b82f6" },
    { id: "scenario", label: "Scenario Player", desc: "High-stakes interactive simulations", icon: <Activity className="w-5 h-5" />, color: "#06b6d4" },
    { id: "logic", label: "Logic Challenge", desc: "Pure cognitive deduction brain teasers", icon: <Award className="w-5 h-5" />, color: "#8b5cf6" },
    { id: "discussion", label: "AI Discussion", desc: "Socratic debates on complex theses", icon: <MessageSquare className="w-5 h-5" />, color: "#6366f1" },
  ];

  const handleStart = () => {
    if (selectedFormat && selectedDomain) {
      onStartSynthesis(selectedFormat, selectedDomain);
    }
  };

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8 select-none">
      
      {/* Console Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-white/[0.05]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-white border border-white/20">
          <Sparkles className="w-6 h-6 animate-pulse" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Cognitive Synthesis Console</h2>
          <p className="text-xs text-[#94a3b8] font-semibold tracking-wider">Configure format and target domain variables to initiate AI synthesis.</p>
        </div>
      </div>

      <div className="grid md:grid-cols-5 gap-8 items-start">
        
        {/* Left Side: Formats Selector */}
        <div className="md:col-span-3 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[2px] text-[#475569]">Select Layout Format</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {formats.map((f) => {
              const isSelected = selectedFormat === f.id;
              return (
                <button
                  key={f.id}
                  onClick={() => setSelectedFormat(f.id)}
                  className={`p-5 rounded-2xl border text-left transition-all ${
                    isSelected
                      ? "bg-white/10 border-white/20 text-white shadow-lg shadow-white/5"
                      : "bg-[#080816]/30 border-white/[0.06] text-[#94a3b8] hover:bg-[#080816]/50 hover:text-white"
                  }`}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div 
                      className="w-8 h-8 rounded-lg flex items-center justify-center"
                      style={{ 
                        backgroundColor: isSelected ? `${f.color}25` : "rgba(255,255,255,0.03)", 
                        color: f.color 
                      }}
                    >
                      {f.icon}
                    </div>
                    <span className="font-bold text-sm">{f.label}</span>
                  </div>
                  <p className="text-[11px] opacity-50 font-medium leading-relaxed">{f.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side: Domains Selector */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-[2px] text-[#475569]">Select Target Domain</h3>
          <div className="bg-[#080816]/40 border border-white/[0.08] rounded-3xl p-6 space-y-3 max-h-[360px] overflow-y-auto scrollbar-thin">
            {activeDomains.length === 0 ? (
              <p className="text-xs text-center text-[#475569] font-mono py-12">
                No active domains found. Please configure them in Settings.
              </p>
            ) : (
              activeDomains.map((domain) => {
                const isSelected = selectedDomain?.toLowerCase() === domain.toLowerCase();
                return (
                  <button
                    key={domain}
                    onClick={() => setSelectedDomain(domain.toLowerCase())}
                    className={`w-full flex items-center justify-between px-5 py-4 rounded-xl border text-left transition-all font-bold text-xs ${
                      isSelected
                        ? "bg-[#3b82f6]/10 border-[#3b82f6] text-[#3b82f6] shadow-lg shadow-[#3b82f6]/5"
                        : "bg-white/[0.02] border-white/5 text-[#cbd5e1] hover:bg-white/[0.04]"
                    }`}
                  >
                    <span className="uppercase tracking-wider">{domain}</span>
                    {isSelected && (
                      <div className="w-2 h-2 rounded-full bg-[#3b82f6] animate-ping" />
                    )}
                  </button>
                );
              })
            )}
          </div>

          {/* Action Synthesis Button */}
          <button
            disabled={!selectedFormat || !selectedDomain}
            onClick={handleStart}
            className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-[2px] flex items-center justify-center gap-3 transition-all ${
              selectedFormat && selectedDomain
                ? "bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white hover:scale-[1.02] active:scale-[0.98] shadow-lg cursor-pointer"
                : "bg-white/[0.02] border border-white/5 text-[#475569] cursor-not-allowed"
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            Initialize Synthesis Engine
          </button>
        </div>

      </div>
    </div>
  );
}
