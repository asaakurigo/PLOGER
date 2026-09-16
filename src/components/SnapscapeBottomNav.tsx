import React from "react";
import { Camera, Search, Plus, Play, Cloud } from "lucide-react";

export type NavTab = "home" | "videos" | "add" | "search" | "vault" | "notifications" | "profile";

interface SnapscapeBottomNavProps {
  activeTab: NavTab;
  onTabChange: (tab: NavTab) => void;
  unreadNotifications?: boolean;
  isDark?: boolean;
}

export const SnapscapeBottomNav: React.FC<SnapscapeBottomNavProps> = ({
  activeTab,
  onTabChange,
  isDark = false,
}) => {
  return (
    <nav 
      aria-label="Bottom Navigation"
      className={`w-full max-w-md mx-auto px-4 py-2 transition-colors duration-300 ${
        isDark 
          ? "bg-[#141518] text-white border-t border-white/10" 
          : "bg-[#FAF8F5] text-neutral-800 border-t border-neutral-200/70"
      }`}
    >
      <div className="flex items-center justify-between">
        
        {/* Tab 1: Home (Snaps Feed) */}
        <button
          onClick={() => onTabChange("home")}
          className="relative flex flex-col items-center justify-center flex-1 py-1 transition-all group"
          id="nav-tab-home"
        >
          {activeTab === "home" && (
            <span 
              className={`absolute -top-2 w-6 h-[3px] rounded-full transition-all ${
                isDark ? "bg-white" : "bg-neutral-900"
              }`} 
            />
          )}
          <Camera 
            className={`w-5 h-5 transition-transform group-active:scale-90 ${
              activeTab === "home" 
                ? isDark ? "text-white stroke-[2.5]" : "text-neutral-900 stroke-[2.5]" 
                : isDark ? "text-neutral-500" : "text-neutral-400"
            }`} 
          />
          <span 
            className={`text-[10px] tracking-tight mt-0.5 ${
              activeTab === "home" 
                ? isDark ? "font-bold text-white" : "font-extrabold text-neutral-900" 
                : isDark ? "font-medium text-neutral-500" : "font-medium text-neutral-400"
            }`}
          >
            Snaps
          </span>
        </button>

        {/* Tab 2: TikTok-Style Short-Form Video & Discovery */}
        <button
          onClick={() => onTabChange("videos")}
          className="relative flex flex-col items-center justify-center flex-1 py-1 transition-all group"
          id="nav-tab-clips"
        >
          {activeTab === "videos" && (
            <span 
              className="absolute -top-2 w-6 h-[3px] rounded-full bg-[#FF2E79] transition-all" 
            />
          )}
          <div className="relative">
            <Play 
              className={`w-5 h-5 transition-transform group-active:scale-90 ${
                activeTab === "videos" 
                  ? "text-[#FF2E79] fill-[#FF2E79] stroke-[2.5]" 
                  : isDark ? "text-neutral-500" : "text-neutral-400"
              }`} 
            />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
          </div>
          <span 
            className={`text-[10px] tracking-tight mt-0.5 ${
              activeTab === "videos" 
                ? "font-extrabold text-[#FF2E79]" 
                : isDark ? "font-medium text-neutral-500" : "font-medium text-neutral-400"
            }`}
          >
            Clips
          </span>
        </button>

        {/* Tab 3: Add (Highlighted pink in creator mode) */}
        <button
          onClick={() => onTabChange("add")}
          className="relative flex flex-col items-center justify-center flex-1 py-1 transition-all group"
          id="nav-tab-add"
        >
          <div 
            className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all ${
              activeTab === "add"
                ? "bg-[#FF2E79] text-white shadow-lg shadow-pink-500/30 scale-105"
                : isDark
                  ? "border border-white/20 text-neutral-300 hover:border-white/40"
                  : "border border-neutral-400 text-neutral-700 hover:border-neutral-800"
            }`}
          >
            <Plus className="w-4 h-4 stroke-[3]" />
          </div>
          <span 
            className={`text-[10px] tracking-tight mt-0.5 ${
              activeTab === "add" 
                ? "font-bold text-[#FF2E79]" 
                : isDark ? "font-medium text-neutral-500" : "font-medium text-neutral-400"
            }`}
          >
            Create
          </span>
        </button>

        {/* Tab 4: Search & Discover */}
        <button
          onClick={() => onTabChange("search")}
          className="relative flex flex-col items-center justify-center flex-1 py-1 transition-all group"
          id="nav-tab-search"
        >
          {activeTab === "search" && (
            <span 
              className={`absolute -top-2 w-6 h-[3px] rounded-full transition-all ${
                isDark ? "bg-white" : "bg-neutral-900"
              }`} 
            />
          )}
          <Search 
            className={`w-5 h-5 transition-transform group-active:scale-90 ${
              activeTab === "search" 
                ? isDark ? "text-white stroke-[2.5]" : "text-neutral-900 stroke-[2.5]" 
                : isDark ? "text-neutral-500" : "text-neutral-400"
            }`} 
          />
          <span 
            className={`text-[10px] tracking-tight mt-0.5 ${
              activeTab === "search" 
                ? isDark ? "font-bold text-white" : "font-extrabold text-neutral-900" 
                : isDark ? "font-medium text-neutral-500" : "font-medium text-neutral-400"
            }`}
          >
            Search
          </span>
        </button>

        {/* Tab 5: Google Photos-Style Auto-Backed Up Vault Gallery */}
        <button
          onClick={() => onTabChange("vault")}
          className="relative flex flex-col items-center justify-center flex-1 py-1 transition-all group"
          id="nav-tab-vault"
        >
          {activeTab === "vault" && (
            <span 
              className="absolute -top-2 w-6 h-[3px] rounded-full bg-blue-500 transition-all" 
            />
          )}
          <div className="relative">
            <Cloud 
              className={`w-5 h-5 transition-transform group-active:scale-90 ${
                activeTab === "vault" 
                  ? "text-blue-500 stroke-[2.5]" 
                  : isDark ? "text-neutral-500" : "text-neutral-400"
              }`} 
            />
            <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-emerald-500" />
          </div>
          <span 
            className={`text-[10px] tracking-tight mt-0.5 ${
              activeTab === "vault" 
                ? "font-extrabold text-blue-600 dark:text-blue-400" 
                : isDark ? "font-medium text-neutral-500" : "font-medium text-neutral-400"
            }`}
          >
            Vault
          </span>
        </button>

      </div>
    </nav>
  );
};
