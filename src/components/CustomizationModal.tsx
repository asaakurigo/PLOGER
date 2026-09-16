import React, { useState } from "react";
import { 
  X, 
  Sparkles, 
  Palette, 
  Volume2, 
  Layout, 
  Sliders, 
  Check, 
  RotateCw, 
  Play, 
  Wand2,
  Code2
} from "lucide-react";
import { 
  ThemeConfig, 
  ThemeType, 
  CustomizationSettings, 
  LandingTab, 
  AudioFeedbackSound, 
  WidgetStyle 
} from "../types";
import { playAudioFeedback } from "../utils/audio";

interface CustomizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  themeConfig: ThemeConfig;
  customSettings: CustomizationSettings;
  onUpdateTheme: (cfg: ThemeConfig) => void;
  onUpdateSettings: (settings: CustomizationSettings) => void;
}

const THEMES: Array<{ id: ThemeType; name: string; desc: string; accent: string }> = [
  { id: "Neon Cyber", name: "Neon Cyber", desc: "Electric lime & cyans on dark HUD canvas", accent: "#39ff14" },
  { id: "Y2K Digicam", name: "Y2K Digicam", desc: "Silver metallic, 2004 LCD timestamps & cyber pink", accent: "#ff007f" },
  { id: "Minimal Glass", name: "Minimal Glass", desc: "Frosted translucent glass & monochromatic chic", accent: "#00f0ff" },
  { id: "Muted Earth", name: "Muted Earth", desc: "Terracotta, sand & olive lo-fi textures", accent: "#10b981" },
  { id: "Sunset Retro", name: "Sunset Retro", desc: "Deep dusk violet, tangerine nostalgia glow", accent: "#ff7700" },
];

const ACCENT_COLORS = [
  { hex: "#39ff14", name: "Electric Lime" },
  { hex: "#ff007f", name: "Cyber Pink" },
  { hex: "#00f0ff", name: "Hyper Cyan" },
  { hex: "#ff7700", name: "Sunset Orange" },
  { hex: "#8b5cf6", name: "Digital Violet" },
  { hex: "#10b981", name: "Digicam Green" },
];

const FONTS: Array<ThemeConfig["fontFamily"]> = [
  "Plus Jakarta Sans",
  "Syne",
  "Space Mono",
  "VT323",
];

const WIDGET_STYLES: Array<{ id: WidgetStyle; name: string }> = [
  { id: "Digicam Viewfinder", name: "Digicam Viewfinder" },
  { id: "Clean Neo-Card", name: "Clean Neo-Card" },
  { id: "Cyber HUD", name: "Cyber HUD" },
  { id: "Polaroid Peel", name: "Polaroid Peel" },
];

const LANDING_TABS: LandingTab[] = [
  "Live Stream",
  "Interactive Map",
  "Shared Dumps",
  "AI Buddy Chat",
];

const AUDIO_FEEDBACKS: Array<{ id: AudioFeedbackSound; name: string; desc: string }> = [
  { id: "shutter", name: "Mechanical Shutter", desc: "Authentic camera mirror & curtain click" },
  { id: "digicam_beep", name: "2000s Digicam Beep", desc: "Classic LCD focus confirmation tone" },
  { id: "pop_chime", name: "Bubble Pop", desc: "Crisp high-frequency social chime" },
  { id: "cyber_chirp", name: "Cyber HUD Chirp", desc: "8-bit futuristic interface chirp" },
];

