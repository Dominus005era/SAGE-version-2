import React from "react";
import { 
  Home, Cpu, Settings, LogOut, Sparkles, Layers, X
} from "lucide-react";
import { UserProfile } from "../../types";

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: UserProfile | null;
  onLogout: () => void;
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ activeTab, setActiveTab, user, onLogout, isOpen, onClose }: SidebarProps) {
  
  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: <Home className="w-5 h-5" /> },
    { id: "cognitive_hub", label: "Cognitive Hub", icon: <Cpu className="w-5 h-5" /> },
    { id: "artifacts", label: "Artifacts", icon: <Layers className="w-5 h-5" /> },
    { id: "settings", label: "Settings", icon: <Settings className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}
      <aside 
        className={`sidebar-container w-72 bg-[#080816]/90 border-r border-white/10 flex flex-col h-screen fixed left-0 top-0 z-50 backdrop-blur-xl transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Brand logo */}
        <div className="sidebar-header h-20 flex items-center justify-between px-8 border-b border-white/[0.05]">
          <a href="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-white/20 shadow-md bg-[#04040a] flex items-center justify-center">
              <img src="/sage-logo.png" alt="SAGE Logo" className="w-full h-full object-cover" />
            </div>
            <span className="sidebar-brand-text text-xl font-black tracking-tighter uppercase italic text-white">SAGE</span>
          </a>
          <button className="lg:hidden p-2 text-white/50 hover:text-white" onClick={onClose}>
            <X className="w-5 h-5" />
          </button>
        </div>

      {/* Navigation list */}
      <nav className="flex-1 px-4 py-6 overflow-y-auto space-y-1.5 scrollbar-thin">
        {menuItems.map((item) => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all font-semibold text-sm ${
                isActive 
                  ? "bg-white/10 text-white shadow-lg border border-white/[0.08] sidebar-link-active" 
                  : "text-[#94a3b8] hover:text-white hover:bg-white/[0.03] border border-transparent sidebar-link"
              }`}
            >
              <span className={isActive ? "text-[#3b82f6]" : "text-[#475569]"}>{item.icon}</span>
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Profile/Footer */}
      <div className="sidebar-footer p-6 border-t border-white/[0.05] bg-black/20 flex flex-col gap-4">
        <div className="flex items-center gap-3">
          {user?.avatarUrl ? (
            <img 
              src={user.avatarUrl} 
              alt="Avatar" 
              className="w-12 h-12 rounded-xl object-cover border border-white/20 shadow-md"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#3b82f6] to-[#8b5cf6] flex items-center justify-center font-bold text-white shadow-md border border-white/20">
              {user?.username ? user.username.substring(0, 2).toUpperCase() : "SG"}
            </div>
          )}
          <div className="overflow-hidden">
            <h4 className="sidebar-user-name font-bold text-white text-sm truncate">{user?.username || "Operative"}</h4>
            <div className="flex items-center gap-1.5 mt-0.5">
              <img src="/sage-logo.png" alt="SAGE Logo" className="w-3.5 h-3.5 object-cover rounded-full border border-white/20 shrink-0" />
              <p className="sidebar-user-level text-[10px] text-[#3b82f6] font-bold uppercase tracking-wider truncate">
                {user?.sageLevel || "Novice Sage"}
              </p>
            </div>
          </div>
        </div>

        <button 
          onClick={onLogout}
          className="sidebar-logout-btn w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500/20 transition-all font-bold text-xs"
        >
          <LogOut className="w-4 h-4" />
          Terminate Session
        </button>
      </div>
    </aside>
    </>
  );
}
