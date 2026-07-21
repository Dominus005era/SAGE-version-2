import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, Brain, Lightbulb, PenTool, LayoutTemplate, Activity, 
  Award, MessageSquare, Send, History, CheckSquare, Sparkles, Pin,
  Calendar, Check, X, ChevronRight, Clock, Trash2, ArrowRight
} from "lucide-react";
import { askAIAnalyzer } from "../../services/aiAnalyzer";

interface DashboardViewProps {
  stats: Record<string, number>;
  routine: any;
  setRoutine: (routine: any) => void;
  onNavigateToTab: (tab: string) => void;
}

export function DashboardView({ stats, routine, setRoutine, onNavigateToTab }: DashboardViewProps) {
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState<{ sender: "user" | "ai"; text: string }[]>([
    { sender: "ai", text: "Hello Operative. Ask me to 'Suggest a daily routine', 'Suggest a weekly routine with daily tasks', or 'Suggest a monthly routine' to optimize your cognitive development." }
  ]);
  const [chatHistory, setChatHistory] = useState<{ sender: "user" | "ai"; text: string }[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [routineCompleted, setRoutineCompleted] = useState(false);

  // Auto-Expiry & Daily Unpin check
  useEffect(() => {
    if (!routine || (Array.isArray(routine) && routine.length === 0)) return;

    const now = Date.now();
    let routineType = 'daily';
    let expiresAt = 0;
    let allTasks: any[] = [];

    if (Array.isArray(routine)) {
      routineType = 'daily';
      allTasks = routine;
    } else if (typeof routine === 'object' && routine !== null) {
      routineType = routine.type || 'daily';
      expiresAt = routine.expiresAt || 0;
      if (routine.tasks) allTasks = routine.tasks;
      if (routine.days) allTasks = routine.days.flatMap((d: any) => d.tasks || []);
    }

    // If routine duration expired
    if (expiresAt > 0 && now > expiresAt) {
      if (routineType === 'daily') {
        const noneCompleted = allTasks.every((t: any) => !t.checked);
        if (noneCompleted) {
          // Automatically unpin if 1 day passed and none of the tasks were completed
          setRoutine([]);
          return;
        }
      }
      // General expiration cleanup
      setRoutine([]);
    }
  }, [routine, setRoutine]);

  const formatConfig: Record<string, { icon: React.ReactNode; color: string; label: string }> = {
    fact: { icon: <BookOpen className="w-5 h-5" />, color: "text-[#10b981] bg-[#10b981]/10 border-[#10b981]/20", label: "Facts" },
    quiz: { icon: <Brain className="w-5 h-5" />, color: "text-[#ec4899] bg-[#ec4899]/10 border-[#ec4899]/20", label: "Quizzes" },
    myth: { icon: <Lightbulb className="w-5 h-5" />, color: "text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20", label: "Myths Debunked" },
    story: { icon: <PenTool className="w-5 h-5" />, color: "text-[#f97316] bg-[#f97316]/10 border-[#f97316]/20", label: "Stories" },
    case_study: { icon: <LayoutTemplate className="w-5 h-5" />, color: "text-[#3b82f6] bg-[#3b82f6]/10 border-[#3b82f6]/20", label: "Case Studies" },
    scenario: { icon: <Activity className="w-5 h-5" />, color: "text-[#06b6d4] bg-[#06b6d4]/10 border-[#06b6d4]/20", label: "Scenarios" },
    logic: { icon: <Award className="w-5 h-5" />, color: "text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/20", label: "Logic Puzzles" },
    discussion: { icon: <MessageSquare className="w-5 h-5" />, color: "text-[#6366f1] bg-[#6366f1]/10 border-[#6366f1]/20", label: "AI Debates" },
  };

  const handleSendChat = async () => {
    if (!chatMessage.trim()) return;
    const msg = chatMessage;
    setChatMessage("");
    setChatLog((prev) => [...prev, { sender: "user", text: msg }]);
    setIsAiTyping(true);

    try {
      const response = await askAIAnalyzer(msg, stats, routine);
      setChatLog((prev) => [...prev, { sender: "ai", text: response }]);
      setChatHistory((prev) => [...prev, { sender: "user", text: msg }, { sender: "ai", text: response }]);
    } catch (e) {
      console.error(e);
    } finally {
      setIsAiTyping(false);
    }
  };

  const extractJsonFromRoutineText = (text: string): any => {
    const routineIdx = text.indexOf("ROUTINE:");
    if (routineIdx === -1) return null;

    const sub = text.slice(routineIdx + 8).trim();
    const firstBraceIndex = sub.search(/[\{\[]/);
    if (firstBraceIndex === -1) return null;

    const jsonContent = sub.slice(firstBraceIndex);
    const startChar = jsonContent[0];
    const endChar = startChar === '{' ? '}' : ']';

    let depth = 0;
    let inString = false;
    let escape = false;

    for (let i = 0; i < jsonContent.length; i++) {
      const char = jsonContent[i];
      if (escape) {
        escape = false;
        continue;
      }
      if (char === '\\') {
        escape = true;
        continue;
      }
      if (char === '"') {
        inString = !inString;
        continue;
      }
      if (!inString) {
        if (char === startChar) depth++;
        else if (char === endChar) {
          depth--;
          if (depth === 0) {
            const jsonStr = jsonContent.slice(0, i + 1);
            return JSON.parse(jsonStr);
          }
        }
      }
    }
    return null;
  };

  const handlePinRoutine = (aiText: string) => {
    try {
      const parsed = extractJsonFromRoutineText(aiText);
      if (!parsed) {
        console.warn("Could not extract routine JSON from AI response.");
        return;
      }

      const now = Date.now();

      if (Array.isArray(parsed)) {
        // Legacy array format -> Daily routine
        const tasks = parsed.map((item: any, index: number) => ({
          id: index + 1,
          task: item.task,
          count: item.count,
          type: item.type,
          checked: false
        }));
        setRoutine({
          type: "daily",
          pinnedAt: now,
          expiresAt: now + 24 * 60 * 60 * 1000,
          tasks
        });
      } else if (typeof parsed === "object" && parsed !== null) {
        const type = parsed.type || "daily";
        let durationMs = 24 * 60 * 60 * 1000;
        if (type === "weekly" || type === "weekly_daily") durationMs = 7 * 24 * 60 * 60 * 1000;
        if (type === "monthly") durationMs = 30 * 24 * 60 * 60 * 1000;

        if (type === "weekly_daily" && Array.isArray(parsed.days)) {
          let globalId = 1;
          const days = parsed.days.map((d: any) => ({
            dayNumber: d.dayNumber,
            dayName: d.dayName || `Day ${d.dayNumber}`,
            tasks: (d.tasks || []).map((t: any) => ({
              id: globalId++,
              task: t.task,
              count: t.count,
              type: t.type,
              checked: false
            }))
          }));
          setRoutine({
            type: "weekly_daily",
            pinnedAt: now,
            expiresAt: now + durationMs,
            activeDay: 1,
            days
          });
        } else {
          const tasks = (parsed.tasks || []).map((item: any, index: number) => ({
            id: index + 1,
            task: item.task,
            count: item.count,
            type: item.type,
            checked: false
          }));
          setRoutine({
            type,
            pinnedAt: now,
            expiresAt: now + durationMs,
            tasks
          });
        }
      }
      setRoutineCompleted(false);
    } catch (e) {
      console.error("Failed to parse routine:", e);
    }
  };

  const handleToggleTask = (taskId: number | string, dayNum?: number) => {
    if (Array.isArray(routine)) {
      const updated = routine.map((t: any) => t.id === taskId ? { ...t, checked: !t.checked } : t);
      setRoutine(updated);
      if (updated.every((t: any) => t.checked) && updated.length > 0) {
        setRoutineCompleted(true);
      }
      return;
    }

    if (!routine || typeof routine !== "object") return;

    if (routine.type === "weekly_daily" && routine.days) {
      const targetDay = dayNum || routine.activeDay || 1;
      const updatedDays = routine.days.map((d: any) => {
        if (d.dayNumber === targetDay) {
          const updatedTasks = d.tasks.map((t: any) => t.id === taskId ? { ...t, checked: !t.checked } : t);
          return { ...d, tasks: updatedTasks };
        }
        return d;
      });
      setRoutine({ ...routine, days: updatedDays });
    } else if (routine.tasks) {
      const updatedTasks = routine.tasks.map((t: any) => t.id === taskId ? { ...t, checked: !t.checked } : t);
      const allDone = updatedTasks.every((t: any) => t.checked);
      setRoutine({ ...routine, tasks: updatedTasks });
      if (allDone && updatedTasks.length > 0) {
        setRoutineCompleted(true);
      }
    }
  };

  const handleSetActiveDay = (dayNum: number) => {
    if (routine && routine.type === "weekly_daily") {
      setRoutine({ ...routine, activeDay: dayNum });
    }
  };

  const handleUnpinRoutine = () => {
    setRoutine([]);
    setRoutineCompleted(false);
  };

  // Helper to extract active tasks and passed days
  const isArrayRoutine = Array.isArray(routine);
  const hasRoutine = (!isArrayRoutine && routine && routine.type) || (isArrayRoutine && routine.length > 0);
  const routineType = isArrayRoutine ? "daily" : (routine?.type || "daily");
  
  const currentActiveDayNum = routine?.activeDay || 1;
  const currentActiveDayObj = routine?.days?.find((d: any) => d.dayNumber === currentActiveDayNum);
  const activeTasks = routineType === "weekly_daily" 
    ? (currentActiveDayObj?.tasks || [])
    : (isArrayRoutine ? routine : (routine?.tasks || []));

  const passedDays = routineType === "weekly_daily" && routine?.days
    ? routine.days.filter((d: any) => d.dayNumber < currentActiveDayNum)
    : [];

  return (
    <div className="space-y-10 w-full max-w-[1440px] mx-auto">
      
      {/* 8 Stats analytical cards */}
      <div>
        <h3 className="text-xs font-bold uppercase tracking-[3px] text-[#475569] mb-6">Cognitive Analytics</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {Object.entries(formatConfig).map(([key, config]) => {
            const count = stats[key] || 0;
            return (
              <motion.div
                key={key}
                whileHover={{ y: -4 }}
                className="p-6 rounded-[24px] border border-white/[0.06] bg-[#080816]/30 hover:bg-[#080816]/50 transition-all flex flex-col justify-between h-40 group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/[0.01] rounded-full blur-2xl group-hover:bg-white/[0.03]" />
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${config.color}`}>
                  {config.icon}
                </div>
                <div>
                  <div className="text-3xl font-black text-white tracking-tight mb-1">{count}</div>
                  <div className="text-[11px] font-bold text-[#475569] uppercase tracking-wider">{config.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        
        {/* Left: AI Analyzer Coaching Box */}
        <div className="lg:col-span-3 bg-[#080816]/40 border border-white/[0.08] rounded-3xl p-6 relative overflow-hidden flex flex-col h-[560px] shadow-2xl backdrop-blur-xl">
          <div className="flex justify-between items-center pb-4 border-b border-white/[0.05] mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#3b82f6]/10 flex items-center justify-center text-[#3b82f6]">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm">SAGE Cognitive Coach</h4>
                <p className="text-[10px] text-[#475569] font-bold uppercase tracking-wider">Gemini Core Active</p>
              </div>
            </div>
            <button 
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 hover:bg-white/5 rounded-lg text-[#475569] hover:text-white transition-colors"
            >
              <History className="w-5 h-5" />
            </button>
          </div>

          {/* History Overlay popup */}
          <AnimatePresence>
            {showHistory && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute inset-x-6 top-16 bottom-20 bg-[#080818] border border-white/10 rounded-2xl z-20 p-6 flex flex-col shadow-2xl"
              >
                <div className="flex justify-between items-center pb-3 border-b border-white/5 mb-4">
                  <h5 className="font-bold text-xs uppercase tracking-wider text-white">Historical Logs</h5>
                  <button onClick={() => setShowHistory(false)} className="text-xs text-[#3b82f6] font-bold">Close</button>
                </div>
                <div className="flex-1 overflow-y-auto space-y-4 pr-2 scrollbar-thin">
                  {chatHistory.length === 0 ? (
                    <p className="text-center text-xs text-[#475569] py-20 font-mono">No historical records found.</p>
                  ) : (
                    chatHistory.map((h, i) => (
                      <div key={i} className={`flex flex-col ${h.sender === "user" ? "items-end" : "items-start"}`}>
                        <div className={`max-w-[85%] rounded-2xl p-4 text-xs font-semibold leading-relaxed ${
                          h.sender === "user" 
                            ? "bg-[#3b82f6] text-white" 
                            : "bg-white/5 text-[#94a3b8]"
                        }`}>
                          {h.text}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Current Live Logs scroll area */}
          <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-2 scrollbar-thin">
            {chatLog.map((log, i) => {
              const hasRoutine = log.text.includes("ROUTINE:");
              return (
                <div key={i} className={`flex flex-col ${log.sender === "user" ? "items-end" : "items-start"}`}>
                  <div className={`max-w-[85%] rounded-2xl p-4 text-xs font-semibold leading-relaxed ${
                    log.sender === "user" 
                      ? "bg-[#3b82f6] text-white" 
                      : "bg-white/5 text-[#94a3b8]"
                  }`}>
                    {hasRoutine ? (
                      <div>
                        {log.text.split("ROUTINE:")[0]}
                        <button 
                          onClick={() => handlePinRoutine(log.text)}
                          className="mt-3 flex items-center gap-2 px-4 py-2 bg-[#3b82f6]/20 border border-[#3b82f6]/40 hover:bg-[#3b82f6]/30 text-white rounded-xl font-bold text-[11px] transition-colors"
                        >
                          <Pin className="w-3.5 h-3.5 text-blue-400" /> Pin Routine to Dashboard
                        </button>
                      </div>
                    ) : (
                      log.text
                    )}
                  </div>
                </div>
              );
            })}
            {isAiTyping && (
              <div className="flex gap-1.5 items-center pl-4 py-2">
                <span className="w-2 h-2 rounded-full bg-white/20 animate-bounce" />
                <span className="w-2 h-2 rounded-full bg-white/20 animate-bounce [animation-delay:0.2s]" />
                <span className="w-2 h-2 rounded-full bg-white/20 animate-bounce [animation-delay:0.4s]" />
              </div>
            )}
          </div>

          {/* Typing Area */}
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Ask for 'daily routine', 'weekly routine', 'monthly routine' or 'day by day'..."
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendChat()}
              className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-4 text-xs font-semibold text-white focus:outline-none focus:border-[#3b82f6] transition-colors"
            />
            <button
              onClick={handleSendChat}
              className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center text-white hover:scale-105 active:scale-95 transition-all shadow-lg"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right: Pinned Routine Checklist Box */}
        <div className="lg:col-span-2 bg-[#080816]/40 border border-white/[0.08] rounded-3xl p-6 h-[560px] flex flex-col shadow-2xl backdrop-blur-xl relative overflow-hidden">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/[0.05] mb-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-[#8b5cf6]/10 flex items-center justify-center text-[#8b5cf6]">
                <CheckSquare className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  Pinned Routine
                  {hasRoutine && (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-400 border border-purple-500/30 uppercase">
                      {routineType.replace("_", " ")}
                    </span>
                  )}
                </h4>
                <p className="text-[10px] text-[#475569] font-bold tracking-wider">
                  {routineType === "daily" && "Lifespan: 1 Day"}
                  {routineType === "weekly" && "Lifespan: 7 Days"}
                  {routineType === "monthly" && "Lifespan: 30 Days"}
                  {routineType === "weekly_daily" && "7-Day Day-by-Day Protocol"}
                </p>
              </div>
            </div>
            {hasRoutine && (
              <button 
                onClick={handleUnpinRoutine}
                title="Unpin Routine"
                className="p-2 hover:bg-red-500/10 hover:text-red-400 rounded-xl text-[#475569] transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto pr-1 space-y-4 scrollbar-thin">
            {!hasRoutine ? (
              <div className="flex flex-col items-center justify-center h-full text-center py-20">
                <Pin className="w-12 h-12 text-[#475569] mb-4 animate-pulse" />
                <h5 className="font-bold text-white mb-1 text-sm">No Pinned Routine</h5>
                <p className="text-xs text-[#94a3b8] max-w-[220px] leading-relaxed">
                  Ask SAGE Cognitive Coach to "Suggest a daily routine", "weekly routine", or "day by day routine" and pin it here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                
                {/* 1. Day Navigation Bar for Weekly Day-by-Day Routines */}
                {routineType === "weekly_daily" && routine.days && (
                  <div className="bg-white/[0.02] border border-white/[0.05] p-3 rounded-2xl space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-bold text-zinc-400">
                      <span>7-Day Progression</span>
                      <span className="text-purple-400 font-mono">Active: Day {currentActiveDayNum}</span>
                    </div>

                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                      {routine.days.map((d: any) => {
                        const isCurrent = d.dayNumber === currentActiveDayNum;
                        const isPassed = d.dayNumber < currentActiveDayNum;
                        const allDone = (d.tasks || []).every((t: any) => t.checked);
                        
                        return (
                          <button
                            key={d.dayNumber}
                            onClick={() => handleSetActiveDay(d.dayNumber)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
                              isCurrent
                                ? "bg-purple-600 text-white shadow-lg shadow-purple-500/20"
                                : isPassed
                                  ? allDone
                                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                    : "bg-red-500/20 text-red-400 border border-red-500/30"
                                  : "bg-white/5 text-zinc-400 hover:bg-white/10"
                            }`}
                          >
                            <span>D{d.dayNumber}</span>
                            {isPassed && (
                              allDone ? <Check className="w-3 h-3 text-emerald-400" /> : <X className="w-3 h-3 text-red-400" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Advance to Next Day button */}
                    {currentActiveDayNum < 7 && (
                      <button
                        onClick={() => handleSetActiveDay(currentActiveDayNum + 1)}
                        className="w-full py-2 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/30 text-purple-300 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-all mt-1"
                      >
                        Advance to Day {currentActiveDayNum + 1}
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                )}

                {/* 2. Main Active Day Checklist */}
                <div className="space-y-2">
                  {routineType === "weekly_daily" && (
                    <div className="flex items-center justify-between text-xs font-bold text-zinc-300 px-1">
                      <span>Day {currentActiveDayNum} Tasks</span>
                      <span className="text-[10px] text-zinc-500">
                        {activeTasks.filter((t: any) => t.checked).length}/{activeTasks.length} Completed
                      </span>
                    </div>
                  )}

                  {activeTasks.map((task: any) => (
                    <button
                      key={task.id}
                      onClick={() => handleToggleTask(task.id, currentActiveDayNum)}
                      className={`w-full flex items-center gap-4 p-3.5 rounded-2xl border text-left transition-all ${
                        task.checked 
                          ? "bg-white/[0.02] border-white/5 text-[#475569] line-through" 
                          : "bg-[#080816]/30 border-white/[0.08] hover:bg-[#080816]/50 text-white"
                      }`}
                    >
                      <div className={`w-5 h-5 rounded border flex items-center justify-center shrink-0 transition-colors ${
                        task.checked ? "bg-[#10b981] border-[#10b981] text-white" : "border-white/20"
                      }`}>
                        {task.checked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </div>
                      <span className="text-xs font-semibold">{task.task}</span>
                    </button>
                  ))}
                </div>

                {/* 3. Passed Days Mini Boxes Region (Below Active Checklist for Weekly Day-by-Day) */}
                {routineType === "weekly_daily" && passedDays.length > 0 && (
                  <div className="border-t border-white/[0.06] pt-4 space-y-2">
                    <h5 className="text-[10px] font-bold uppercase tracking-wider text-zinc-500 px-1">
                      Passed Days History
                    </h5>

                    {passedDays.map((d: any) => {
                      const total = d.tasks?.length || 0;
                      const done = (d.tasks || []).filter((t: any) => t.checked).length;
                      const isFullyCompleted = done === total && total > 0;

                      return (
                        <div
                          key={d.dayNumber}
                          className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold transition-all ${
                            isFullyCompleted
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                              : "bg-red-500/10 border-red-500/30 text-red-400"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isFullyCompleted ? (
                              <div className="w-5 h-5 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                                <Check className="w-3 h-3" />
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400">
                                <X className="w-3 h-3" />
                              </div>
                            )}
                            <span>Day {d.dayNumber} Protocol</span>
                          </div>

                          <span className="font-mono text-[11px] px-2 py-0.5 rounded-lg bg-black/20">
                            {isFullyCompleted ? "Completed" : `Incomplete (${done}/${total})`}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}

              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
