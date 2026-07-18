import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Sparkles, Shield, Cpu, Zap } from "lucide-react";

interface InitAnimationProps {
  onComplete: () => void;
}

export function InitAnimation({ onComplete }: InitAnimationProps) {
  const [stage, setStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [messages, setMessages] = useState<string[]>([]);
  
  const timeoutsRef = useRef<number[]>([]);
  const intervalRef = useRef<number | null>(null);

  const stages = [
    { text: "INITIATING quantum handshake...", delay: 500 },
    { text: "ESTABLISHING secure neural pipeline...", delay: 700 },
    { text: "DECRYPTING persistent cognitive vault...", delay: 600 },
    { text: "SYNCHRONIZING concept matrices...", delay: 700 },
    { text: "SAGE ENGINE ACTIVE. Welcome Operative.", delay: 800 },
  ];

  useEffect(() => {
    // Clear any existing timers
    timeoutsRef.current.forEach(t => clearTimeout(t));
    timeoutsRef.current = [];
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    setMessages([]);
    setStage(0);
    setProgress(0);

    // Sequential stage execution
    let currentStage = 0;
    const runStages = () => {
      if (currentStage < stages.length) {
        setMessages((prev) => [...prev, stages[currentStage].text]);
        const timeoutId = window.setTimeout(() => {
          currentStage++;
          setStage(currentStage);
          runStages();
        }, stages[currentStage].delay);
        timeoutsRef.current.push(timeoutId);
      }
    };
    runStages();

    // Progress bar increments matching total delays
    intervalRef.current = window.setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          return 100;
        }
        return prev + 1;
      });
    }, 30); // ~3 seconds to reach 100%

    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  useEffect(() => {
    if (progress === 100 && stage === stages.length) {
      const timeoutId = window.setTimeout(() => {
        onComplete();
      }, 600);
      timeoutsRef.current.push(timeoutId);
    }
  }, [progress, stage, onComplete]);

  return (
    <div className="fixed inset-0 bg-[#04040a] z-[999] flex flex-col items-center justify-center p-6 select-none overflow-hidden font-sans">
      {/* 1. Cyber Scanning Grid Background */}
      <div className="absolute inset-0 grid-bg opacity-[0.06] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(59,130,246,0.1),transparent_70%)] pointer-events-none animate-pulse" />
      
      {/* Scanning Laser Line */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-[#3b82f6]/40 to-transparent top-0 animate-[scan_3s_ease-in-out_infinite] pointer-events-none" />

      <div className="max-w-md w-full flex flex-col items-center relative z-10">
        
        {/* 2. Futuristic Circular HUD Target reticle */}
        <div className="relative mb-14 flex items-center justify-center w-40 h-40">
          
          {/* Rotating Outer Radar Rings */}
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border border-dashed border-[#3b82f6]/30"
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
            className="absolute inset-3 rounded-full border border-[#8b5cf6]/20 border-t-[#8b5cf6]/60 border-b-[#06b6d4]/60"
          />
          
          {/* Outer Pulse */}
          <motion.div 
            animate={{ scale: [1, 1.15, 1], opacity: [0.1, 0.3, 0.1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -inset-4 rounded-full border border-[#06b6d4]/10 blur-[2px]"
          />

          {/* SAGE Core Logo Centerpiece */}
          <motion.div
            initial={{ scale: 0.6, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-24 h-24 bg-gradient-to-br from-[#3b82f6] via-[#8b5cf6] to-[#06b6d4] rounded-[28px] flex items-center justify-center border border-white/20 shadow-[0_0_60px_rgba(59,130,246,0.4)] z-10"
          >
            <Sparkles className="w-12 h-12 text-white animate-pulse" />
          </motion.div>
        </div>

        {/* 3. Futuristic Progress Circle & Status */}
        <div className="text-center mb-8">
          <div className="text-[10px] font-mono font-black tracking-[4px] text-[#3b82f6] uppercase mb-2">
            SYNCHRONIZING CORE METRIC
          </div>
          <div className="text-3xl font-black font-mono tracking-tighter text-white">
            {progress}%
          </div>
        </div>

        {/* Energy bar loader */}
        <div className="w-full bg-white/[0.03] border border-white/[0.08] h-2 rounded-full overflow-hidden mb-10 relative p-[2px]">
          <motion.div 
            className="h-full rounded-full bg-gradient-to-r from-[#3b82f6] via-[#8b5cf6] to-[#06b6d4]"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* 4. Sequential Hologram Logs */}
        <div className="w-full bg-[#080816]/80 border border-white/[0.06] rounded-2xl p-6 min-h-[180px] font-mono text-left text-xs leading-relaxed flex flex-col justify-start shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.05] mb-4 text-[#475569] text-[9px] uppercase tracking-wider font-bold">
            <span>Diagnostic Console</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500" />
            </span>
          </div>
          <AnimatePresence>
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={`flex gap-3 mb-2 items-start ${
                  i === messages.length - 1 ? "text-[#3b82f6] font-bold" : "text-[#94a3b8] opacity-50"
                }`}
              >
                <span className="shrink-0 font-bold">&gt;&gt;</span>
                <span>{msg}</span>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