export const CustomizationModal: React.FC<CustomizationModalProps> = ({
  isOpen,
  onClose,
  themeConfig,
  customSettings,
  onUpdateTheme,
  onUpdateSettings,
}) => {
  const [aiWish, setAiWish] = useState("");
  const [isAiStyling, setIsAiStyling] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // AI Assistant Engine customization
  const handleAiAutoStyle = async () => {
    if (!aiWish.trim()) return;
    setIsAiStyling(true);
    playAudioFeedback("cyber_chirp", customSettings.hapticEnabled);

    try {
      const res = await fetch("/api/buddy/configure-customization", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userWish: aiWish, currentConfig: themeConfig }),
      });
      const data = await res.json();
      if (data.theme_config) {
        onUpdateTheme({
          ...themeConfig,
          theme: data.theme_config.theme || themeConfig.theme,
          accentColor: data.theme_config.accentColor || themeConfig.accentColor,
          fontFamily: data.theme_config.fontFamily || themeConfig.fontFamily,
          widgetStyle: data.theme_config.widgetStyle || themeConfig.widgetStyle,
        });
      }
      if (data.customization_settings) {
        onUpdateSettings({
          ...customSettings,
          audioFeedbackSound: data.customization_settings.audioFeedbackSound || customSettings.audioFeedbackSound,
          primaryLandingTab: data.customization_settings.primaryLandingTab || customSettings.primaryLandingTab,
        });
      }
      setAiSuccessMessage(data.buddy_commentary || "Customization applied instantly!");
      playAudioFeedback("pop_chime", customSettings.hapticEnabled);
    } catch (err) {
      console.error("AI customization error:", err);
    } finally {
      setIsAiStyling(false);
    }
  };

  const handleTestSound = (sound: AudioFeedbackSound) => {
    playAudioFeedback(sound, true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in">
      <div 
        className="w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border flex flex-col max-h-[90vh]"
        style={{
          backgroundColor: "#121620",
          borderColor: `${themeConfig.accentColor}50`,
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5">
            <Palette className="w-5 h-5 text-amber-400" />
            <div>
              <h2 className="text-base font-bold font-syne text-white uppercase tracking-wider">
                UI Management & Customization Engine
              </h2>
              <p className="text-[11px] text-white/50">Personalize your Ploger interface & triggers</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 space-y-6 overflow-y-auto">
          
          {/* AI Styling Prompt Box */}
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2.5">
            <div className="flex items-center gap-2 text-xs font-bold text-white">
              <Wand2 className="w-4 h-4 text-cyan-400" />
              <span>Ask AI Engine to Re-Style Ploger</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={aiWish}
                onChange={(e) => setAiWish(e.target.value)}
                placeholder="e.g., 'Make it look like a 2004 Tokyo underground arcade'"
                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none focus:border-white/30"
              />
              <button
                onClick={handleAiAutoStyle}
                disabled={isAiStyling || !aiWish.trim()}
                className="px-4 py-2 rounded-xl text-xs font-bold text-black flex items-center gap-1.5 transition-transform active:scale-95 disabled:opacity-40"
                style={{ backgroundColor: themeConfig.accentColor }}
              >
                {isAiStyling ? <RotateCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                <span>Style</span>
              </button>
            </div>
            {aiSuccessMessage && (
              <p className="text-xs text-emerald-300 italic pt-1">
                ✓ {aiSuccessMessage}
              </p>
            )}
          </div>

          {/* 1. UI Themes */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">
              1. UI Aesthetic Themes
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {THEMES.map((thm) => {
                const isSelected = themeConfig.theme === thm.id;
                return (
                  <button
                    key={thm.id}
                    onClick={() => {
                      playAudioFeedback(customSettings.audioFeedbackSound, customSettings.hapticEnabled);
                      onUpdateTheme({ ...themeConfig, theme: thm.id, accentColor: thm.accent });
                    }}
                    className={`p-3 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? "bg-white/15 border-white text-white shadow-lg"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-white">{thm.name}</span>
                      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: thm.accent }} />
                    </div>
                    <p className="text-[11px] text-white/50 leading-relaxed">{thm.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Accent Color Palette */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">
              2. Custom Accent Color
            </label>
            <div className="flex items-center gap-3 flex-wrap">
              {ACCENT_COLORS.map((col) => {
                const isSelected = themeConfig.accentColor.toLowerCase() === col.hex.toLowerCase();
                return (
                  <button
                    key={col.hex}
                    onClick={() => {
                      playAudioFeedback(customSettings.audioFeedbackSound, customSettings.hapticEnabled);
                      onUpdateTheme({ ...themeConfig, accentColor: col.hex });
                    }}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border text-xs transition-all ${
                      isSelected 
                        ? "bg-white/20 border-white text-white font-bold scale-105" 
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: col.hex }} />
                    <span>{col.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 3. Typography & Font Family */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">
              3. Interface Typography
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {FONTS.map((font) => {
                const isSelected = themeConfig.fontFamily === font;
                return (
                  <button
                    key={font}
                    onClick={() => {
                      playAudioFeedback(customSettings.audioFeedbackSound, customSettings.hapticEnabled);
                      onUpdateTheme({ ...themeConfig, fontFamily: font });
                    }}
                    className={`p-2.5 rounded-xl text-center border transition-all text-xs ${
                      isSelected
                        ? "bg-white text-black font-bold border-white"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {font}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Widget Style */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">
              4. Widget Style
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {WIDGET_STYLES.map((ws) => {
                const isSelected = themeConfig.widgetStyle === ws.id;
                return (
                  <button
                    key={ws.id}
                    onClick={() => {
                      playAudioFeedback(customSettings.audioFeedbackSound, customSettings.hapticEnabled);
                      onUpdateTheme({ ...themeConfig, widgetStyle: ws.id });
                    }}
                    className={`p-2 rounded-xl text-center border transition-all text-xs ${
                      isSelected
                        ? "bg-white text-black font-bold border-white"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {ws.name}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Dynamic Layout Ordering / Primary Landing Tab */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">
              5. Dynamic Landing Tab Ordering
            </label>
            <p className="text-[11px] text-white/50">
              Pin which tab Ploger boots into when you open the app:
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LANDING_TABS.map((tab) => {
                const isSelected = customSettings.primaryLandingTab === tab;
                return (
                  <button
                    key={tab}
                    onClick={() => {
                      playAudioFeedback(customSettings.audioFeedbackSound, customSettings.hapticEnabled);
                      onUpdateSettings({ ...customSettings, primaryLandingTab: tab });
                    }}
                    className={`p-2.5 rounded-xl text-center border transition-all text-xs ${
                      isSelected
                        ? "bg-white text-black font-bold border-white shadow-md"
                        : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"
                    }`}
                  >
                    {tab}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 6. Haptic & Audio Feedback Triggers */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">
                6. Custom Haptic & Audio Feedback Triggers
              </label>
              <button
                onClick={() => {
                  const nextState = !customSettings.hapticEnabled;
                  onUpdateSettings({ ...customSettings, hapticEnabled: nextState });
                  playAudioFeedback("pop_chime", nextState);
                }}
                className={`text-xs px-2.5 py-1 rounded-full border transition-colors ${
                  customSettings.hapticEnabled 
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40" 
                    : "bg-white/5 text-white/40 border-white/10"
                }`}
              >
                {customSettings.hapticEnabled ? "Audio & Haptics ON" : "Muted"}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {AUDIO_FEEDBACKS.map((snd) => {
                const isSelected = customSettings.audioFeedbackSound === snd.id;
                return (
                  <div
                    key={snd.id}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                      isSelected
                        ? "bg-white/15 border-white text-white font-medium"
                        : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                    }`}
                  >
                    <button
                      onClick={() => {
                        onUpdateSettings({ ...customSettings, audioFeedbackSound: snd.id });
                        handleTestSound(snd.id);
                      }}
                      className="text-left flex-1"
                    >
                      <p className="font-bold text-xs text-white">{snd.name}</p>
                      <p className="text-[10px] text-white/50">{snd.desc}</p>
                    </button>

                    <button
                      onClick={() => handleTestSound(snd.id)}
                      title="Test Audio"
                      className="w-7 h-7 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/80 transition-colors ml-2"
                    >
                      <Play className="w-3 h-3 fill-white" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-white/10 bg-black/40 flex items-center justify-end">
          <button
            onClick={() => {
              playAudioFeedback("digicam_beep", customSettings.hapticEnabled);
              onClose();
            }}
            className="px-5 py-2 rounded-xl text-xs font-bold text-black shadow-lg"
            style={{ backgroundColor: themeConfig.accentColor }}
          >
            Apply Settings
          </button>
        </div>

      </div>
    </div>
  );
};
