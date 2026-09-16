import React, { useState } from "react";
import { X, Sparkles, RefreshCw, Share2, Film, Check, Calendar, Flame } from "lucide-react";
import { PhotoPost } from "../types";
import { playAudioFeedback } from "../utils/audio";
import { MOCK_WEEKLY_DUMP } from "../data/mockPosts";

interface SnapscapeWeeklyDumpModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPublishDump: (post: PhotoPost) => void;
  allPosts: PhotoPost[];
}

export const SnapscapeWeeklyDumpModal: React.FC<SnapscapeWeeklyDumpModalProps> = ({
  isOpen,
  onClose,
  onPublishDump,
  allPosts,
}) => {
  const [photos, setPhotos] = useState<string[]>(MOCK_WEEKLY_DUMP.photos);
  const [caption, setCaption] = useState(MOCK_WEEKLY_DUMP.caption);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  if (!isOpen) return null;

  const handleShuffleRoll = () => {
    setIsRegenerating(true);
    playAudioFeedback("digicam_beep", true);
    setTimeout(() => {
      // Pick random photos from allPosts
      const shuffled = [...allPosts]
        .sort(() => 0.5 - Math.random())
        .slice(0, 4)
        .map((p) => p.imageUrl);
      if (shuffled.length >= 2) {
        setPhotos(shuffled);
      }
      setIsRegenerating(false);
      playAudioFeedback("pop_chime", true);
    }, 500);
  };

  const handlePublish = () => {
    setIsPublishing(true);
    playAudioFeedback("shutter", true);

    setTimeout(() => {
      const newPost: PhotoPost = {
        id: `dump-${Date.now()}`,
        author: {
          username: "you",
          avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
          streak: 35,
        },
        imageUrl: photos[0],
        caption: caption,
        timestamp: "Just now",
        isoDate: new Date().toISOString(),
        location: {
          name: "Sunday Night Auto-Collage",
          coords: [40.7128, -74.006],
        },
        sentimentCategory: "Dump of the Week",
        reactions: {
          fire: 1,
          skull: 0,
          nails: 0,
          sparkles: 5,
          lightning: 2,
          sob: 0,
        },
        commentsCount: 0,
        comments: [],
        digicamMetadata: {
          dateStamp: "'26 09 16 23:59",
          iso: "ISO 400",
          filterApplied: "Sunday Night Auto-Dump",
          archivedAt: "Archived to Weekly Carousel #37",
          shutterSpeed: "Multi-Frame Burst",
        },
        audioTag: {
          id: `audio-dump-${Date.now()}`,
          title: "Sunday Chill Bedroom Tape",
          category: "ambient",
          duration: 5,
          presetId: "indie_bedroom",
        },
        ephemeralHoursLeft: 48,
        isPinned: false,
      };

      onPublishDump(newPost);
      setIsPublishing(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
      <div className="w-full max-w-lg bg-[#14161E] text-white rounded-3xl border border-amber-500/20 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header */}
        <div className="px-5 py-3.5 bg-gradient-to-r from-amber-950/40 via-purple-950/30 to-black/60 border-b border-white/10 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400">
              <Film className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm tracking-wide text-amber-200">Sunday Night Dump of the Week</h3>
                <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 text-[9px] font-mono font-bold">
                  AUTO-COLLAGE
                </span>
              </div>
              <p className="text-[11px] text-white/50">{MOCK_WEEKLY_DUMP.dates} • Week 37</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Digicam Curation Banner */}
        <div className="px-5 py-2.5 bg-amber-500/10 border-b border-amber-500/15 flex items-center justify-between text-xs text-amber-200/90">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="text-[11px]">84 candid camera-roll frames scanned automatically on Sunday night.</span>
          </div>
          <div className="flex items-center gap-1 font-mono font-bold text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full text-[10px]">
            <Flame className="w-3 h-3 text-orange-400" />
            <span>Vibe: 98%</span>
          </div>
        </div>

        {/* 4-Photo Candid Scrapbook Grid */}
        <div className="p-4 overflow-y-auto space-y-4">
          <div className="grid grid-cols-2 gap-3 p-3 bg-black/40 rounded-2xl border border-white/5 relative">
            {/* Vintage Polaroid Tape Decor */}
            <div className="absolute -top-2.5 left-8 px-4 py-0.5 bg-yellow-100/30 backdrop-blur-sm border border-yellow-200/40 text-[9px] font-mono text-yellow-100 uppercase tracking-widest -rotate-2 z-10 shadow-sm">
              TAPE // CANDID_01
            </div>
            <div className="absolute -bottom-2.5 right-8 px-4 py-0.5 bg-pink-500/30 backdrop-blur-sm border border-pink-400/40 text-[9px] font-mono text-pink-200 uppercase tracking-widest rotate-2 z-10 shadow-sm">
              WEEK_37_PURGE
            </div>

            {photos.map((src, idx) => (
              <div 
                key={idx} 
                className={`group relative aspect-[4/5] rounded-xl overflow-hidden bg-neutral-900 border border-white/10 transition-transform ${
                  idx === 0 ? "rotate-[-1deg]" : idx === 1 ? "rotate-[1.5deg]" : idx === 2 ? "rotate-[1deg]" : "rotate-[-1.5deg]"
                } hover:rotate-0 hover:scale-[1.02]`}
              >
                <img 
                  src={src} 
                  alt={`Candid frame ${idx + 1}`} 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute bottom-1 right-1.5 px-1.5 py-0.5 rounded bg-black/70 font-mono text-[9px] text-amber-300 tracking-wider">
                  '26 09 16 #{idx + 1}
                </div>
              </div>
            ))}
          </div>

          {/* AI Auto-Generated Caption Field */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <label className="text-white/60 font-mono text-[11px]">Draft Carousel Caption</label>
              <button 
                onClick={handleShuffleRoll} 
                disabled={isRegenerating}
                className="text-[11px] text-amber-400 hover:text-amber-300 flex items-center gap-1 font-mono transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isRegenerating ? "animate-spin" : ""}`} />
                <span>Shuffle Candid Roll</span>
              </button>
            </div>
            <input 
              type="text" 
              value={caption} 
              onChange={(e) => setCaption(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400 transition-colors"
            />
          </div>

          {/* AI Observation Card */}
          <div className="p-3 rounded-xl bg-purple-950/20 border border-purple-500/20 flex items-start gap-2.5">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <p className="text-xs text-purple-200/80 leading-relaxed font-sans">
              "{MOCK_WEEKLY_DUMP.aiSummary}"
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3.5 bg-black/60 border-t border-white/10 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-full text-xs text-white/60 hover:text-white transition-colors"
          >
            Keep in Camera Roll
          </button>
          <button
            onClick={handlePublish}
            disabled={isPublishing}
            className="px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all active:scale-95"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isPublishing ? "Publishing Dump..." : "Publish Dump to Feed"}</span>
          </button>
        </div>

      </div>
    </div>
  );
};
