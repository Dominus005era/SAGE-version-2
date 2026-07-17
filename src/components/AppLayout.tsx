import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  User, BarChart3, Bookmark, AlertCircle, Settings, 
  Moon, Sun, Globe, Zap, Menu, X, ChevronRight,
  TrendingUp, Award, Clock, LogOut
} from "lucide-react";
import { UserProfile } from "../types";
import { logoutUser } from "../lib/firebase";

interface Props {
  user: UserProfile | null;
  children: React.ReactNode;
  onUpdateSettings: (settings: Partial<UserProfile['settings']>) => void;
}

export const AppLayout: React.FC<Props> = ({ user, children, onUpdateSettings }) => {
  const [isOpen, setIsOpen] = useState(false);

  const stats = [
    { label: "Space", value: user?.categoryProgress.space || 0, color: "bg-accent-blue" },
    { label: "Science", value: user?.categoryProgress.science || 0, color: "bg-accent-purple" },
    { label: "Nature", value: user?.categoryProgress.nature || 0, color: "bg-accent-green" },
    { label: "Brain", value: user?.categoryProgress.brain || 0, color: "bg-accent-orange" },
  ];

  const languages = ["English", "Hindi", "Spanish", "French", "German"];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-10 z-40 bg-white/5 backdrop-blur-xl border-b border-white/10">
        <button onClick={() => setIsOpen(true)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold tracking-tighter uppercase italic">Sage</h1>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
            <Zap className="w-4 h-4 text-orange-400 fill-orange-400" />
            <span className="font-mono text-sm font-bold">{user?.streak || 0} Day Streak</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 border border-white/10 rounded-full">
            <Award className="w-4 h-4 text-blue-400" />
            <span className="font-mono text-sm font-bold">{user?.xp?.toLocaleString() || 0} XP</span>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-md z-50 transition-all"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 left-0 bottom-0 w-[320px] z-55 overflow-y-auto bg-white/5 backdrop-blur-[30px] border-r border-white/10"
            >
              <div className="p-8 flex flex-col h-full">
                {/* Profile Section */}
                <div className="flex items-center gap-4 mb-10">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent-purple to-accent-blue flex items-center justify-center font-bold text-xl shadow-[0_4px_15px_rgba(189,0,255,0.3)] border border-white/20">
                    {user?.username ? user.username.substring(0, 2).toUpperCase() : "AK"}
                  </div>
                  <div className="user-info">
                    <h2 className="text-lg font-bold leading-none mb-1">{user?.username || "Guest User"}</h2>
                    <p className="text-[10px] text-accent-blue font-bold uppercase tracking-widest">{user?.sageLevel || "Universal Sage"} • Lvl 24</p>
                  </div>
                  <button onClick={() => setIsOpen(false)} className="ml-auto p-2 hover:bg-white/5 rounded-full">
                    <X className="w-5 h-5 text-white/40" />
                  </button>
                </div>

                {/* Live Analytics */}
                <div className="mb-10">
                  <h3 className="text-[11px] uppercase tracking-[2px] text-white/40 font-bold mb-6">Live Analytics</h3>
                  <div className="space-y-4">
                    {stats.map((stat) => (
                      <div key={stat.label} className="space-y-2">
                        <div className="flex justify-between text-xs items-center">
                          <span className="font-medium text-white/80">{stat.label}</span>
                          <span className="font-mono opacity-60">{stat.value}%</span>
                        </div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                          <motion.div 
                            initial={{ width: 0 }}
                            animate={{ width: `${stat.value}%` }}
                            className={`h-full ${stat.color}`} 
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-4 flex items-center gap-3">
                    <span className="text-[11px] uppercase tracking-wider text-white/40">Mastery Score</span>
                    <span className="text-2xl font-black bg-gradient-to-r from-[#ff4e00] to-[#ec9f05] bg-clip-text text-transparent">
                      {user?.masteryScore?.toLocaleString() || "2,840"}
                    </span>
                  </div>
                </div>

                {/* Records Section */}
                <div className="mb-10">
                  <h3 className="text-[11px] uppercase tracking-[2px] text-white/40 font-bold mb-4">Records</h3>
                  <div className="space-y-2">
                    <NavItem icon={<Bookmark className="w-4 h-4" />} label="Personal Vault" badge="12" />
                    <NavItem icon={<AlertCircle className="w-4 h-4" />} label="Mistakes Gallery" badge="4" badgeColor="bg-red-500" />
                  </div>
                </div>

                {/* Settings Footer */}
                <div className="mt-auto pt-6 border-t border-white/10 space-y-4">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40 font-bold uppercase tracking-tight">UI Language</span>
                    <select 
                      value={user?.settings.appLanguage || "en"}
                      onChange={(e) => onUpdateSettings({ appLanguage: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded px-2 py-1 font-mono text-[10px] uppercase outline-none focus:border-accent-blue"
                    >
                      <option value="en">English</option>
                      <option value="hi">Hindi</option>
                      <option value="es">Spanish</option>
                    </select>
                  </div>
                  
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40 font-bold uppercase tracking-tight">Fact Language</span>
                    <select 
                      value={user?.settings.responseLanguage || "english"}
                      onChange={(e) => onUpdateSettings({ responseLanguage: e.target.value })}
                      className="bg-white/5 border border-white/10 rounded px-2 py-1 font-mono text-[10px] uppercase outline-none focus:border-accent-purple"
                    >
                      <option value="english">English</option>
                      <option value="hindi">Hindi</option>
                      <option value="spanish">Spanish</option>
                    </select>
                  </div>

                  <div className="flex justify-between items-center text-xs">
                    <span className="text-white/40 font-bold uppercase tracking-tight">Theme</span>
                    <button 
                       onClick={() => onUpdateSettings({ theme: user?.settings.theme === 'dark' ? 'light' : 'dark' })}
                       className="px-2 py-1 bg-white/5 border border-white/10 rounded text-[10px] uppercase font-mono hover:bg-white/10"
                    >
                      {user?.settings.theme || 'dark'} Mode
                    </button>
                  </div>

                  <button 
                    onClick={() => logoutUser()}
                    className="w-full mt-4 flex items-center gap-3 px-4 py-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all font-bold text-sm"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out Operative
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <main className="pt-32 px-10 pb-12 flex flex-col items-center">
        {children}
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, badge, badgeColor }: { icon: any, label: string, badge?: string, badgeColor?: string }) => (
  <button className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white/[0.03] border border-transparent hover:bg-white/[0.08] hover:border-white/10 transition-all group">
    <div className="flex items-center gap-3">
      <span className="text-white/40 group-hover:text-white transition-colors">{icon}</span>
      <span className="text-sm font-medium">{label}</span>
    </div>
    {badge && (
      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full text-white ${badgeColor || "bg-accent-purple"}`}>
        {badge}
      </span>
    )}
  </button>
);
