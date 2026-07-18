import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  CheckCircle2, XCircle, Share2, Bookmark, BookmarkCheck, 
  ArrowRight, BrainCircuit, Lightbulb, BookOpen, MessageSquare, 
  HelpCircle, Sparkles, Volume2, ShieldAlert
} from "lucide-react";
import { KnowledgeItem } from "../types";
import { DiscussionChat } from "./DiscussionChat";
import confetti from "canvas-confetti";

interface Props {
  item: KnowledgeItem;
  onResponse: (correct: boolean) => void;
  onSave: (item: KnowledgeItem) => void;
  onNext: () => void;
  onPrevious?: () => void;
  onToggleLearnMode?: (learn: boolean) => void;
}

export const KnowledgeCard: React.FC<Props> = ({ 
  item, 
  onResponse, 
  onSave, 
  onNext, 
  onPrevious,
  onToggleLearnMode 
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showDiscussionChat, setShowDiscussionChat] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [copied, setCopied] = useState(false);
  const [localLearnMode, setLocalLearnMode] = useState<boolean>(!!item.isLearnMode);

  // Universal Arrow Key Navigation Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent key triggers if user is typing inside an input or textarea
      const target = e.target as HTMLElement;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) {
        return;
      }

      if (e.key === "ArrowRight" || e.key === "ArrowUp") {
        e.preventDefault();
        onNext(); // Instantly change card regardless of type, mode, or answered status!
      } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
        e.preventDefault();
        if (onPrevious) onPrevious();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onNext, onPrevious]);

  // Reset state when item changes
  useEffect(() => {
    setSelectedOption(null);
    setShowExplanation(false);
    setShowDiscussionChat(false);
    setIsSaved(false);
    setCopied(false);
    setLocalLearnMode(!!item.isLearnMode);
  }, [item]);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    const correct = index === item.correctOptionIndex;
    
    if (correct) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#3b82f6', '#8b5cf6', '#10b981']
      });
    }
    
    setShowExplanation(true);
    onResponse(correct);
  };

  const handleSaveClick = () => {
    onSave(item);
    setIsSaved(true);
  };

  const handleShareClick = () => {
    let bodyText = item.content;

    if (item.type === "myth" && localLearnMode && (item.mythText || item.truthText)) {
      bodyText = `Myth: ${item.mythText || item.content.split('\n')[0]}\n\nTruth: ${item.truthText || item.explanation}`;
    } else if (hasOptions && item.options && item.options.length > 0) {
      const optionsFormatted = item.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n');
      bodyText = `Question:\n${item.content}\n\nOptions:\n${optionsFormatted}`;
      
      if (item.correctOptionIndex !== undefined && item.options[item.correctOptionIndex]) {
        bodyText += `\n\nCorrect Answer:\nOption ${item.correctOptionIndex + 1}: ${item.options[item.correctOptionIndex]}`;
      }

      if (item.explanation) {
        bodyText += `\n\nAI Cognitive Insight:\n${item.explanation}`;
      }
    } else if (item.explanation) {
      bodyText = `${item.content}\n\nAI Cognitive Insight:\n${item.explanation}`;
    }

    const shareText = `SAGE Cognitive Link [${item.type.toUpperCase()} - ${item.category.toUpperCase()}]:\n\n"${item.title || ""}"\n\n${bodyText}`;
    navigator.clipboard.writeText(shareText.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const toggleLearnMode = (mode: boolean) => {
    setLocalLearnMode(mode);
    if (onToggleLearnMode) onToggleLearnMode(mode);
  };

  const currentImageUrl = item.imageUrl || `https://picsum.photos/seed/${encodeURIComponent(item.category + "-" + (item.title || "logic"))}/800/450`;
  const isDualModeFormat = item.type === "story" || item.type === "myth" || item.type === "case_study";
  const hasOptions = !!(item.options && item.options.length > 0 && !(isDualModeFormat && localLearnMode));

  return (
    <div className="relative w-full max-w-3xl mx-auto select-none">
      
      {/* Upper Action Bar & Learn/Test Mode Toggle */}
      <div className="flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase tracking-[2px] text-[#3b82f6]">
            {item.category} • {item.type.replace("_", " ")}
          </span>

          {/* Learn Mode vs Test Mode Pill Selector */}
          {isDualModeFormat && (
            <div className="flex items-center bg-white/5 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => toggleLearnMode(true)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  localLearnMode
                    ? "bg-purple-600 text-white shadow-md shadow-purple-500/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                📖 Learn Mode
              </button>
              <button
                onClick={() => toggleLearnMode(false)}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold transition-all ${
                  !localLearnMode
                    ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                🧪 Test Mode
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {copied && (
            <span className="text-[10px] text-emerald-400 font-mono font-bold mr-2 animate-pulse">
              Link Copied!
            </span>
          )}
          <button 
            onClick={handleShareClick} 
            className="p-2.5 bg-white/5 hover:bg-white/10 text-[#94a3b8] hover:text-white rounded-xl border border-white/5 transition-all"
            title="Share with peers"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={handleSaveClick}
            disabled={isSaved}
            className={`p-2.5 rounded-xl border border-white/5 transition-all ${
              isSaved 
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                : "bg-white/5 hover:bg-white/10 text-[#94a3b8] hover:text-white"
            }`}
            title={isSaved ? "Saved to Vault" : "Save Card to Vault"}
          >
            {isSaved ? <BookmarkCheck className="w-4 h-4" /> : <Bookmark className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Glassmorphic Card Container */}
      <div className="w-full bg-[#080816]/65 backdrop-blur-[30px] border border-white/10 rounded-[32px] p-6 md:p-8 shadow-[0_30px_80px_rgba(0,0,0,0.6)] flex flex-col relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#3b82f6]/5 to-[#8b5cf6]/5 pointer-events-none" />

        {/* 1. Dynamic Featured Image */}
        <div className="w-full aspect-[16/9] md:aspect-[21/9] rounded-2xl overflow-hidden mb-6 border border-white/10 relative shadow-inner">
          <img 
            src={currentImageUrl} 
            alt={item.title || "Cognitive Synthesis"} 
            className="w-full h-full object-cover transform hover:scale-[1.02] transition-transform duration-700"
            loading="lazy"
          />
        </div>

        {/* 2. Content Area */}
        <div className="space-y-6 flex-grow">
          {item.title && (
            <h3 className="text-2xl md:text-3xl font-black text-white uppercase italic tracking-tight leading-snug">
              {item.title}
            </h3>
          )}

          {/* MYTH LEARN MODE UI: Explicit Myth vs Truth layout */}
          {item.type === "myth" && localLearnMode ? (
            <div className="space-y-4">
              <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider">
                  <Lightbulb className="w-4 h-4" /> Common Misconception (Myth)
                </div>
                <p className="text-sm md:text-base text-amber-100 font-semibold leading-relaxed">
                  {item.mythText || item.content.split('\n')[0]}
                </p>
              </div>

              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-1">
                <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-4 h-4" /> Scientific Truth (Debunk)
                </div>
                <p className="text-sm md:text-base text-emerald-100 font-semibold leading-relaxed">
                  {item.truthText || item.explanation}
                </p>
              </div>
            </div>
          ) : !hasOptions ? (
            /* LEARN MODE or pure reading content (Fact, Learn Story, Learn Case Study) */
            <p className="text-base md:text-lg opacity-90 leading-relaxed font-semibold text-zinc-200">
              {item.content}
            </p>
          ) : (
            /* TEST MODE: Options Grid */
            <div className="space-y-6">
              <p className="text-base md:text-lg font-bold text-white leading-relaxed">
                {item.content}
              </p>

              <div className="space-y-3">
                {item.options?.map((option, idx) => {
                  const isSelected = selectedOption === idx;
                  const isCorrect = idx === item.correctOptionIndex;
                  
                  let optStyle = "bg-white/[0.02] border-white/5 text-zinc-300 hover:bg-white/[0.04]";
                  if (selectedOption !== null) {
                    if (isSelected) {
                      optStyle = isCorrect 
                        ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400 shadow-lg shadow-emerald-500/5" 
                        : "bg-red-500/10 border-red-500/30 text-red-400 shadow-lg shadow-red-500/5";
                    } else if (isCorrect) {
                      optStyle = "bg-emerald-500/5 border-emerald-500/20 text-emerald-400/70";
                    } else {
                      optStyle = "bg-white/[0.01] border-white/[0.02] text-zinc-500 opacity-60";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      disabled={selectedOption !== null}
                      className={`w-full p-4 md:p-5 rounded-2xl border text-left text-sm md:text-base font-bold flex items-center justify-between transition-all ${optStyle}`}
                    >
                      <span>{option}</span>
                      {selectedOption !== null && (
                        isSelected ? (
                          isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <XCircle className="w-4 h-4 text-red-400" />
                        ) : (
                          isCorrect ? <CheckCircle2 className="w-4 h-4 text-emerald-400/50" /> : null
                        )
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* AI Cognitive Insight drawer */}
          <AnimatePresence>
            {(showExplanation || (localLearnMode && item.type !== "myth")) && item.explanation && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden border-t border-white/[0.05] pt-5 mt-6"
              >
                <div className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 space-y-2 relative">
                  <div className="flex items-center gap-2 text-purple-400">
                    <BrainCircuit className="w-4 h-4 animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-wider">AI Cognitive Insight</span>
                  </div>
                  
                  <p className="text-sm md:text-base text-zinc-300 leading-relaxed font-light italic">
                    "{item.explanation}"
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AI Discussion Mini-Chat Activation Button */}
          {item.type === "discussion" && (
            <div className="pt-2">
              <button
                onClick={() => setShowDiscussionChat(prev => !prev)}
                className="w-full py-3 px-5 rounded-2xl bg-gradient-to-r from-indigo-600/30 to-purple-600/30 hover:from-indigo-600/50 hover:to-purple-600/50 border border-indigo-500/40 text-white font-bold text-xs flex items-center justify-center gap-3 transition-all shadow-lg shadow-indigo-500/10"
              >
                <MessageSquare className="w-4 h-4 text-indigo-400 animate-pulse" />
                {showDiscussionChat ? "Close Socratic Discussion" : "Start Live AI Socratic Discussion"}
              </button>

              <AnimatePresence>
                {showDiscussionChat && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    <DiscussionChat card={item} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}

        </div>

        {/* Footer Navigation Bar */}
        <div className="mt-8 pt-5 border-t border-white/[0.05] flex items-center justify-between">
          <p className="text-[10px] text-[#475569] font-mono">
            Press [Right Arrow] to advance to next card
          </p>

          <button
            onClick={onNext}
            className="px-5 py-2.5 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] rounded-xl hover:scale-105 active:scale-95 text-xs font-bold text-white transition-all flex items-center gap-2 shadow-lg shadow-purple-500/20"
          >
            Next Card <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
};
