import React, { useState, useEffect } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc, setDoc, updateDoc, increment } from "firebase/firestore";
import { auth, db, signInWithGoogle, registerEmail, loginEmail } from "./lib/firebase";
import { AppLayout } from "./components/AppLayout";
import { KnowledgeCard } from "./components/KnowledgeCard";
import { LandingPage } from "./components/LandingPage";
import { generateMicroContent } from "./services/learningEngine";
import { UserProfile, KnowledgeItem, Category } from "./types";
import { Loader2, Sparkles, BookOpen, Brain, Globe2, Rocket, Zap } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentItem, setCurrentItem] = useState<KnowledgeItem | null>(null);
  const [generating, setGenerating] = useState(false);
  const [mode, setMode] = useState<'fact' | 'quiz'>('quiz');
  const [showLanding, setShowLanding] = useState(true);

  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState("");
  const [authPass, setAuthPass] = useState("");
  const [authName, setAuthName] = useState("");
  const [authError, setAuthError] = useState("");

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");
    try {
      if (authMode === 'register') {
        if (!authName) throw new Error("Name is required");
        await registerEmail(authEmail, authPass, authName);
      } else {
        await loginEmail(authEmail, authPass);
      }
    } catch (err: any) {
      setAuthError(err.message || "Authentication failed");
    }
  };

  useEffect(() => {
    console.log("Firebase onAuthStateChanged subscription started.");
    return onAuthStateChanged(auth, async (u) => {
      console.log("Firebase auth state changed. User:", u ? u.uid : "null");
      setUser(u);
      if (u) {
        await syncProfile(u);
      } else {
        setProfile(null);
        setCurrentItem(null);
        setLoading(false);
        console.log("No user found. Loading set to false.");
      }
    });
  }, []);

  const syncProfile = async (u: User) => {
    console.log("Syncing profile for:", u.uid);
    try {
      const userRef = doc(db, "users", u.uid);
      console.log("Fetching user doc from Firestore...");
      const snap = await getDoc(userRef);

      if (snap.exists()) {
        console.log("User profile found in Firestore.");
        setProfile(snap.data() as UserProfile);
      } else {
        console.log("Creating new user profile in Firestore...");
        const newProfile: UserProfile = {
          userId: u.uid,
          username: u.displayName || "Novice Sage",
          avatarUrl: u.photoURL || null,
          sageLevel: "Novice",
          xp: 0,
          streak: 1,
          lastLoginDate: new Date().toISOString(),
          masteryScore: 0,
          categoryProgress: { space: 10, science: 5, nature: 8, brain: 12 },
          settings: { theme: 'dark', appLanguage: 'en', responseLanguage: 'auto' }
        };
        await setDoc(userRef, newProfile);
        setProfile(newProfile);
        console.log("New profile created successfully.");
      }
    } catch (error) {
      console.error("Firestore sync error:", error);
      // Fallback to local profile to prevent app hanging
      console.log("Using offline fallback profile...");
      setProfile({
        userId: u.uid,
        username: u.displayName || "Offline Sage",
        avatarUrl: u.photoURL || null,
        sageLevel: "Novice",
        xp: 0,
        streak: 1,
        lastLoginDate: new Date().toISOString(),
        masteryScore: 0,
        categoryProgress: { space: 10, science: 5, nature: 8, brain: 12 },
        settings: { theme: 'dark', appLanguage: 'en', responseLanguage: 'auto' }
      });
    } finally {
      setLoading(false);
      console.log("Profile sync finalized. Loading set to false.");
    }
  };


  const getNextItem = async (category?: Category) => {
    setGenerating(true);
    try {
      const cats: Category[] = ['space', 'science', 'nature', 'brain'];
      const randomCat = category || cats[Math.floor(Math.random() * cats.length)];
      const lang = profile?.settings.responseLanguage || 'english';
      const item = await generateMicroContent(randomCat, mode, lang);
      setCurrentItem(item);
    } catch (error) {
      console.error("Content gen error:", error);
    } finally {
      setGenerating(false);
    }
  };

  useEffect(() => {
    if (user && !currentItem && !generating && profile) {
      getNextItem();
    }
  }, [user, currentItem, generating, profile]);

  const handleUpdateSettings = async (settings: Partial<UserProfile['settings']>) => {
    if (!user || !profile) return;
    const userRef = doc(db, "users", user.uid);
    const newSettings = { ...profile.settings, ...settings };
    await updateDoc(userRef, { settings: newSettings });
    setProfile({ ...profile, settings: newSettings });
    
    // If language changed, clear current item to force regenerate in new language
    if (settings.responseLanguage) {
      setCurrentItem(null);
    }
  };

  const handleResponse = async (correct: boolean) => {
    if (!user) return;
    const userRef = doc(db, "users", user.uid);
    const xpGain = correct ? 15 : 5;
    
    await updateDoc(userRef, {
      xp: increment(xpGain),
      masteryScore: increment(correct ? 1 : 0)
    });

    // Refresh local profile state
    const snap = await getDoc(userRef);
    setProfile(snap.data() as UserProfile);
  };

  const handleNext = () => {
    setCurrentItem(null);
  };

  const handleSave = async (item: KnowledgeItem) => {
    if (!user) return;
    const saveRef = doc(db, "users", user.uid, "saved", item.id);
    await setDoc(saveRef, {
      itemId: item.id,
      userId: user.uid,
      isSaved: true,
      isMistake: false,
      title: item.title,
      category: item.category,
      type: item.type,
      savedAt: new Date().toISOString()
    });
    alert("Saved to your Personal Vault!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0b1e] flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="w-16 h-16 border-4 border-accent-purple border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(189,0,255,0.4)]" />
          <p className="text-accent-blue font-mono text-sm animate-pulse tracking-widest uppercase">Initializing Core...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    if (showLanding) {
      return <LandingPage onStart={() => setShowLanding(false)} />;
    }
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden bg-[#0a0b1e]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(189,0,255,0.1),transparent_70%)]" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-accent-blue/5 blur-[120px] rounded-full" />
        
        <motion.div 
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-md w-full relative z-10 p-10 bg-white/5 backdrop-blur-[40px] border border-white/10 rounded-[40px] shadow-[0_40px_100px_rgba(0,0,0,0.5)]"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-accent-purple to-accent-blue rounded-[24px] mx-auto flex items-center justify-center shadow-[0_10px_40px_rgba(189,0,255,0.4)] mb-8 border border-white/20">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-4xl font-black tracking-tighter mb-2 uppercase italic">SAGE</h1>
          <p className="text-white/40 mb-8 font-light text-xs tracking-[2px] uppercase">Scenario Applied General Education</p>

          <form onSubmit={handleEmailAuth} className="space-y-4 mb-8">
            {authMode === 'register' && (
              <input 
                type="text" 
                placeholder="Full Name" 
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent-purple transition-colors"
                value={authName}
                onChange={(e) => setAuthName(e.target.value)}
              />
            )}
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent-blue transition-colors"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
            />
            <input 
              type="password" 
              placeholder="Security Key" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:border-accent-purple transition-colors"
              value={authPass}
              onChange={(e) => setAuthPass(e.target.value)}
            />
            {authError && <p className="text-red-400 text-xs font-mono">{authError}</p>}
            
            <button 
              type="submit"
              className="w-full py-5 bg-gradient-to-r from-accent-purple to-accent-blue text-white rounded-2xl font-bold flex items-center justify-center gap-3 shadow-[0_15px_30px_rgba(189,0,255,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              <Zap className="w-5 h-5" />
              {authMode === 'login' ? 'Initiate Session' : 'Registry Entry'}
            </button>
          </form>

          <div className="relative flex items-center gap-4 mb-8">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-[10px] font-bold text-white/20 uppercase tracking-widest">Global Auth</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          <button 
            onClick={signInWithGoogle}
            className="w-full py-4 bg-white text-black rounded-2xl font-bold flex items-center justify-center gap-3 hover:translate-y-[-2px] transition-all shadow-[0_10px_30px_rgba(0,0,0,0.3)] active:scale-[0.98]"
          >
            <Globe2 className="w-5 h-5 text-accent-blue" />
            Google Sync
          </button>

          <p className="mt-8 text-xs text-white/40">
            {authMode === 'login' ? "New operative?" : "Existing sage?"}
            <button 
              onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
              className="ml-2 text-accent-blue font-bold hover:underline"
            >
              {authMode === 'login' ? 'Create Profile' : 'Access Vault'}
            </button>
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <AppLayout user={profile} onUpdateSettings={handleUpdateSettings}>
      <div className="max-w-4xl w-full mx-auto">
        {/* Mode Selector */}
        <div className="flex justify-center mb-16">
          <div className="bg-white/5 p-1.5 rounded-2xl border border-white/10 flex gap-1 backdrop-blur-md">
            <ModeBtn active={mode === 'fact'} onClick={() => setMode('fact')} icon={<BookOpen className="w-4 h-4" />} label="Fact Mode" />
            <ModeBtn active={mode === 'quiz'} onClick={() => setMode('quiz')} icon={<Brain className="w-4 h-4" />} label="Quiz Mode" />
          </div>
        </div>

        {/* Categories Bar */}
        <div className="flex justify-center items-center mb-24 gap-12">
           <CatIcon icon={<Rocket />} category="space" onClick={() => getNextItem('space')} />
           <CatIcon icon={<Sparkles />} category="science" onClick={() => getNextItem('science')} />
           <CatIcon icon={<Globe2 />} category="nature" onClick={() => getNextItem('nature')} />
           <CatIcon icon={<Brain />} category="brain" onClick={() => getNextItem('brain')} />
        </div>

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
                  <Loader2 className="w-12 h-12 text-purple-500 animate-spin" />
                  <Sparkles className="w-5 h-5 text-yellow-500 absolute top-[-10px] right-[-10px] animate-pulse" />
                </div>
                <p className="text-sm font-mono uppercase tracking-[0.3em] opacity-40 animate-pulse">
                  Synthesizing Applied Logic...
                </p>
              </motion.div>
            ) : currentItem && (
               <KnowledgeCard 
                 key={currentItem.id}
                 item={currentItem}
                 onSave={handleSave}
                 onResponse={handleResponse}
                 onNext={handleNext}
               />
            )}
          </AnimatePresence>
        </div>
      </div>
    </AppLayout>
  );
}

