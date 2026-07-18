import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { auth, db, signInWithGoogle, registerEmail, loginEmail } from "./lib/firebase";
import { UserProfile, KnowledgeItem, Category } from "./types";
import { generateMicroContent } from "./services/learningEngine";
import { InitAnimation } from "./components/dashboard/InitAnimation";
import { Sidebar } from "./components/dashboard/Sidebar";
import { SettingsPanel } from "./components/dashboard/SettingsPanel";
import { DashboardView } from "./components/dashboard/DashboardView";
import { CognitiveHub } from "./components/dashboard/CognitiveHub";
import { ArtifactsView } from "./components/dashboard/ArtifactsView";
import { KnowledgeCard } from "./components/KnowledgeCard";
import { LandingPage } from "./components/LandingPage";
import { 
  Loader2, Sparkles, Globe2, Rocket, Brain, Zap, ArrowLeft, 
  ShieldAlert, Award, BookOpen, Lightbulb, PenTool, LayoutTemplate, 
  Activity, MessageSquare, Layers, Shuffle, Globe, Sun, Moon
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Sleek react runtime error boundary to prevent blank screen crashes
class AppErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error("ErrorBoundary caught rendering error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#04040a] text-white flex flex-col items-center justify-center p-8 text-center font-mono select-text">
          <div className="max-w-xl w-full border border-red-500/20 bg-red-500/5 rounded-[32px] p-8 shadow-2xl backdrop-blur-md">
            <div className="w-16 h-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-500 mx-auto mb-6">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <h2 className="text-red-500 font-bold text-lg mb-2 uppercase tracking-wide">Runtime Collision Detected</h2>
            <p className="text-xs text-zinc-500 mb-6">The application failed to render. Inspect the stack trace below:</p>
            <div className="bg-black/60 border border-white/[0.05] p-5 rounded-2xl text-[10px] text-left overflow-x-auto mb-6 max-h-64 text-red-400/90 leading-relaxed">
              <strong>Error:</strong> {this.state.error?.toString()}
              <br/><br/>
              <strong>Stack trace:</strong>
              <pre className="mt-2 text-zinc-400 overflow-x-auto font-mono">{this.state.error?.stack}</pre>
            </div>
            <button 
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="px-6 py-3 bg-red-500/10 border border-red-500/30 hover:bg-red-500/20 text-red-500 rounded-xl text-xs font-bold transition-all"
            >
              Reset Storage & Reload Portal
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

function PlatformAppContent() {
  const [user, setUser] = useState<any | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [initDone, setInitDone] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Auth Method Toggle: 'sandbox' (mock login) vs 'firebase' (real Firebase login)
  const [authMethod, setAuthMethod] = useState<'sandbox' | 'firebase'>('sandbox');

  // Learning Generator states
  const [currentItem, setCurrentItem] = useState<KnowledgeItem | null>(null);
  const [generating, setGenerating] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("space");
  const [activeTabMode, setActiveTabMode] = useState<string>("fact");
  const [isLearnMode, setIsLearnMode] = useState<boolean>(true);
  const [isRandomizedSession, setIsRandomizedSession] = useState<boolean>(false);
  const [customDomainInput, setCustomDomainInput] = useState<string>("");
  
  // Font Sizing (inner region only) and Theme states
  const [fontSize, setFontSize] = useState<string>(() => localStorage.getItem("sage_font_size") || "base");
  const [theme, setTheme] = useState<'dark' | 'light'>(() => (localStorage.getItem('sage_theme') as any) || 'dark');

  useEffect(() => {
    if (theme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
    localStorage.setItem('sage_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('sage_theme', nextTheme);
    if (nextTheme === 'light') {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  };

  // History traversal queue states
  const [sessionHistory, setSessionHistory] = useState<KnowledgeItem[]>([]);
  const [historyIndex, setHistoryIndex] = useState<number>(-1);

  // List of active domains (customizable in platform settings)
  const [activeDomains, setActiveDomains] = useState<string[]>(() => {
    const saved = localStorage.getItem("sage_active_domains");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }
    return ["Science", "Brain", "Nature", "Space"];
  });

  useEffect(() => {
    localStorage.setItem("sage_active_domains", JSON.stringify(activeDomains));
  }, [activeDomains]);

  // Authentication UI states
  const [showLanding, setShowLanding] = useState(true);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");

  // Statistics tracker
  const [stats, setStats] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("sage_content_stats");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return {
      fact: 12,
      quiz: 8,
      myth: 4,
      story: 6,
      case_study: 2,
      scenario: 4,
      logic: 5,
      discussion: 3
    };
  });

  // Routine checklist & tracking state
  const [routine, setRoutine] = useState<any>(() => {
    const saved = localStorage.getItem("sage_daily_routine");
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { console.error(e); }
    }
    return [];
  });

  // Subscriptions on mount
  useEffect(() => {
    // Safety fallback timeout: if the app is still loading after 2.5 seconds, force-disable the loading screen
    const safetyTimeout = setTimeout(() => {
      setLoading((prev) => {
        if (prev) {
          console.warn("Safety trigger: loading took too long, forcing load completed.");
          return false;
        }
        return prev;
      });
    }, 2500);

    // Check if we have a saved mock profile session
    const saved = localStorage.getItem("sage_mock_profile");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser({ uid: parsed.userId, displayName: parsed.username });
        setProfile(parsed);
        setLoading(false);
        clearTimeout(safetyTimeout);
        return;
      } catch (e) {
        console.error("Mock session loading failed:", e);
      }
    }

    // Subscribe to Firebase Auth changes in parallel
    console.log("Subscribing to Firebase Auth events...");
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      console.log("Firebase Auth changed. User:", fbUser ? fbUser.uid : "null");
      if (fbUser) {
        setUser(fbUser);
        await syncFirebaseProfile(fbUser);
      } else {
        // If not sandbox logged-in and no firebase user, clear states
        if (!localStorage.getItem("sage_mock_profile")) {
          setUser(null);
          setProfile(null);
          setCurrentItem(null);
        }
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
      clearTimeout(safetyTimeout);
    };
  }, []);

  // Save changes to stats/routine
  useEffect(() => {
    localStorage.setItem("sage_content_stats", JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem("sage_daily_routine", JSON.stringify(routine));
  }, [routine]);

  // Sync profile details with Firebase Firestore
  const syncFirebaseProfile = async (u: User) => {
    try {
      const userRef = doc(db, "users", u.uid);
      
      // Attempt to load from Firestore with a 2-second timeout race
      const getDocWithTimeout = Promise.race([
        getDoc(userRef),
        new Promise<any>((_, reject) => 
          setTimeout(() => reject(new Error("Firestore connection timed out")), 2000)
        )
      ]);

      const snap = await getDocWithTimeout;
      if (snap.exists()) {
        setProfile(snap.data() as UserProfile);
      } else {
        const newProfile: UserProfile = {
          userId: u.uid,
          username: u.displayName || "Novice Sage",
          avatarUrl: u.photoURL || null,
          sageLevel: "Initiate Sage",
          xp: 0,
          streak: 1,
          lastLoginDate: new Date().toISOString(),
          masteryScore: 0,
          categoryProgress: { space: 10, science: 5, nature: 8, brain: 12 },
          settings: { theme: 'dark', appLanguage: 'en', responseLanguage: 'english' }
        };

        const setDocWithTimeout = Promise.race([
          setDoc(userRef, newProfile),
          new Promise<void>((_, reject) => 
            setTimeout(() => reject(new Error("Firestore write timed out")), 2000)
          )
        ]);

        await setDocWithTimeout;
        setProfile(newProfile);
      }
    } catch (error) {
      console.error("Firebase database sync error, falling back offline:", error);
      // Fallback offline details
      setProfile({
        userId: u.uid,
        username: u.displayName || "Offline Operative",
        avatarUrl: u.photoURL || null,
        sageLevel: "Offline Sage",
        xp: 100,
        streak: 1,
        lastLoginDate: new Date().toISOString(),
        masteryScore: 0,
        categoryProgress: { space: 10, science: 10, nature: 10, brain: 10 },
        settings: { theme: 'dark', appLanguage: 'en', responseLanguage: 'english' }
      });
    } finally {
      setLoading(false);
    }
  };

  // Login handler
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    if (!authEmail) {
      setAuthError("Email address is required.");
      return;
    }

    if (authMethod === 'sandbox') {
      // Bypasses Firebase Auth - Sandbox Mode
      const mockUser = {
        uid: "mock-uid-" + Date.now(),
        email: authEmail,
        displayName: authName || authEmail.split("@")[0]
      };

      const mockProfile: UserProfile = {
        userId: mockUser.uid,
        username: mockUser.displayName,
        avatarUrl: null,
        sageLevel: "Initiate Sage",
        xp: 1500,
        streak: 3,
        lastLoginDate: new Date().toISOString(),
        masteryScore: 18,
        categoryProgress: { space: 20, science: 15, nature: 30, brain: 40 },
        settings: { theme: 'dark', appLanguage: 'en', responseLanguage: 'english' }
      };

      setUser(mockUser);
      setProfile(mockProfile);
      localStorage.setItem("sage_mock_profile", JSON.stringify(mockProfile));
      setInitDone(false);
    } else {
      // Connects to Real Firebase Auth
      try {
        setLoading(true);
        if (authMode === 'register') {
          if (!authName) throw new Error("Name is required for registry entry");
          await registerEmail(authEmail, authPass, authName);
        } else {
          await loginEmail(authEmail, authPass);
        }
        setInitDone(false);
      } catch (err: any) {
        setAuthError(err.message || "Firebase sync authenticated failed.");
        setLoading(false);
      }
    }
  };

  const handleGoogleSyncClick = async () => {
    if (authMethod === 'sandbox') {
      const mockUser = {
        uid: "mock-google-" + Date.now(),
        email: "nexus_operative@gmail.com",
        displayName: "Nexus Operative"
      };

      const mockProfile: UserProfile = {
        userId: mockUser.uid,
        username: mockUser.displayName,
        avatarUrl: null,
        sageLevel: "Universal Sage",
        xp: 8400,
        streak: 8,
        lastLoginDate: new Date().toISOString(),
        masteryScore: 142,
        categoryProgress: { space: 65, science: 50, nature: 70, brain: 85 },
        settings: { theme: 'dark', appLanguage: 'en', responseLanguage: 'english' }
      };

      setUser(mockUser);
      setProfile(mockProfile);
      localStorage.setItem("sage_mock_profile", JSON.stringify(mockProfile));
      setInitDone(false);
    } else {
      try {
        setLoading(true);
        await signInWithGoogle();
        setInitDone(false);
      } catch (err: any) {
        setAuthError(err.message || "Google Authentication failed.");
        setLoading(false);
      }
    }
  };

  const handleLogout = async () => {
    setUser(null);
    setProfile(null);
    setInitDone(false);
    setCurrentItem(null);
    setActiveTab("dashboard");
    localStorage.removeItem("sage_mock_profile");
    try {
      await auth.signOut();
    } catch (e) {
      console.log("Firebase signout skipped.");
    }
    // Redirect directly to marketing landing page
    window.location.href = "/";
  };

  const handleUpdateProfile = async (updatedFields: Partial<UserProfile>) => {
    if (!profile) return;
    const newProfile = { ...profile, ...updatedFields };
    setProfile(newProfile);
    localStorage.setItem("sage_mock_profile", JSON.stringify(newProfile));

    // Also update firebase if user logged in via Firebase
    if (user && !user.uid.startsWith("mock-")) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, updatedFields);
      } catch (e) {
        console.error("Firestore profile sync failed:", e);
      }
    }
  };

  const handleUpdateSettings = async (settings: Partial<UserProfile['settings']>) => {
    if (!profile) return;
    const newSettings = { ...profile.settings, ...settings };
    const newProfile = { ...profile, settings: newSettings };
    setProfile(newProfile);
    localStorage.setItem("sage_mock_profile", JSON.stringify(newProfile));

    if (user && !user.uid.startsWith("mock-")) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, { settings: newSettings });
      } catch (e) {
        console.error("Firestore settings sync failed:", e);
      }
    }
  };

  const getNextItem = async (category: Category = activeCategory) => {
    setGenerating(true);
    setActiveCategory(category);
    try {
      const lang = profile?.settings.responseLanguage || 'english';
      const item = await generateMicroContent(category, activeTab, lang);
      setCurrentItem(item);
    } catch (error) {
      console.error("Content generation error:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleResponse = async (correct: boolean) => {
    if (!profile) return;
    const xpGain = correct ? 20 : 5;
    const updatedProfile = {
      ...profile,
      xp: profile.xp + xpGain,
      masteryScore: profile.masteryScore + (correct ? 1 : 0)
    };
    setProfile(updatedProfile);
    localStorage.setItem("sage_mock_profile", JSON.stringify(updatedProfile));

    // Update firebase firestore if applicable
    if (user && !user.uid.startsWith("mock-")) {
      try {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          xp: increment(xpGain),
          masteryScore: increment(correct ? 1 : 0)
        });
      } catch (e) {
        console.error("Firebase stats upload failed:", e);
      }
    }

    setStats(prev => ({ ...prev, [activeTabMode]: (prev[activeTabMode] || 0) + 1 }));

    // Update pinned routine tasks
    if (routine) {
      const matchType = activeTabMode;
      if (Array.isArray(routine) && routine.length > 0) {
        let taskUpdated = false;
        const updatedRoutine = routine.map(task => {
          if (task.type === matchType && !task.checked && !taskUpdated) {
            taskUpdated = true;
            return { ...task, checked: true };
          }
          return task;
        });
        setRoutine(updatedRoutine);
      } else if (typeof routine === "object" && routine !== null) {
        if (routine.type === "weekly_daily" && Array.isArray(routine.days)) {
          const activeDayNum = routine.activeDay || 1;
          let taskUpdated = false;
          const updatedDays = routine.days.map((d: any) => {
            if (d.dayNumber === activeDayNum && Array.isArray(d.tasks)) {
              const updatedTasks = d.tasks.map((t: any) => {
                if (t.type === matchType && !t.checked && !taskUpdated) {
                  taskUpdated = true;
                  return { ...t, checked: true };
                }
                return t;
              });
              return { ...d, tasks: updatedTasks };
            }
            return d;
          });
          setRoutine({ ...routine, days: updatedDays });
        } else if (Array.isArray(routine.tasks)) {
          let taskUpdated = false;
          const updatedTasks = routine.tasks.map((t: any) => {
            if (t.type === matchType && !t.checked && !taskUpdated) {
              taskUpdated = true;
              return { ...t, checked: true };
            }
            return t;
          });
          setRoutine({ ...routine, tasks: updatedTasks });
        }
      }
    }
  };

  const handleNext = async () => {
    if (activeTabMode === "fact") {
      setStats(prev => ({ ...prev, fact: (prev.fact || 0) + 1 }));
    }
    
    if (historyIndex < sessionHistory.length - 1) {
      const nextIdx = historyIndex + 1;
      setHistoryIndex(nextIdx);
      const item = sessionHistory[nextIdx];
      setActiveTabMode(item.type);
      setActiveCategory(item.category);
      setCurrentItem(item);
    } else {
      setGenerating(true);
      try {
        let formatToUse = activeTabMode;
        let domainToUse = activeCategory;

        if (isRandomizedSession) {
          const formats = ["fact", "quiz", "myth", "story", "case_study", "scenario", "logic", "discussion"];
          formatToUse = formats[Math.floor(Math.random() * formats.length)];
          domainToUse = activeDomains[Math.floor(Math.random() * activeDomains.length)] || "Space";
          
          setActiveTabMode(formatToUse);
          setActiveCategory(domainToUse);
        }

        const lang = profile?.settings.responseLanguage || 'english';
        const item = await generateMicroContent(domainToUse, formatToUse, lang, isLearnMode);
        setSessionHistory(prev => {
          const nextHistory = [...prev, item];
          setHistoryIndex(nextHistory.length - 1);
          return nextHistory;
        });
        setCurrentItem(item);
      } catch (error) {
        console.error("Failed to synthesize next item in queue:", error);
      } finally {
        setGenerating(false);
      }
    }
  };

  const handlePrevious = () => {
    if (historyIndex > 0) {
      const prevIdx = historyIndex - 1;
      setHistoryIndex(prevIdx);
      const item = sessionHistory[prevIdx];
      setActiveTabMode(item.type);
      setActiveCategory(item.category);
      setCurrentItem(item);
    }
  };

  const handleSave = (item: KnowledgeItem) => {
    const savedVaultKey = `saved_vault_${profile?.userId || "guest"}`;
    const currentVault = JSON.parse(localStorage.getItem(savedVaultKey) || "[]");
    
    // Prevent duplicate entries
    if (currentVault.some((i: any) => i.id === item.id)) {
      alert("This card is already saved in your vault!");
      return;
    }

    currentVault.push(item);
    localStorage.setItem(savedVaultKey, JSON.stringify(currentVault));
    alert("Synthesized data successfully saved to your Vault!");
  };

  const handleMidSessionSwitch = async (newFormat: string) => {
    setActiveTabMode(newFormat);
    setGenerating(true);
    setCurrentItem(null); // Clear previous card to show loading spinner
    try {
      const lang = profile?.settings.responseLanguage || 'english';
      const item = await generateMicroContent(activeCategory, newFormat, lang, isLearnMode);
      setSessionHistory(prev => {
        const nextHistory = [...prev, item];
        setHistoryIndex(nextHistory.length - 1);
        return nextHistory;
      });
      setCurrentItem(item);
    } catch (error) {
      console.error("Mid session generation error:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleMidSessionDomainSwitch = async (newDomain: string) => {
    setActiveCategory(newDomain);
    setGenerating(true);
    setCurrentItem(null);
    try {
      const lang = profile?.settings.responseLanguage || 'english';
      const item = await generateMicroContent(newDomain, activeTabMode, lang, isLearnMode);
      setSessionHistory(prev => {
        const nextHistory = [...prev, item];
        setHistoryIndex(nextHistory.length - 1);
        return nextHistory;
      });
      setCurrentItem(item);
    } catch (error) {
      console.error("Domain switch synthesis error:", error);
    } finally {
      setGenerating(false);
    }
  };

  const handleActivateCustomDomain = () => {
    if (!customDomainInput.trim()) return;
    const newDomain = customDomainInput.trim();
    if (!activeDomains.some(d => d.toLowerCase() === newDomain.toLowerCase())) {
      setActiveDomains(prev => [...prev, newDomain]);
    }
    handleMidSessionDomainSwitch(newDomain);
    setCustomDomainInput("");
  };

  // Sync loader loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-[#04040a] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-[#8b5cf6] border-t-transparent rounded-full animate-spin shadow-[0_0_25px_rgba(139,92,246,0.3)]" />
          <p className="text-[#3b82f6] font-mono text-xs animate-pulse tracking-widest uppercase">Initializing Core Platform...</p>
        </div>
      </div>
    );
  }

  // Not logged in Auth Panel
  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-[#04040a]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.08),transparent_75%)] pointer-events-none" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-[#3b82f6]/5 blur-[120px] rounded-full pointer-events-none" />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full relative z-10 p-10 bg-[#080816]/60 backdrop-blur-[40px] border border-white/10 rounded-[40px] shadow-2xl"
        >
          {/* SAGE Brand Emblem */}
          <div className="w-20 h-20 bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] rounded-[24px] mx-auto flex items-center justify-center shadow-[0_10px_40px_rgba(139,92,246,0.3)] mb-6 border border-white/20">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-black tracking-tighter mb-1 uppercase italic text-white">SAGE</h1>
          <p className="text-[#94a3b8] mb-6 font-light text-xs tracking-[2px] uppercase">Scenario Applied General Education</p>

          {/* Tab Selector: Offline Sandbox Mode vs Production Firebase Sync */}
          <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10 mb-8 max-w-sm mx-auto">
            <button
              onClick={() => { setAuthMethod('sandbox'); setAuthError(""); }}
              className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all ${
                authMethod === 'sandbox' ? "bg-white/10 text-white shadow-md" : "text-[#475569] hover:text-[#94a3b8]"
              }`}
            >
              Sandbox (Offline)
            </button>
            <button
              onClick={() => { setAuthMethod('firebase'); setAuthError(""); }}
              className={`flex-1 py-2 text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all ${
                authMethod === 'firebase' ? "bg-white/10 text-white shadow-md" : "text-[#475569] hover:text-[#94a3b8]"
              }`}
            >
              Firebase (Cloud)
            </button>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4 mb-8">
            {authMode === 'register' && (
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#8b5cf6] text-white placeholder-zinc-500 transition-colors"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
              />
            )}
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#3b82f6] text-white placeholder-zinc-500 transition-colors"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder={authMethod === 'sandbox' ? "Security Code (Optional)" : "Account Password"}
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-[#8b5cf6] text-white placeholder-zinc-500 transition-colors"
              value={authPass}
              onChange={(e) => setAuthPass(e.target.value)}
            />
            {authError && <p className="text-red-400 text-xs font-mono">{authError}</p>}
            
            <button 
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-lg hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Zap className="w-5 h-5" />
              {authMethod === 'sandbox' 
                ? 'Initiate Sandbox Session' 
                : authMode === 'login' ? 'Firebase Cloud Access' : 'Create Cloud Profile'
              }
            </button>
          </form>

          <div className="relative flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Global Sync</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button 
            onClick={handleGoogleSyncClick}
            className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all shadow-md active:scale-[0.98]"
          >
            <Globe2 className="w-5 h-5 text-[#3b82f6]" />
            {authMethod === 'sandbox' ? "Simulate Google Login" : "Google Cloud Sync"}
          </button>

          {authMethod === 'firebase' && (
            <p className="mt-8 text-xs text-white/40">
              {authMode === 'login' ? "New operative?" : "Existing sage?"}
              <button 
                onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                className="ml-2 text-[#3b82f6] font-bold hover:underline"
              >
                {authMode === 'login' ? 'Create Cloud Profile' : 'Access Cloud Vault'}
              </button>
            </p>
          )}
        </motion.div>
      </div>
    );
  }

  // Play cinematic intro sequence on login
  if (!initDone) {
    return <InitAnimation onComplete={() => setInitDone(true)} />;
  }

  // Logged-in full Dashboard & Navigation tabs
  return (
    <div className="min-h-screen bg-[#04040a] text-white flex selection:bg-[#8b5cf6]/30">
      
      {/* Dynamic scrolling background system */}
      <div className="fixed inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(circle_at_50%_50%,rgba(139,92,246,0.06),transparent_80%)]" />

      {/* Sidebar Navigation Panel */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={(tab) => {
          setActiveTab(tab);
          setCurrentItem(null); // Reset current generated cards when changing modes
        }} 
        user={profile} 
        onLogout={handleLogout}
      />

      {/* Main Content Pane */}
      <main className={`flex-1 pl-72 min-h-screen relative z-10 flex flex-col inner-region-scale-${fontSize}`}>
        {/* Top Mini Header */}
        <header className="h-20 border-b border-white/[0.05] bg-black/10 backdrop-blur-md flex items-center justify-between px-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-mono font-bold tracking-widest text-[#475569] uppercase">
              STATUS: CORE_ONLINE
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              className="p-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[#94a3b8] hover:text-white transition-all flex items-center justify-center"
            >
              {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-indigo-400" />}
            </button>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <Zap className="w-4 h-4 text-orange-400 fill-orange-400" />
              <span className="font-mono text-xs font-bold">{profile?.streak || 0} Streak</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
              <Award className="w-4 h-4 text-[#3b82f6]" />
              <span className="font-mono text-xs font-bold">{profile?.xp?.toLocaleString() || 0} XP</span>
            </div>
          </div>
        </header>

        {/* Dynamic Inner Tab Router */}
        <div className="flex-grow p-10 flex flex-col justify-start">
          <AnimatePresence mode="wait">
            {activeTab === "dashboard" && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -15 }}
                className="w-full"
              >
                <DashboardView 
                  stats={stats} 
                  routine={routine} 
                  setRoutine={setRoutine} 
                  onNavigateToTab={(tab) => {
                    setActiveTab(tab);
                    setCurrentItem(null);
                  }}
                />
              </motion.div>
            )}

            {activeTab === "settings" && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -15 }}
                className="w-full"
              >
                <SettingsPanel 
                  user={profile}
                  onUpdateProfile={handleUpdateProfile}
                  onUpdateSettings={handleUpdateSettings}
                  activeDomains={activeDomains}
                  setActiveDomains={setActiveDomains}
                  fontSize={fontSize}
                  setFontSize={setFontSize}
                />
              </motion.div>
            )}

            {activeTab === "artifacts" && (
              <motion.div 
                key="artifacts"
                initial={{ opacity: 0, y: 15 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -15 }}
                className="w-full"
              >
                <ArtifactsView user={profile} />
              </motion.div>
            )}

            {activeTab === "cognitive_hub" && (
              <motion.div
                key="cognitive_hub"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="w-full"
              >
                {generating || currentItem ? (
                  <div className="w-full mx-auto">
                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/[0.05]">
                      <div className="flex items-center gap-4">
                        <button 
                          onClick={() => { setCurrentItem(null); setGenerating(false); setSessionHistory([]); setHistoryIndex(-1); }}
                          className="p-3 hover:bg-white/5 rounded-xl border border-white/10 text-[#475569] hover:text-white transition-colors"
                        >
                          <ArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                          <h2 className="text-3xl font-black text-white uppercase italic tracking-tight">
                            {activeCategory} Synthesis
                          </h2>
                          <p className="text-xs text-[#94a3b8] font-semibold tracking-wider">Active Domain Parameter</p>
                        </div>
                      </div>
                    </div>

                    {/* Side-by-side grid split: Left column is format switcher, Right column is the Card View */}
                    <div className="grid md:grid-cols-4 gap-8 items-start">
                      
                      {/* Left Column Format & Domain Switchers */}
                      <div className="md:col-span-1 flex flex-col gap-6 bg-[#080816]/40 p-4 rounded-3xl border border-white/[0.05]">
                        
                        {/* Change Format Section */}
                        <div>
                          <h4 className="text-[10px] font-bold uppercase tracking-[2px] text-[#475569] mb-3 px-2">Change Format</h4>
                          <div className="flex flex-col gap-1">
                            {[
                              { id: "fact", label: "Fact Mode", icon: <BookOpen className="w-4 h-4" />, color: "#10b981" },
                              { id: "quiz", label: "Quiz Mode", icon: <Brain className="w-4 h-4" />, color: "#ec4899" },
                              { id: "myth", label: "Myth Debunker", icon: <Lightbulb className="w-4 h-4" />, color: "#f59e0b" },
                              { id: "story", label: "Storyteller", icon: <PenTool className="w-4 h-4" />, color: "#f97316" },
                              { id: "case_study", label: "Case Study", icon: <LayoutTemplate className="w-4 h-4" />, color: "#3b82f6" },
                              { id: "scenario", label: "Scenario Player", icon: <Activity className="w-4 h-4" />, color: "#06b6d4" },
                              { id: "logic", label: "Logic Challenge", icon: <Award className="w-4 h-4" />, color: "#8b5cf6" },
                              { id: "discussion", label: "AI Discussion", icon: <MessageSquare className="w-4 h-4" />, color: "#6366f1" },
                            ].map((f) => {
                              const isActive = activeTabMode === f.id;
                              return (
                                <button
                                  key={f.id}
                                  onClick={() => handleMidSessionSwitch(f.id)}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                                    isActive
                                      ? "bg-white/10 text-white border border-white/10 shadow-lg shadow-white/5"
                                      : "text-[#cbd5e1] hover:text-white hover:bg-white/[0.02]"
                                  }`}
                                >
                                  <span style={{ color: isActive ? f.color : undefined }}>{f.icon}</span>
                                  {f.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* Change Domain Section */}
                        <div className="border-t border-white/[0.05] pt-4">
                          <h4 className="text-[10px] font-bold uppercase tracking-[2px] text-[#475569] mb-3 px-2">Change Domain</h4>
                          <div className="flex flex-col gap-1 mb-3 max-h-48 overflow-y-auto pr-1 scrollbar-thin">
                            {activeDomains.map((d) => {
                              const isActive = activeCategory.toLowerCase() === d.toLowerCase();
                              return (
                                <button
                                  key={d}
                                  onClick={() => handleMidSessionDomainSwitch(d)}
                                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold text-left transition-all ${
                                    isActive
                                      ? "bg-white/10 text-white border border-white/10 shadow-lg shadow-white/5"
                                      : "text-[#cbd5e1] hover:text-white hover:bg-white/[0.02]"
                                  }`}
                                >
                                  <Globe className="w-4 h-4 text-[#3b82f6]" />
                                  {d}
                                </button>
                              );
                            })}
                          </div>
                          
                          {/* Text input to activate any custom domain */}
                          <div className="space-y-2 px-1">
                            <input 
                              type="text"
                              value={customDomainInput}
                              onChange={(e) => setCustomDomainInput(e.target.value)}
                              placeholder="Type custom domain..."
                              className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-zinc-500 focus:outline-none focus:border-[#3b82f6]"
                            />
                            <button
                              onClick={handleActivateCustomDomain}
                              className="w-full py-2 bg-gradient-to-r from-[#3b82f6] to-[#8b5cf6] text-white font-bold text-xs rounded-xl hover:scale-[1.02] active:scale-95 transition-all"
                            >
                              Activate
                            </button>
                          </div>
                        </div>

                        {/* Randomize Session Toggle */}
                        <div className="border-t border-white/[0.05] pt-4">
                          <button
                            onClick={() => setIsRandomizedSession(prev => !prev)}
                            className={`w-full flex items-center justify-between p-3 rounded-2xl border text-xs font-bold transition-all ${
                              isRandomizedSession
                                ? "bg-purple-500/10 border-purple-500/30 text-purple-400 shadow-lg shadow-purple-500/5 animate-pulse"
                                : "bg-white/5 border-white/10 text-zinc-300 hover:bg-white/10"
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <Shuffle className="w-4 h-4 text-purple-400" />
                              Randomize Session
                            </span>
                            <span className="text-[9px] uppercase font-mono px-2 py-0.5 rounded-md bg-white/10">
                              {isRandomizedSession ? "ON" : "OFF"}
                            </span>
                          </button>
                        </div>
                      </div>

                      {/* Right Column Card Area */}
                      <div className="md:col-span-3">
                        <div className="relative">
                          <AnimatePresence mode="wait">
                            {generating ? (
                              <motion.div 
                                key="loading"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex flex-col items-center justify-center py-20 gap-4"
                              >
                                <div className="relative">
                                  <Loader2 className="w-12 h-12 text-[#8b5cf6] animate-spin" />
                                  <Sparkles className="w-5 h-5 text-yellow-500 absolute top-[-10px] right-[-10px] animate-pulse" />
                                </div>
                                <p className="text-xs font-mono uppercase tracking-[0.3em] opacity-40 animate-pulse">
                                  Synthesizing Applied Logic...
                                </p>
                              </motion.div>
                            ) : (
                               <KnowledgeCard 
                                 key={currentItem?.id}
                                 item={currentItem!}
                                 onSave={handleSave}
                                 onResponse={handleResponse}
                                 onNext={handleNext}
                                 onPrevious={handlePrevious}
                                 onToggleLearnMode={(mode) => setIsLearnMode(mode)}
                               />
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                    </div>
                  </div>
                ) : (
                  <CognitiveHub 
                    activeDomains={activeDomains}
                    initialFormat={activeTabMode}
                    onStartSynthesis={async (format, domain) => {
                      setActiveTabMode(format);
                      setActiveCategory(domain);
                      setGenerating(true);
                      try {
                        const lang = profile?.settings.responseLanguage || 'english';
                        const item = await generateMicroContent(domain, format, lang);
                        setSessionHistory(prev => {
                          const nextHistory = [...prev, item];
                          setHistoryIndex(nextHistory.length - 1);
                          return nextHistory;
                        });
                        setCurrentItem(item);
                      } catch (error) {
                        console.error("Content generation error:", error);
                      } finally {
                        setGenerating(false);
                      }
                    }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

const CatIcon = ({ icon, active, label, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-3 group"
  >
    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-105 group-active:scale-95 border ${
      active 
        ? "bg-white/10 text-white border-white/20 shadow-lg shadow-white/5" 
        : "bg-white/[0.01] border-white/5 text-[#475569] group-hover:border-white/10 hover:text-zinc-300"
    }`}>
      {React.cloneElement(icon as React.ReactElement, { className: "w-6 h-6" })}
    </div>
    <span className={`text-[10px] font-bold uppercase tracking-[2px] transition-opacity ${
      active ? "text-white" : "opacity-40 group-hover:opacity-100"
    }`}>
      {label}
    </span>
  </button>
);

export default function PlatformApp() {
  return (
    <AppErrorBoundary>
      <PlatformAppContent />
    </AppErrorBoundary>
  );
}
