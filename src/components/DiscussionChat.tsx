import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Send, Mic, MicOff, Sparkles, MessageSquare, Volume2, Bot, User } from "lucide-react";
import { GoogleGenAI } from "@google/genai";
import { KnowledgeItem } from "../types";

interface DiscussionChatProps {
  card: KnowledgeItem;
  onClose?: () => void;
}

export function DiscussionChat({ card }: DiscussionChatProps) {
  const [messages, setMessages] = useState<Array<{ sender: "user" | "ai"; text: string; timestamp: string }>>([
    {
      sender: "ai",
      text: `Greetings Operative. Let's delve deep into this thesis: "${card.title}". ${card.content} What is your position on this perspective?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Auto-scroll to bottom of discussion
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  // Setup Web Speech API for Speech-to-Text
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onresult = (event: any) => {
        let transcript = "";
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInput(transcript);
      };

      rec.onerror = (event: any) => {
        console.warn("Web Speech API Error:", event.error);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleMic = () => {
    if (!recognitionRef.current) {
      alert("Web Speech recognition is not supported in this browser environment.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput("");
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { sender: "user", text: userText, timestamp: timeStr }]);
    setIsTyping(true);

    try {
      const apiKey = process.env.GEMINI_API_KEY || (import.meta as any).env?.VITE_GEMINI_API_KEY;
      if (apiKey && apiKey !== "dummy-gemini-api-key") {
        const ai = new GoogleGenAI({ apiKey });
        const chatHistory = messages.map(m => `${m.sender.toUpperCase()}: ${m.text}`).join("\n");
        const response = await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: `You are SAGE Socratic Debate AI. The topic is: "${card.title}".
Context: ${card.content}
Previous Conversation:
${chatHistory}
USER: ${userText}

Respond with a sharp, balanced, counter-argument or probing question to deepen the user's reasoning. Keep it under 4 sentences.`
        });
        const reply = response.text || "That's a provocative point. How do you reconcile that with the empirical trade-offs?";
        setMessages(prev => [...prev, { sender: "ai", text: reply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
      } else {
        // Fallback intelligent response
        setTimeout(() => {
          const fallbacks = [
            "That presents a compelling thesis. However, if we evaluate the long-term systemic impact, could that lead to unintended secondary consequences?",
            "An insightful perspective. From a purely logical stance, how would you address the primary counter-argument regarding resource constraints?",
            "Fascinating deduction. If we push that principle to its logical extreme, does it still hold under stress testing?"
          ];
          const reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
          setMessages(prev => [...prev, { sender: "ai", text: reply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
        }, 1000);
      }
    } catch (e) {
      console.error("Discussion AI Error:", e);
      setMessages(prev => [...prev, { sender: "ai", text: "Interesting stance. Let's analyze the core assumptions behind your hypothesis.", timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="w-full bg-[#080816]/90 border border-white/10 rounded-3xl p-5 shadow-2xl flex flex-col gap-4 mt-6 backdrop-blur-xl">
      
      {/* Discussion Drawer Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <MessageSquare className="w-4 h-4" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2">
              Socratic AI Debate Interface
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            </h4>
            <p className="text-[10px] text-zinc-400 font-mono">Topic: {card.title}</p>
          </div>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="max-h-64 overflow-y-auto space-y-3 pr-2 scrollbar-thin">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex gap-3 ${m.sender === "user" ? "flex-row-reverse" : "flex-row"}`}>
            <div className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
              m.sender === "user" ? "bg-blue-600 text-white" : "bg-purple-600/30 border border-purple-500/40 text-purple-300"
            }`}>
              {m.sender === "user" ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>
            
            <div className={`max-w-[80%] rounded-2xl p-3.5 text-xs font-medium leading-relaxed ${
              m.sender === "user"
                ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-tr-none"
                : "bg-white/5 border border-white/10 text-zinc-200 rounded-tl-none"
            }`}>
              <p>{m.text}</p>
              <span className="text-[9px] opacity-40 block mt-1 text-right font-mono">{m.timestamp}</span>
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-2 items-center text-xs text-zinc-500 font-mono pl-10">
            <Sparkles className="w-3.5 h-3.5 text-purple-400 animate-spin" />
            <span>AI is formulating counter-thesis...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar with Speech Microphone */}
      <div className="flex items-center gap-2 pt-2 border-t border-white/[0.08]">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder={isListening ? "Listening to your voice..." : "Type your argument or tap microphone to speak..."}
          className={`flex-1 bg-white/5 border rounded-2xl px-4 py-3 text-xs text-white placeholder-zinc-500 focus:outline-none transition-all ${
            isListening ? "border-purple-500 ring-2 ring-purple-500/20 bg-purple-500/10" : "border-white/10 focus:border-indigo-500"
          }`}
        />
        
        {/* Voice Microphone Button */}
        <button
          onClick={toggleMic}
          title={isListening ? "Stop Listening" : "Speak via Web Speech"}
          className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all ${
            isListening 
              ? "bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/30" 
              : "bg-white/5 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10"
          }`}
        >
          {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
        </button>

        {/* Send Button */}
        <button
          onClick={handleSend}
          className="w-10 h-10 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-lg shadow-indigo-500/20"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}
