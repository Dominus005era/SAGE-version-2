import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Info, CheckCircle2, XCircle, Share2, BookmarkPlus, Zap, ArrowRight, BrainCircuit } from "lucide-react";
import { KnowledgeItem } from "../types";
import confetti from "canvas-confetti";

interface Props {
  item: KnowledgeItem;
  onResponse: (correct: boolean) => void;
  onSave: (item: KnowledgeItem) => void;
  onNext: () => void;
}

export const KnowledgeCard: React.FC<Props> = ({ item, onResponse, onSave, onNext }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionClick = (index: number) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    const correct = index === item.correctOptionIndex;
    if (correct) {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#00d2ff', '#bd00ff', '#39ff14']
      });
      // Show explanation even if correct, but wait a bit
      setTimeout(() => setShowExplanation(true), 1200);
    } else {
      setTimeout(() => setShowExplanation(true), 800);
    }
    onResponse(correct);
  };

  return (
    <div className="relative w-full max-w-2xl mx-auto perspective-1000">
      <AnimatePresence mode="wait">
        {!showExplanation ? (
          <motion.div
            key="card"
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 1.1, opacity: 0, x: 100 }}
            className="w-full bg-white/5 backdrop-blur-[30px] border border-white/10 rounded-[32px] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.4)] relative flex flex-col"
          >
            {/* Top Bar for Actions */}
            <div className="absolute top-8 right-8 flex gap-2 z-20">
               <button 
                  onClick={() => onSave(item)} 
                  className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10 text-white/60 hover:text-white"
                  title="Save to Vault"
               >
                 <BookmarkPlus className="w-5 h-5" />
               </button>
            </div>

            {/* Category Tag */}
            <span className="text-accent-purple text-sm font-bold uppercase tracking-[2px] mb-4">
              {item.category} • {item.type === 'fact' ? 'Scenario Detail' : 'Scenario Challenge'}
            </span>

            {/* Question Text */}
            <h2 className="text-[32px] font-bold leading-[1.2] mb-10 tracking-tight pr-12">
              {item.type === 'fact' ? item.title : item.content}
            </h2>
            
            {/* Options/Body */}
            <div className="flex-1">
              {item.type === 'fact' ? (
                 <p className="text-xl opacity-80 leading-relaxed font-light mb-10">
                   {item.content}
                 </p>
              ) : (
                <div className="space-y-4">
                  {item.options?.map((option, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleOptionClick(idx)}
                      disabled={selectedOption !== null}
                      className={`w-full p-6 bg-white/5 border border-white/10 rounded-2xl text-left text-lg transition-all ${
                        selectedOption === idx
                          ? idx === item.correctOptionIndex
                            ? "border-accent-green bg-accent-green/10 text-accent-green"
                            : "border-red-500 bg-red-500/10 text-red-500"
                          : selectedOption !== null && idx === item.correctOptionIndex
                          ? "border-accent-green/50 bg-accent-green/5 text-accent-green/50"
                          : "hover:bg-white/10 hover:border-white/20"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <span>{option}</span>
                        {selectedOption === idx && (
                          idx === item.correctOptionIndex ? <CheckCircle2 className="w-5 h-5" /> : <XCircle className="w-5 h-5" />
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="mt-10 pt-6 border-t border-white/10 flex justify-between items-center text-zinc-500">
               <p className="text-sm">
                 {item.type === 'fact' ? 'Tap for next scenario insight' : selectedOption === null ? 'Select an option to see Logic Correction' : 'Opening Logic Correction...'}
               </p>
               {item.type === 'fact' && (
                 <button onClick={() => setShowExplanation(true)} className="p-3 bg-white/5 rounded-full hover:bg-white/10 text-accent-blue">
                   <Info className="w-5 h-5" />
                 </button>
               )}
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="explanation"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            exit={{ rotateY: -90, opacity: 0 }}
            className="w-full bg-zinc-900/95 backdrop-blur-[30px] border border-accent-purple/30 rounded-[32px] p-12 shadow-[0_40px_100px_rgba(0,0,0,0.6)] flex flex-col"
          >
             <div className="flex items-center justify-between mb-8">
               <div className="flex items-center gap-3 text-accent-purple">
                  <BrainCircuit className="w-8 h-8" />
                  <h3 className="text-2xl font-bold uppercase tracking-tighter">Logic Correction</h3>
               </div>
               <button 
                  onClick={() => onSave(item)} 
                  className="p-3 bg-white/5 rounded-full hover:bg-white/10 transition-colors border border-white/10 text-white/60 hover:text-white"
               >
                 <BookmarkPlus className="w-5 h-5" />
               </button>
             </div>
             
             <div className="flex-1 overflow-y-auto space-y-6">
               <div className="p-6 bg-white/5 rounded-2xl border border-white/5">
                 <p className="text-[11px] font-bold uppercase tracking-widest text-white/40 mb-3">Cognitive Analysis</p>
                 <p className="text-lg opacity-90 leading-relaxed font-light italic text-zinc-300">
                   "{item.explanation}"
                 </p>
               </div>
             </div>

             <button 
               onClick={onNext}
               className="w-full mt-10 p-6 bg-gradient-to-r from-accent-purple to-accent-blue rounded-2xl font-bold flex items-center justify-center gap-3 hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_0_30px_rgba(189,0,255,0.3)]"
             >
                Continue Adventure <ArrowRight className="w-5 h-5" />
             </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