const ModeBtn = ({ active, onClick, icon, label }: any) => (
  <button 
    onClick={onClick}
    className={`flex items-center gap-2 px-6 py-2.5 rounded-xl transition-all text-sm font-medium ${
      active ? "bg-white/10 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
    }`}
  >
    {icon} {label}
  </button>
);

const CatIcon = ({ icon, category, onClick }: any) => (
  <button 
    onClick={onClick}
    className="flex flex-col items-center gap-4 group"
  >
    <div className={`w-16 h-16 rounded-[20px] flex items-center justify-center transition-all group-hover:scale-110 group-active:scale-95 border border-white/10 backdrop-blur-md ${
      category === 'space' ? "bg-accent-blue/10 text-accent-blue group-hover:bg-accent-blue/20" :
      category === 'science' ? "bg-accent-purple/10 text-accent-purple group-hover:bg-accent-purple/20" :
      category === 'nature' ? "bg-accent-green/10 text-accent-green group-hover:bg-accent-green/20" :
      "bg-accent-orange/10 text-accent-orange group-hover:bg-accent-orange/20"
    }`}>
      {React.cloneElement(icon as React.ReactElement, { className: "w-7 h-7" })}
    </div>
    <span className="text-[11px] font-bold uppercase tracking-[2px] opacity-40 group-hover:opacity-100 transition-opacity">
      {category}
    </span>
  </button>
);

