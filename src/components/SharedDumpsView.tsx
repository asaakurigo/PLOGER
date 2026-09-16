import React, { useState } from "react";
import { 
  Archive, 
  Sparkles, 
  Calendar, 
  Layers, 
  RotateCw, 
  Flame, 
  TrendingUp, 
  Clock, 
  FolderSync, 
  Share2,
  Bot,
  Zap,
  CheckCircle2
} from "lucide-react";
import { PhotoPost, ThemeConfig, CustomizationSettings, BuddyPersona, WeeklyRecapData } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface SharedDumpsViewProps {
  posts: PhotoPost[];
  themeConfig: ThemeConfig;
  customSettings: CustomizationSettings;
  currentPersona: BuddyPersona;
  onOpenSnapper: () => void;
}

export const SharedDumpsView: React.FC<SharedDumpsViewProps> = ({
  posts,
  themeConfig,
  customSettings,
  currentPersona,
  onOpenSnapper,
}) => {
  const [activeFilter, setActiveFilter] = useState<string>("All Dumps");
  const [isGeneratingRecap, setIsGeneratingRecap] = useState(false);
  const [recapData, setRecapData] = useState<WeeklyRecapData | null>(null);
  const [organizeSuccess, setOrganizeSuccess] = useState(false);

  // Generate Weekly Recap from AI Buddy
  const handleGenerateRecap = async () => {
    playAudioFeedback("digicam_beep", customSettings.hapticEnabled);
    setIsGeneratingRecap(true);
    try {
      const topStreams = Array.from(new Set(posts.map((p) => p.sentimentCategory)));
      const res = await fetch("/api/buddy/recap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          snapsCount: posts.length,
          topStreams,
          persona: currentPersona,
        }),
      });
      const data = await res.json();
      setRecapData(data);
      playAudioFeedback("pop_chime", customSettings.hapticEnabled);
    } catch (err) {
      console.error("Recap generation error:", err);
    } finally {
      setIsGeneratingRecap(false);
    }
  };

  const handleAutoOrganizeStreams = () => {
    playAudioFeedback("cyber_chirp", customSettings.hapticEnabled);
    setOrganizeSuccess(true);
    setTimeout(() => setOrganizeSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-20">
      
      {/* Archive Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Archive className="w-5 h-5 text-amber-400" />
            <h2 className="text-xl font-bold font-syne tracking-tight text-white uppercase">
              Shared Dumps & Memory Vault
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-0.5">
            Automatic background archiving engine • {posts.length} Raw snaps stored securely
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleAutoOrganizeStreams}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-white/90 border border-white/10 transition-colors"
          >
            <FolderSync className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Stream Cluster</span>
          </button>

          <button
            onClick={handleGenerateRecap}
            disabled={isGeneratingRecap}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold text-black shadow-lg transition-transform active:scale-95"
            style={{ backgroundColor: themeConfig.accentColor }}
          >
            {isGeneratingRecap ? (
              <>
                <RotateCw className="w-3.5 h-3.5 animate-spin" />
                <span>Compiling Recap...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5" />
                <span>Weekly AI Recap</span>
              </>
            )}
          </button>
        </div>
      </div>

      {organizeSuccess && (
        <div className="p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-200 text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
          <span>Ploger Engine re-clustered {posts.length} background snaps into sentiment streams automatically!</span>
        </div>
      )}

      {/* AI Weekly Recap Card if generated or preview */}
      {recapData && (
        <div 
          className="p-5 rounded-3xl border shadow-2xl space-y-4 animate-in fade-in slide-in-from-top-3"
          style={{
            backgroundColor: "rgba(22, 28, 38, 0.95)",
            borderColor: `${themeConfig.accentColor}50`,
          }}
        >
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  {recapData.top_archetype}
                </span>
                <span className="text-xs text-white/50 font-mono">Week 37 Report</span>
              </div>
              <h3 className="text-lg font-bold font-syne text-white">
                {recapData.recap_title}
              </h3>
            </div>

            <div className="text-right">
              <span className="text-[10px] font-mono text-white/50 block">CHAOS INDEX</span>
              <span 
                className="text-2xl font-black font-mono"
                style={{ color: themeConfig.accentColor }}
              >
                {recapData.chaos_index}%
              </span>
            </div>
          </div>

          <p className="text-xs text-white/80 italic leading-relaxed bg-white/5 p-3 rounded-2xl border border-white/10">
            "{recapData.vibe_summary}"
          </p>

          {/* Camera Roll Roast Callout */}
          <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-200 space-y-1">
            <span className="font-bold flex items-center gap-1 text-rose-300">
              <Flame className="w-3.5 h-3.5" />
              PLOGER BUDDY CAMERA ROLL ROAST:
            </span>
            <p className="italic">"{recapData.camera_roll_roast}"</p>
          </div>

          {/* Aesthetic Breakdown Bars */}
          {recapData.aesthetic_breakdown && (
            <div className="space-y-2 pt-1">
              <span className="text-[10px] uppercase font-mono font-bold text-white/50">
                Aesthetic Stream Distribution
              </span>
              <div className="space-y-1.5">
                {recapData.aesthetic_breakdown.map((item) => (
                  <div key={item.label} className="space-y-1">
                    <div className="flex justify-between text-[11px] font-mono text-white/70">
                      <span>{item.label}</span>
                      <span>{item.percentage}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full rounded-full transition-all duration-500"
                        style={{ 
                          width: `${item.percentage}%`,
                          backgroundColor: themeConfig.accentColor 
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Vault Stats Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-mono text-white/40 block">TOTAL LOGGED</span>
          <span className="text-xl font-bold font-mono text-white mt-1 block">
            {posts.length} snaps
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-mono text-white/40 block">ARCHIVE SYNC</span>
          <span className="text-xl font-bold font-mono text-emerald-400 mt-1 block">
            100% Active
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-mono text-white/40 block">TOP SENTIMENT</span>
          <span className="text-sm font-bold font-mono text-amber-300 mt-1.5 truncate block">
            Feels like 2 AM
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10">
          <span className="text-[10px] font-mono text-white/40 block">PRIVACY STATUS</span>
          <span className="text-sm font-bold font-mono text-cyan-300 mt-1.5 block">
            Locked & Safe
          </span>
        </div>
      </div>

      {/* Memory Dumps Grid */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/60 font-mono">
            Archived Photo Dumps Grid
          </h3>
          <span className="text-xs text-white/40 font-mono">Unedited Originals</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="group relative rounded-2xl overflow-hidden border border-white/10 bg-black/40 aspect-square shadow-lg transition-transform hover:-translate-y-1"
            >
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Digicam date stamp watermark */}
              <div className="absolute bottom-2 right-2.5 digicam-stamp text-xs pointer-events-none select-none">
                '26 09 14
              </div>

              {/* Sentiment tag pill */}
              <div className="absolute top-2 left-2">
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold font-mono bg-black/70 backdrop-blur text-white border border-white/20">
                  {post.sentimentCategory}
                </span>
              </div>

              {/* Hover overlay with caption & author */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end">
                <p className="text-xs font-bold text-white truncate">
                  @{post.author.username}
                </p>
                <p className="text-[11px] text-white/80 line-clamp-2 mt-0.5">
                  {post.caption}
                </p>
                <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mt-1.5">
                  <span>{post.timestamp}</span>
                  <span className="text-emerald-400">Archived</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
