import React, { useState } from "react";
import { 
  MapPin, 
  Navigation, 
  Sparkles, 
  Camera, 
  Compass, 
  Flame, 
  Layers, 
  Clock, 
  ChevronRight,
  Maximize2
} from "lucide-react";
import { PhotoPost, ThemeConfig, CustomizationSettings } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface InteractiveMapViewProps {
  posts: PhotoPost[];
  themeConfig: ThemeConfig;
  customSettings: CustomizationSettings;
  onOpenSnapper: () => void;
}

export const InteractiveMapView: React.FC<InteractiveMapViewProps> = ({
  posts,
  themeConfig,
  customSettings,
  onOpenSnapper,
}) => {
  const [selectedPost, setSelectedPost] = useState<PhotoPost | null>(posts[0] || null);
  const [activeZone, setActiveZone] = useState<string>("All Zones");

  // Filter posts with location data
  const locationPosts = posts.filter((p) => p.location);

  return (
    <div className="space-y-4 max-w-4xl mx-auto pb-20">
      
      {/* Map Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-cyan-400 animate-spin-slow" />
            <h2 className="text-xl font-bold font-syne tracking-tight text-white uppercase">
              Interactive Live Map
            </h2>
          </div>
          <p className="text-xs text-white/50 mt-0.5">
            Real-time geolocation-tagged photo dumps & late night spots
          </p>
        </div>

        <button
          onClick={() => {
            playAudioFeedback("shutter", customSettings.hapticEnabled);
            onOpenSnapper();
          }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-black shadow-md hover:opacity-95"
          style={{ backgroundColor: themeConfig.accentColor }}
        >
          <Camera className="w-3.5 h-3.5" />
          <span>Tag My Spot</span>
        </button>
      </div>

      {/* Radar Map Canvas Representation */}
      <div 
        className="relative w-full h-[420px] rounded-3xl overflow-hidden border shadow-2xl flex items-center justify-center"
        style={{
          backgroundColor: "#0c1018",
          borderColor: "rgba(255, 255, 255, 0.1)",
        }}
      >
        {/* Futuristic / Cyber Grid Background */}
        <div 
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: `radial-gradient(${themeConfig.accentColor} 1px, transparent 1px), radial-gradient(rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "28px 28px",
            backgroundPosition: "0 0, 14px 14px",
          }}
        />

        {/* Radar concentric rings */}
        <div className="absolute w-[500px] h-[500px] rounded-full border border-cyan-500/10 pointer-events-none" />
        <div className="absolute w-[360px] h-[360px] rounded-full border border-cyan-500/15 pointer-events-none" />
        <div className="absolute w-[220px] h-[220px] rounded-full border border-cyan-500/20 pointer-events-none" />
        <div className="absolute w-[80px] h-[80px] rounded-full border border-cyan-500/30 bg-cyan-500/5 pointer-events-none animate-pulse" />

        {/* Radar Scanner Sweep */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div 
            className="w-full h-0.5 opacity-25"
            style={{ 
              background: `linear-gradient(90deg, transparent, ${themeConfig.accentColor}, transparent)` 
            }}
          />
        </div>

        {/* Top Floating Map Controls */}
        <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-black/70 backdrop-blur border border-white/10 text-xs font-mono text-white/80 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>5 HOTSPOTS ACTIVE</span>
          </div>
        </div>

        <div className="absolute top-4 right-4 z-10">
          <div className="px-2.5 py-1 rounded-full bg-black/70 backdrop-blur border border-white/10 text-[11px] font-mono text-white/60">
            LAT 40.7180° N • LON -73.9870° W
          </div>
        </div>

        {/* Interactive Map Pins */}
        {locationPosts.map((post, idx) => {
          // Calculate stylized coordinates for the radar display
          const offsets = [
            { top: "32%", left: "42%" },
            { top: "62%", left: "68%" },
            { top: "25%", left: "75%" },
            { top: "72%", left: "28%" },
            { top: "45%", left: "20%" },
          ];
          const pos = offsets[idx % offsets.length];
          const isSelected = selectedPost?.id === post.id;

          return (
            <div
              key={post.id}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 transition-all duration-300 z-20"
              style={{ top: pos.top, left: pos.left }}
            >
              <button
                onClick={() => {
                  playAudioFeedback("pop_chime", customSettings.hapticEnabled);
                  setSelectedPost(post);
                }}
                className={`group relative flex items-center justify-center transition-all ${
                  isSelected ? "scale-125 z-30" : "hover:scale-110"
                }`}
              >
                {/* Ripple ring for selected */}
                {isSelected && (
                  <span 
                    className="absolute w-12 h-12 rounded-full animate-ping opacity-40 pointer-events-none"
                    style={{ backgroundColor: themeConfig.accentColor }}
                  />
                )}

                {/* Avatar Pin with Border */}
                <div 
                  className={`w-10 h-10 rounded-2xl overflow-hidden border-2 shadow-xl flex items-center justify-center p-0.5 transition-all ${
                    isSelected ? "ring-4 ring-white/40" : ""
                  }`}
                  style={{ 
                    backgroundColor: isSelected ? themeConfig.accentColor : "#1a202c",
                    borderColor: isSelected ? "#fff" : themeConfig.accentColor 
                  }}
                >
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover rounded-xl"
                  />
                </div>

                {/* Pin Tooltip */}
                <div 
                  className={`absolute top-11 whitespace-nowrap px-2 py-0.5 rounded-md text-[10px] font-mono font-bold backdrop-blur border transition-all ${
                    isSelected 
                      ? "bg-white text-black border-white shadow-lg" 
                      : "bg-black/80 text-white/80 border-white/20 opacity-0 group-hover:opacity-100"
                  }`}
                >
                  {post.location?.name.split(",")[0]}
                </div>
              </button>
            </div>
          );
        })}

        {/* Selected Pin Snapshot Popover (Bottom overlay) */}
        {selectedPost && (
          <div 
            className="absolute bottom-4 inset-x-4 max-w-md mx-auto p-3.5 rounded-2xl border backdrop-blur-xl z-30 shadow-2xl flex items-center gap-3.5 animate-in fade-in slide-in-from-bottom-2"
            style={{
              backgroundColor: "rgba(15, 18, 26, 0.95)",
              borderColor: `${themeConfig.accentColor}50`,
            }}
          >
            <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 relative border border-white/10">
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.caption}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-1 right-1 digicam-stamp text-[9px] pointer-events-none">
                '26
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {selectedPost.sentimentCategory}
                </span>
                <span className="text-[10px] text-white/40 font-mono">
                  {selectedPost.timestamp}
                </span>
              </div>
              <p className="font-bold text-xs text-white truncate mt-0.5">
                {selectedPost.location?.name}
              </p>
              <p className="text-[11px] text-white/70 italic truncate mt-0.5">
                "{selectedPost.caption}"
              </p>
            </div>

            <button
              onClick={() => {
                playAudioFeedback("digicam_beep", customSettings.hapticEnabled);
                onOpenSnapper();
              }}
              className="px-3 py-2 rounded-xl text-xs font-bold text-black flex-shrink-0"
              style={{ backgroundColor: themeConfig.accentColor }}
            >
              Snap Here
            </button>
          </div>
        )}

      </div>

      {/* Spot List Feed */}
      <div className="space-y-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 font-mono">
          Nearby Photo Hotspots & Dumps
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {locationPosts.map((post) => (
            <div
              key={post.id}
              onClick={() => {
                playAudioFeedback("pop_chime", customSettings.hapticEnabled);
                setSelectedPost(post);
              }}
              className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 cursor-pointer flex items-center gap-3 transition-colors"
            >
              <img
                src={post.imageUrl}
                alt={post.caption}
                className="w-12 h-12 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-white truncate">
                    {post.location?.name}
                  </span>
                  <span className="text-[10px] text-white/40 font-mono">{post.timestamp}</span>
                </div>
                <p className="text-[11px] text-white/60 truncate mt-0.5">
                  @{post.author.username}: {post.caption}
                </p>
              </div>
              <ChevronRight className="w-4 h-4 text-white/30 flex-shrink-0" />
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
