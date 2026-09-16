import React, { useState } from "react";
import { 
  Flame, 
  MessageCircle, 
  Share2, 
  Sparkles, 
  MapPin, 
  Clock, 
  Bot, 
  Camera, 
  Heart, 
  Send, 
  Archive,
  Eye,
  SlidersHorizontal
} from "lucide-react";
import { PhotoPost, ThemeConfig, CustomizationSettings, BuddyPersona } from "../types";
import { playAudioFeedback } from "../utils/audio";

interface LiveStreamViewProps {
  posts: PhotoPost[];
  themeConfig: ThemeConfig;
  customSettings: CustomizationSettings;
  currentPersona: BuddyPersona;
  onOpenSnapper: () => void;
  onAddReaction: (postId: string, reactionType: keyof PhotoPost["reactions"]) => void;
  onAddComment: (postId: string, commentText: string) => void;
  onRequestBuddyRoast: (post: PhotoPost) => void;
}

const CATEGORIES = [
  "All Streams",
  "Feels like 2 AM",
  "Main Character Energy",
  "Brain Rot Memes",
  "Golden Hour Drift",
  "Candid Bloopers",
];

export const LiveStreamView: React.FC<LiveStreamViewProps> = ({
  posts,
  themeConfig,
  customSettings,
  currentPersona,
  onOpenSnapper,
  onAddReaction,
  onAddComment,
  onRequestBuddyRoast,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All Streams");
  const [activeCommentPostId, setActiveCommentPostId] = useState<string | null>(null);
  const [newCommentText, setNewCommentText] = useState("");

  const filteredPosts = selectedCategory === "All Streams"
    ? posts
    : posts.filter((p) => p.sentimentCategory === selectedCategory);

  const handleReactionClick = (postId: string, type: keyof PhotoPost["reactions"]) => {
    playAudioFeedback("pop_chime", customSettings.hapticEnabled);
    onAddReaction(postId, type);
  };

  const handlePostComment = (postId: string) => {
    if (!newCommentText.trim()) return;
    playAudioFeedback("digicam_beep", customSettings.hapticEnabled);
    onAddComment(postId, newCommentText.trim());
    setNewCommentText("");
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto pb-20">
      
      {/* Gen Z Fast Stream Header & Category Selector */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <h2 className="text-xl font-bold font-syne tracking-tight text-white uppercase">
                Real-Time Live Stream
              </h2>
            </div>
            <p className="text-xs text-white/50 mt-0.5">
              Unedited daily photo dumps • Background archiving enabled
            </p>
          </div>

          <button
            onClick={() => {
              playAudioFeedback("shutter", customSettings.hapticEnabled);
              onOpenSnapper();
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold text-black shadow-md hover:opacity-90 active:scale-95 transition-all"
            style={{ backgroundColor: themeConfig.accentColor }}
          >
            <Camera className="w-3.5 h-3.5" />
            <span>Drop Snap</span>
          </button>
        </div>

        {/* Sentiment Categories Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  playAudioFeedback("pop_chime", customSettings.hapticEnabled);
                  setSelectedCategory(cat);
                }}
                className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  isSelected
                    ? "bg-white text-black font-bold shadow-lg scale-105"
                    : "bg-white/5 text-white/70 hover:bg-white/10 border border-white/10 hover:text-white"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Photo Stream Posts */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="p-8 text-center rounded-3xl bg-white/5 border border-white/10 space-y-3">
            <Camera className="w-10 h-10 mx-auto text-white/30" />
            <p className="text-white font-medium">No snaps logged in "{selectedCategory}" yet</p>
            <p className="text-xs text-white/50 max-w-xs mx-auto">
              Be the first to drop an unedited digicam snapshot into this stream.
            </p>
            <button
              onClick={onOpenSnapper}
              className="px-4 py-2 rounded-full text-xs font-bold text-black"
              style={{ backgroundColor: themeConfig.accentColor }}
            >
              Take First Snap
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isCommentOpen = activeCommentPostId === post.id;

            return (
              <article
                key={post.id}
                id={`post-card-${post.id}`}
                className="rounded-3xl overflow-hidden border transition-all duration-300 shadow-xl"
                style={{
                  backgroundColor: "rgba(18, 22, 30, 0.85)",
                  borderColor: "rgba(255, 255, 255, 0.08)",
                }}
              >
                {/* Author & Timestamp Header */}
                <div className="p-4 flex items-center justify-between border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.author.avatar}
                      alt={post.author.username}
                      className="w-10 h-10 rounded-full object-cover ring-2"
                      style={{ ringColor: themeConfig.accentColor }}
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm text-white">
                          @{post.author.username}
                        </span>
                        {post.author.streak && (
                          <span className="text-[11px] font-mono px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold">
                            🔥 {post.author.streak}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-white/50">
                        <span>{post.timestamp}</span>
                        {post.location && (
                          <>
                            <span>•</span>
                            <span className="flex items-center gap-0.5 truncate max-w-[140px]">
                              <MapPin className="w-3 h-3 text-white/40" />
                              {post.location.name}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Sentiment Badge & Archiving Status */}
                  <div className="text-right">
                    <span 
                      className="px-2.5 py-1 rounded-full text-[11px] font-bold border block mb-0.5"
                      style={{
                        backgroundColor: `${themeConfig.accentColor}15`,
                        borderColor: `${themeConfig.accentColor}40`,
                        color: themeConfig.accentColor,
                      }}
                    >
                      {post.sentimentCategory}
                    </span>
                    <span className="text-[10px] font-mono text-white/40 block">
                      ARCHIVED AUTO
                    </span>
                  </div>
                </div>

                {/* Main Photo Image with Digicam Watermark */}
                <div className="relative bg-black overflow-hidden aspect-[4/3] sm:aspect-[16/11]">
                  <img
                    src={post.imageUrl}
                    alt={post.caption}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />

                  {/* Vintage Date Watermark */}
                  <div className="absolute bottom-3 right-4 digicam-stamp text-sm sm:text-base select-none pointer-events-none">
                    {post.digicamMetadata.dateStamp}
                  </div>

                  {/* Filter & ISO Overlay Tag */}
                  <div className="absolute top-3 left-3 flex items-center gap-2 select-none">
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-black/60 text-white/80 backdrop-blur border border-white/10">
                      {post.digicamMetadata.filterApplied}
                    </span>
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-black/60 text-emerald-400 backdrop-blur border border-white/10">
                      {post.digicamMetadata.iso}
                    </span>
                  </div>
                </div>

                {/* Caption & Metadata Details */}
                <div className="p-4 space-y-3">
                  <p className="text-sm text-white/90 leading-relaxed font-medium">
                    {post.caption}
                  </p>

                  {/* Ploger Buddy Commentary / Roast Callout */}
                  {post.aiAnalysis?.roast_or_commentary && (
                    <div className="p-3 rounded-2xl bg-white/5 border border-white/10 flex items-start gap-2.5">
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ backgroundColor: themeConfig.accentColor, color: "#000" }}
                      >
                        ⚡
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-bold text-white/70">
                            PLOGER BUDDY TAKE
                          </span>
                          <span className="text-[10px] font-mono text-emerald-400">
                            Vibe: {post.aiAnalysis.vibe_score}/100
                          </span>
                        </div>
                        <p className="text-xs text-white/80 italic mt-0.5">
                          "{post.aiAnalysis.roast_or_commentary}"
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Fast Gen Z Reaction Bar */}
                  <div className="flex items-center justify-between pt-1 border-t border-white/5">
                    <div className="flex items-center gap-1 sm:gap-2">
                      <button
                        onClick={() => handleReactionClick(post.id, "fire")}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                      >
                        <span>🔥</span>
                        <span>{post.reactions.fire}</span>
                      </button>

                      <button
                        onClick={() => handleReactionClick(post.id, "skull")}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                      >
                        <span>💀</span>
                        <span>{post.reactions.skull}</span>
                      </button>

                      <button
                        onClick={() => handleReactionClick(post.id, "nails")}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                      >
                        <span>💅</span>
                        <span>{post.reactions.nails}</span>
                      </button>

                      <button
                        onClick={() => handleReactionClick(post.id, "sparkles")}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                      >
                        <span>🫧</span>
                        <span>{post.reactions.sparkles}</span>
                      </button>

                      <button
                        onClick={() => handleReactionClick(post.id, "lightning")}
                        className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-mono bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
                      >
                        <span>⚡</span>
                        <span>{post.reactions.lightning}</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onRequestBuddyRoast(post)}
                        title="Ask Ploger Buddy to roast or analyze"
                        className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs text-amber-300 bg-amber-400/10 hover:bg-amber-400/20 border border-amber-400/20 transition-colors"
                      >
                        <Bot className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline font-semibold">Buddy Roast</span>
                      </button>

                      <button
                        onClick={() => setActiveCommentPostId(isCommentOpen ? null : post.id)}
                        className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-white/5 hover:bg-white/10 text-white/80 transition-colors"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>{post.comments.length}</span>
                      </button>
                    </div>
                  </div>

                  {/* Comment Drawer if open */}
                  {isCommentOpen && (
                    <div className="pt-3 border-t border-white/5 space-y-3 animate-in fade-in">
                      <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                        {post.comments.map((comm) => (
                          <div
                            key={comm.id}
                            className={`p-2.5 rounded-xl text-xs ${
                              comm.isBuddy 
                                ? "bg-amber-500/10 border border-amber-500/20 text-amber-100" 
                                : "bg-white/5 text-white/80"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold flex items-center gap-1 text-white">
                                {comm.isBuddy && <span>⚡</span>}
                                {comm.user}
                              </span>
                              <span className="text-[10px] text-white/40">{comm.timestamp}</span>
                            </div>
                            <p>{comm.text}</p>
                          </div>
                        ))}
                      </div>

                      {/* Comment Input */}
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === "Enter") handlePostComment(post.id);
                          }}
                          placeholder="Drop a comment or meme..."
                          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-white/40 focus:outline-none"
                        />
                        <button
                          onClick={() => handlePostComment(post.id)}
                          className="w-8 h-8 rounded-xl flex items-center justify-center text-black font-bold"
                          style={{ backgroundColor: themeConfig.accentColor }}
                        >
                          <Send className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Archiving Proof Footer */}
                  <div className="text-[10px] font-mono text-white/30 flex items-center justify-between pt-1">
                    <span>{post.digicamMetadata.archivedAt}</span>
                    <span>{post.digicamMetadata.shutterSpeed}</span>
                  </div>
                </div>
              </article>
            );
          })
        )}
      </div>

    </div>
  );
};
