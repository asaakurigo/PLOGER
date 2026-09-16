import React, { useState } from "react";
import { 
  Sparkles, 
  Camera, 
  Settings2, 
  Info, 
  Volume2, 
  VolumeX, 
  Radio, 
  ShieldCheck, 
  ChevronDown,
  Flame,
  Zap,
  Bot
} from "lucide-react";
import { BuddyPersona, ThemeConfig, CustomizationSettings } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface NavbarProps {
  currentPersona: BuddyPersona;
  onSelectPersona: (persona: BuddyPersona) => void;
  themeConfig: ThemeConfig;
  customSettings: CustomizationSettings;
  onOpenCustomizer: () => void;
  onOpenAbout: () => void;
  onOpenSnapper: () => void;
  onToggleSound: () => void;
}

const PERSONA_BADGES: Record<BuddyPersona, { emoji: string; color: string; tag: string }> = {
  "Unhinged Bestie": { emoji: "⚡", color: "text-amber-400 bg-amber-400/10 border-amber-400/30", tag: "Chaotic" },
  "Hype Man": { emoji: "🔥", color: "text-rose-400 bg-rose-400/10 border-rose-400/30", tag: "1000% Gas" },
  "Sarcastic Critic": { emoji: "💅", color: "text-fuchsia-400 bg-fuchsia-400/10 border-fuchsia-400/30", tag: "Playful Shade" },
  "Chill Study Buddy": { emoji: "🎧", color: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30", tag: "Lo-Fi Calm" },
  "Y2K Nostalgic": { emoji: "💾", color: "text-cyan-400 bg-cyan-400/10 border-cyan-400/30", tag: "2004 Digicam" },
  "Professional Tech Assistant": { emoji: "🤖", color: "text-blue-400 bg-blue-400/10 border-blue-400/30", tag: "Engine Schema" },
};

export const Navbar: React.FC<NavbarProps> = ({
  currentPersona,
  onSelectPersona,
  themeConfig,
  customSettings,
  onOpenCustomizer,
  onOpenAbout,
  onOpenSnapper,
  onToggleSound,
}) => {
  const [showPersonaMenu, setShowPersonaMenu] = useState(false);

  const handlePersonaChange = (p: BuddyPersona) => {
    playAudioFeedback(customSettings.audioFeedbackSound, customSettings.hapticEnabled);
    onSelectPersona(p);
    setShowPersonaMenu(false);
  };

  return (
    <header 
      id="snaplog-header"
      className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-200"
      style={{
        borderColor: `${themeConfig.accentColor}30`,
        background: themeConfig.theme === "Neon Cyber" 
          ? "rgba(10, 15, 20, 0.9)" 
          : themeConfig.theme === "Y2K Digicam"
          ? "rgba(235, 240, 245, 0.9)"
          : themeConfig.theme === "Muted Earth"
          ? "rgba(28, 30, 26, 0.9)"
          : themeConfig.theme === "Sunset Retro"
          ? "rgba(35, 18, 42, 0.9)"
          : "rgba(18, 18, 22, 0.85)"
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => {
              playAudioFeedback("pop_chime", customSettings.hapticEnabled);
            }}
            className="flex items-center gap-2 group text-left focus:outline-none"
          >
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-xl shadow-lg transition-transform group-hover:scale-105"
              style={{ 
                background: `linear-gradient(135deg, ${themeConfig.accentColor}, #ec4899)`,
                color: "#000" 
              }}
            >
              ⚡
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-wider text-xl font-syne uppercase">
                  PLOGER
                </span>
                <span className="text-[10px] px-1.5 py-0.5 rounded font-mono font-bold bg-white/10 text-white/70">
                  GEN Z
                </span>
              </div>
              <p className="text-[10px] text-white/50 tracking-tight leading-none hidden sm:block">
                REAL-TIME SOCIAL & VAULT
              </p>
            </div>
          </button>

          {/* Digicam Live Status */}
          <div className="hidden lg:flex items-center gap-2 ml-4 px-2.5 py-1 rounded-full bg-black/30 border border-white/10 text-[11px] font-mono">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse"></span>
            <span className="text-rose-400 font-bold">REC</span>
            <span className="text-white/60">00:00:14</span>
            <span className="text-white/20">|</span>
            <span className="text-emerald-400">ARCHIVE ON</span>
          </div>
        </div>

        {/* Center: PLOGER BUDDY Persona Switcher */}
        <div className="relative">
          <button
            id="persona-switcher-btn"
            onClick={() => setShowPersonaMenu(!showPersonaMenu)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs font-semibold transition-all hover:brightness-110 shadow-sm ${PERSONA_BADGES[currentPersona].color}`}
          >
            <span className="text-sm">{PERSONA_BADGES[currentPersona].emoji}</span>
            <span className="hidden md:inline font-medium">BUDDY:</span>
            <span className="font-bold">{currentPersona}</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${showPersonaMenu ? "rotate-180" : ""}`} />
          </button>

          {showPersonaMenu && (
            <div 
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 rounded-2xl p-2 shadow-2xl backdrop-blur-xl border z-50 animate-in fade-in zoom-in-95"
              style={{
                backgroundColor: "rgba(15, 18, 24, 0.97)",
                borderColor: `${themeConfig.accentColor}50`
              }}
            >
              <div className="px-3 py-2 border-b border-white/10 mb-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-white/40">
                  PLOGER BUDDY CONSTITUTION
                </p>
                <p className="text-xs text-white/80 font-medium">Switch Companion Persona</p>
              </div>

              <div className="space-y-1 max-h-72 overflow-y-auto">
                {(Object.keys(PERSONA_PROMPTS_NAMES) as BuddyPersona[]).map((p) => {
                  const badge = PERSONA_BADGES[p];
                  const isSelected = currentPersona === p;
                  return (
                    <button
                      key={p}
                      onClick={() => handlePersonaChange(p)}
                      className={`w-full text-left px-3 py-2 rounded-xl text-xs flex items-center justify-between transition-colors ${
                        isSelected 
                          ? "bg-white/15 text-white font-bold" 
                          : "text-white/70 hover:bg-white/5 hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-base">{badge.emoji}</span>
                        <div>
                          <p className="font-semibold text-white/90">{p}</p>
                          <p className="text-[10px] text-white/50">{badge.tag}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <span className="w-1.5 h-1.5 rounded-full" style={{ background: themeConfig.accentColor }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Quick Camera Snapshot Button */}
          <button
            id="open-digicam-btn"
            onClick={() => {
              playAudioFeedback("shutter", customSettings.hapticEnabled);
              onOpenSnapper();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-bold text-xs shadow-lg transition-transform active:scale-95 text-black hover:opacity-95"
            style={{
              backgroundColor: themeConfig.accentColor,
              boxShadow: `0 0 16px ${themeConfig.accentColor}60`
            }}
          >
            <Camera className="w-4 h-4" />
            <span className="hidden sm:inline">SNAP NOW</span>
          </button>

          {/* Sound Mute/Toggle */}
          <button
            onClick={onToggleSound}
            title={customSettings.hapticEnabled ? "Mute Feedback Sounds" : "Enable Feedback Sounds"}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/70 hover:text-white transition-colors"
          >
            {customSettings.hapticEnabled ? (
              <Volume2 className="w-4 h-4 text-emerald-400" />
            ) : (
              <VolumeX className="w-4 h-4 text-white/40" />
            )}
          </button>

          {/* Customization Engine */}
          <button
            id="open-customizer-btn"
            onClick={() => {
              playAudioFeedback(customSettings.audioFeedbackSound, customSettings.hapticEnabled);
              onOpenCustomizer();
            }}
            title="UI Customization Engine"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors"
          >
            <Settings2 className="w-4 h-4" />
          </button>

          {/* About / Brand Info */}
          <button
            id="open-about-btn"
            onClick={() => {
              playAudioFeedback("pop_chime", customSettings.hapticEnabled);
              onOpenAbout();
            }}
            title="About & Company Info"
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 border border-white/10 text-white/80 hover:text-white transition-colors"
          >
            <Info className="w-4 h-4" />
          </button>
        </div>

      </div>
    </header>
  );
};

const PERSONA_PROMPTS_NAMES: Record<BuddyPersona, string> = {
  "Unhinged Bestie": "Unhinged Bestie",
  "Hype Man": "Hype Man",
  "Sarcastic Critic": "Sarcastic Critic",
  "Chill Study Buddy": "Chill Study Buddy",
  "Y2K Nostalgic": "Y2K Nostalgic",
  "Professional Tech Assistant": "Professional Tech Assistant",
};
