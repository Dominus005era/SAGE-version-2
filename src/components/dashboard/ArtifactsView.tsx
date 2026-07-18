import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Layers, Search, Trash2, Share2, BookOpen, Brain, 
  Lightbulb, PenTool, LayoutTemplate, Activity, Award, MessageSquare, 
  ExternalLink, Calendar, CheckCircle2 
} from "lucide-react";
import { KnowledgeItem, UserProfile } from "../../types";

interface ArtifactsViewProps {
  user: UserProfile | null;
}

export function ArtifactsView({ user }: ArtifactsViewProps) {
  const vaultKey = `saved_vault_${user?.userId || "guest"}`;
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [filterType, setFilterType] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedItem, setSelectedItem] = useState<KnowledgeItem | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Load saved cards on mount
  useEffect(() => {
    const saved = localStorage.getItem(vaultKey);
    if (saved) {
      try {
        setItems(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse saved vault:", e);
      }
    }
  }, [vaultKey]);

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this saved artifact?")) {
      const updated = items.filter(item => item.id !== id);
      setItems(updated);
      localStorage.setItem(vaultKey, JSON.stringify(updated));
      if (selectedItem?.id === id) {
        setSelectedItem(null);
      }
    }
  };

  const handleShare = (item: KnowledgeItem, e: React.MouseEvent) => {
    e.stopPropagation();
    const typeLabel = item.type === "fact" ? "FACT" : "QUIZ";
    const shareText = `SAGE Cognitive Link [${typeLabel} - ${item.category.toUpperCase()}]:\n\n"${item.title || item.content}"\n\nSynthesized on SAGE Portal. Check out http://localhost:3000/app`;
    navigator.clipboard.writeText(shareText);
    setCopiedId(item.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getFormatDetails = (type: string) => {
    switch (type) {
      case "fact": return { label: "Fact Mode", color: "#10b981", icon: <BookOpen className="w-4 h-4" /> };
      case "quiz": return { label: "Quiz Mode", color: "#ec4899", icon: <Brain className="w-4 h-4" /> };
      case "myth": return { label: "Myth Debunker", color: "#f59e0b", icon: <Lightbulb className="w-4 h-4" /> };
      case "story": return { label: "Storyteller", color: "#f97316", icon: <PenTool className="w-4 h-4" /> };
      case "case_study": return { label: "Case Study", color: "#3b82f6", icon: <LayoutTemplate className="w-4 h-4" /> };
      case "scenario": return { label: "Scenario Player", color: "#06b6d4", icon: <Activity className="w-4 h-4" /> };
      case "logic": return { label: "Logic Challenge", color: "#8b5cf6", icon: <Award className="w-4 h-4" /> };
      default: return { label: "AI Discussion", color: "#6366f1", icon: <MessageSquare className="w-4 h-4" /> };
    }
  };

  const filteredItems = items.filter(item => {
    const matchesFilter = filterType === "all" || item.type === filterType;
    const matchesSearch = item.title?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          item.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-5xl w-full mx-auto space-y-8 select-none">
      
      {/* Header */}
      <div className="flex items-center gap-3 pb-6 border-b border-white/[0.05]">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#3b82f6] flex items-center justify-center text-white border border-white/20">
          <Layers className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Saved Artifacts Vault</h2>
          <p className="text-xs text-[#94a3b8] font-semibold tracking-wider">Review, study, and share your custom-synthesized cognitive templates.</p>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Search */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-[#475569] absolute left-4 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search saved cards by keyword, category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#080816]/40 border border-white/10 rounded-2xl pl-12 pr-6 py-3 text-xs font-semibold text-white placeholder-zinc-500 focus:outline-none focus:border-[#3b82f6] transition-colors"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex gap-1.5 bg-white/5 p-1 rounded-xl border border-white/10">
          {[
            { id: "all", label: "All Items" },
            { id: "fact", label: "Facts" },
            { id: "quiz", label: "Quizzes" }
          ].map(opt => (
            <button
              key={opt.id}
              onClick={() => setFilterType(opt.id)}
              className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${
                filterType === opt.id
                  ? "bg-white/10 text-white shadow-md"
                  : "text-[#475569] hover:text-[#94a3b8]"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-start">
        
        {/* Left Side: List Grid */}
        <div className="md:col-span-2 space-y-4 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin">
          {filteredItems.length === 0 ? (
            <div className="bg-[#080816]/20 border border-white/[0.05] rounded-3xl p-12 text-center">
              <Layers className="w-12 h-12 text-[#475569] mx-auto mb-4 animate-pulse" />
              <h4 className="font-bold text-white text-sm mb-1">No Artifacts Found</h4>
              <p className="text-xs text-[#475569] max-w-xs mx-auto leading-relaxed">
                Start generating learning cards in the Cognitive Hub and click the Bookmark button to save them here.
              </p>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {filteredItems.map((item) => {
                const fmt = getFormatDetails(item.type);
                const isSelected = selectedItem?.id === item.id;
                return (
                  <div
                    key={item.id}
                    onClick={() => setSelectedItem(item)}
                    className={`p-5 rounded-2xl border text-left cursor-pointer transition-all ${
                      isSelected
                        ? "bg-white/10 border-white/20 text-white shadow-lg"
                        : "bg-[#080816]/30 border-white/[0.06] text-[#cbd5e1] hover:bg-white/[0.02]"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#3b82f6]">
                        {item.category}
                      </span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => handleShare(item, e)}
                          className="p-1.5 hover:bg-white/5 rounded-lg text-[#475569] hover:text-white transition-colors"
                          title="Share"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={(e) => handleDelete(item.id, e)}
                          className="p-1.5 hover:bg-red-500/10 rounded-lg text-[#475569] hover:text-red-400 transition-colors"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <h4 className="font-bold text-xs line-clamp-2 mb-2 leading-relaxed text-white">
                      {item.title || item.content}
                    </h4>

                    <div className="flex items-center gap-1.5 mt-4 text-[10px] text-[#475569] font-bold">
                      <span style={{ color: fmt.color }}>{fmt.icon}</span>
                      <span className="uppercase tracking-wider">{fmt.label}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Side: Preview Display Panel */}
        <div className="md:col-span-1">
          <AnimatePresence mode="wait">
            {selectedItem ? (
              <motion.div
                key={selectedItem.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#080816]/55 border border-white/10 rounded-3xl p-6 space-y-6 shadow-xl backdrop-blur-xl relative"
              >
                <div className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#3b82f6]">
                    {selectedItem.category} Artifact
                  </span>
                  
                  {copiedId === selectedItem.id ? (
                    <span className="text-[10px] text-emerald-400 font-mono font-bold">Copied!</span>
                  ) : (
                    <button
                      onClick={(e) => handleShare(selectedItem, e)}
                      className="flex items-center gap-1 px-3 py-1 bg-white/5 rounded-lg text-[10px] font-bold border border-white/10 text-zinc-300 hover:text-white"
                    >
                      <Share2 className="w-3 h-3" /> Share
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  <h3 className="font-black text-sm uppercase tracking-wide text-white leading-normal">
                    {selectedItem.title || "Synthesized Challenge"}
                  </h3>
                  
                  <p className="text-xs text-[#94a3b8] leading-relaxed font-medium">
                    {selectedItem.content}
                  </p>

                  {selectedItem.options && (
                    <div className="space-y-2 pt-2">
                      <p className="text-[9px] font-bold uppercase tracking-wider text-[#475569]">Options Registry</p>
                      {selectedItem.options.map((opt, idx) => {
                        const isCorrect = idx === selectedItem.correctOptionIndex;
                        return (
                          <div 
                            key={idx}
                            className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-between ${
                              isCorrect 
                                ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400" 
                                : "bg-white/[0.01] border-white/5 text-zinc-400"
                            }`}
                          >
                            <span>{opt}</span>
                            {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/[0.05] space-y-2">
                    <span className="text-[9px] font-bold uppercase tracking-wider text-purple-400">AI Cognitive Insight</span>
                    <p className="text-xs text-zinc-300 leading-relaxed font-light italic">
                      "{selectedItem.explanation}"
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-[#080816]/10 border border-dashed border-white/10 rounded-3xl p-12 text-center flex flex-col items-center justify-center min-h-[300px]">
                <Layers className="w-8 h-8 text-[#475569] mb-3 opacity-50" />
                <p className="text-xs text-[#475569] font-mono">Select a saved artifact to preview blueprint data.</p>
              </div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
