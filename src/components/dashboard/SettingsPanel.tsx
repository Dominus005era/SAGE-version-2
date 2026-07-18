import React, { useState } from "react";
import { User, Monitor, Cpu, Edit3, Save, Upload, Shield, Trash2, Plus, Sun, Moon, Type, Target, BookOpen } from "lucide-react";
import { UserProfile } from "../../types";

interface SettingsPanelProps {
  user: UserProfile | null;
  onUpdateProfile: (updatedFields: Partial<UserProfile>) => void;
  onUpdateSettings: (settings: Partial<UserProfile["settings"]>) => void;
  activeDomains: string[];
  setActiveDomains: React.Dispatch<React.SetStateAction<string[]>>;
  fontSize?: string;
  setFontSize?: (size: any) => void;
}

export function SettingsPanel({ 
  user, 
  onUpdateProfile, 
  onUpdateSettings,
  activeDomains,
  setActiveDomains,
  fontSize = "base",
  setFontSize
}: SettingsPanelProps) {
  const [activeSubTab, setActiveSubTab] = useState<"profile" | "display" | "platform">("profile");
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  // Editable Profile States
  const [editedName, setEditedName] = useState(user?.username || "");
  const [editedAvatar, setEditedAvatar] = useState(user?.avatarUrl || "");
  const [editedBio, setEditedBio] = useState(user?.bio || "Dedicated Operative exploring deep analytical logic and scientific principles.");
  const [editedFocus, setEditedFocus] = useState(user?.primaryFocus || "Space & Quantum Physics");
  const [editedDailyGoal, setEditedDailyGoal] = useState<number>(user?.dailyGoal || 10);
  
  // Custom Domain input state
  const [newDomain, setNewDomain] = useState("");

  // Display settings local states
  const [theme, setTheme] = useState<"light" | "dark">(user?.settings?.theme || (localStorage.getItem("sage_theme") as any) || "dark");
  const [localFontSize, setLocalFontSize] = useState<string>(fontSize || localStorage.getItem("sage_font_size") || "base");

  // Handle Avatar base64 loading
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setEditedAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const saveProfile = () => {
    onUpdateProfile({
      username: editedName,
      avatarUrl: editedAvatar,
      bio: editedBio,
      primaryFocus: editedFocus,
      dailyGoal: editedDailyGoal
    });
    setIsEditingProfile(false);
  };

  const handleThemeChange = (newTheme: "light" | "dark") => {
    setTheme(newTheme);
    onUpdateSettings({ theme: newTheme });
    localStorage.setItem("sage_theme", newTheme);
    
    // Apply theme globally across the entire platform
    if (newTheme === "light") {
      document.documentElement.classList.add("light-mode");
    } else {
      document.documentElement.classList.remove("light-mode");
    }
  };

  const handleFontSizeChange = (size: "sm" | "base" | "lg" | "xlarge") => {
    setLocalFontSize(size);
    localStorage.setItem("sage_font_size", size);
    if (setFontSize) setFontSize(size);
  };

  const handleAddDomain = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = newDomain.trim();
    if (!clean) return;
    
    if (activeDomains.some(d => d.toLowerCase() === clean.toLowerCase())) {
      alert("This domain is already registered on SAGE.");
      return;
    }

    setActiveDomains(prev => [...prev, clean]);
    setNewDomain("");
  };

  const handleRemoveDomain = (domainToRemove: string) => {
    setActiveDomains(prev => prev.filter(d => d !== domainToRemove));
  };

  return (
    <div className="max-w-5xl w-full mx-auto bg-[#080816]/40 border border-white/[0.08] rounded-3xl overflow-hidden flex min-h-[580px] shadow-2xl backdrop-blur-xl">
      {/* Left split mini-panel */}
      <div className="w-1/3 border-r border-white/[0.08] bg-black/10 p-6 space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-[2px] text-[#475569] mb-6 px-4">Configurations</h3>
        
        <button
          onClick={() => setActiveSubTab("profile")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
            activeSubTab === "profile" 
              ? "bg-white/10 text-white shadow-md border border-white/[0.08]" 
              : "text-[#94a3b8] hover:text-white hover:bg-white/[0.02]"
          }`}
        >
          <User className="w-4 h-4 text-[#3b82f6]" />
          Operative Profile
        </button>

        <button
          onClick={() => setActiveSubTab("display")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
            activeSubTab === "display" 
              ? "bg-white/10 text-white shadow-md border border-white/[0.08]" 
              : "text-[#94a3b8] hover:text-white hover:bg-white/[0.02]"
          }`}
        >
          <Monitor className="w-4 h-4 text-[#8b5cf6]" />
          Display & Font Scaling
        </button>

        <button
          onClick={() => setActiveSubTab("platform")}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all ${
            activeSubTab === "platform" 
              ? "bg-white/10 text-white shadow-md border border-white/[0.08]" 
              : "text-[#94a3b8] hover:text-white hover:bg-white/[0.02]"
          }`}
        >
          <Cpu className="w-4 h-4 text-[#06b6d4]" />
          Domain Registry
        </button>
      </div>

      {/* Right details panel */}
      <div className="w-2/3 p-8 flex flex-col relative bg-black/5 overflow-y-auto">
        
        {/* PROFILE SETTINGS DETAIL PANEL */}
        {activeSubTab === "profile" && (
          <div className="flex-1 flex flex-col space-y-6">
            <div className="flex justify-between items-center pb-4 border-b border-white/[0.05]">
              <div>
                <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Operative Profile</h2>
                <p className="text-xs text-[#94a3b8] font-semibold">Customize your identity, primary domain, and daily targets</p>
              </div>
              {isEditingProfile ? (
                <button
                  onClick={saveProfile}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-[#10b981] to-[#06b6d4] text-white rounded-xl text-xs font-bold shadow-md hover:scale-105 active:scale-95 transition-all"
                >
                  <Save className="w-4 h-4" /> Save Profile
                </button>
              ) : (
                <button
                  onClick={() => setIsEditingProfile(true)}
                  className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/15 border border-white/10 text-white rounded-xl text-xs font-bold hover:scale-105 active:scale-95 transition-all"
                >
                  <Edit3 className="w-4 h-4" /> Edit Profile
                </button>
              )}
            </div>

            {/* Avatar section */}
            <div className="flex items-center gap-6 pb-6 border-b border-white/[0.05]">
              <div className="relative group">
                {editedAvatar ? (
                  <img 
                    src={editedAvatar} 
                    alt="Profile Avatar" 
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-white/20 shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center font-black text-2xl text-white shadow-lg border-2 border-white/20">
                    {editedName.substring(0, 2).toUpperCase() || "OP"}
                  </div>
                )}
                {isEditingProfile && (
                  <label className="absolute inset-0 bg-black/60 rounded-2xl flex flex-col items-center justify-center text-[10px] font-bold text-white cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity">
                    <Upload className="w-4 h-4 mb-1 text-[#3b82f6]" />
                    Upload Avatar
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      onChange={handleAvatarChange}
                    />
                  </label>
                )}
              </div>
              <div>
                <h4 className="font-bold text-lg text-white">{editedName || "Guest Operative"}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <Shield className="w-3.5 h-3.5 text-[#3b82f6]" />
                  <span className="text-xs text-[#3b82f6] font-bold uppercase tracking-wider">
                    {user?.sageLevel || "Universal Sage"} • Active Operative
                  </span>
                </div>
              </div>
            </div>

            {/* Editable Fields Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#475569]">Operative Identity / Handle</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-[#3b82f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#475569]">Primary Focus Domain</label>
                <input
                  type="text"
                  disabled={!isEditingProfile}
                  value={editedFocus}
                  onChange={(e) => setEditedFocus(e.target.value)}
                  placeholder="e.g. Space, Quantum Physics, Finance..."
                  className="w-full bg-white/[0.02] border border-white/10 rounded-2xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-[#3b82f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#475569]">Daily Target Cards</label>
                <select
                  disabled={!isEditingProfile}
                  value={editedDailyGoal}
                  onChange={(e) => setEditedDailyGoal(Number(e.target.value))}
                  className="w-full bg-[#080816] border border-white/10 rounded-2xl px-4 py-3 text-xs font-semibold text-white focus:outline-none focus:border-[#3b82f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value={5}>5 Cards / Day (Casual)</option>
                  <option value={10}>10 Cards / Day (Standard)</option>
                  <option value={15}>15 Cards / Day (Intensive)</option>
                  <option value={20}>20 Cards / Day (Mastery)</option>
                  <option value={30}>30 Cards / Day (Extreme)</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#475569]">Contact Protocol (Email)</label>
                <input
                  type="email"
                  disabled
                  value={user?.userId ? `${user.username.toLowerCase().replace(/\s+/g, "")}@sage-learning.net` : "guest@sage.net"}
                  className="w-full bg-white/[0.01] border border-white/[0.04] rounded-2xl px-4 py-3 text-xs font-semibold text-[#475569] cursor-not-allowed focus:outline-none"
                />
              </div>
            </div>

            {/* Bio Statement */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#475569]">Cognitive Bio & Mission Statement</label>
              <textarea
                disabled={!isEditingProfile}
                rows={3}
                value={editedBio}
                onChange={(e) => setEditedBio(e.target.value)}
                placeholder="Describe your learning objectives and cognitive focus..."
                className="w-full bg-white/[0.02] border border-white/10 rounded-2xl p-4 text-xs font-light text-zinc-200 focus:outline-none focus:border-[#3b82f6] transition-colors disabled:opacity-50 disabled:cursor-not-allowed leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* DISPLAY SETTINGS DETAIL PANEL */}
        {activeSubTab === "display" && (
          <div className="flex-1 flex flex-col space-y-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Display & Text Sizing</h2>
              <p className="text-xs text-[#94a3b8] font-semibold">Universal platform theme & inner region text scaling</p>
            </div>
            
            <div className="space-y-8 flex-1">
              {/* Theme Settings */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#475569]">Universal Platform Theme</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => handleThemeChange("dark")}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      theme === "dark"
                        ? "bg-[#3b82f6]/10 border-[#3b82f6] shadow-lg shadow-[#3b82f6]/10 text-white"
                        : "bg-white/[0.02] border-white/10 text-[#94a3b8] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2 text-blue-400">
                      <Moon className="w-5 h-5" />
                      <h4 className="font-bold text-sm">Dark Mode</h4>
                    </div>
                    <p className="text-xs opacity-60 leading-relaxed">Sleek dark futuristic theme optimized for low-light focus across all pages.</p>
                  </button>

                  <button
                    onClick={() => handleThemeChange("light")}
                    className={`p-5 rounded-2xl border text-left transition-all ${
                      theme === "light"
                        ? "bg-[#8b5cf6]/10 border-[#8b5cf6] shadow-lg shadow-[#8b5cf6]/10 text-white"
                        : "bg-white/[0.02] border-white/10 text-[#94a3b8] hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-2 text-purple-400">
                      <Sun className="w-5 h-5" />
                      <h4 className="font-bold text-sm">Light Mode</h4>
                    </div>
                    <p className="text-xs opacity-60 leading-relaxed">Clean translucent light theme for maximum legibility in daytime environments.</p>
                  </button>
                </div>
              </div>

              {/* Text Size Settings (Inner Region Only) */}
              <div className="space-y-3 pt-6 border-t border-white/[0.05]">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#475569]">Inner Region Text Scaling</label>
                  <span className="text-[10px] font-mono text-purple-400">Affects Dashboard, Hub, Vault & Cards</span>
                </div>
                <div className="grid grid-cols-4 gap-3">
                  {[
                    { id: "sm", label: "Small" },
                    { id: "base", label: "Medium" },
                    { id: "lg", label: "Large" },
                    { id: "xlarge", label: "Extra Large" }
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => handleFontSizeChange(s.id as any)}
                      className={`py-3.5 rounded-2xl border text-xs font-bold uppercase tracking-wider transition-all ${
                        localFontSize === s.id
                          ? "bg-gradient-to-r from-indigo-600/30 to-purple-600/30 border-indigo-500 text-white shadow-md"
                          : "bg-white/[0.02] border-white/5 text-[#94a3b8] hover:bg-white/[0.04]"
                      }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* PLATFORM SETTINGS (DOMAIN EDITING) */}
        {activeSubTab === "platform" && (
          <div className="flex-1 flex flex-col space-y-6">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-white uppercase italic">Domain Registry</h2>
              <p className="text-xs text-[#94a3b8] font-semibold">Manage active domains for session generation</p>
            </div>
            
            <div className="space-y-6 flex-grow">
              
              {/* Add Custom Domain Form */}
              <form onSubmit={handleAddDomain} className="flex gap-3">
                <input
                  type="text"
                  placeholder="Enter custom domain (e.g. Astrochemistry, AI Ethics)..."
                  value={newDomain}
                  onChange={(e) => setNewDomain(e.target.value)}
                  className="flex-1 bg-white/[0.02] border border-white/10 rounded-2xl px-5 py-3.5 text-xs font-semibold text-white focus:outline-none focus:border-[#06b6d4] transition-colors"
                />
                <button
                  type="submit"
                  className="px-5 rounded-2xl bg-gradient-to-r from-[#06b6d4] to-[#3b82f6] text-white flex items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-md font-bold text-xs"
                >
                  <Plus className="w-4 h-4" /> Add
                </button>
              </form>

              {/* Active Domains List */}
              <div className="space-y-3">
                <label className="text-[10px] font-bold uppercase tracking-[2px] text-[#475569]">Registered Active Domains</label>
                <div className="bg-[#080816]/40 border border-white/[0.08] rounded-3xl p-6 max-h-[260px] overflow-y-auto space-y-2 scrollbar-thin">
                  {activeDomains.map((domain) => (
                    <div 
                      key={domain}
                      className="flex items-center justify-between px-5 py-3 bg-white/[0.02] border border-white/5 rounded-xl text-xs font-bold"
                    >
                      <span className="uppercase tracking-wider text-white">{domain}</span>
                      <button
                        onClick={() => handleRemoveDomain(domain)}
                        className="p-1.5 hover:bg-red-500/10 rounded-lg text-[#475569] hover:text-red-500 transition-colors"
                        title={`Remove ${domain}`}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
